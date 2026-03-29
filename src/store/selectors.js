/**
 * selectors.js
 * Selector functions for the Zustand store. Import these in components to
 * avoid re-renders when unrelated state changes.
 *
 * Usage:
 *   const activeTab = useAppStore(selectActiveTab)
 *   const { lines, layouts } = useAppStore(selectSystemData)
 */

// ---------------------------------------------------------------------------
// Primitive field selectors
// ---------------------------------------------------------------------------

export const selectFetchedAt = (s) => s.fetchedAt
export const selectError = (s) => s.error
export const selectActiveSystemId = (s) => s.activeSystemId
export const selectActiveTab = (s) => s.activeTab
export const selectActiveLineId = (s) => s.activeLineId
export const selectCompactLayout = (s) => s.compactLayout
export const selectTheme = (s) => s.theme
export const selectLanguage = (s) => s.language
export const selectIsSyncingFromUrl = (s) => s.isSyncingFromUrl
export const selectActiveDialogRequest = (s) => s.activeDialogRequest
export const selectActiveDialogType = (s) => s.activeDialogType

// ---------------------------------------------------------------------------
// System / layout selectors
// ---------------------------------------------------------------------------

export const selectLines = (s) => s.lines
export const selectLayouts = (s) => s.layouts
export const selectSystemsById = (s) => s.systemsById
export const selectLayoutsBySystem = (s) => s.layoutsBySystem

export const selectSystemData = (s) => ({
  lines: s.lines,
  layouts: s.layouts,
  systemsById: s.systemsById,
  layoutsBySystem: s.layoutsBySystem,
  activeLineId: s.activeLineId,
  activeSystemId: s.activeSystemId,
})

// ---------------------------------------------------------------------------
// Vehicle selectors
// ---------------------------------------------------------------------------

export const selectVehiclesByLine = (s) => s.vehiclesByLine
export const selectRawVehicles = (s) => s.rawVehicles
export const selectAlerts = (s) => s.alerts
export const selectVehicleGhosts = (s) => s.vehicleGhosts
export const selectSystemSnapshots = (s) => s.systemSnapshots
export const selectDirectionFilterByLine = (s) => s.directionFilterByLine

/** Returns all vehicles across all lines with line metadata attached. */
export const selectAllVehicles = (s) =>
  s.lines.flatMap((line) =>
    (s.vehiclesByLine.get(line.id) ?? []).map((vehicle) => ({
      ...vehicle,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    })),
  )

/** Returns vehicles for the currently active line only. */
export const selectActiveLineVehicles = (s) => {
  const line = s.lines.find((l) => l.id === s.activeLineId)
  if (!line) return []
  return (s.vehiclesByLine.get(line.id) ?? []).map((vehicle) => ({
    ...vehicle,
    lineColor: line.color,
    lineId: line.id,
    lineName: line.name,
    lineToken: line.name[0],
  }))
}

// ---------------------------------------------------------------------------
// Arrivals cache selectors
// ---------------------------------------------------------------------------

export const selectArrivalsCache = (s) => s.arrivalsCache

// ---------------------------------------------------------------------------
// Dialog selectors
// ---------------------------------------------------------------------------

export const selectCurrentDialogStation = (s) => s.currentDialogStation
export const selectCurrentDialogStationId = (s) => s.currentDialogStationId
export const selectCurrentTrainId = (s) => s.currentTrainId
export const selectCurrentAlertLineId = (s) => s.currentAlertLineId
export const selectDialogAbortController = (s) => s.dialogAbortController

export const selectDialogDisplayState = (s) => ({
  dialogDisplayMode: s.dialogDisplayMode,
  dialogDisplayDirection: s.dialogDisplayDirection,
  dialogDisplayAutoPhase: s.dialogDisplayAutoPhase,
  dialogDisplayAnimatingDirection: s.dialogDisplayAnimatingDirection,
  dialogDisplayIndexes: s.dialogDisplayIndexes,
})

// ---------------------------------------------------------------------------
// Insights selectors
// ---------------------------------------------------------------------------

export const selectInsightsTickerIndex = (s) => s.insightsTickerIndex
export const selectCurrentInsightsDetailType = (s) => s.currentInsightsDetailType
export const selectCurrentInsightsLineId = (s) => s.currentInsightsLineId
export const selectInsightsDetail = (s) => ({
  title: s.insightsDetailTitle,
  subtitle: s.insightsDetailSubtitle,
  body: s.insightsDetailBody,
  type: s.currentInsightsDetailType,
  lineId: s.currentInsightsLineId,
})

// ---------------------------------------------------------------------------
// Station search selectors
// ---------------------------------------------------------------------------

export const selectStationSearchQuery = (s) => s.stationSearchQuery
export const selectStationSearchResults = (s) => s.stationSearchResults
export const selectHighlightedSearchIndex = (s) => s.highlightedStationSearchIndex
export const selectNearbyStations = (s) => s.nearbyStations
export const selectHighlightedNearbyIndex = (s) => s.highlightedNearbyStationIndex
export const selectGeolocationStatus = (s) => s.geolocationStatus
export const selectGeolocationError = (s) => s.geolocationError
export const selectIsLocating = (s) => s.isLocating
export const selectUserLocation = (s) => s.userLocation

export const selectStationSearchState = (s) => ({
  query: s.stationSearchQuery,
  results: s.stationSearchResults,
  highlightedIndex: s.highlightedStationSearchIndex,
  nearbyStations: s.nearbyStations,
  highlightedNearbyIndex: s.highlightedNearbyStationIndex,
  geolocationStatus: s.geolocationStatus,
  geolocationError: s.geolocationError,
  isLocating: s.isLocating,
  userLocation: s.userLocation,
})

// ---------------------------------------------------------------------------
// Favorites selectors
// ---------------------------------------------------------------------------

export const selectFavoriteArrivals = (s) => s.favoriteArrivals
export const selectFavoriteArrivalsRequestId = (s) => s.favoriteArrivalsRequestId

// ---------------------------------------------------------------------------
// Toast selectors
// ---------------------------------------------------------------------------

export const selectToast = (s) => ({
  message: s.toastMessage,
  tone: s.toastTone,
  key: s.toastKey,
})

// ---------------------------------------------------------------------------
// Computed / derived selectors
// ---------------------------------------------------------------------------

/**
 * Returns the lines visible in the current view (compact: only active line).
 */
export const selectVisibleLines = (s) =>
  s.compactLayout ? s.lines.filter((line) => line.id === s.activeLineId) : s.lines

/**
 * Returns true when there is no data yet (loading state).
 */
export const selectIsLoading = (s) => !s.fetchedAt && !s.error && s.lines.length === 0

/**
 * Returns true when there is a fetch error.
 */
export const selectHasError = (s) => Boolean(s.error)

/**
 * Returns alerts for a specific line id. Memoisation is caller's responsibility.
 */
export const makeSelectAlertsForLine = (lineId) => (s) =>
  s.alerts.filter((alert) => alert.lineIds.includes(lineId))

/**
 * Returns the active system's SYSTEM_META record (or a fallback).
 */
import { SYSTEM_META, DEFAULT_SYSTEM_ID } from '../config'

export const selectActiveSystemMeta = (s) =>
  SYSTEM_META[s.activeSystemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]
