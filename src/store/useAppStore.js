/**
 * useAppStore.js
 * Zustand v5 store — the single source of truth for React components.
 *
 * appState (src/lib/appState.js) is mutated by async legacy modules.
 * After those mutations, call syncFromAppState() to push the updated fields
 * into this store so React re-renders.
 */

import { create } from 'zustand'
import { appState } from '../lib/appState'
import { THEME_STORAGE_KEY, LANGUAGE_STORAGE_KEY } from '../config'

export const useAppStore = create((set, get) => ({
  // -------------------------------------------------------------------------
  // Mirror of appState fields that React components read
  // -------------------------------------------------------------------------
  fetchedAt: '',
  error: '',
  activeSystemId: appState.activeSystemId,
  activeTab: 'map',
  activeLineId: '',
  compactLayout: false,
  theme: 'dark',
  language: 'en',
  currentDialogStationId: '',
  systemsById: new Map(),
  layoutsBySystem: new Map(),
  lines: [],
  layouts: new Map(),
  vehiclesByLine: new Map(),
  directionFilterByLine: new Map(),
  rawVehicles: [],
  arrivalsCache: new Map(),
  activeDialogRequest: 0,
  isSyncingFromUrl: false,
  currentDialogStation: null,
  dialogDisplayMode: false,
  dialogDisplayDirection: 'both',
  dialogDisplayAutoPhase: 'nb',
  dialogDisplayAnimatingDirection: '',
  dialogDisplayIndexes: { nb: 0, sb: 0 },
  insightsTickerIndex: 0,
  currentTrainId: '',
  alerts: [],
  systemSnapshots: new Map(),
  vehicleGhosts: new Map(),
  stationSearchQuery: '',
  stationSearchResults: [],
  highlightedStationSearchIndex: 0,
  activeDialogType: '',
  currentInsightsDetailType: '',
  currentInsightsLineId: '',
  dialogAbortController: null,
  nearbyStations: [],
  highlightedNearbyStationIndex: 0,
  geolocationStatus: '',
  geolocationError: '',
  isLocating: false,
  userLocation: null,
  favoriteArrivals: new Map(),
  favoriteArrivalsRequestId: 0,

  // Extra fields not in appState
  toastMessage: '',
  toastTone: 'info',
  toastKey: 0,
  insightsDetailTitle: '',
  insightsDetailSubtitle: '',
  insightsDetailBody: '',
  currentAlertLineId: '',

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  setTab(tab) {
    appState.activeTab = tab
    set({ activeTab: tab })
  },

  setLine(lineId) {
    appState.activeLineId = lineId
    set({ activeLineId: lineId })
  },

  setActiveSystem(systemId) {
    appState.activeSystemId = systemId
    set({ activeSystemId: systemId })
  },

  setLanguage(lang) {
    const resolved = lang === 'zh-CN' ? 'zh-CN' : 'en'
    appState.language = resolved
    document.documentElement.lang = resolved
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved)
    set({ language: resolved })
  },

  setTheme(theme) {
    appState.theme = theme
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    set({ theme })
  },

  setCompactLayout(bool) {
    appState.compactLayout = bool
    set({ compactLayout: bool })
  },

  setSyncingFromUrl(bool) {
    appState.isSyncingFromUrl = bool
    set({ isSyncingFromUrl: bool })
  },

  setSystemData({ lines, layouts, systemsById, layoutsBySystem, activeLineId, activeSystemId }) {
    appState.lines = lines
    appState.layouts = layouts
    appState.systemsById = systemsById
    appState.layoutsBySystem = layoutsBySystem
    appState.activeLineId = activeLineId
    appState.activeSystemId = activeSystemId
    set({ lines, layouts, systemsById, layoutsBySystem, activeLineId, activeSystemId })
  },

  updateVehicleData({ vehiclesByLine, rawVehicles, alerts, fetchedAt, vehicleGhosts, systemSnapshots }) {
    appState.vehiclesByLine = vehiclesByLine
    appState.rawVehicles = rawVehicles
    appState.alerts = alerts
    appState.fetchedAt = fetchedAt
    appState.vehicleGhosts = vehicleGhosts
    appState.systemSnapshots = systemSnapshots
    set({
      vehiclesByLine: new Map(vehiclesByLine),
      rawVehicles,
      alerts,
      fetchedAt,
      vehicleGhosts: new Map(vehicleGhosts),
      systemSnapshots: new Map(systemSnapshots),
    })
  },

  setFetchError(error) {
    appState.error = error
    set({ error })
  },

  clearFetchError() {
    appState.error = ''
    set({ error: '' })
  },

  setDirectionFilter(lineId, direction) {
    const next = new Map(get().directionFilterByLine)
    next.set(lineId, direction)
    appState.directionFilterByLine = next
    set({ directionFilterByLine: next })
  },

  setArrivalsCache(cache) {
    appState.arrivalsCache = cache
    set({ arrivalsCache: new Map(cache) })
  },

  openStationDialog({ station, stationId }) {
    const requestId = get().activeDialogRequest + 1
    appState.activeDialogRequest = requestId
    appState.currentDialogStation = station
    appState.currentDialogStationId = stationId ?? station?.id ?? ''
    appState.activeDialogType = 'station'
    set({
      currentDialogStation: station,
      currentDialogStationId: stationId ?? station?.id ?? '',
      activeDialogType: 'station',
      activeDialogRequest: requestId,
    })
  },

  closeStationDialog() {
    const requestId = get().activeDialogRequest + 1
    appState.activeDialogRequest = requestId
    appState.currentDialogStation = null
    appState.currentDialogStationId = ''
    appState.activeDialogType = ''
    if (appState.dialogAbortController) {
      appState.dialogAbortController.abort()
      appState.dialogAbortController = null
    }
    set({
      currentDialogStation: null,
      currentDialogStationId: '',
      activeDialogType: '',
      activeDialogRequest: requestId,
      dialogAbortController: null,
    })
  },

  setCurrentTrainId(id) {
    appState.currentTrainId = id
    set({ currentTrainId: id })
  },

  openTrainDialog(id) {
    appState.currentTrainId = id
    appState.activeDialogType = 'train'
    set({ currentTrainId: id, activeDialogType: 'train' })
  },

  closeTrainDialog() {
    if (get().activeDialogType === 'train') {
      appState.activeDialogType = ''
    }
    appState.currentTrainId = ''
    set({ currentTrainId: '', activeDialogType: get().activeDialogType === 'train' ? '' : get().activeDialogType })
  },

  openAlertDialog(lineId) {
    appState.activeDialogType = 'alerts'
    set({ activeDialogType: 'alerts', currentAlertLineId: lineId })
  },

  closeAlertDialog() {
    if (get().activeDialogType === 'alerts') {
      appState.activeDialogType = ''
    }
    set({ activeDialogType: get().activeDialogType === 'alerts' ? '' : get().activeDialogType, currentAlertLineId: '' })
  },

  openInsightsDetail({ type, lineId, title, subtitle, body }) {
    appState.activeDialogType = 'insights'
    appState.currentInsightsDetailType = type
    appState.currentInsightsLineId = lineId ?? ''
    set({
      activeDialogType: 'insights',
      currentInsightsDetailType: type,
      currentInsightsLineId: lineId ?? '',
      insightsDetailTitle: title ?? '',
      insightsDetailSubtitle: subtitle ?? '',
      insightsDetailBody: body ?? '',
    })
  },

  closeInsightsDetail() {
    if (get().activeDialogType === 'insights') {
      appState.activeDialogType = ''
    }
    appState.currentInsightsDetailType = ''
    appState.currentInsightsLineId = ''
    set({
      activeDialogType: get().activeDialogType === 'insights' ? '' : get().activeDialogType,
      currentInsightsDetailType: '',
      currentInsightsLineId: '',
      insightsDetailTitle: '',
      insightsDetailSubtitle: '',
      insightsDetailBody: '',
    })
  },

  incrementActiveDialogRequest() {
    const next = get().activeDialogRequest + 1
    appState.activeDialogRequest = next
    set({ activeDialogRequest: next })
  },

  setDialogAbortController(controller) {
    appState.dialogAbortController = controller
    set({ dialogAbortController: controller })
  },

  setDialogDisplayMode(bool) {
    appState.dialogDisplayMode = bool
    set({ dialogDisplayMode: bool })
  },

  setDialogDisplayDirection(dir) {
    appState.dialogDisplayDirection = dir
    set({ dialogDisplayDirection: dir })
  },

  setDialogDisplayAutoPhase(phase) {
    appState.dialogDisplayAutoPhase = phase
    set({ dialogDisplayAutoPhase: phase })
  },

  setDialogDisplayAnimatingDirection(dir) {
    appState.dialogDisplayAnimatingDirection = dir
    set({ dialogDisplayAnimatingDirection: dir })
  },

  updateDialogDisplayIndexes(indexes) {
    appState.dialogDisplayIndexes = { ...appState.dialogDisplayIndexes, ...indexes }
    set({ dialogDisplayIndexes: { ...get().dialogDisplayIndexes, ...indexes } })
  },

  setStationSearchQuery(query) {
    appState.stationSearchQuery = query
    set({ stationSearchQuery: query })
  },

  setStationSearchResults(results) {
    appState.stationSearchResults = results
    set({ stationSearchResults: results })
  },

  setHighlightedSearchIndex(n) {
    appState.highlightedStationSearchIndex = n
    set({ highlightedStationSearchIndex: n })
  },

  setNearbyStations(stations) {
    appState.nearbyStations = stations
    set({ nearbyStations: stations })
  },

  setHighlightedNearbyIndex(n) {
    appState.highlightedNearbyStationIndex = n
    set({ highlightedNearbyStationIndex: n })
  },

  setGeolocationStatus(status) {
    appState.geolocationStatus = status
    set({ geolocationStatus: status })
  },

  setGeolocationError(err) {
    appState.geolocationError = err
    set({ geolocationError: err })
  },

  setLocating(bool) {
    appState.isLocating = bool
    set({ isLocating: bool })
  },

  setUserLocation(loc) {
    appState.userLocation = loc
    set({ userLocation: loc })
  },

  setInsightsTickerIndex(n) {
    appState.insightsTickerIndex = n
    set({ insightsTickerIndex: n })
  },

  incrementInsightsTickerIndex() {
    const next = get().insightsTickerIndex + 1
    appState.insightsTickerIndex = next
    set({ insightsTickerIndex: next })
  },

  updateFavoriteArrivals(key, snapshot) {
    const next = new Map(get().favoriteArrivals)
    next.set(key, snapshot)
    appState.favoriteArrivals = next
    set({ favoriteArrivals: next })
  },

  setFavoriteArrivalsRequestId(n) {
    appState.favoriteArrivalsRequestId = n
    set({ favoriteArrivalsRequestId: n })
  },

  showToast({ message, tone = 'info' }) {
    set((state) => ({
      toastMessage: message,
      toastTone: tone,
      toastKey: state.toastKey + 1,
    }))
  },

  dismissToast() {
    set({ toastMessage: '', toastTone: 'info' })
  },

  /**
   * syncFromAppState — pulls all mutable appState fields into the Zustand store.
   * Call this after any async mutation that should trigger a React re-render.
   */
  syncFromAppState() {
    set({
      fetchedAt: appState.fetchedAt,
      error: appState.error,
      activeSystemId: appState.activeSystemId,
      activeTab: appState.activeTab,
      activeLineId: appState.activeLineId,
      compactLayout: appState.compactLayout,
      theme: appState.theme,
      language: appState.language,
      currentDialogStationId: appState.currentDialogStationId,
      systemsById: new Map(appState.systemsById),
      layoutsBySystem: new Map(appState.layoutsBySystem),
      lines: appState.lines,
      layouts: new Map(appState.layouts),
      vehiclesByLine: new Map(appState.vehiclesByLine),
      directionFilterByLine: new Map(appState.directionFilterByLine),
      rawVehicles: appState.rawVehicles,
      arrivalsCache: new Map(appState.arrivalsCache),
      activeDialogRequest: appState.activeDialogRequest,
      isSyncingFromUrl: appState.isSyncingFromUrl,
      currentDialogStation: appState.currentDialogStation,
      dialogDisplayMode: appState.dialogDisplayMode,
      dialogDisplayDirection: appState.dialogDisplayDirection,
      dialogDisplayAutoPhase: appState.dialogDisplayAutoPhase,
      dialogDisplayAnimatingDirection: appState.dialogDisplayAnimatingDirection,
      dialogDisplayIndexes: appState.dialogDisplayIndexes,
      insightsTickerIndex: appState.insightsTickerIndex,
      currentTrainId: appState.currentTrainId,
      alerts: appState.alerts,
      systemSnapshots: new Map(appState.systemSnapshots),
      vehicleGhosts: new Map(appState.vehicleGhosts),
      stationSearchQuery: appState.stationSearchQuery,
      stationSearchResults: appState.stationSearchResults,
      highlightedStationSearchIndex: appState.highlightedStationSearchIndex,
      activeDialogType: appState.activeDialogType,
      currentInsightsDetailType: appState.currentInsightsDetailType,
      currentInsightsLineId: appState.currentInsightsLineId,
      dialogAbortController: appState.dialogAbortController,
      nearbyStations: appState.nearbyStations,
      highlightedNearbyStationIndex: appState.highlightedNearbyStationIndex,
      geolocationStatus: appState.geolocationStatus,
      geolocationError: appState.geolocationError,
      isLocating: appState.isLocating,
      userLocation: appState.userLocation,
      favoriteArrivals: new Map(appState.favoriteArrivals),
      favoriteArrivalsRequestId: appState.favoriteArrivalsRequestId,
    })
  },
}))
