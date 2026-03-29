/**
 * apiClient.js
 * Singletons for the OBA client and arrivals helpers.
 * Modules that need to make API requests import from here rather than creating
 * their own instances, so that the request queue, cache, and abort logic are shared.
 */

import { createObaClient } from '../oba'
import { createArrivalsHelpers } from '../arrivals'
import { appState } from './appState'

// ---------------------------------------------------------------------------
// OBA client singleton
// ---------------------------------------------------------------------------

const obaClient = createObaClient(appState)

export const fetchJsonWithRetry = obaClient.fetchJsonWithRetry
export const clearObaQueue = obaClient.clearQueue
export const prefetchOba = obaClient.prefetch
export const clearExpiredObaCache = obaClient.clearExpiredCache

// ---------------------------------------------------------------------------
// getStationStopIds — must match the implementation in main.js exactly so
// arrivals helpers produce the same stop-ID set.
// ---------------------------------------------------------------------------

export function getStationStopIds(station, line) {
  const aliases = new Set(line.stationAliases?.[station.id] ?? [])
  aliases.add(station.id)

  const platformMatch = station.id.match(/^(.+)-T(\d+)$/)
  if (platformMatch) {
    aliases.add(`${platformMatch[1]}-T${platformMatch[2] === '1' ? '2' : '1'}`)
  }

  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith(`${line.agencyId}_`) ? alias : `${line.agencyId}_${alias}`
    candidates.add(normalized)
  }

  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith(`${line.agencyId}_`) ? baseId : `${line.agencyId}_${baseId}`)

  return [...candidates]
}

// ---------------------------------------------------------------------------
// copyValue helper — resolves a UI_COPY key for the current language stored
// in appState.  Arrivals helpers need this for destination labels.
// ---------------------------------------------------------------------------

import { UI_COPY } from '../config'

export function copyValue(key, ...args) {
  const lang = appState.language
  const copy = UI_COPY[lang] ?? UI_COPY.en
  const value = copy[key]
  return typeof value === 'function' ? value(...args) : (value ?? key)
}

// ---------------------------------------------------------------------------
// Arrivals helpers singleton
// ---------------------------------------------------------------------------

const arrivalsHelpers = createArrivalsHelpers({
  state: appState,
  fetchJsonWithRetry,
  getStationStopIds,
  copyValue,
})

export const buildArrivalsForLine = arrivalsHelpers.buildArrivalsForLine
export const fetchArrivalsForStop = arrivalsHelpers.fetchArrivalsForStop
export const fetchArrivalsForStopIds = arrivalsHelpers.fetchArrivalsForStopIds
export const getCachedArrivalsForStation = arrivalsHelpers.getCachedArrivalsForStation
export const getArrivalsForStation = arrivalsHelpers.getArrivalsForStation
export const mergeArrivalBuckets = arrivalsHelpers.mergeArrivalBuckets
export const getArrivalServiceStatus = arrivalsHelpers.getArrivalServiceStatus
