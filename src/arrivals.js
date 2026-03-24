import {
  ARRIVALS_CACHE_TTL_MS,
  OBA_ARRIVALS_CONCURRENCY,
  OBA_BASE_URL,
  OBA_KEY,
} from './config'
import { normalizeName } from './utils'

const ARRIVALS_LOOKAHEAD_MINUTES = 60
const ARRIVALS_CACHE_MAX_SIZE = 50
const ARRIVALS_LOOKAHEAD_MS = ARRIVALS_LOOKAHEAD_MINUTES * 60 * 1000
const MAX_ARRIVALS_PER_DIRECTION = 4

const sortByArrivalTime = (arr) => arr.sort((a, b) => a.arrivalTime - b.arrivalTime)

// Adaptive concurrency controller
const concurrency = {
  value: OBA_ARRIVALS_CONCURRENCY,
  adjust(success) {
    this.value = success
      ? Math.min(this.value + 1, 6)
      : Math.max(this.value - 1, 1)
  },
}

export function classifyArrivalDirection(arrival, line) {
  const lookedUpDirection = line.directionLookup?.[arrival.tripId ?? '']
  if (lookedUpDirection === '1') return 'nb'
  if (lookedUpDirection === '0') return 'sb'

  const headsign = arrival.tripHeadsign ?? ''
  const headsignLower = headsign.toLowerCase()

  if (line.nbTerminusPrefix && headsignLower.startsWith(line.nbTerminusPrefix)) return 'nb'
  if (line.sbTerminusPrefix && headsignLower.startsWith(line.sbTerminusPrefix)) return 'sb'

  if (/Lynnwood|Downtown Redmond/i.test(headsign)) return 'nb'
  if (/Federal Way|South Bellevue/i.test(headsign)) return 'sb'

  const directionId = String(arrival.directionId ?? '')
  if (directionId === '1') return 'nb'
  if (directionId === '0') return 'sb'

  return ''
}

export function getLineRouteId(line) {
  return line.routeKey ?? `${line.agencyId}_${line.id}`
}

export function formatArrivalDestination(arrival, copyValue) {
  const headsign = arrival.tripHeadsign?.trim()
  if (headsign) return normalizeName(headsign.replace(/^to\s+/i, ''))
  return copyValue('terminalFallback')
}

export function getArrivalServiceStatus(arrivalTime, scheduleDeviation, copyValue) {
  const secondsUntilArrival = Math.floor((arrivalTime - Date.now()) / 1000)

  if (secondsUntilArrival <= 90) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return copyValue('onTimeStatus')
}

export function getStatusTone(status) {
  if (status === 'DELAY') return 'delay'
  if (status === 'ARR') return 'arr'
  return 'ok'
}

export function createArrivalsHelpers({ state, fetchJsonWithRetry, getStationStopIds, copyValue }) {
  async function fetchArrivalsForStop(stopId, signal) {
    const url = `${OBA_BASE_URL}/arrivals-and-departures-for-stop/${stopId}.json?key=${OBA_KEY}&minutesAfter=${ARRIVALS_LOOKAHEAD_MINUTES}`
    const payload = await fetchJsonWithRetry(url, 'Arrivals', signal)
    if (payload.code !== 200) {
      throw new Error(payload.text || `Arrivals request failed for ${stopId}`)
    }
    const arrivals = payload.data?.entry?.arrivalsAndDepartures ?? []
    const trips = payload.data?.references?.trips ?? []
    const tripDirectionMap = new Map(trips.map((t) => [t.id, String(t.directionId ?? '')]))
    for (const arrival of arrivals) {
      if (arrival.directionId == null && arrival.tripId) {
        arrival.directionId = tripDirectionMap.get(arrival.tripId) ?? ''
      }
    }
    return arrivals
  }

  async function fetchArrivalsForStopIds(stopIds, signal) {
    const dedupedStopIds = [...new Set(stopIds)]
    const results = []
    const arrivals = []
    for (let index = 0; index < dedupedStopIds.length; index += concurrency.value) {
      const batch = dedupedStopIds.slice(index, index + concurrency.value)
      const batchResults = await Promise.allSettled(
        batch.map((stopId) => fetchArrivalsForStop(stopId, signal))
      )
      results.push(...batchResults)
      
      // Adjust concurrency based on batch success rate
      const successCount = batchResults.filter(r => r.status === 'fulfilled').length
      concurrency.adjust(successCount === batch.length)
    }

    for (const result of results) {
      if (result.status !== 'fulfilled') continue
      arrivals.push(...result.value)
    }

    if (results.length > 0 && results.every((result) => result.status !== 'fulfilled')) {
      throw results[0].reason ?? new Error('Arrivals request failed')
    }

    return arrivals
  }

  function buildArrivalsForLine(arrivalFeed, line, allowedStopIds = null) {
    const now = Date.now()
    const cutoff = now + ARRIVALS_LOOKAHEAD_MS
    const seen = new Set()
    const arrivals = { nb: [], sb: [] }
    const stopIdFilter = allowedStopIds ? new Set(allowedStopIds) : null

    for (const arrival of arrivalFeed) {
      if (arrival.routeId !== getLineRouteId(line)) continue
      if (stopIdFilter && !stopIdFilter.has(arrival.stopId)) continue
      const isRealtime = Boolean(arrival.predictedArrivalTime)
      const arrivalTime = arrival.predictedArrivalTime || arrival.scheduledArrivalTime
      if (!arrivalTime || arrivalTime <= now || arrivalTime > cutoff) continue

      const bucket = classifyArrivalDirection(arrival, line)
      if (!bucket) continue

      const dedupeKey = `${arrival.tripId}:${arrival.stopId}:${arrivalTime}`
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)

      arrivals[bucket].push({
        vehicleId: (arrival.vehicleId || '').replace(/^\d+_/, '') || '--',
        rawVehicleId: arrival.vehicleId || '',
        arrivalTime,
        isRealtime,
        destination: formatArrivalDestination(arrival, copyValue),
        scheduleDeviation: arrival.scheduleDeviation ?? 0,
        tripId: arrival.tripId,
        lineColor: line.color,
        lineName: line.name,
        lineToken: line.name[0],
        distanceFromStop: arrival.distanceFromStop ?? 0,
        numberOfStopsAway: arrival.numberOfStopsAway ?? 0,
      })
    }

    arrivals.nb = sortByArrivalTime(arrivals.nb).slice(0, MAX_ARRIVALS_PER_DIRECTION)
    arrivals.sb = sortByArrivalTime(arrivals.sb).slice(0, MAX_ARRIVALS_PER_DIRECTION)
    return arrivals
  }

  function getCachedArrivalsForStation(station, line) {
    const cacheKey = `${state.activeSystemId}:${line.id}:${station.id}`
    return state.arrivalsCache.get(cacheKey)?.value ?? null
  }

  async function getArrivalsForStation(station, line, prefetchedFeed = null) {
    const cacheKey = `${state.activeSystemId}:${line.id}:${station.id}`
    const cached = state.arrivalsCache.get(cacheKey)
    if (cached && Date.now() - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS) {
      return cached.value
    }

    const stopIds = getStationStopIds(station, line)
    const arrivalFeed = prefetchedFeed ?? (await fetchArrivalsForStopIds(stopIds))
    const arrivals = buildArrivalsForLine(arrivalFeed, line, stopIds)
    state.arrivalsCache.set(cacheKey, { fetchedAt: Date.now(), value: arrivals })
    if (state.arrivalsCache.size > ARRIVALS_CACHE_MAX_SIZE) {
      const oldest = [...state.arrivalsCache.entries()].sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)[0][0]
      state.arrivalsCache.delete(oldest)
    }
    return arrivals
  }

  function mergeArrivalBuckets(collections) {
    const merged = { nb: [], sb: [] }

    for (const arrivals of collections) {
      merged.nb.push(...arrivals.nb)
      merged.sb.push(...arrivals.sb)
    }

    sortByArrivalTime(merged.nb)
    sortByArrivalTime(merged.sb)
    return merged
  }

  return {
    buildArrivalsForLine,
    fetchArrivalsForStop,
    fetchArrivalsForStopIds,
    getCachedArrivalsForStation,
    getArrivalsForStation,
    mergeArrivalBuckets,
    getArrivalServiceStatus: (arrivalTime, scheduleDeviation) => getArrivalServiceStatus(arrivalTime, scheduleDeviation, copyValue),
  }
}
