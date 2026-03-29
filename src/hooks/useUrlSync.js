/**
 * useUrlSync.js
 * Sets up a popstate listener and syncs URL parameters to the Zustand store
 * on mount and whenever the browser history changes.
 *
 * This mirrors the syncDialogFromUrl() / window.addEventListener('popstate')
 * pattern from main.js.
 *
 * The hook itself has no return value. It is meant to be called once at the
 * top of the React app tree.
 *
 * URL parameter schema (from url-state.js):
 *   ?page=map|trains|insights
 *   ?system=link|rapidride|swift
 *   ?dialog=station|train|alerts|search|insights
 *   ?station=<slug>
 *   ?train=<vehicleId>
 *   ?line=<lineId>
 *   ?detail=<insightsType>
 *   ?q=<searchQuery>
 *
 * Usage:
 *   // In your root React component:
 *   useUrlSync()
 */

import { useEffect, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getPageFromUrl } from '../url-state'
import { DEFAULT_SYSTEM_ID } from '../config'
import { appState } from '../lib/appState'
import { slugifyStation } from '../utils'

function findStationByParam(stationParam, lines) {
  if (!stationParam) return null
  const normalizedParam = stationParam.trim().toLowerCase()

  for (const line of lines) {
    for (const station of line.stops) {
      const candidates = new Set([
        station.id,
        station.name,
        station.name?.toLowerCase(),
        slugifyStation(station.name),
      ])

      for (const alias of line.stationAliases?.[station.id] ?? []) {
        candidates.add(alias)
        candidates.add(slugifyStation(alias))
      }

      if ([...candidates].some((c) => String(c).toLowerCase() === normalizedParam)) {
        return station
      }
    }
  }

  return null
}

export function useUrlSync() {
  const {
    setTab,
    setActiveSystem,
    openStationDialog,
    closeStationDialog,
    openTrainDialog,
    closeTrainDialog,
    openAlertDialog,
    closeAlertDialog,
    setStationSearchQuery,
    setSyncingFromUrl,
    syncFromAppState,
  } = useAppStore.getState()

  const syncFromUrl = useCallback(async () => {
    const url = new URL(window.location.href)

    setSyncingFromUrl(true)
    appState.isSyncingFromUrl = true

    try {
      // Tab
      const page = getPageFromUrl()
      setTab(page)
      appState.activeTab = page

      // System
      const requestedSystemId = url.searchParams.get('system') ?? ''
      if (
        requestedSystemId &&
        appState.systemsById.has(requestedSystemId) &&
        requestedSystemId !== appState.activeSystemId
      ) {
        setActiveSystem(requestedSystemId)
      }

      syncFromAppState()

      const requestedDialog = (url.searchParams.get('dialog') ?? '').trim().toLowerCase()
      const requestedStation = url.searchParams.get('station') ?? ''
      const requestedTrainId = url.searchParams.get('train') ?? ''
      const requestedLineId = url.searchParams.get('line') ?? ''
      const requestedDetailType = url.searchParams.get('detail') ?? ''
      const requestedSearchQuery = url.searchParams.get('q') ?? ''
      const effectiveDialog = requestedDialog || (requestedStation ? 'station' : '')

      // Close dialogs that are no longer requested
      const state = useAppStore.getState()
      if (effectiveDialog !== 'station' && state.activeDialogType === 'station') {
        closeStationDialog()
      }
      if (effectiveDialog !== 'train' && state.currentTrainId) {
        closeTrainDialog()
      }
      if (effectiveDialog !== 'alerts' && state.activeDialogType === 'alerts') {
        closeAlertDialog()
      }

      if (!effectiveDialog) return

      if (effectiveDialog === 'station') {
        if (!requestedStation) {
          closeStationDialog()
          return
        }
        const station = findStationByParam(requestedStation, appState.lines)
        if (!station) {
          closeStationDialog()
          return
        }
        const currentState = useAppStore.getState()
        if (currentState.currentDialogStationId !== station.id) {
          openStationDialog({ station, stationId: station.id })
        }
        return
      }

      if (effectiveDialog === 'train') {
        if (!requestedTrainId) {
          closeTrainDialog()
          return
        }
        openTrainDialog(requestedTrainId)
        return
      }

      if (effectiveDialog === 'alerts') {
        if (!requestedLineId) {
          closeAlertDialog()
          return
        }
        openAlertDialog(requestedLineId)
        return
      }

      if (effectiveDialog === 'search') {
        setStationSearchQuery(requestedSearchQuery)
        return
      }

      if (effectiveDialog === 'insights') {
        if (page !== 'insights') {
          setTab('insights')
          appState.activeTab = 'insights'
        }
        // Insights detail is handled by the insights panel component
      }
    } finally {
      appState.isSyncingFromUrl = false
      setSyncingFromUrl(false)
    }
  }, [
    setSyncingFromUrl,
    setTab,
    setActiveSystem,
    openStationDialog,
    closeStationDialog,
    openTrainDialog,
    closeTrainDialog,
    openAlertDialog,
    closeAlertDialog,
    setStationSearchQuery,
    syncFromAppState,
  ])

  useEffect(() => {
    // Initial sync
    syncFromUrl().catch(console.error)

    function handlePopState() {
      syncFromUrl().catch(console.error)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [syncFromUrl])
}
