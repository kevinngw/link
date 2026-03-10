import fs from 'node:fs/promises'
import path from 'node:path'

import AdmZip from 'adm-zip'
import { parse } from 'csv-parse/sync'

const OUTPUT_FILE = path.resolve('public/link-data.json')

const SYSTEM_CONFIG = {
  link: {
    id: 'link',
    name: 'Link',
    gtfsUrl: 'https://www.soundtransit.org/GTFS-rail/40_gtfs.zip',
    agencyId: '40',
    lines: {
      '100479': {
        slug: '1line',
        name: '1 Line',
        color: '#28813F',
        stopCodeStart: 40,
      },
      '2LINE': {
        slug: '2line',
        name: '2 Line',
        color: '#007CAD',
        stopCodeStart: 56,
      },
    },
  },
  rapidride: {
    id: 'rapidride',
    name: 'RapidRide',
    gtfsUrl: 'https://metro.kingcounty.gov/GTFS/google_transit.zip',
    agencyId: '1',
    lineOrder: ['A Line', 'B Line', 'C Line', 'D Line', 'E Line', 'F Line', 'G Line', 'H Line'],
    lineFilter(route) {
      return /Line$/i.test(route.route_short_name || '')
    },
    buildLineConfig(route, index) {
      const shortName = route.route_short_name.trim()
      const slug = shortName.toLowerCase().replace(/\s+/g, '-')
      return {
        slug,
        name: shortName,
        color: route.route_color ? `#${route.route_color}` : '#9C182F',
        stopCodeStart: 100 + index * 100,
      }
    },
  },
}

async function loadZipBuffer(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download GTFS: ${response.status} ${response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

function readCsv(zip, entryName) {
  return parse(zip.readAsText(entryName), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  })
}

function chooseRepresentativeTrip(routeId, trips, stopTimesByTrip) {
  const candidates = trips.filter((trip) => trip.route_id === routeId)

  return candidates
    .map((trip) => ({
      ...trip,
      stopCount: stopTimesByTrip.get(trip.trip_id)?.length ?? 0,
    }))
    .sort((left, right) => {
      if (right.stopCount !== left.stopCount) return right.stopCount - left.stopCount
      return left.trip_id.localeCompare(right.trip_id)
    })[0]
}

function simplifyPoints(points, minimumGap = 0.0012) {
  if (points.length < 3) return points

  const simplified = [points[0]]
  let previous = points[0]

  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index]
    const latGap = point.lat - previous.lat
    const lonGap = point.lon - previous.lon

    if (Math.hypot(latGap, lonGap) >= minimumGap) {
      simplified.push(point)
      previous = point
    }
  }

  simplified.push(points.at(-1))
  return simplified
}

function parseClockToSeconds(value) {
  const [hours = '0', minutes = '0', seconds = '0'] = String(value).split(':')
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

function formatDateKey(value) {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

function getActiveServiceIdsByDate(calendar, calendarDates) {
  const activeByDate = new Map()

  for (const row of calendar) {
    const start = new Date(`${formatDateKey(row.start_date)}T00:00:00Z`)
    const end = new Date(`${formatDateKey(row.end_date)}T00:00:00Z`)

    for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const dateKey = cursor.toISOString().slice(0, 10)
      const weekdayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        cursor.getUTCDay()
      ]

      if (row[weekdayName] !== '1') continue
      const services = activeByDate.get(dateKey) ?? new Set()
      services.add(row.service_id)
      activeByDate.set(dateKey, services)
    }
  }

  for (const row of calendarDates) {
    const dateKey = formatDateKey(row.date)
    const services = activeByDate.get(dateKey) ?? new Set()
    if (row.exception_type === '1') {
      services.add(row.service_id)
    } else if (row.exception_type === '2') {
      services.delete(row.service_id)
    }
    activeByDate.set(dateKey, services)
  }

  return activeByDate
}

function buildServiceSpansByDate(routeTrips, stopTimesByTrip, activeServiceIdsByDate) {
  const firstStopTimesByTrip = new Map()
  const lastStopTimesByTrip = new Map()

  for (const trip of routeTrips) {
    const stopTimes = stopTimesByTrip.get(trip.trip_id) ?? []
    if (!stopTimes.length) continue
    firstStopTimesByTrip.set(trip.trip_id, stopTimes[0].departure_time)
    lastStopTimesByTrip.set(trip.trip_id, stopTimes.at(-1).arrival_time)
  }

  const spansByDate = {}

  for (const [dateKey, activeServiceIds] of activeServiceIdsByDate.entries()) {
    let firstDeparture = null
    let lastArrival = null

    for (const trip of routeTrips) {
      if (!activeServiceIds.has(trip.service_id)) continue

      const departureTime = firstStopTimesByTrip.get(trip.trip_id)
      const arrivalTime = lastStopTimesByTrip.get(trip.trip_id)
      if (!departureTime || !arrivalTime) continue

      if (firstDeparture == null || parseClockToSeconds(departureTime) < parseClockToSeconds(firstDeparture)) {
        firstDeparture = departureTime
      }

      if (lastArrival == null || parseClockToSeconds(arrivalTime) > parseClockToSeconds(lastArrival)) {
        lastArrival = arrivalTime
      }
    }

    if (firstDeparture && lastArrival) {
      spansByDate[dateKey] = {
        start: firstDeparture,
        end: lastArrival,
      }
    }
  }

  return spansByDate
}

function buildDirectionLookup(routeTrips, agencyId) {
  const entries = []

  for (const trip of routeTrips) {
    entries.push([trip.trip_id, trip.direction_id])
    entries.push([`${agencyId}_${trip.trip_id}`, trip.direction_id])
  }

  return Object.fromEntries(entries)
}

function buildLine(route, config, representativeTrip, routeTrips, stopTimesByTrip, stopsById, shapesById, activeServiceIdsByDate, agencyId) {
  const stopTimes = stopTimesByTrip.get(representativeTrip.trip_id) ?? []
  const stops = stopTimes.map((stopTime, index) => {
    const stop = stopsById.get(stopTime.stop_id)
    const previousStopTime = stopTimes[index - 1]
    const segmentMinutes = previousStopTime
      ? Math.max(
          1,
          Math.round(
            (parseClockToSeconds(stopTime.arrival_time) -
              parseClockToSeconds(previousStopTime.departure_time)) /
              60,
          ),
        )
      : 0

    return {
      id: stop.stop_id,
      name: stop.stop_name,
      lat: Number(stop.stop_lat),
      lon: Number(stop.stop_lon),
      sequence: Number(stopTime.stop_sequence),
      stopCode: config.stopCodeStart + index,
      segmentMinutes,
    }
  })

  const shapePoints = simplifyPoints(
    (shapesById.get(representativeTrip.shape_id) ?? []).map((shapePoint) => ({
      lat: Number(shapePoint.shape_pt_lat),
      lon: Number(shapePoint.shape_pt_lon),
      sequence: Number(shapePoint.shape_pt_sequence),
    })),
  )

  return {
    agencyId,
    id: route.route_id,
    routeKey: `${agencyId}_${route.route_id}`,
    name: config.name,
    slug: config.slug,
    color: config.color,
    directionLookup: buildDirectionLookup(routeTrips, agencyId),
    headsign: representativeTrip.trip_headsign,
    shapeId: representativeTrip.shape_id,
    serviceSpansByDate: buildServiceSpansByDate(routeTrips, stopTimesByTrip, activeServiceIdsByDate),
    stationAliases: {},
    stops,
    shapePoints,
  }
}

async function buildSystem(systemConfig) {
  const zip = new AdmZip(await loadZipBuffer(systemConfig.gtfsUrl))
  const routes = readCsv(zip, 'routes.txt')
  const trips = readCsv(zip, 'trips.txt')
  const calendar = readCsv(zip, 'calendar.txt')
  const calendarDates = readCsv(zip, 'calendar_dates.txt')
  const stopTimes = readCsv(zip, 'stop_times.txt')
  const stops = readCsv(zip, 'stops.txt')
  const shapes = readCsv(zip, 'shapes.txt')
  const activeServiceIdsByDate = getActiveServiceIdsByDate(calendar, calendarDates)

  const stopTimesByTrip = new Map()
  for (const stopTime of stopTimes) {
    const list = stopTimesByTrip.get(stopTime.trip_id) ?? []
    list.push(stopTime)
    stopTimesByTrip.set(stopTime.trip_id, list)
  }

  for (const list of stopTimesByTrip.values()) {
    list.sort((left, right) => Number(left.stop_sequence) - Number(right.stop_sequence))
  }

  const stopsById = new Map(stops.map((stop) => [stop.stop_id, stop]))
  const stopIdsByName = new Map()
  for (const stop of stops) {
    const list = stopIdsByName.get(stop.stop_name) ?? []
    list.push(stop.stop_id)
    stopIdsByName.set(stop.stop_name, list)
  }

  const shapesById = new Map()
  for (const shape of shapes) {
    const list = shapesById.get(shape.shape_id) ?? []
    list.push(shape)
    shapesById.set(shape.shape_id, list)
  }

  for (const list of shapesById.values()) {
    list.sort(
      (left, right) => Number(left.shape_pt_sequence) - Number(right.shape_pt_sequence),
    )
  }

  const lineDefinitions =
    systemConfig.lines
      ? Object.entries(systemConfig.lines).map(([routeId, config]) => ({
          routeId,
          route: routes.find((candidate) => candidate.route_id === routeId),
          config,
        }))
      : routes
          .filter((route) => systemConfig.lineFilter(route))
          .sort(
            (left, right) =>
              systemConfig.lineOrder.indexOf(left.route_short_name) - systemConfig.lineOrder.indexOf(right.route_short_name),
          )
          .map((route, index) => ({
            routeId: route.route_id,
            route,
            config: systemConfig.buildLineConfig(route, index),
          }))

  const lines = lineDefinitions.map(({ routeId, route, config }) => {
    if (!route) {
      throw new Error(`No route found for ${systemConfig.id}:${routeId}`)
    }

    const routeTrips = trips.filter((trip) => trip.route_id === routeId)
    const representativeTrip = chooseRepresentativeTrip(routeId, trips, stopTimesByTrip)

    if (!representativeTrip) {
      throw new Error(`No trip found for route ${routeId}`)
    }

    const line = buildLine(
      route,
      config,
      representativeTrip,
      routeTrips,
      stopTimesByTrip,
      stopsById,
      shapesById,
      activeServiceIdsByDate,
      systemConfig.agencyId,
    )

    line.stationAliases = Object.fromEntries(
      line.stops.map((stop) => [stop.id, stopIdsByName.get(stop.name) ?? [stop.id]]),
    )

    return line
  })

  return {
    id: systemConfig.id,
    name: systemConfig.name,
    agencyId: systemConfig.agencyId,
    source: systemConfig.gtfsUrl,
    lines,
  }
}

async function main() {
  const systems = await Promise.all(Object.values(SYSTEM_CONFIG).map((config) => buildSystem(config)))

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        systems,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
