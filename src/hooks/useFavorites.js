/**
 * useFavorites.js
 * Wraps the favorites CRUD operations from favorites.js for React components.
 *
 * All persistence is via localStorage (same as the vanilla implementation).
 * The hook does NOT manage arrivals — use useFavoriteArrivals for that.
 *
 * Usage:
 *   const {
 *     favorites, isFavorite, toggleFavorite,
 *     moveFavorite, removeFavorite, getFavoriteDisplayData
 *   } = useFavorites()
 */

import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { appState } from '../lib/appState'

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'
const FAVORITES_MAX_COUNT = 20

// ---------------------------------------------------------------------------
// localStorage helpers (pure functions, no React)
// ---------------------------------------------------------------------------

function loadFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  try {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites.slice(0, FAVORITES_MAX_COUNT)),
    )
  } catch {}
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFavorites() {
  const systemsById = useAppStore((s) => s.systemsById)
  const lines = useAppStore((s) => s.lines)
  // We use syncFromAppState to force re-render after mutations
  const syncFromAppState = useAppStore((s) => s.syncFromAppState)

  const getFavorites = useCallback(() => loadFavorites(), [])

  const isFavorite = useCallback((stationId, lineId, systemId) => {
    return loadFavorites().some(
      (f) => f.stationId === stationId && f.lineId === lineId && f.systemId === systemId,
    )
  }, [])

  const toggleFavorite = useCallback(
    (station, line, systemId) => {
      const favorites = loadFavorites()
      const exists = favorites.some(
        (f) => f.stationId === station.id && f.lineId === line.id && f.systemId === systemId,
      )

      if (exists) {
        // Remove
        const filtered = favorites.filter(
          (f) =>
            !(f.stationId === station.id && f.lineId === line.id && f.systemId === systemId),
        )
        saveFavorites(filtered)
        syncFromAppState()
        return { isFavorite: false, favorites: filtered }
      } else {
        // Add
        const existingIndex = favorites.findIndex(
          (f) => f.stationId === station.id && f.lineId === line.id && f.systemId === systemId,
        )
        if (existingIndex >= 0) {
          const [existing] = favorites.splice(existingIndex, 1)
          favorites.unshift(existing)
        } else {
          favorites.unshift({
            stationId: station.id,
            stationName: station.name,
            lineId: line.id,
            lineName: line.name,
            lineColor: line.color,
            systemId,
            systemName: appState.systemsById.get(systemId)?.name ?? systemId,
            addedAt: Date.now(),
          })
        }
        saveFavorites(favorites)
        syncFromAppState()
        return { isFavorite: true, favorites }
      }
    },
    [syncFromAppState],
  )

  const moveFavorite = useCallback(
    (stationId, lineId, systemId, direction) => {
      const favorites = loadFavorites()
      const index = favorites.findIndex(
        (f) => f.stationId === stationId && f.lineId === lineId && f.systemId === systemId,
      )
      if (index < 0) return favorites
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= favorites.length) return favorites
      const temp = favorites[index]
      favorites[index] = favorites[targetIndex]
      favorites[targetIndex] = temp
      saveFavorites(favorites)
      syncFromAppState()
      return favorites
    },
    [syncFromAppState],
  )

  const removeFavorite = useCallback(
    (stationId, lineId, systemId) => {
      const favorites = loadFavorites()
      const filtered = favorites.filter(
        (f) =>
          !(f.stationId === stationId && f.lineId === lineId && f.systemId === systemId),
      )
      saveFavorites(filtered)
      syncFromAppState()
      return filtered
    },
    [syncFromAppState],
  )

  const getFavoriteDisplayData = useCallback(() => {
    const favorites = loadFavorites()
    return favorites.map((fav) => {
      const system = systemsById.get(fav.systemId)
      const hasLoadedSystemData = Boolean(system?.lines)
      const line = system?.lines?.find((l) => l.id === fav.lineId)
      const station = line?.stops?.find((s) => s.id === fav.stationId)
      return {
        ...fav,
        exists: hasLoadedSystemData ? Boolean(station) : true,
        hasLoadedSystemData,
        station,
        line,
        system,
      }
    })
  }, [systemsById])

  return {
    getFavorites,
    isFavorite,
    toggleFavorite,
    moveFavorite,
    removeFavorite,
    getFavoriteDisplayData,
  }
}
