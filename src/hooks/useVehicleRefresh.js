/**
 * useVehicleRefresh.js
 * Manages the setTimeout-based vehicle refresh loop.
 *
 * - Schedules refreshVehicles() at VEHICLE_REFRESH_INTERVAL_MS
 * - On document visibilitychange (tab becomes visible) triggers a refresh
 * - On window focus triggers a refresh
 * - Returns { refreshNow } so components can trigger a manual refresh
 *
 * Usage:
 *   const { refreshNow } = useVehicleRefresh()
 */

import { useEffect, useRef, useCallback } from 'react'
import { VEHICLE_REFRESH_INTERVAL_MS } from '../config'
import { refreshVehicles } from '../lib/refreshVehicles'

export function useVehicleRefresh() {
  const timerRef = useRef(0)

  const scheduleNext = useCallback(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(async () => {
      await refreshVehicles()
      scheduleNext()
    }, VEHICLE_REFRESH_INTERVAL_MS)
  }, [])

  const refreshNow = useCallback(async () => {
    window.clearTimeout(timerRef.current)
    await refreshVehicles()
    scheduleNext()
  }, [scheduleNext])

  useEffect(() => {
    // Start loop immediately
    scheduleNext()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refreshNow().catch(console.error)
      }
    }

    function handleFocus() {
      refreshNow().catch(console.error)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearTimeout(timerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [scheduleNext, refreshNow])

  return { refreshNow }
}
