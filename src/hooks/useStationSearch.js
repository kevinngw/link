/**
 * useStationSearch.js
 * Wraps the station-search logic for use in React components.
 *
 * This hook manages:
 *   - Search query state
 *   - Fuzzy-scored result computation
 *   - Nearby stations via geolocation
 *   - Opening / closing the search dialog
 *   - Handling result selection (switching system + opening station dialog)
 *
 * Usage:
 *   const {
 *     query, results, nearbyStations,
 *     openSearch, closeSearch,
 *     handleSelection, findNearby,
 *     highlightedIndex, highlightedNearbyIndex,
 *     setHighlightedIndex, setHighlightedNearbyIndex,
 *   } = useStationSearch()
 */

import { useCallback } from 'react'
import { normalizeName, getDistanceMeters, formatDistanceMeters } from '../utils'
import { useAppStore } from '../store/useAppStore'
import { appState } from '../lib/appState'

// localStorage key for recent searches (mirrors station-search.js)
const RECENT_SEARCHES_KEY = 'link-pulse-recent-searches'
const RECENT_SEARCHES_MAX = 5

function getRecentSearches() {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function addRecentSearch(result) {
  const recents = getRecentSearches()
  const key = `${result.systemId}:${result.lineId}:${result.stationId}`
  const updated = [
    {
      key,
      systemId: result.systemId,
      lineId: result.lineId,
      stationId: result.stationId,
      stationName: result.stationName,
      lineName: result.lineName,
      lineColor: result.lineColor,
      systemName: result.systemName,
    },
    ...recents.filter((item) => item.key !== key),
  ].slice(0, RECENT_SEARCHES_MAX)
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {}
}

function buildSearchEntries(systemsById) {
  const entries = []
  for (const system of systemsById.values()) {
    for (const line of system.lines ?? []) {
      for (const station of line.stops ?? []) {
        entries.push({
          key: `${system.id}:${line.id}:${station.id}`,
          systemId: system.id,
          systemName: system.name,
          lineId: line.id,
          lineName: line.name,
          lineColor: line.color,
          stationId: station.id,
          stationName: station.name,
          normalizedStationName: normalizeName(station.name),
          aliases: line.stationAliases?.[station.id] ?? [],
          lat: station.lat,
          lon: station.lon,
        })
      }
    }
  }
  return entries
}

function scoreEntries(entries, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return entries
    .map((entry) => {
      const stationLower = entry.stationName.toLowerCase()
      const normalizedLower = entry.normalizedStationName.toLowerCase()
      const lineLower = entry.lineName.toLowerCase()
      const systemLower = entry.systemName.toLowerCase()
      const aliasHit = entry.aliases.some((alias) => alias.toLowerCase().includes(q))

      const searchHaystack = [
        entry.stationName,
        entry.normalizedStationName,
        entry.lineName,
        entry.systemName,
        ...entry.aliases,
      ]
        .join(' | ')
        .toLowerCase()

      if (!searchHaystack.includes(q)) return null

      let score = 0
      if (stationLower === q || normalizedLower === q) score += 120
      if (stationLower.startsWith(q) || normalizedLower.startsWith(q)) score += 90
      if (stationLower.includes(q) || normalizedLower.includes(q)) score += 70
      if (lineLower.includes(q)) score += 20
      if (systemLower.includes(q)) score += 12
      if (aliasHit) score += 18

      return { ...entry, score }
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.stationName.localeCompare(b.stationName) ||
        a.lineName.localeCompare(b.lineName),
    )
    .slice(0, 12)
}

function getNearbyEntries(entries, latitude, longitude) {
  const deduped = new Map()
  for (const entry of entries) {
    const lat = Number(entry.lat)
    const lon = Number(entry.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
    const distanceMeters = getDistanceMeters(latitude, longitude, lat, lon)
    const dedupeKey = `${entry.systemId}:${entry.normalizedStationName}`
    const existing = deduped.get(dedupeKey)
    const candidate = { ...entry, distanceMeters }
    if (!existing || candidate.distanceMeters < existing.distanceMeters) {
      deduped.set(dedupeKey, candidate)
    }
  }
  return [...deduped.values()]
    .sort(
      (a, b) =>
        a.distanceMeters - b.distanceMeters || a.stationName.localeCompare(b.stationName),
    )
    .slice(0, 8)
}

export function useStationSearch() {
  const query = useAppStore((s) => s.stationSearchQuery)
  const results = useAppStore((s) => s.stationSearchResults)
  const nearbyStations = useAppStore((s) => s.nearbyStations)
  const highlightedIndex = useAppStore((s) => s.highlightedStationSearchIndex)
  const highlightedNearbyIndex = useAppStore((s) => s.highlightedNearbyStationIndex)
  const isLocating = useAppStore((s) => s.isLocating)
  const geolocationStatus = useAppStore((s) => s.geolocationStatus)
  const geolocationError = useAppStore((s) => s.geolocationError)
  const systemsById = useAppStore((s) => s.systemsById)

  const {
    setStationSearchQuery,
    setStationSearchResults,
    setHighlightedSearchIndex,
    setNearbyStations,
    setHighlightedNearbyIndex,
    setGeolocationStatus,
    setGeolocationError,
    setLocating,
    setUserLocation,
  } = useAppStore.getState()

  // Compute search results for a given query string
  const computeResults = useCallback(
    (searchQuery) => {
      const entries = buildSearchEntries(systemsById)
      const q = searchQuery.trim()
      if (!q) return []
      return scoreEntries(entries, q)
    },
    [systemsById],
  )

  const openSearch = useCallback(
    (prefill = '') => {
      setStationSearchQuery(prefill)
      setHighlightedSearchIndex(0)
      setHighlightedNearbyIndex(0)
      if (prefill.trim()) {
        setNearbyStations([])
        setGeolocationStatus('')
        setGeolocationError('')
        const computed = computeResults(prefill)
        setStationSearchResults(computed)
      } else {
        setStationSearchResults([])
      }
    },
    [
      computeResults,
      setStationSearchQuery,
      setStationSearchResults,
      setHighlightedSearchIndex,
      setHighlightedNearbyIndex,
      setNearbyStations,
      setGeolocationStatus,
      setGeolocationError,
    ],
  )

  const closeSearch = useCallback(() => {
    setStationSearchQuery('')
    setStationSearchResults([])
    setHighlightedSearchIndex(0)
    setHighlightedNearbyIndex(0)
    setNearbyStations([])
    setGeolocationStatus('')
    setGeolocationError('')
    setLocating(false)
  }, [
    setStationSearchQuery,
    setStationSearchResults,
    setHighlightedSearchIndex,
    setHighlightedNearbyIndex,
    setNearbyStations,
    setGeolocationStatus,
    setGeolocationError,
    setLocating,
  ])

  const updateQuery = useCallback(
    (newQuery) => {
      setStationSearchQuery(newQuery)
      setHighlightedSearchIndex(0)
      setHighlightedNearbyIndex(0)
      if (newQuery.trim()) {
        setNearbyStations([])
        setGeolocationStatus('')
        setGeolocationError('')
        const computed = computeResults(newQuery)
        setStationSearchResults(computed)
      } else {
        setStationSearchResults([])
      }
    },
    [
      computeResults,
      setStationSearchQuery,
      setStationSearchResults,
      setHighlightedSearchIndex,
      setHighlightedNearbyIndex,
      setNearbyStations,
      setGeolocationStatus,
      setGeolocationError,
    ],
  )

  const findNearby = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeolocationError('This browser does not support geolocation.')
      setGeolocationStatus('')
      setNearbyStations([])
      return
    }

    setLocating(true)
    setGeolocationError('')
    setGeolocationStatus('Requesting your location\u2026')
    setStationSearchQuery('')
    setHighlightedNearbyIndex(0)

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 120000,
        })
      })

      const latitude = position.coords?.latitude
      const longitude = position.coords?.longitude
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('invalid-location')
      }

      setUserLocation({ latitude, longitude })
      const entries = buildSearchEntries(systemsById)
      const nearby = getNearbyEntries(entries, latitude, longitude)
      setNearbyStations(nearby)
      setGeolocationStatus(
        nearby.length
          ? `Showing ${nearby.length} nearest station${nearby.length === 1 ? '' : 's'}`
          : 'No nearby stations found in loaded data.',
      )
      setGeolocationError('')
    } catch (error) {
      const code = error?.code
      setNearbyStations([])
      setGeolocationStatus('')
      setGeolocationError(
        code === 1
          ? 'Location permission was denied.'
          : code === 2
            ? 'Current location is unavailable.'
            : code === 3
              ? 'Location request timed out.'
              : 'Could not get your location.',
      )
    } finally {
      setLocating(false)
    }
  }, [
    systemsById,
    setLocating,
    setGeolocationError,
    setGeolocationStatus,
    setStationSearchQuery,
    setHighlightedNearbyIndex,
    setNearbyStations,
    setUserLocation,
  ])

  const handleSelection = useCallback(
    async (result, { openStationDialog, switchSystem } = {}) => {
      addRecentSearch(result)
      closeSearch()

      if (result.systemId !== appState.activeSystemId && switchSystem) {
        await switchSystem(result.systemId)
      }

      if (openStationDialog) {
        const line = appState.lines.find((l) => l.id === result.lineId)
        const station = line?.stops?.find((s) => s.id === result.stationId)
        if (station) openStationDialog(station)
      }
    },
    [closeSearch],
  )

  return {
    query,
    results,
    nearbyStations,
    highlightedIndex,
    highlightedNearbyIndex,
    isLocating,
    geolocationStatus,
    geolocationError,
    openSearch,
    closeSearch,
    updateQuery,
    findNearby,
    handleSelection,
    setHighlightedIndex,
    setHighlightedNearbyIndex,
  }
}
