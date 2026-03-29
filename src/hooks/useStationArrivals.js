/**
 * useStationArrivals.js
 * Fetches and auto-refreshes arrivals for the station currently open in the
 * station dialog.
 *
 * - Fetches immediately when `station` changes
 * - Auto-refreshes at DIALOG_REFRESH_INTERVAL_MS
 * - Manages AbortController so in-flight requests are cancelled on unmount
 *   or when the station changes
 * - Returns stale cached arrivals immediately while a fresh fetch is underway
 *
 * Usage:
 *   const { arrivals, loading, error, refresh, fetchedAt } = useStationArrivals(station)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { DIALOG_REFRESH_INTERVAL_MS, ARRIVALS_CACHE_TTL_MS } from '../config'
import { appState } from '../lib/appState'
import {
  fetchArrivalsForStopIds,
  buildArrivalsForLine,
  getCachedArrivalsForStation,
  mergeArrivalBuckets,
  getStationStopIds,
} from '../lib/apiClient'
import { useAppStore } from '../store/useAppStore'

function getDialogStations(station, lines) {
  const exactMatches = lines
    .map((line) => {
      const matchedStation = line.stops.find((s) => s.id === station.id)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)

  if (exactMatches.length > 0) return exactMatches

  return lines
    .map((line) => {
      const matchedStation = line.stops.find((s) => s.name === station.name)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)
}

export function useStationArrivals(station) {
  const lines = useAppStore((s) => s.lines)
  const activeDialogRequest = useAppStore((s) => s.activeDialogRequest)

  const [arrivals, setArrivals] = useState({ nb: [], sb: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchedAt, setFetchedAt] = useState(null)

  const abortRef = useRef(null)
  const timerRef = useRef(0)
  const requestIdRef = useRef(activeDialogRequest)

  const doFetch = useCallback(
    async ({ skipCache = false } = {}) => {
      if (!station) return

      const dialogStations = getDialogStations(station, lines)
      if (!dialogStations.length) return

      // Serve stale cache immediately (phase 1)
      if (!skipCache) {
        const cachedBuckets = dialogStations.map(
          ({ station: s, line }) => getCachedArrivalsForStation(s, line) ?? { nb: [], sb: [] },
        )
        const hasCache = cachedBuckets.some((b) => b.nb.length > 0 || b.sb.length > 0)
        if (hasCache) {
          setArrivals(mergeArrivalBuckets(cachedBuckets))
        }
      }

      // Cancel previous in-flight request
      if (abortRef.current) {
        abortRef.current.abort()
      }
      abortRef.current = new AbortController()
      const { signal } = abortRef.current

      setLoading(true)
      setError(null)

      try {
        // Collect all unique stop IDs
        const lineStopIdMap = new Map()
        const allStopIds = new Set()

        for (const { station: matchedStation, line } of dialogStations) {
          const stopIds = getStationStopIds(matchedStation, line)
          lineStopIdMap.set(line, stopIds)
          for (const id of stopIds) allStopIds.add(id)
        }

        const arrivalFeed = await fetchArrivalsForStopIds([...allStopIds], signal)

        // Build per-line arrivals from the shared feed
        const arrivalsByLine = dialogStations.map(({ station: matchedStation, line }) => {
          const stopIds = lineStopIdMap.get(line)
          return buildArrivalsForLine(arrivalFeed, line, stopIds)
        })

        const merged = mergeArrivalBuckets(arrivalsByLine)
        setArrivals(merged)
        setFetchedAt(new Date().toISOString())
        setError(null)
      } catch (err) {
        if (err?.message?.includes('cancelled') || err?.name === 'AbortError') {
          // Silently ignore cancellations
          return
        }
        console.warn('[useStationArrivals] fetch failed:', err)
        setError(err?.errorType || err?.message || 'request-failed')
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [station, lines],
  )

  // Reset and re-fetch when station changes
  useEffect(() => {
    if (!station) {
      setArrivals({ nb: [], sb: [] })
      setLoading(false)
      setError(null)
      setFetchedAt(null)
      return
    }

    requestIdRef.current = activeDialogRequest

    // Fetch immediately (skip cache on fresh open)
    doFetch({ skipCache: true })

    // Auto-refresh interval
    window.clearTimeout(timerRef.current)
    function scheduleNext() {
      timerRef.current = window.setTimeout(async () => {
        await doFetch()
        scheduleNext()
      }, DIALOG_REFRESH_INTERVAL_MS)
    }
    scheduleNext()

    return () => {
      window.clearTimeout(timerRef.current)
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, activeDialogRequest])

  return {
    arrivals,
    loading,
    error,
    fetchedAt,
    refresh: doFetch,
  }
}
