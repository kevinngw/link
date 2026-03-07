import fs from 'node:fs/promises'
import path from 'node:path'

import AdmZip from 'adm-zip'
import { parse } from 'csv-parse/sync'

const GTFS_URL = 'https://www.soundtransit.org/GTFS-rail/40_gtfs.zip'
const OUTPUT_FILE = path.resolve('public/link-data.json')
const LINE_CONFIG = {
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
}

async function loadZipBuffer() {
  const response = await fetch(GTFS_URL)

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

function extractTripKey(routeId, tripId) {
  const marker = `_${routeId}_`
  const markerIndex = tripId.lastIndexOf(marker)
  if (markerIndex === -1) return ''
  return tripId.slice(markerIndex + marker.length)
}

function buildLine(routeId, config, representativeTrip, routeTrips, stopTimesByTrip, stopsById, shapesById) {
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
    id: routeId,
    name: config.name,
    slug: config.slug,
    color: config.color,
    directionLookup: Object.fromEntries(
      routeTrips
        .map((trip) => [extractTripKey(routeId, trip.trip_id), trip.direction_id])
        .filter(([key]) => key),
    ),
    headsign: representativeTrip.trip_headsign,
    shapeId: representativeTrip.shape_id,
    stationAliases: Object.fromEntries(
      stops.map((stop) => [
        stop.id,
        stops
          .filter((candidate) => candidate.name === stop.name)
          .map((candidate) => candidate.id),
      ]),
    ),
    stops,
    shapePoints,
  }
}

async function main() {
  const zip = new AdmZip(await loadZipBuffer())
  const trips = readCsv(zip, 'trips.txt')
  const stopTimes = readCsv(zip, 'stop_times.txt')
  const stops = readCsv(zip, 'stops.txt')
  const shapes = readCsv(zip, 'shapes.txt')

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

  const lines = Object.entries(LINE_CONFIG).map(([routeId, config]) => {
    const routeTrips = trips.filter((trip) => trip.route_id === routeId)
    const representativeTrip = chooseRepresentativeTrip(routeId, trips, stopTimesByTrip)

    if (!representativeTrip) {
      throw new Error(`No trip found for route ${routeId}`)
    }

    const line = buildLine(
      routeId,
      config,
      representativeTrip,
      routeTrips,
      stopTimesByTrip,
      stopsById,
      shapesById,
    )

    line.stationAliases = Object.fromEntries(
      line.stops.map((stop) => [stop.id, stopIdsByName.get(stop.name) ?? [stop.id]]),
    )

    return line
  })

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: GTFS_URL,
        lines,
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
