/**
 * useRecentStations.js
 * Wraps the recent-stations.js manager for React components.
 *
 * Recent stations are stored in sessionStorage (cleared on tab close).
 *
 * Usage:
 *   const { getRecentStations, addRecentStation } = useRecentStations()
 */

import { useMemo } from 'react'
import { createRecentStationsManager } from '../recent-stations'

// Create a single shared manager instance (not per-hook, so storage is shared)
const manager = createRecentStationsManager()

export function useRecentStations() {
  // Expose stable references
  const { getRecentStations, addRecentStation, clearRecentStations } = useMemo(
    () => manager,
    [],
  )

  return { getRecentStations, addRecentStation, clearRecentStations }
}
