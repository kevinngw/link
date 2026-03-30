import fs from 'node:fs/promises'
import path from 'node:path'

import AdmZip from 'adm-zip'
import { parse } from 'csv-parse/sync'

const OUTPUT_DIR = path.resolve('public')
const INDEX_FILE = path.resolve(OUTPUT_DIR, 'pulse-data.json')

function getSystemFilePath(systemId) {
  return path.resolve(OUTPUT_DIR, `pulse-data-${systemId}.json`)
}

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
  swift: {
    id: 'swift',
    name: 'Swift',
    gtfsUrl: 'https://www.soundtransit.org/GTFS-CT/current.zip',
    agencyId: '29',
    lines: {
      '701': { slug: 'swift-blue', name: 'Swift Blue', color: '#006CFF', stopCodeStart: 200 },
      '702': { slug: 'swift-green', name: 'Swift Green', color: '#00AA00', stopCodeStart: 300 },
      '703': { slug: 'swift-orange', name: 'Swift Orange', color: '#F24C21', stopCodeStart: 400 },
    },
  },
}

function decodePolyline(encoded) {
  const points = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push({ lat: lat / 1e5, lon: lng / 1e5 })
  }

  return points
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

async function buildSystemFromOBA(systemConfig) {
  const { agencyId, lines: lineConfigs } = systemConfig
  const lines = []

  for (const [routeShortId, config] of Object.entries(lineConfigs)) {
    const routeId = `${agencyId}_${routeShortId}`

    let response
    for (let attempt = 0; attempt < 4; attempt++) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
      response = await fetch(
        `${OBA_BASE}/stops-for-route/${routeId}.json?key=${OBA_KEY}&includePolylines=true`,
      )
      if (response.status !== 429) break
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch stops for route ${routeId}: ${response.status}`)
    }

    const data = await response.json()
    const entry = data.data.entry
    const refs = data.data.references

    const stopsById = new Map(refs.stops.map((stop) => [stop.id, stop]))

    const grouping = entry.stopGroupings[0]
    const dir1Group = grouping?.stopGroups?.find((group) => group.id === '1')
    const dir0Group = grouping?.stopGroups?.find((group) => group.id === '0')
    const representativeGroup = dir0Group ?? dir1Group
    const representativeStopIds = representativeGroup?.stopIds ?? entry.stopIds
    const oppositeGroup = representativeGroup === dir0Group ? dir1Group : dir0Group
    const oppositeStopIds = oppositeGroup?.stopIds ?? []

    const nbTerminusPrefix = (dir1Group?.name?.name ?? '').split('/')[0].toLowerCase()
    const sbTerminusPrefix = (dir0Group?.name?.name ?? '').split('/')[0].toLowerCase()

    const stops = representativeStopIds
      .map((stopId, index) => {
        const stop = stopsById.get(stopId)
        if (!stop) return null

        const prevId = index > 0 ? representativeStopIds[index - 1] : null
        const prev = prevId ? stopsById.get(prevId) : null
        const segmentMinutes = prev
          ? Math.max(1, Math.round((haversineKm(prev.lat, prev.lon, stop.lat, stop.lon) / 56) * 60))
          : 0

        return {
          id: stop.id,
          name: stop.name,
          lat: stop.lat,
          lon: stop.lon,
          sequence: index + 1,
          stopCode: config.stopCodeStart + index,
          segmentMinutes,
        }
      })
      .filter(Boolean)

    // Build stationAliases: pair each stop with its nearest opposite-direction stop
    const oppositeStops = oppositeStopIds.map((id) => stopsById.get(id)).filter(Boolean)
    const stationAliases = {}
    for (const stop of stops) {
      const aliases = [stop.id]
      if (oppositeStops.length) {
        let nearest = null
        let nearestDist = Infinity
        for (const opp of oppositeStops) {
          const dist = haversineKm(stop.lat, stop.lon, opp.lat, opp.lon)
          if (dist < nearestDist) {
            nearestDist = dist
            nearest = opp
          }
        }
        // Pair if within 500m
        if (nearest && nearestDist < 0.6) {
          aliases.push(nearest.id)
        }
      }
      stationAliases[stop.id] = aliases
    }

    const allPoints = []
    for (const pl of entry.polylines ?? []) {
      if (pl.points) allPoints.push(...decodePolyline(pl.points))
    }

    lines.push({
      agencyId,
      id: routeShortId,
      routeKey: routeId,
      name: config.name,
      slug: config.slug,
      color: config.color,
      directionLookup: {},
      nbTerminusPrefix,
      sbTerminusPrefix,
      headsign: (dir1Group?.name?.name) || config.name,
      serviceSpansByDate: {},
      stationAliases,
      stops,
      shapePoints: simplifyPoints(allPoints),
    })
  }

  return {
    id: systemConfig.id,
    name: systemConfig.name,
    agencyId,
    source: `${OBA_BASE}/routes-for-agency/${agencyId}`,
    lines,
  }
}

async function loadZipBuffer(url, retries = 4) {
  let lastError
  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) {
      const delayMs = 3000 * attempt
      console.warn(`Retrying GTFS download (attempt ${attempt + 1}/${retries}) after ${delayMs}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download GTFS: ${response.status} ${response.statusText}`)
      }
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      lastError = error
      console.warn(`GTFS download attempt ${attempt + 1} failed: ${error.cause?.code ?? error.message}`)
    }
  }
  throw lastError
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
  // Also index by normalized name (strip NB/SB direction suffix) for BRT stop pairing
  const stopIdsByNormalizedName = new Map()
  for (const stop of stops) {
    const normalized = stop.stop_name.replace(/\s+(NB|SB|EB|WB)\s+/i, ' ')
    const list = stopIdsByNormalizedName.get(normalized) ?? []
    list.push(stop.stop_id)
    stopIdsByNormalizedName.set(normalized, list)
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

    // Build stationAliases: pair each stop with opposite-direction stops
    const lineStopIds = new Set(line.stops.map((s) => s.id))
    const repDirection = representativeTrip.direction_id ?? '0'
    const oppositeTrips = routeTrips.filter((t) => String(t.direction_id ?? '0') !== String(repDirection))
    const oppositeStopIds = new Set()
    for (const trip of oppositeTrips) {
      for (const st of stopTimesByTrip.get(trip.trip_id) ?? []) {
        if (!lineStopIds.has(st.stop_id)) oppositeStopIds.add(st.stop_id)
      }
    }
    const oppositeStopsGeo = [...oppositeStopIds].map((id) => stopsById.get(id)).filter(Boolean)

    const oppositeStopNames = {}
    line.stationAliases = Object.fromEntries(
      line.stops.map((stop) => {
        const exactMatch = stopIdsByName.get(stop.name) ?? []
        const normalizedName = stop.name.replace(/\s+(NB|SB|EB|WB)\s+/i, ' ')
        const normalizedMatch = stopIdsByNormalizedName.get(normalizedName) ?? []
        const allIds = [...new Set([...exactMatch, ...normalizedMatch])]
        // If no opposite-direction match found by name, use geo-proximity
        const hasOpposite = allIds.some((id) => !lineStopIds.has(id))
        if (!hasOpposite && oppositeStopsGeo.length) {
          let nearest = null
          let nearestDist = Infinity
          for (const opp of oppositeStopsGeo) {
            const dist = haversineKm(stop.lat, stop.lon, Number(opp.stop_lat), Number(opp.stop_lon))
            if (dist < nearestDist) { nearestDist = dist; nearest = opp }
          }
          if (nearest && nearestDist < 0.6) allIds.push(nearest.stop_id)
        }
        // Record opposite-direction stop name if different
        const oppositeIds = allIds.filter((id) => id !== stop.id)
        if (oppositeIds.length) {
          const oppStop = stopsById.get(oppositeIds[0])
          if (oppStop && oppStop.stop_name !== stop.name) {
            oppositeStopNames[stop.id] = oppStop.stop_name
          }
        }
        return [stop.id, allIds.length ? allIds : [stop.id]]
      }),
    )
    line.oppositeStopNames = Object.keys(oppositeStopNames).length ? oppositeStopNames : undefined

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

async function writeOutputFile(systems) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // 为每个系统生成单独的数据文件
  for (const system of systems) {
    const filePath = getSystemFilePath(system.id)
    const systemData = { system }
    const nextContent = `${JSON.stringify(systemData, null, 2)}\n`
    const existingContent = await fs.readFile(filePath, 'utf8').catch(() => '')

    if (existingContent === nextContent) {
      console.log(`Static data unchanged: ${path.relative(process.cwd(), filePath)}`)
    } else {
      await fs.writeFile(filePath, nextContent)
      console.log(`Static data updated: ${path.relative(process.cwd(), filePath)} (${(nextContent.length / 1024).toFixed(1)} KB)`)
    }
  }

  // 生成索引文件（只包含系统列表，不含详细数据）
  const indexPayload = {
    systems: systems.map((s) => ({ id: s.id, name: s.name, agencyId: s.agencyId })),
  }
  const indexContent = `${JSON.stringify(indexPayload, null, 2)}\n`
  const existingIndex = await fs.readFile(INDEX_FILE, 'utf8').catch(() => '')

  if (existingIndex === indexContent) {
    console.log(`Index unchanged: ${path.relative(process.cwd(), INDEX_FILE)}`)
  } else {
    await fs.writeFile(INDEX_FILE, indexContent)
    console.log(`Index updated: ${path.relative(process.cwd(), INDEX_FILE)}`)
  }
}

async function main() {
  const allConfigs = Object.values(SYSTEM_CONFIG)
  const gtfsConfigs = allConfigs.filter((c) => !c.useOBA)
  const obaConfigs = allConfigs.filter((c) => c.useOBA)

  const gtfsResults = await Promise.allSettled(gtfsConfigs.map((c) => buildSystem(c)))
  const obaResults = await Promise.allSettled(obaConfigs.map((c) => buildSystemFromOBA(c)))

  const systems = []
  for (const [i, result] of gtfsResults.entries()) {
    if (result.status === 'fulfilled') {
      systems.push(result.value)
    } else {
      const cached = getSystemFilePath(gtfsConfigs[i].id)
      const hasCached = await fs.access(cached).then(() => true, () => false)
      if (hasCached) {
        console.warn(`Warning: ${gtfsConfigs[i].id} build failed (${result.reason.cause?.code ?? result.reason.message}), using cached data`)
      } else {
        console.warn(`Warning: ${gtfsConfigs[i].id} build failed with no cached fallback (${result.reason.cause?.code ?? result.reason.message}), skipping`)
      }
    }
  }
  for (const [i, result] of obaResults.entries()) {
    if (result.status === 'fulfilled') {
      systems.push(result.value)
    } else {
      const cached = getSystemFilePath(obaConfigs[i].id)
      const hasCached = await fs.access(cached).then(() => true, () => false)
      if (hasCached) {
        console.warn(`Warning: ${obaConfigs[i].id} build failed (${result.reason.cause?.code ?? result.reason.message}), using cached data`)
      } else {
        console.warn(`Warning: ${obaConfigs[i].id} build failed with no cached fallback (${result.reason.cause?.code ?? result.reason.message}), skipping`)
      }
    }
  }

  if (!systems.length) {
    console.error('Error: all system builds failed, no data to write')
    process.exitCode = 1
    return
  }

  await writeOutputFile(systems)
}

main()
