/**
 * useFavoriteArrivals.js
 * Manages fetching and refreshing live arrival previews for all favorite stations.
 *
 * This mirrors the refreshFavoriteArrivals() function from main.js.
 * Each favorite gets a snapshot stored in the Zustand store under
 * state.favoriteArrivals (keyed by "systemId:lineId:stationId").
 *
 * Usage:
 *   const { favoriteArrivals, refresh } = useFavoriteArrivals()
 *
 * The `refresh` function accepts an optional `{ force: true }` argument to
 * bypass the freshness check and re-fetch all favorites.
 */

import { useCallback, useRef } from 'react'
import { ARRIVALS_CACHE_TTL_MS } from '../config'
import { useAppStore } from '../store/useAppStore'
import { appState } from '../lib/appState'
import {
  fetchArrivalsForStopIds,
  buildArrivalsForLine,
  getStationStopIds,
} from '../lib/apiClient'
import { loadSystemDataById } from '../static-data'

function getFavoriteKey(fav) {
  return `${fav.systemId}:${fav.lineId}:${fav.stationId}`
}

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'

function loadFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function resolveFavoriteRecord(favorite) {
  let system = appState.systemsById.get(favorite.systemId)
  if (!system?.lines) {
    system = await loadSystemDataById(appState, favorite.systemId)
  }
  const line = system?.lines?.find((l) => l.id === favorite.lineId)
  const station = line?.stops?.find((s) => s.id === favorite.stationId)
  return { system, line, station }
}

export function useFavoriteArrivals() {
  const favoriteArrivals = useAppStore((s) => s.favoriteArrivals)
  const { updateFavoriteArrivals, setFavoriteArrivalsRequestId, syncFromAppState } =
    useAppStore.getState()

  // Track active refresh promise to avoid duplicate runs
  const refreshPromiseRef = useRef(null)

  const refresh = useCallback(
    async ({ force = false } = {}) => {
      if (refreshPromiseRef.current && !force) {
        return refreshPromiseRef.current
      }

      const run = (async () => {
        const favorites = loadFavorites()
        const validKeys = new Set(favorites.map(getFavoriteKey))

        // Remove stale keys
        for (const key of [...appState.favoriteArrivals.keys()]) {
          if (!validKeys.has(key)) {
            appState.favoriteArrivals.delete(key)
          }
        }

        if (!favorites.length) {
          syncFromAppState()
          return
        }

        const now = Date.now()
        const requestId = appState.favoriteArrivalsRequestId + 1
        appState.favoriteArrivalsRequestId = requestId
        setFavoriteArrivalsRequestId(requestId)

        // Mark stale entries as loading
        for (const fav of favorites) {
          const key = getFavoriteKey(fav)
          const cached = appState.favoriteArrivals.get(key)
          const isFresh =
            cached?.fetchedAt &&
            now - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS &&
            !cached?.error
          if (!force && (cached?.loading || isFresh)) continue
          const next = {
            ...(cached ?? {}),
            loading: true,
            error: '',
            arrivals: cached?.arrivals ?? { nb: [], sb: [] },
          }
          appState.favoriteArrivals.set(key, next)
          updateFavoriteArrivals(key, next)
        }

        // Fetch each favorite
        for (const fav of favorites) {
          if (appState.favoriteArrivalsRequestId !== requestId) return

          const key = getFavoriteKey(fav)
          const cached = appState.favoriteArrivals.get(key)
          const isFresh =
            cached?.fetchedAt &&
            Date.now() - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS &&
            !cached?.error
          if (!force && cached?.loading === false && isFresh) continue

          try {
            const { line, station } = await resolveFavoriteRecord(fav)

            if (!line || !station) {
              const snapshot = {
                loading: false,
                error: 'missing',
                fetchedAt: Date.now(),
                arrivals: { nb: [], sb: [] },
              }
              appState.favoriteArrivals.set(key, snapshot)
              updateFavoriteArrivals(key, snapshot)
              continue
            }

            const stopIds = getStationStopIds(station, line)
            const arrivalFeed = await fetchArrivalsForStopIds(stopIds)
            const arrivals = buildArrivalsForLine(arrivalFeed, line, stopIds)

            const snapshot = {
              loading: false,
              error: '',
              fetchedAt: Date.now(),
              arrivals,
            }
            appState.favoriteArrivals.set(key, snapshot)
            updateFavoriteArrivals(key, snapshot)
          } catch (error) {
            console.warn(`[useFavoriteArrivals] Failed for ${fav.stationName}:`, error)
            const snapshot = {
              loading: false,
              error: error?.errorType || error?.message || 'request-failed',
              fetchedAt: Date.now(),
              arrivals: { nb: [], sb: [] },
            }
            appState.favoriteArrivals.set(key, snapshot)
            updateFavoriteArrivals(key, snapshot)
          }
        }
      })()

      refreshPromiseRef.current = run
      try {
        await run
      } finally {
        if (refreshPromiseRef.current === run) {
          refreshPromiseRef.current = null
        }
      }
    },
    [updateFavoriteArrivals, setFavoriteArrivalsRequestId, syncFromAppState],
  )

  return { favoriteArrivals, refresh }
}
