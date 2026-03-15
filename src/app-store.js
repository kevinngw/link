import { createStore, computed } from './store.js'
import { DEFAULT_SYSTEM_ID } from './config.js'

/**
 * Create application store with reactive state management
 */
export function createAppStore() {
  const store = createStore({
    // UI State
    activeTab: 'map',
    activeLineId: '',
    activeSystemId: DEFAULT_SYSTEM_ID,
    compactLayout: false,
    theme: 'dark',
    language: 'en',
    
    // Data State
    lines: [],
    layouts: new Map(),
    vehiclesByLine: new Map(),
    rawVehicles: [],
    alerts: [],
    fetchedAt: '',
    error: '',
    
    // Dialog State
    currentDialogStationId: '',
    currentDialogStation: null,
    activeDialogRequest: 0,
    activeDialogType: '',
    dialogAbortController: null,
    dialogDisplayMode: false,
    dialogDisplayDirection: 'both',
    
    // Search State
    stationSearchQuery: '',
    stationSearchResults: [],
    highlightedStationSearchIndex: 0,
    nearbyStations: [],
    
    // Insights State
    currentInsightsDetailType: '',
    currentInsightsLineId: '',
    insightsTickerIndex: 0,
    
    // Vehicle State
    currentTrainId: '',
    vehicleGhosts: new Map(),
    systemSnapshots: new Map(),
    
    // Timing
    dialogRefreshTimer: 0,
    liveRefreshTimer: 0,
    dialogDisplayTimer: 0,
    insightsTickerTimer: 0,
  })

  // Computed properties
  computed(store, 'visibleLines', 
    () => store.state.compactLayout 
      ? store.state.lines.filter((line) => line.id === store.state.activeLineId)
      : store.state.lines,
    ['compactLayout', 'activeLineId', 'lines']
  )

  computed(store, 'hasError',
    () => Boolean(store.state.error),
    ['error']
  )

  computed(store, 'isLoading',
    () => !store.state.fetchedAt && !store.state.error,
    ['fetchedAt', 'error']
  )

  // Actions
  const actions = {
    setTab(tab) {
      store.state.activeTab = tab
    },
    
    setLine(lineId) {
      store.state.activeLineId = lineId
    },
    
    setSystem(systemId) {
      store.state.activeSystemId = systemId
    },
    
    setLanguage(lang) {
      store.state.language = lang
    },
    
    setTheme(theme) {
      store.state.theme = theme
    },
    
    setDialogStation(station) {
      store.state.currentDialogStation = station
      store.state.currentDialogStationId = station?.id || ''
      store.state.activeDialogRequest += 1
    },
    
    clearDialogStation() {
      store.state.currentDialogStation = null
      store.state.currentDialogStationId = ''
      store.state.activeDialogRequest += 1
      if (store.state.dialogAbortController) {
        store.state.dialogAbortController.abort()
        store.state.dialogAbortController = null
      }
    },
    
    updateVehicles({ rawVehicles, vehiclesByLine, fetchedAt }) {
      store.batch(() => {
        store.state.rawVehicles = rawVehicles
        store.state.vehiclesByLine = vehiclesByLine
        store.state.fetchedAt = fetchedAt
      })
    },
    
    setError(error) {
      store.state.error = error
    },
    
    clearError() {
      store.state.error = ''
    },
    
    setLines(lines) {
      store.state.lines = lines
      // Auto-select first line if current not in list
      if (!lines.some((l) => l.id === store.state.activeLineId)) {
        store.state.activeLineId = lines[0]?.id || ''
      }
    },
    
    toggleDialogDisplayMode() {
      store.state.dialogDisplayMode = !store.state.dialogDisplayMode
    },
    
    setDialogDisplayDirection(direction) {
      store.state.dialogDisplayDirection = direction
    }
  }

  return {
    ...store,
    actions
  }
}
