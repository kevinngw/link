import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { ARRIVALS_CACHE_TTL_MS, COMPACT_LAYOUT_BREAKPOINT, DEFAULT_SYSTEM_ID, GHOST_HISTORY_LIMIT, GHOST_MAX_AGE_MS, IS_PUBLIC_TEST_KEY, LANGUAGE_STORAGE_KEY, OBA_BASE_URL, OBA_KEY, SYSTEM_META, THEME_STORAGE_KEY, UI_COPY, VEHICLE_REFRESH_INTERVAL_MS } from './config'
import { formatAlertEffect, formatAlertSeverity, formatArrivalTime as formatArrivalTimeValue, formatClockTime as formatClockTimeValue, formatCurrentTime as formatCurrentTimeValue, formatDurationFromMs as formatDurationFromMsValue, formatEtaClockFromNow as formatEtaClockFromNowValue, formatRelativeTime as formatRelativeTimeValue, formatServiceClock as formatServiceClockValue, getDateKeyWithOffset, getServiceDateTime, getTodayDateKey } from './formatters'
import { classifyHeadwayHealth, computeGapStats, computeLineHeadways, formatPercent, getDelayBuckets, getLineAttentionReasons } from './insights'
import { clamp, normalizeName, parseClockToSeconds, pluralizeVehicleLabel, sleep, slugifyStation } from './utils'
import { createObaClient } from './oba'
import { createArrivalsHelpers, getLineRouteId, getStatusTone } from './arrivals'
import { parseVehicle } from './vehicles'
import { createMapRenderer } from './renderers/map'
import { createTrainRenderers } from './renderers/trains'
import { createInsightsRenderers } from './renderers/insights'

import { getDialogElements } from './dialogs/dom'
import { createStationDialogDisplayController } from './dialogs/station-display'
import { createStationDialogRenderers } from './dialogs/station-render'
import { createOverlayDialogs } from './dialogs/overlays'
import { applySystemState, bootstrapApp, loadStaticData, loadSystemDataById } from './static-data'
import { clearDialogParams, clearStationParam, getPageFromUrl, isOptionalNavigationEnabled, setAlertDialogParams, setInsightsDialogParams, setPageParam, setStationParam, setStationSearchParams, setSystemParam, setTrainDialogParams } from './url-state'
import { createToast } from './toast'
import { createVehicleDisplay } from './vehicle-display'
import { createStationSearch } from './station-search'
import { createFavoritesManager } from './favorites'

const state = {
  fetchedAt: '',
  error: '',
  activeSystemId: DEFAULT_SYSTEM_ID,
  activeTab: 'map',
  activeLineId: '',
  compactLayout: false,
  theme: 'dark',
  currentDialogStationId: '',
  systemsById: new Map(),
  layoutsBySystem: new Map(),
  lines: [],
  layouts: new Map(),
  vehiclesByLine: new Map(),
  rawVehicles: [],
  arrivalsCache: new Map(),
  activeDialogRequest: 0,
  isSyncingFromUrl: false,
  currentDialogStation: null,
  dialogOpenerElement: null,
  dialogRefreshTimer: 0,
  liveRefreshTimer: 0,
  liveMetaTimer: 0,
  dialogDisplayMode: false,
  dialogDisplayDirection: 'both',
  dialogDisplayAutoPhase: 'nb',
  dialogDisplayDirectionTimer: 0,
  dialogDisplayDirectionAnimationTimer: 0,
  dialogDisplayAnimatingDirection: '',
  dialogDisplayTimer: 0,
  dialogDisplayIndexes: { nb: 0, sb: 0 },
  insightsTickerIndex: 0,
  insightsTickerTimer: 0,
  currentTrainId: '',
  alerts: [],
  systemSnapshots: new Map(),
  vehicleGhosts: new Map(),
  language: 'en',
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
}

function closeDialogAnimated(dialogEl) {
  if (!dialogEl.open) return
  dialogEl.classList.add('is-closing')
  dialogEl.addEventListener('animationend', () => {
    dialogEl.classList.remove('is-closing')
    dialogEl.close()
  }, { once: true })
}

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
})

document.querySelector('#app').innerHTML = `
  <main class="screen">
    <header class="screen-header">
      <div>
        <p id="screen-kicker" class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1 id="screen-title">LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="station-search-toggle" class="theme-toggle station-search-toggle" type="button" aria-label="Open station search">Search</button>
        <button id="language-toggle" class="theme-toggle" type="button" aria-label="Switch to Chinese">中文</button>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="current-time" class="updated-at">Now --:--</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <div class="switcher-stack">
      <section id="system-bar" class="tab-bar system-bar" aria-label="Transit systems"></section>
      <section id="view-bar" class="tab-bar" aria-label="Board views">
        <button class="tab-button is-active" data-tab="map" type="button">Map</button>
        <button class="tab-button" data-tab="trains" type="button" id="tab-trains">Trains</button>
        <button class="tab-button" data-tab="favorites" type="button">Favorites</button>
        <button class="tab-button" data-tab="insights" type="button">Insights</button>
      </section>
    </div>
    <section id="board" class="board"></section>
    <div id="toast-region" class="toast-region" aria-live="polite" aria-atomic="true"></div>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div class="dialog-header-main">
          <div class="dialog-title-wrap">
            <h3 id="dialog-title" class="dialog-title">
              <span id="dialog-title-track" class="dialog-title-track">
                <span id="dialog-title-text" class="dialog-title-text">Station</span>
                <span id="dialog-title-text-clone" class="dialog-title-text dialog-title-text-clone" aria-hidden="true">Station</span>
              </span>
            </h3>
            <div id="dialog-meta" class="dialog-meta">
              <p id="dialog-status-pill" class="status-pill">SYNC</p>
              <p id="dialog-updated-at" class="updated-at">Waiting for snapshot</p>
            </div>
          </div>
          <p id="dialog-service-summary" class="dialog-service-summary">Service summary</p>
        </div>
        <div class="dialog-actions">
          <button id="dialog-favorite" class="dialog-close dialog-favorite-button" type="button" aria-label="Add to favorites">☆</button>
          <button id="dialog-share" class="dialog-close dialog-share-button" type="button" aria-label="Share arrivals">Share</button>
          <button id="dialog-display" class="dialog-close dialog-mode-button" type="button" aria-label="Toggle display mode">Board</button>
          <button id="station-dialog-close" class="dialog-close" type="button" aria-label="Close station dialog">&times;</button>
        </div>
      </header>
      <div class="dialog-direction-bar">
        <div id="dialog-direction-tabs" class="dialog-direction-tabs" aria-label="Board direction view">
          <button class="dialog-direction-tab is-active" data-dialog-direction="both" type="button">Both</button>
          <button class="dialog-direction-tab" data-dialog-direction="nb" type="button">NB</button>
          <button class="dialog-direction-tab" data-dialog-direction="sb" type="button">SB</button>
          <button class="dialog-direction-tab" data-dialog-direction="auto" type="button">Auto</button>
        </div>
      </div>
      <div id="station-alerts-container"></div>
      <div class="dialog-body">
        <div class="arrivals-section" data-direction-section="nb">
          <h4 id="arrivals-title-nb" class="arrivals-title">
            <span class="arrivals-title-track">
              <span class="arrivals-title-text">Northbound (▲)</span>
              <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">Northbound (▲)</span>
            </span>
          </h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 id="arrivals-title-sb" class="arrivals-title">
            <span class="arrivals-title-track">
              <span class="arrivals-title-text">Southbound (▼)</span>
              <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">Southbound (▼)</span>
            </span>
          </h4>
          <div id="arrivals-sb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-sb" class="arrivals-list"></div></div>
        </div>
      </div>
    </div>
  </dialog>
  <dialog id="train-dialog" class="station-dialog train-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="train-dialog-title">Train</h3>
          <p id="train-dialog-subtitle" class="updated-at">Current movement</p>
        </div>
        <div class="dialog-actions">
          <button id="train-dialog-close" class="dialog-close" type="button" aria-label="Close train dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <div id="train-dialog-line" class="train-detail-line"></div>
        <div id="train-dialog-status" class="train-detail-status"></div>
      </div>
    </div>
  </dialog>
  <dialog id="alert-dialog" class="station-dialog alert-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="alert-dialog-title">Service Alert</h3>
          <p id="alert-dialog-subtitle" class="updated-at">Transit advisory</p>
        </div>
        <div class="dialog-actions">
          <button id="alert-dialog-close" class="dialog-close" type="button" aria-label="Close alert dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <p id="alert-dialog-lines" class="train-detail-status"></p>
        <p id="alert-dialog-body" class="alert-dialog-body"></p>
        <a id="alert-dialog-link" class="alert-dialog-link" href="" target="_blank" rel="noreferrer">Read official alert</a>
      </div>
    </div>
  </dialog>
  <dialog id="station-search-dialog" class="station-dialog station-search-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="station-search-title">Station search</h3>
          <p id="station-search-summary" class="dialog-service-summary">Jump straight to any station across loaded systems.</p>
        </div>
        <div class="dialog-actions">
          <button id="station-search-close" class="dialog-close" type="button" aria-label="Close station search">&times;</button>
        </div>
      </header>
      <div class="station-search-shell">
        <label class="sr-only" for="station-search-input">Station search</label>
        <input id="station-search-input" class="station-search-input" type="search" placeholder="Search stations, lines, or systems" autocomplete="off" spellcheck="false" />
        <div class="station-search-actions">
          <button id="station-location-button" class="station-location-button" type="button">Use my location</button>
          <p id="station-location-status" class="station-location-status updated-at"></p>
        </div>
        <p id="station-search-meta" class="updated-at">Press / to search</p>
        <div id="station-search-results" class="station-search-results"></div>
      </div>
    </div>
  </dialog>
  <dialog id="insights-detail-dialog" class="station-dialog train-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="insights-detail-title">Details</h3>
          <p id="insights-detail-subtitle" class="updated-at"></p>
        </div>
        <div class="dialog-actions">
          <button id="insights-detail-close" class="dialog-close" type="button" aria-label="Close details">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <div id="insights-detail-body"></div>
      </div>
    </div>
  </dialog>
`

const boardElement = document.querySelector('#board')
const screenKickerElement = document.querySelector('#screen-kicker')
const screenTitleElement = document.querySelector('#screen-title')
const systemBarElement = document.querySelector('#system-bar')
const viewBarElement = document.querySelector('#view-bar')
const tabButtons = [...document.querySelectorAll('.tab-button')]
const stationSearchToggleButton = document.querySelector('#station-search-toggle')
const languageToggleButton = document.querySelector('#language-toggle')
const themeToggleButton = document.querySelector('#theme-toggle')
const statusPillElement = document.querySelector('#status-pill')
const currentTimeElement = document.querySelector('#current-time')
const updatedAtElement = document.querySelector('#updated-at')
const toastRegionElement = document.querySelector('#toast-region')
const stationSearchDialog = document.querySelector('#station-search-dialog')
const stationSearchTitleElement = document.querySelector('#station-search-title')
const stationSearchSummaryElement = document.querySelector('#station-search-summary')
const stationSearchInput = document.querySelector('#station-search-input')
const stationSearchMetaElement = document.querySelector('#station-search-meta')
const stationSearchResultsElement = document.querySelector('#station-search-results')
const stationSearchCloseButton = document.querySelector('#station-search-close')
const stationLocationButton = document.querySelector('#station-location-button')
const stationLocationStatusElement = document.querySelector('#station-location-status')

const dialogElements = getDialogElements()
const {
  dialog,
  dialogServiceSummary,
  dialogStatusPillElement,
  dialogUpdatedAtElement,
  dialogShare,
  dialogDisplay,
  dialogDirectionTabs,
  arrivalsTitleNb,
  arrivalsTitleSb,
  stationAlertsContainer,
  arrivalsNbPinned,
  arrivalsNb,
  arrivalsSbPinned,
  arrivalsSb,
  trainDialog,
  trainDialogTitle,
  trainDialogSubtitle,
  trainDialogClose,
  alertDialog,
  alertDialogTitle,
  alertDialogSubtitle,
  alertDialogLink,
  alertDialogClose,
  insightsDetailDialog,
  insightsDetailTitle,
  insightsDetailSubtitle,
  insightsDetailBody,
  insightsDetailClose,
} = dialogElements

const dialogShareButton = document.querySelector('#dialog-share')
const dialogFavoriteButton = document.querySelector('#dialog-favorite')

dialogDisplay.addEventListener('click', () => toggleDialogDisplayMode())

// Share button event listener
if (dialogShareButton) {
  dialogShareButton.addEventListener('click', () => {
    if (!state.currentDialogStation) return
    shareArrivals()
  })
}

trainDialogClose.addEventListener('click', () => closeTrainDialog())
alertDialogClose.addEventListener('click', () => closeAlertDialog())
insightsDetailClose.addEventListener('click', () => closeInsightsDetailDialog())
insightsDetailDialog.addEventListener('click', (e) => { if (e.target === insightsDetailDialog) closeInsightsDetailDialog() })
languageToggleButton.addEventListener('click', () => {
  setLanguage(state.language === 'en' ? 'zh-CN' : 'en')
  render()
})
dialogDirectionTabs.forEach((button) => {
  button.addEventListener('click', () => {
    state.dialogDisplayDirection = button.dataset.dialogDirection
    if (state.dialogDisplayDirection === 'auto') {
      state.dialogDisplayAutoPhase = 'nb'
    }
    renderDialogDirectionView()
  })
})
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) closeStationDialog()
})
document.querySelector('#station-dialog-close').addEventListener('click', () => closeStationDialog())
trainDialog.addEventListener('click', (e) => {
  if (e.target === trainDialog) closeTrainDialog()
})
alertDialog.addEventListener('click', (e) => {
  if (e.target === alertDialog) closeAlertDialog()
})
trainDialog.addEventListener('close', () => {
  state.currentTrainId = ''
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
  }
})
alertDialog.addEventListener('close', () => {
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
  }
})
stationSearchDialog.addEventListener('close', () => {
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
  }
})
insightsDetailDialog.addEventListener('close', () => {
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
  }
})
dialog.addEventListener('close', () => {
  state.activeDialogRequest += 1
  state.currentDialogStationId = ''
  state.currentDialogStation = null
  state.activeDialogType = ''
  // Cancel pending requests
  if (state.dialogAbortController) {
    state.dialogAbortController.abort()
    state.dialogAbortController = null
  }
  stopDialogAutoRefresh()
  stopDialogDisplayScroll()
  stopDialogDirectionRotation()
  setDialogDisplayMode(false)
  clearStationDialogContent()
  state.arrivalsCache.clear()
  clearObaQueue() // Cancel pending requests for this dialog
  setDialogTitle(copyValue('station'))
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true })
  }
  state.dialogOpenerElement?.focus()
  state.dialogOpenerElement = null
})
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.tab === state.activeTab) return
    boardElement.style.opacity = '0'
    setTimeout(() => {
      state.activeTab = button.dataset.tab
      setPageParam(state.activeTab)
      render()
      boardElement.style.opacity = '1'
    }, 150)
  })
})
themeToggleButton.addEventListener('click', () => {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setTheme(nextTheme)
      render()
    })
  } else {
    setTheme(nextTheme)
    render()
  }
})
stationSearchToggleButton.addEventListener('click', () => {
  openStationSearch()
})
stationLocationButton?.addEventListener('click', async () => {
  await findNearbyStations()
})
stationSearchCloseButton.addEventListener('click', () => closeStationSearch())
stationSearchDialog.addEventListener('click', (e) => {
  if (e.target === stationSearchDialog) closeStationSearch()
})
stationSearchInput.addEventListener('input', () => {
  state.stationSearchQuery = stationSearchInput.value
  state.highlightedStationSearchIndex = 0
  state.highlightedNearbyStationIndex = 0
  if (state.stationSearchQuery.trim()) {
    state.nearbyStations = []
    state.geolocationStatus = ''
    state.geolocationError = ''
  }
  if (stationSearchDialog.open && !state.isSyncingFromUrl) {
    setStationSearchParams(state.stationSearchQuery)
  }
  renderStationSearchResults()
})
stationSearchInput.addEventListener('keydown', async (event) => {
  const results = getActiveStationSearchResults()
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (state.stationSearchQuery.trim()) {
      state.highlightedStationSearchIndex = Math.min(Math.max(0, results.length - 1), state.highlightedStationSearchIndex + 1)
    } else {
      state.highlightedNearbyStationIndex = Math.min(Math.max(0, results.length - 1), state.highlightedNearbyStationIndex + 1)
    }
    renderStationSearchResults()
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (state.stationSearchQuery.trim()) {
      state.highlightedStationSearchIndex = Math.max(0, state.highlightedStationSearchIndex - 1)
    } else {
      state.highlightedNearbyStationIndex = Math.max(0, state.highlightedNearbyStationIndex - 1)
    }
    renderStationSearchResults()
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    const selected = state.stationSearchQuery.trim()
      ? (results[state.highlightedStationSearchIndex] ?? results[0])
      : (results[state.highlightedNearbyStationIndex] ?? results[0])
    if (selected) await handleStationSearchSelection(selected)
  }
})
document.addEventListener('keydown', (event) => {
  const target = event.target
  const isTypingTarget = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  if (event.key === '/' && !isTypingTarget && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault()
    openStationSearch()
    return
  }
  if (event.key === 'Escape' && stationSearchDialog.open) {
    closeStationSearch()
  }
})
document.addEventListener('visibilitychange', () => {
  refreshVisibleRealtime().catch(console.error)
})
window.addEventListener('focus', () => {
  refreshVisibleRealtime().catch(console.error)
})

// ---------------------------------------------------------------------------
// Event delegation — set up once; no re-attachment on every render
// ---------------------------------------------------------------------------

function findStationAndLineByStopId(stopId) {
  for (const line of state.lines) {
    const layout = state.layouts.get(line.id)
    const station = layout?.stations.find((s) => s.id === stopId)
    if (station) return { station, line }
  }
  return null
}

// Board: activate role=button elements with keyboard (Enter/Space)
boardElement.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const activatable = e.target.closest('[role="button"]')
  if (!activatable) return
  e.preventDefault()
  activatable.click()
})

// Board: handles line-switch, train, alert, station, insights, terminal clicks
boardElement.addEventListener('click', (e) => {
  const lineSwitchBtn = e.target.closest('[data-line-switch]')
  if (lineSwitchBtn) {
    state.activeLineId = lineSwitchBtn.dataset.lineSwitch
    render()
    return
  }

  const trainItem = e.target.closest('[data-train-id]')
  if (trainItem) {
    const vehicle = getAllVehicles().find((c) => c.id === trainItem.dataset.trainId)
    if (vehicle) {
      state.currentTrainId = trainItem.dataset.trainId
      renderTrainDialog(vehicle)
    }
    return
  }

  const alertBtn = e.target.closest('[data-alert-line-id]')
  if (alertBtn) {
    const line = state.lines.find((c) => c.id === alertBtn.dataset.alertLineId)
    if (line) renderAlertListDialog(line)
    return
  }

  const stationGroup = e.target.closest('.station-group')
  if (stationGroup) {
    const result = findStationAndLineByStopId(stationGroup.dataset.stopId)
    if (result) showStationDialog(result.station)
    return
  }

  const insightsEl = e.target.closest('[data-insights-type]')
  if (insightsEl) {
    const lineId = insightsEl.dataset.insightsLineId ?? null
    const type = insightsEl.dataset.insightsType
    const stopId = insightsEl.dataset.hotspotStopId ?? null
    const content = buildInsightsDetailContent(lineId, type, { stopId })
    if (content) showInsightsDetail(content.title, content.subtitle, content.body, { type, lineId: lineId ?? '' })
    return
  }

  const terminalEl = e.target.closest('[data-terminal-line-id]')
  if (terminalEl) {
    const layout = state.layouts.get(terminalEl.dataset.terminalLineId)
    if (!layout) return
    const station = terminalEl.dataset.terminalDirection === 'nb' ? layout.stations[0] : layout.stations.at(-1)
    if (station) showStationDialog(station)
  }
})


// System bar: system switcher
systemBarElement.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-system-switch]')
  if (!btn) return
  await switchSystem(btn.dataset.systemSwitch, { updateUrl: true, preserveDialog: false })
})

// Station dialog: arrival items → train dialog
dialog.addEventListener('click', (e) => {
  const item = e.target.closest('[data-arrival-vehicle-id]')
  if (!item) return
  const vehicle = getAllVehicles().find((c) => c.id === item.dataset.arrivalVehicleId)
  if (!vehicle) return
  state.currentTrainId = item.dataset.arrivalVehicleId
  renderTrainDialog(vehicle)
})

const { showToast, hideToast } = createToast(toastRegionElement)



const {
  getActiveStationSearchResults,
  getStationSearchEntries,
  findNearbyStations,
  renderStationSearchResults,
  openStationSearch,
  closeStationSearch,
  handleStationSearchSelection,
} = createStationSearch({
  state,
  elements: {
    stationSearchDialog,
    stationSearchInput,
    stationSearchMetaElement,
    stationSearchResultsElement,
    stationLocationButton,
    stationLocationStatusElement,
  },
  copyValue,
  closeDialogAnimated,
  showStationDialog,
  switchSystem,
  setStationSearchParams,
})

const {
  getFavorites,
  isFavorite,
  toggleFavorite,
  getFavoriteDisplayData,
  handleFavoriteClick,
} = createFavoritesManager({
  state,
  showStationDialog,
  switchSystem,
  showToast,
})

function updateFavoriteButton() {
  if (!dialogFavoriteButton || !state.currentDialogStation) return
  const dialogStations = getDialogStations(state.currentDialogStation)
  const firstMatch = dialogStations[0]
  if (!firstMatch) return
  
  const fav = isFavorite(firstMatch.station.id, firstMatch.line.id, state.activeSystemId)
  dialogFavoriteButton.textContent = fav ? '★' : '☆'
  dialogFavoriteButton.setAttribute('aria-label', fav ? copyValue('removeFavorite') : copyValue('addFavorite'))
  dialogFavoriteButton.classList.toggle('is-favorite', fav)
}

function renderFavoritesView() {
  const favorites = getFavoriteDisplayData()
  
  if (!favorites.length) {
    return `
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>${copyValue('favoritesTitle')}</h2>
          <p class="muted">${copyValue('noFavorites')}</p>
          <p class="muted">${copyValue('favoritesHint')}</p>
        </article>
      </section>
    `
  }

  const items = favorites.map((fav) => {
    const isCurrentSystem = fav.systemId === state.activeSystemId
    return `
      <div class="favorite-item ${fav.exists ? '' : 'favorite-item-missing'}" 
           data-favorite-key="${fav.systemId}:${fav.lineId}:${fav.stationId}"
           role="button" tabindex="0">
        <span class="arrival-line-token" style="--line-color:${fav.lineColor};">${fav.lineName[0]}</span>
        <div class="favorite-item-content">
          <p class="favorite-item-title">${fav.stationName}</p>
          <p class="favorite-item-meta">${fav.lineName}${isCurrentSystem ? '' : ` · ${fav.systemName}`}</p>
        </div>
        <span class="favorite-item-arrow">→</span>
      </div>
    `
  }).join('')

  return `
    <article class="panel-card panel-card-wide">
      <header class="panel-header">
        <h2>${copyValue('favoritesTitle')}</h2>
      </header>
      <div class="favorites-list">
        ${items}
      </div>
    </article>
  `
}

boardElement.addEventListener('click', (e) => {
  const favItem = e.target.closest('[data-favorite-key]')
  if (!favItem) return
  const key = favItem.dataset.favoriteKey
  const fav = getFavorites().find((f) => `${f.systemId}:${f.lineId}:${f.stationId}` === key)
  if (fav) handleFavoriteClick(fav)
})

function setArrivalsTitleHtml(element, text) {
  element.innerHTML = `<span class="arrivals-title-track"><span class="arrivals-title-text">${text}</span><span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">${text}</span></span>`
}

function clearStationDialogContent() {
  stationAlertsContainer.innerHTML = ''
  arrivalsNbPinned.innerHTML = ''
  arrivalsSbPinned.innerHTML = ''
  arrivalsNb.innerHTML = ''
  arrivalsSb.innerHTML = ''
  setArrivalsTitleHtml(arrivalsTitleNb, formatDirectionLabel('▲', '', { includeSymbol: true }))
  setArrivalsTitleHtml(arrivalsTitleSb, formatDirectionLabel('▼', '', { includeSymbol: true }))
  dialogServiceSummary.textContent = copyValue('serviceSummary')
}

function getActiveSystemMeta() {
  return SYSTEM_META[state.activeSystemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]
}

function getActiveAgencyId() {
  return state.systemsById.get(state.activeSystemId)?.agencyId ?? SYSTEM_META[DEFAULT_SYSTEM_ID].agencyId
}

function getVehicleUrl() {
  return `${OBA_BASE_URL}/vehicles-for-agency/${getActiveAgencyId()}.json?key=${OBA_KEY}`
}

function getVehicleLabel() {
  if (state.language === 'zh-CN') {
    return getActiveSystemMeta().vehicleLabel === 'Train' ? '列车' : '公交'
  }

  return getActiveSystemMeta().vehicleLabel ?? 'Vehicle'
}

function getVehicleLabelPlural() {
  if (state.language === 'zh-CN') {
    return getVehicleLabel()
  }

  return getActiveSystemMeta().vehicleLabelPlural ?? pluralizeVehicleLabel(getVehicleLabel())
}

function copyForLanguage() {
  return UI_COPY[state.language] ?? UI_COPY.en
}

function copyValue(key, ...args) {
  const value = copyForLanguage()[key]
  return typeof value === 'function' ? value(...args) : value
}

function isPageRequestContextActive() {
  return document.visibilityState === 'visible' && document.hasFocus()
}

const { fetchJsonWithRetry, clearQueue: clearObaQueue } = createObaClient(state)
const { buildArrivalsForLine, fetchArrivalsForStopIds, getCachedArrivalsForStation, getArrivalsForStation, mergeArrivalBuckets, getArrivalServiceStatus } = createArrivalsHelpers({
  state,
  fetchJsonWithRetry,
  getStationStopIds: (...args) => getStationStopIds(...args),
  copyValue,
})

function formatRelativeTime(dateString) {
  return formatRelativeTimeValue(dateString, copyValue)
}

function formatCurrentTime() {
  return formatCurrentTimeValue(state.language)
}

function formatArrivalTime(offsetSeconds) {
  return formatArrivalTimeValue(offsetSeconds, copyValue)
}

function formatDurationFromMs(ms) {
  return formatDurationFromMsValue(ms, copyValue)
}

function formatServiceClock(clockValue) {
  return formatServiceClockValue(clockValue, state.language, copyValue)
}

function formatClockTime(timestamp) {
  return formatClockTimeValue(timestamp, state.language)
}

function formatEtaClockFromNow(offsetSeconds) {
  return formatEtaClockFromNowValue(offsetSeconds, state.language)
}

function getDirectionBaseLabel(directionSymbol, includeSymbol = false) {
  const symbolPrefix = includeSymbol && (directionSymbol === '▲' || directionSymbol === '▼')
    ? `${directionSymbol} `
    : ''

  if (directionSymbol === '▲') {
    return `${symbolPrefix}${copyValue('northboundLabel')}`
  }

  if (directionSymbol === '▼') {
    return `${symbolPrefix}${copyValue('southboundLabel')}`
  }

  return copyValue('active')
}

function formatDirectionLabel(directionSymbol, destination = '', { includeSymbol = false } = {}) {
  const baseLabel = getDirectionBaseLabel(directionSymbol, includeSymbol)
  if (!destination) return baseLabel
  return copyValue('directionTo', baseLabel, destination)
}

function getDirectionDestinationLabel(directionSymbol, layout) {
  if (!layout?.stations?.length) return ''
  const terminalIndex = directionSymbol === '▲' ? 0 : directionSymbol === '▼' ? layout.stations.length - 1 : -1
  if (terminalIndex < 0) return ''
  return layout.stations[terminalIndex]?.label ?? ''
}

function getVehicleDestinationLabel(vehicle, layout) {
  const terminalLabel = getDirectionDestinationLabel(vehicle?.directionSymbol, layout)
  if (terminalLabel) return terminalLabel
  return vehicle?.upcomingLabel || vehicle?.toLabel || vehicle?.currentStopLabel || ''
}

function formatLayoutDirectionLabel(directionSymbol, layout, options = {}) {
  return formatDirectionLabel(directionSymbol, getDirectionDestinationLabel(directionSymbol, layout), options)
}

function summarizeDirectionDestinations(destinations) {
  const uniqueDestinations = [...new Set(destinations.map((destination) => destination?.trim()).filter(Boolean))]
  if (!uniqueDestinations.length) return ''
  const labels = uniqueDestinations.slice(0, 2)
  if (uniqueDestinations.length > 2) {
    labels.push(copyValue('etcLabel'))
  }
  return labels.join(' / ')
}

function getDialogDirectionSummary(directionSymbol, arrivalsBucket = [], station = state.currentDialogStation) {
  const arrivalDestinations = arrivalsBucket.map((arrival) => arrival.destination)
  const arrivalSummary = summarizeDirectionDestinations(arrivalDestinations)
  if (arrivalSummary) return arrivalSummary

  if (!station) return ''

  const layoutDestinations = getDialogStations(station)
    .map(({ line }) => state.layouts.get(line.id))
    .map((layout) => getDirectionDestinationLabel(directionSymbol, layout))

  return summarizeDirectionDestinations(layoutDestinations)
}

function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return 'dark'
}

function getPreferredLanguage() {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage === 'en' || storedLanguage === 'zh-CN') return storedLanguage

  const browserLanguage = navigator.language?.toLowerCase() ?? ''
  return browserLanguage.startsWith('zh') ? 'zh-CN' : 'en'
}

function setTheme(theme) {
  state.theme = theme
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

function setLanguage(language) {
  state.language = language === 'zh-CN' ? 'zh-CN' : 'en'
  document.documentElement.lang = state.language
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language)
}

function updateViewportState() {
  const visualViewportWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY
  const innerWidth = window.innerWidth || Number.POSITIVE_INFINITY
  const documentWidth = document.documentElement?.clientWidth || Number.POSITIVE_INFINITY
  const viewportWidth = Math.min(innerWidth, visualViewportWidth, documentWidth)
  state.compactLayout = viewportWidth <= COMPACT_LAYOUT_BREAKPOINT
}

function syncCompactLayoutFromBoard() {
  const gridTemplateColumns = window.getComputedStyle(boardElement).gridTemplateColumns
  const columnCount = gridTemplateColumns
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean).length
  const shouldCompact = columnCount <= 1

  if (shouldCompact !== state.compactLayout) {
    state.compactLayout = shouldCompact
    render()
  }
}

function getInsightsTickerPageSize() {
  return state.compactLayout ? 1 : 3
}

function getTodayServiceSpan(line) {
  const todayKey = getTodayDateKey()
  const span = line.serviceSpansByDate?.[todayKey]
  if (!span) return copyValue('todayServiceUnavailable')
  return copyValue('todayServiceSpan', formatServiceClock(span.start), formatServiceClock(span.end))
}

function getServiceReminder(line) {
  const now = new Date()
  const yesterdayKey = getDateKeyWithOffset(-1)
  const todayKey = getDateKeyWithOffset(0)
  const tomorrowKey = getDateKeyWithOffset(1)

  const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
  const todaySpan = line.serviceSpansByDate?.[todayKey]
  const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

  const windows = [
    yesterdaySpan && {
      kind: 'yesterday',
      start: getServiceDateTime(yesterdayKey, yesterdaySpan.start),
      end: getServiceDateTime(yesterdayKey, yesterdaySpan.end),
      span: yesterdaySpan,
    },
    todaySpan && {
      kind: 'today',
      start: getServiceDateTime(todayKey, todaySpan.start),
      end: getServiceDateTime(todayKey, todaySpan.end),
      span: todaySpan,
    },
  ].filter(Boolean)

  const activeWindow = windows.find((window) => now >= window.start && now <= window.end)
  if (activeWindow) {
    return {
      tone: 'active',
      headline: copyValue('lastTrip', formatServiceClock(activeWindow.span.end)),
      detail: copyValue('endsIn', formatDurationFromMs(activeWindow.end.getTime() - now.getTime())),
      compact: copyValue('endsIn', formatDurationFromMs(activeWindow.end.getTime() - now.getTime())),
    }
  }

  if (todaySpan) {
    const todayStart = getServiceDateTime(todayKey, todaySpan.start)
    const todayEnd = getServiceDateTime(todayKey, todaySpan.end)

    if (now < todayStart) {
      return {
        tone: 'upcoming',
        headline: copyValue('firstTrip', formatServiceClock(todaySpan.start)),
        detail: copyValue('startsIn', formatDurationFromMs(todayStart.getTime() - now.getTime())),
        compact: copyValue('startsIn', formatDurationFromMs(todayStart.getTime() - now.getTime())),
      }
    }

    if (now > todayEnd) {
      return {
        tone: 'ended',
        headline: copyValue('serviceEnded', formatServiceClock(todaySpan.end)),
        detail: tomorrowSpan ? copyValue('nextStart', formatServiceClock(tomorrowSpan.start)) : copyValue('noNextServiceLoaded'),
        compact: tomorrowSpan ? copyValue('nextStart', formatServiceClock(tomorrowSpan.start)) : copyValue('ended'),
      }
    }
  }

  if (tomorrowSpan) {
    return {
      tone: 'upcoming',
      headline: copyValue('nextFirstTrip', formatServiceClock(tomorrowSpan.start)),
      detail: copyValue('noServiceRemainingToday'),
      compact: copyValue('nextStart', formatServiceClock(tomorrowSpan.start)),
    }
  }

  return {
    tone: 'muted',
    headline: copyValue('serviceHoursUnavailable'),
    detail: copyValue('staticScheduleMissing'),
    compact: copyValue('unavailable'),
  }
}

function renderServiceReminderChip(line) {
  const reminder = getServiceReminder(line)
  return `
    <div class="service-reminder service-reminder-${reminder.tone}">
      <p class="service-reminder-headline">${reminder.headline}</p>
      <p class="service-reminder-detail">${reminder.detail}</p>
    </div>
  `
}

function renderStationServiceSummary(station) {
  const summaries = getDialogStations(station)
    .map(({ line }) => {
      const reminder = getServiceReminder(line)
      return `${line.name}: ${reminder.compact}`
    })
    .slice(0, 3)

  dialogServiceSummary.textContent = summaries.join('  ·  ') || copyValue('serviceSummaryUnavailable')
}

function getTimelineHour(date) {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
}

function getLosAngelesDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
  const hours = Number(parts.hour ?? '0')
  const minutes = Number(parts.minute ?? '0')
  const seconds = Number(parts.second ?? '0')
  return {
    hours,
    minutes,
    seconds,
    hourValue: hours + minutes / 60 + seconds / 3600,
  }
}

function getTimelineBoundaryLabel(boundary) {
  if (boundary === 'start') {
    return copyValue('midnightStartLabel')
  }
  return copyValue('midnightEndLabel')
}

function getServiceTimelineData(line) {
  const now = new Date()
  const yesterdayKey = getDateKeyWithOffset(-1)
  const todayKey = getDateKeyWithOffset(0)
  const tomorrowKey = getDateKeyWithOffset(1)
  const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
  const todaySpan = line.serviceSpansByDate?.[todayKey]
  const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

  const windows = [
    yesterdaySpan && {
      kind: 'yesterday',
      dateKey: yesterdayKey,
      span: yesterdaySpan,
      start: getServiceDateTime(yesterdayKey, yesterdaySpan.start),
      end: getServiceDateTime(yesterdayKey, yesterdaySpan.end),
    },
    todaySpan && {
      kind: 'today',
      dateKey: todayKey,
      span: todaySpan,
      start: getServiceDateTime(todayKey, todaySpan.start),
      end: getServiceDateTime(todayKey, todaySpan.end),
    },
    tomorrowSpan && {
      kind: 'tomorrow',
      dateKey: tomorrowKey,
      span: tomorrowSpan,
      start: getServiceDateTime(tomorrowKey, tomorrowSpan.start),
      end: getServiceDateTime(tomorrowKey, tomorrowSpan.end),
    },
  ].filter(Boolean)

  if (!windows.length) return null

  const activeWindow = windows.find((window) => now >= window.start && now <= window.end)
  const selectedWindow = activeWindow
    ?? windows.find((window) => window.kind === 'today')
    ?? windows.find((window) => window.start > now)
    ?? windows.at(-1)

  if (!selectedWindow?.span) return null

  const todayStart = getServiceDateTime(todayKey, '00:00:00')
  const todayEnd = getServiceDateTime(tomorrowKey, '00:00:00')
  const visibleStart = new Date(Math.max(selectedWindow.start.getTime(), todayStart.getTime()))
  const visibleEnd = new Date(Math.min(selectedWindow.end.getTime(), todayEnd.getTime()))
  const visibleStartHours = Math.max(0, (visibleStart.getTime() - todayStart.getTime()) / 3_600_000)
  const visibleEndHours = Math.max(0, (visibleEnd.getTime() - todayStart.getTime()) / 3_600_000)
  const { hourValue: nowHourValue } = getLosAngelesDateParts(now)
  const isLive = now >= selectedWindow.start && now <= selectedWindow.end
  const continuesPastMidnight = selectedWindow.end.getTime() > todayEnd.getTime()
  const startedBeforeToday = selectedWindow.start.getTime() < todayStart.getTime()

  return {
    startHours: visibleStartHours,
    endHours: visibleEndHours,
    nowHours: nowHourValue,
    axisMax: 24,
    isLive,
    startLabel: startedBeforeToday ? getTimelineBoundaryLabel('start') : formatServiceClock(selectedWindow.span.start),
    endLabel: continuesPastMidnight ? getTimelineBoundaryLabel('end') : formatServiceClock(selectedWindow.span.end),
    overflowLabel: continuesPastMidnight ? formatServiceClock(selectedWindow.span.end) : '',
  }
}

function renderServiceTimeline(line) {
  const timeline = getServiceTimelineData(line)
  if (!timeline) return ''

  const startPercent = clamp((timeline.startHours / timeline.axisMax) * 100, 0, 100)
  const endPercent = clamp((timeline.endHours / timeline.axisMax) * 100, startPercent, 100)
  const nowPercent = clamp((timeline.nowHours / timeline.axisMax) * 100, 0, 100)

  return `
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${copyValue('todayServiceWindowTitle')}</p>
          <p class="headway-chart-copy">${timeline.overflowLabel
            ? copyValue('serviceOverflowNote', timeline.overflowLabel)
            : copyValue('serviceFirstLastNote')}</p>
        </div>
        <span class="service-timeline-badge ${timeline.isLive ? 'is-live' : 'is-off'}">${timeline.isLive ? copyValue('inServiceBadge') : copyValue('offHoursBadge')}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${startPercent}%; width:${Math.max(2, endPercent - startPercent)}%;"></div>
        <div class="service-timeline-now" style="left:${nowPercent}%;" aria-label="${copyValue('currentTimeAria')}">
          <span class="service-timeline-now-line"></span>
          <span class="service-timeline-now-dot"></span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${timeline.startLabel}</span>
        <span>${timeline.endLabel}</span>
      </div>
    </section>
  `
}

function getAlertsForLine(lineId) {
  return state.alerts.filter((alert) => alert.lineIds.includes(lineId))
}

function getAlertsForStation(station, line) {
  const lineAlerts = getAlertsForLine(line.id)
  if (!lineAlerts.length) return []
  const stopIds = new Set(getStationStopIds(station, line))
  stopIds.add(station.id)
  return lineAlerts.filter((alert) => alert.stopIds.length > 0 && alert.stopIds.some((id) => stopIds.has(id)))
}

function getStationDialogAlerts(station) {
  const seen = new Set()
  const alerts = []
  for (const { station: matchedStation, line } of getDialogStations(station)) {
    for (const alert of getAlertsForStation(matchedStation, line)) {
      if (!seen.has(alert.id)) {
        seen.add(alert.id)
        alerts.push(alert)
      }
    }
  }
  return alerts
}

function renderInlineAlerts(lineAlerts, lineId) {
  if (!lineAlerts.length) return ''

  return `
    <button class="line-alert-badge" type="button" data-alert-line-id="${lineId}">
      <span class="line-alert-badge-count">${lineAlerts.length}</span>
      <span class="line-alert-badge-copy">${copyValue('alertsWord', lineAlerts.length)}</span>
    </button>
  `
}

function formatVehicleSegment(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return copyValue('vehicleAt', vehicle.fromLabel)
  }

  return `${vehicle.fromLabel} -> ${vehicle.toLabel}`
}

function formatVehicleLocationSummary(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return copyValue('vehicleCurrentlyAt', vehicle.fromLabel)
  }

  return copyValue('vehicleRunningBetween', vehicle.fromLabel, vehicle.toLabel)
}

function getTrainTimelineEntries(vehicle, layout) {
  if (!layout?.stations?.length) return []

  const currentIndex = Math.max(0, Math.min(layout.stations.length - 1, vehicle.currentIndex ?? 0))
  const nextIndex = Math.max(0, Math.min(layout.stations.length - 1, vehicle.upcomingStopIndex ?? currentIndex))
  const directionStep = vehicle.directionSymbol === '▲' ? -1 : vehicle.directionSymbol === '▼' ? 1 : 0
  if (!directionStep) return []

  const entries = []
  let etaSeconds = Math.max(0, vehicle.nextOffset ?? 0)

  for (let index = nextIndex; index >= 0 && index < layout.stations.length; index += directionStep) {
    const station = layout.stations[index]
    if (!station) break

    entries.push({
      stationId: station.id,
      label: station.label,
      etaSeconds,
      clockTime: formatClockTime(Date.now() + etaSeconds * 1000),
      isNext: index === nextIndex,
      isTerminal: index === 0 || index === layout.stations.length - 1,
    })

    const segmentMinutes = station.segmentMinutes ?? 0
    const previousStation = layout.stations[index - 1]
    const reverseSegmentMinutes = previousStation?.segmentMinutes ?? 0
    etaSeconds += Math.round((directionStep > 0 ? segmentMinutes : reverseSegmentMinutes) * 60)
  }

  return entries
}

function renderFocusMetrics(vehicle) {
  const layout = state.layouts.get(vehicle.lineId)
  const terminalEta = Math.max(0, (getTrainTimelineEntries(vehicle, layout).at(-1)?.etaSeconds) ?? (vehicle.nextOffset ?? 0))
  const nextStopName = vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel

  return `
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${copyValue('nextStop')}</p>
        <p class="train-focus-metric-value">${nextStopName}</p>
        <p class="train-focus-metric-copy" data-vehicle-next-countdown="${vehicle.id}">${formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${copyValue('terminal')}</p>
        <p class="train-focus-metric-value">${getVehicleDestinationLabel(vehicle, layout)}</p>
        <p class="train-focus-metric-copy" data-vehicle-terminal-countdown="${vehicle.id}">${formatArrivalTime(getRealtimeOffset(terminalEta))}</p>
      </div>
    </div>
  `
}

function getAllVehicles() {
  return state.lines.flatMap((line) =>
    (state.vehiclesByLine.get(line.id) ?? []).map((vehicle) => ({
      ...vehicle,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    })),
  )
}

const {
  getRealtimeOffset,
  getVehicleStatusClass,
  getVehicleStatusPills,
  renderStatusPills,
  formatVehicleStatus,
  renderLineStatusMarquee,
  refreshVehicleStatusMessages,
  refreshVehicleCountdownDisplays,
  refreshArrivalCountdowns,
} = createVehicleDisplay({
  state,
  copyValue,
  formatArrivalTime,
  formatEtaClockFromNow,
  getArrivalServiceStatus,
  getStatusTone,
  getAllVehicles,
  getTrainTimelineEntries,
})

async function shareArrivals() {
  if (!state.currentDialogStation) return
  
  const station = state.currentDialogStation
  const dialogStations = getDialogStations(station)
  
  // Get cached arrivals for both directions
  const arrivalsByLine = dialogStations.map(({ station: s, line }) => {
    return getCachedArrivalsForStation(s, line) ?? { nb: [], sb: [] }
  })
  const arrivals = mergeArrivalBuckets(arrivalsByLine)
  
  // Format share text
  const nbArrivals = arrivals.nb.slice(0, 3)
  const sbArrivals = arrivals.sb.slice(0, 3)
  
  let shareText = `${station.name}\n`
  
  if (nbArrivals.length > 0) {
    shareText += `\n${state.language === 'zh-CN' ? '北向' : 'Northbound'}:\n`
    nbArrivals.forEach((a) => {
      const timeStr = formatArrivalTime(Math.floor((a.arrivalTime - Date.now()) / 1000))
      shareText += `• ${a.lineName} ${getVehicleLabel()} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
    })
  }
  
  if (sbArrivals.length > 0) {
    shareText += `\n${state.language === 'zh-CN' ? '南向' : 'Southbound'}:\n`
    sbArrivals.forEach((a) => {
      const timeStr = formatArrivalTime(Math.floor((a.arrivalTime - Date.now()) / 1000))
      shareText += `• ${a.lineName} ${getVehicleLabel()} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
    })
  }
  
  // Add app link
  const baseUrl = window.location.origin + window.location.pathname
  const stationParam = encodeURIComponent(station.name.toLowerCase().replace(/\s+/g, '-'))
  shareText += `\n${baseUrl}?system=${state.activeSystemId}&station=${stationParam}`
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: `${station.name} - ${getActiveSystemMeta().title}`,
        text: shareText,
      })
      showToast(copyValue('shareSuccess'))
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      showToast(copyValue('shareCopied'))
    } else {
      showToast(copyValue('shareFailed'))
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      showToast(copyValue('shareFailed'))
    }
  }
}

function renderSystemSwitcher() {
  return Object.values(SYSTEM_META)
    .filter((system) => state.systemsById.has(system.id))
    .map(
      (system) => `
        <button
          class="tab-button ${system.id === state.activeSystemId ? 'is-active' : ''}"
          data-system-switch="${system.id}"
          type="button"
        >
          ${system.label}
        </button>
      `,
    )
    .join('')
}

function getLineSwitcherLabel(line) {
  const name = line.name?.trim() ?? ''
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return name

  const compactPrefixes = ['rapidride', 'swift']
  if (compactPrefixes.includes(parts[0].toLowerCase())) {
    return parts.slice(1).join(' ')
  }

  return name
}

function renderLineSwitcher() {
  if (!state.compactLayout || state.lines.length < 2) return ''

  const buttons = state.lines
    .map((line) => {
      const compactLabel = getLineSwitcherLabel(line)
      return `
        <button
          class="line-switcher-button ${line.id === state.activeLineId ? 'is-active' : ''}"
          data-line-switch="${line.id}"
          type="button"
          aria-pressed="${line.id === state.activeLineId ? 'true' : 'false'}"
          aria-label="${line.name}"
          style="--line-color:${line.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <span class="line-switcher-label-group">
            <span class="line-switcher-label-compact">${compactLabel}</span>
            <span class="line-switcher-label-full">${line.name}</span>
          </span>
        </button>
      `
    })
    .join('')

  return `<section class="line-switcher" aria-label="Lines">${buttons}</section>`
}

function getVisibleLines() {
  return state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
}


function getStationStopIds(station, line) {
  const aliases = new Set(line.stationAliases?.[station.id] ?? [])
  aliases.add(station.id)

  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith(`${line.agencyId}_`) ? alias : `${line.agencyId}_${alias}`
    candidates.add(normalized)
  }

  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith(`${line.agencyId}_`) ? baseId : `${line.agencyId}_${baseId}`)

  return [...candidates]
}

function getDialogStations(station) {
  const exactMatches = state.lines
    .map((line) => {
      const matchedStation = line.stops.find((stop) => stop.id === station.id)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)

  if (exactMatches.length > 0) return exactMatches

  return state.lines
    .map((line) => {
      const matchedStation = line.stops.find((stop) => stop.name === station.name)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)
}

function findStationByParam(stationParam) {
  if (!stationParam) return null

  const normalizedParam = stationParam.trim().toLowerCase()

  for (const line of state.lines) {
    for (const station of line.stops) {
      const candidates = new Set([
        station.id,
        `${line.agencyId}_${station.id}`,
        station.name,
        normalizeName(station.name),
        slugifyStation(station.name),
        slugifyStation(normalizeName(station.name)),
      ])

      for (const alias of line.stationAliases?.[station.id] ?? []) {
        candidates.add(alias)
        candidates.add(`${line.agencyId}_${alias}`)
        candidates.add(slugifyStation(alias))
      }

      if ([...candidates].some((candidate) => String(candidate).toLowerCase() === normalizedParam)) {
        return station
      }
    }
  }

  return null
}



function getSystemIdFromUrl() {
  const url = new URL(window.location.href)
  const requested = url.searchParams.get('system')
  if (requested && state.systemsById.has(requested)) return requested
  return DEFAULT_SYSTEM_ID
}

async function syncDialogFromUrl() {
  const url = new URL(window.location.href)
  state.isSyncingFromUrl = true
  try {
    state.activeTab = getPageFromUrl()

    const requestedSystemId = url.searchParams.get('system')
    if (requestedSystemId && state.systemsById.has(requestedSystemId) && requestedSystemId !== state.activeSystemId) {
      await switchSystem(requestedSystemId, { updateUrl: false, preserveDialog: false })
    }

    render()

    const requestedDialog = (url.searchParams.get('dialog') ?? '').trim().toLowerCase()
    const requestedStation = url.searchParams.get('station')
    const requestedTrainId = url.searchParams.get('train')
    const requestedLineId = url.searchParams.get('line')
    const requestedDetailType = url.searchParams.get('detail')
    const requestedSearchQuery = url.searchParams.get('q') ?? ''
    const effectiveDialog = requestedDialog || (requestedStation ? 'station' : '')

    if (effectiveDialog !== 'station' && dialog.open) closeStationDialog()
    if (effectiveDialog !== 'train' && trainDialog.open) closeTrainDialog()
    if (effectiveDialog !== 'alerts' && alertDialog.open) closeAlertDialog()
    if (effectiveDialog !== 'search' && stationSearchDialog.open) closeStationSearch()
    if (effectiveDialog !== 'insights' && insightsDetailDialog.open) closeInsightsDetailDialog()

    if (!effectiveDialog) return

    if (effectiveDialog === 'station') {
      if (!requestedStation) {
        closeStationDialog()
        return
      }

      const station = findStationByParam(requestedStation)
      if (!station) {
        closeStationDialog()
        return
      }

      if (state.currentDialogStationId === station.id && dialog.open) return
      await showStationDialog(station, { updateUrl: false })
      return
    }

    if (effectiveDialog === 'train') {
      if (!requestedTrainId) {
        closeTrainDialog()
        return
      }
      const vehicle = getAllVehicles().find((candidate) => candidate.id === requestedTrainId)
      if (!vehicle) {

        closeTrainDialog()
        return
      }
      state.currentTrainId = requestedTrainId
      state.activeDialogType = 'train'
      renderTrainDialog(vehicle, { updateUrl: false })
      return
    }

    if (effectiveDialog === 'alerts') {
      if (!requestedLineId) {
        closeAlertDialog()
        return
      }
      const line = state.lines.find((candidate) => candidate.id === requestedLineId)
      if (!line) {
        closeAlertDialog()
        return
      }
      state.activeDialogType = 'alerts'
      renderAlertListDialog(line, { updateUrl: false })
      return
    }

    if (effectiveDialog === 'search') {
      state.activeDialogType = 'search'
      openStationSearch(requestedSearchQuery, { updateUrl: false })
      return
    }

    if (effectiveDialog === 'insights') {
      if (state.activeTab !== 'insights') {
        state.activeTab = 'insights'
        render()
      }
      if (!requestedDetailType) {
        closeInsightsDetailDialog()
        return
      }
      const content = buildInsightsDetailContent(requestedLineId || null, requestedDetailType)
      if (!content) {
        closeInsightsDetailDialog()
        return
      }
      state.activeDialogType = 'insights'
      showInsightsDetail(content.title, content.subtitle, content.body, {
        updateUrl: false,
        lineId: requestedLineId || '',
        type: requestedDetailType,
      })
    }
  } finally {
    state.isSyncingFromUrl = false
  }
}

const stationDialogDisplay = createStationDialogDisplayController({
  state,
  elements: dialogElements,
  copyValue,
  refreshStationDialog: async (station) => {
    try {
      await refreshStationDialog(station)
    } catch (error) {
      if (error.errorType === 'rate-limit') {
        showToast(copyValue('stationRateLimited'))
      } else {
        showToast(copyValue('stationRequestFailed'))
      }
      throw error
    }
  },
  clearStationParam,
})

const {
  setDialogDisplayMode,
  toggleDialogDisplayMode,
  stopDialogDirectionRotation,
  stopDialogDirectionAnimation,
  renderDialogDirectionView,
  stopDialogAutoRefresh,
  stopDialogDisplayScroll,
  applyDialogDisplayOffset,
  syncDialogDisplayScroll,
  startDialogAutoRefresh,
  closeStationDialog,
  setDialogTitle,
  syncDialogTitleMarquee,
} = stationDialogDisplay

function recordVehicleGhosts(lineId, vehicles) {
  const now = Date.now()
  const activeKeys = new Set()

  for (const vehicle of vehicles) {
    const key = `${lineId}:${vehicle.id}`
    activeKeys.add(key)
    const existing = state.vehicleGhosts.get(key) ?? []
    const nextHistory = [
      ...existing.filter((entry) => now - entry.timestamp <= GHOST_MAX_AGE_MS),
      { y: vehicle.y, minutePosition: vehicle.minutePosition, timestamp: now },
    ].slice(-GHOST_HISTORY_LIMIT)
    state.vehicleGhosts.set(key, nextHistory)
  }

  for (const [key, history] of state.vehicleGhosts.entries()) {
    if (!key.startsWith(`${lineId}:`)) continue
    const freshHistory = history.filter((entry) => now - entry.timestamp <= GHOST_MAX_AGE_MS)
    if (!activeKeys.has(key) || freshHistory.length === 0) {
      state.vehicleGhosts.delete(key)
      continue
    }
    if (freshHistory.length !== history.length) {
      state.vehicleGhosts.set(key, freshHistory)
    }
  }
}

function getVehicleGhostTrail(lineId, vehicleId) {
  const history = state.vehicleGhosts.get(`${lineId}:${vehicleId}`) ?? []
  return history.slice(0, -1)
}


function buildInsightsItems(lines) {
  return lines.map((line) => {
    const layout = state.layouts.get(line.id)
    const vehicles = state.vehiclesByLine.get(line.id) ?? []
    const nb = vehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
    const sb = vehicles.filter((vehicle) => vehicle.directionSymbol === '▼')
    const lineAlerts = getAlertsForLine(line.id)

    return {
      line,
      layout,
      vehicles,
      nb,
      sb,
      lineAlerts,
    }
  })
}

function computeSystemSummaryMetrics(insightsItems) {
  const totalLines = insightsItems.length
  const totalVehicles = insightsItems.reduce((sum, item) => sum + item.vehicles.length, 0)
  const totalAlerts = insightsItems.reduce((sum, item) => sum + item.lineAlerts.length, 0)
  const impactedLines = insightsItems.filter((item) => item.lineAlerts.length > 0).length
  const impactedStopCount = new Set(insightsItems.flatMap((item) => item.lineAlerts.flatMap((alert) => alert.stopIds ?? []))).size
  const allVehicles = insightsItems.flatMap((item) => item.vehicles)
  const delayBuckets = getDelayBuckets(allVehicles)

  const rankedLines = insightsItems
    .map((item) => {
      const { nbGaps, sbGaps } = computeLineHeadways(item.nb, item.sb)
      const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : 0
      const severeLateCount = item.vehicles.filter((vehicle) => Number(vehicle.scheduleDeviation ?? 0) > 300).length
      const balanceDelta = Math.abs(item.nb.length - item.sb.length)
      const nbHealth = classifyHeadwayHealth(nbGaps, item.nb.length).health
      const sbHealth = classifyHeadwayHealth(sbGaps, item.sb.length).health
      const isUneven = [nbHealth, sbHealth].some((health) => health === 'uneven' || health === 'bunched' || health === 'sparse')
      const hasSevereLate = severeLateCount > 0
      const score = item.lineAlerts.length * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
      const attentionReasons = getLineAttentionReasons({
        worstGap,
        severeLateCount,
        alertCount: item.lineAlerts.length,
        balanceDelta,
        copyValue,
      })

      return {
        line: item.line,
        score,
        worstGap,
        severeLateCount,
        alertCount: item.lineAlerts.length,
        balanceDelta,
        hasSevereLate,
        isUneven,
        attentionReasons,
      }
    })
    .sort((left, right) => right.score - left.score || right.worstGap - left.worstGap)

  const delayedLineIds = new Set(rankedLines.filter((item) => item.hasSevereLate).map((item) => item.line.id))
  const unevenLineIds = new Set(rankedLines.filter((item) => item.isUneven).map((item) => item.line.id))
  const lateOnlyLineCount = rankedLines.filter((item) => item.hasSevereLate && !item.isUneven).length
  const unevenOnlyLineCount = rankedLines.filter((item) => item.isUneven && !item.hasSevereLate).length
  const mixedIssueLineCount = rankedLines.filter((item) => item.hasSevereLate && item.isUneven).length
  const attentionLineCount = new Set([...delayedLineIds, ...unevenLineIds]).size
  const healthyLineCount = Math.max(0, totalLines - attentionLineCount)
  const onTimeRate = totalVehicles ? Math.round((delayBuckets.onTime / totalVehicles) * 100) : null
  const priorityLines = rankedLines.filter((item) => item.score > 0).slice(0, 2)

  let topIssue = {
    tone: 'healthy',
    copy: copyValue('noMajorIssues'),
  }
  const topLine = rankedLines[0] ?? null
  if (topLine?.alertCount) {
    topIssue = {
      tone: 'info',
      copy: copyValue('topIssueAlerts', topLine.line.name, topLine.alertCount),
    }
  } else if (topLine?.worstGap >= 12) {
    topIssue = {
      tone: 'alert',
      copy: copyValue('topIssueGap', topLine.line.name, topLine.worstGap),
    }
  } else if (topLine?.severeLateCount) {
    topIssue = {
      tone: 'warn',
      copy: copyValue('topIssueLate', topLine.line.name, topLine.severeLateCount, topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()),
    }
  }

  return {
    totalLines,
    totalVehicles,
    totalAlerts,
    impactedLines,
    impactedStopCount,
    delayedLineIds,
    unevenLineIds,
    lateOnlyLineCount,
    unevenOnlyLineCount,
    mixedIssueLineCount,
    attentionLineCount,
    healthyLineCount,
    onTimeRate,
    rankedLines,
    priorityLines,
    topIssue,
  }
}

function isActiveStationDialogRequest(station, requestId) {
  return Boolean(
    dialog.open &&
    station &&
    state.currentDialogStationId === station.id &&
    state.activeDialogRequest === requestId,
  )
}

function canRefreshStationDialog(station, requestId = state.activeDialogRequest) {
  return isPageRequestContextActive() && isActiveStationDialogRequest(station, requestId)
}

async function refreshStationDialog(station, { requestId = state.activeDialogRequest, skipCache = false } = {}) {
  if (!station) return

  const dialogStations = getDialogStations(station)

  // Phase 1: render stale cached arrivals immediately (zero wait) - skip for fresh opens
  if (!skipCache) {
    const cachedArrivals = dialogStations.map(({ station: s, line }) => getCachedArrivalsForStation(s, line) ?? { nb: [], sb: [] })
    const hasAnyCache = cachedArrivals.some((a) => a.nb.length > 0 || a.sb.length > 0)
    if (hasAnyCache) {
      renderArrivalLists(mergeArrivalBuckets(cachedArrivals))
      renderDialogDirectionView()
      syncDialogTitleMarquee()
    }
  }

  const stationAlerts = getStationDialogAlerts(station)
  stationAlertsContainer.innerHTML = stationAlerts.length
    ? stationAlerts.map((alert) => `
        <article class="insight-exception insight-exception-warn">
          <p>${alert.title || copyValue('serviceAlert')}</p>
        </article>
      `).join('')
    : ''

  if (!canRefreshStationDialog(station, requestId)) return

  // Cancel previous request if any
  if (state.dialogAbortController) {
    state.dialogAbortController.abort()
  }
  // Create new controller for this request
  state.dialogAbortController = new AbortController()
  const { signal } = state.dialogAbortController

  // Phase 2: fetch fresh arrivals for all lines
  // Collect all unique stop IDs across all lines, then fetch once and distribute
  const lineStopIdMap = new Map() // line -> stopIds for this station
  const allStopIds = new Set()
  
  for (const { station: matchedStation, line } of dialogStations) {
    const stopIds = getStationStopIds(matchedStation, line)
    lineStopIdMap.set(line, stopIds)
    for (const id of stopIds) {
      allStopIds.add(id)
    }
  }
  
  // Single fetch for all unique stop IDs
  let arrivalFeed = []
  try {
    arrivalFeed = await fetchArrivalsForStopIds([...allStopIds], signal)
  } catch (error) {
    if (error.message?.includes('cancelled') || error.name === 'AbortError') {
      console.debug(`[refreshStationDialog] Request cancelled for ${station.name}`)
      return
    }
    console.warn(`Failed to fetch arrivals for station ${station.name}:`, error)
  }
  
  // Safeguard: abort if station changed during fetch
  if (state.currentDialogStationId !== station.id) {
    console.debug(`[refreshStationDialog] Station changed during fetch, aborting render`)
    return
  }
  
  if (!isActiveStationDialogRequest(station, requestId)) {
    console.debug(`[refreshStationDialog] Request ID mismatch, aborting render`)
    return
  }
  
  // Build arrivals for each line using the shared feed
  const arrivalsByLine = dialogStations.map(({ station: matchedStation, line }) => {
    const stopIds = lineStopIdMap.get(line)
    return buildArrivalsForLine(arrivalFeed, line, stopIds)
  })
  
  renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))
  renderDialogDirectionView()
  syncDialogTitleMarquee()
}

async function showStationDialog(station, { updateUrl = true } = {}) {
  if (!station) return
  const requestId = state.activeDialogRequest + 1
  state.activeDialogRequest = requestId
  state.currentDialogStation = station
  state.currentDialogStationId = station.id
  setDialogTitle(station.name)
  renderStationServiceSummary(station)
  clearStationDialogContent()
  renderArrivalLists({ nb: [], sb: [] }, true)
  if (!dialog.open) {
    state.dialogOpenerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    dialog.querySelector('#station-dialog-close')?.focus()
  }
  if (updateUrl) setStationParam(station)
  startDialogAutoRefresh()
  updateFavoriteButton()
  try {
    await refreshStationDialog(station, { requestId, skipCache: true })
  } catch (e) {
    if (state.activeDialogRequest !== requestId) return
    if (e.errorType === 'rate-limit') {
      showToast(copyValue('stationRateLimited'))
    } else {
      showToast(copyValue('stationRequestFailed'))
    }
    console.warn('Station refresh failed:', e)
  }
}

if (dialogFavoriteButton) {
  dialogFavoriteButton.addEventListener('click', () => {
    if (!state.currentDialogStation) return
    const dialogStations = getDialogStations(state.currentDialogStation)
    const firstMatch = dialogStations[0]
    if (!firstMatch) return
    
    const result = toggleFavorite(firstMatch.station, firstMatch.line, state.activeSystemId)
    updateFavoriteButton()
    showToast(copyValue(result.isFavorite ? 'favoriteAdded' : 'favoriteRemoved'))
  })
}

const { renderLine } = createMapRenderer({
  state,
  getAlertsForLine,
  getAlertsForStation,
  getTodayServiceSpan,
  getVehicleGhostTrail,
  getVehicleLabel,
  getVehicleLabelPlural,
  copyValue,
  renderInlineAlerts,
  renderLineStatusMarquee,
  renderServiceReminderChip,
})

const { renderTrainList } = createTrainRenderers({
  state,
  copyValue,
  formatArrivalTime,
  formatDirectionLabel,
  formatEtaClockFromNow,
  formatVehicleLocationSummary,
  getAlertsForLine,
  getAllVehicles,
  getRealtimeOffset,
  getTodayServiceSpan,
  getVehicleDestinationLabel,
  getVehicleLabel,
  getVehicleLabelPlural,
  getVehicleStatusClass,
  renderFocusMetrics,
  renderInlineAlerts,
  renderLineStatusMarquee,
  renderServiceReminderChip,
  formatVehicleStatus,
})

const { renderInsightsBoard, buildInsightsDetailContent, showInsightsDetail: showInsightsDetailBase } = createInsightsRenderers({
  state,
  classifyHeadwayHealth,
  computeLineHeadways,
  copyValue,
  elements: dialogElements,
  formatCurrentTime,
  formatLayoutDirectionLabel,
  formatPercent,
  getActiveSystemMeta,
  getAlertsForLine,
  getDelayBuckets,
  getLineAttentionReasons,
  getInsightsTickerPageSize,
  getRealtimeOffset,
  getTodayServiceSpan,
  getVehicleLabel,
  getVehicleLabelPlural,
  renderServiceReminderChip,
  renderServiceTimeline,
})

const { renderArrivalLists } = createStationDialogRenderers({
  state,
  elements: dialogElements,
  copyValue,
  formatArrivalTime,
  formatDirectionLabel,
  getDialogDirectionSummary,
  getVehicleLabel,
  getVehicleLabelPlural,
  getStatusTone,
  getArrivalServiceStatus,
  getAllVehicles,
  syncDialogDisplayScroll,
})


const overlayDialogs = createOverlayDialogs({
  state,
  elements: dialogElements,
  copyValue,
  formatAlertSeverity,
  formatAlertEffect,
  getAlertsForLine: (lineId) => getAlertsForLine(lineId),
  getDirectionBaseLabel,
  getVehicleLabel,
  getVehicleDestinationLabel,
  getTrainTimelineEntries,
  getStatusTone,
  getVehicleStatusPills,
  renderStatusPills,
  formatArrivalTime,
  formatEtaClockFromNow,
  onStationClick: (stationId, lineId) => {
    const line = state.lines.find((l) => l.id === lineId)
    const station = line?.stops?.find((s) => s.id === stationId)
    if (station) showStationDialog(station)
  },
})

const {
  closeTrainDialog: closeTrainDialogBase,
  closeAlertDialog: closeAlertDialogBase,
  renderAlertListDialog: renderAlertListDialogBase,
  renderTrainDialog: renderTrainDialogBase,
} = overlayDialogs

function closeTrainDialog() {
  if (state.activeDialogType === 'train') state.activeDialogType = ''
  closeTrainDialogBase()
}

function closeAlertDialog() {
  if (state.activeDialogType === 'alerts') state.activeDialogType = ''
  closeAlertDialogBase()
}

function renderTrainDialog(vehicle, { updateUrl = true } = {}) {
  if (!vehicle) return
  state.currentTrainId = vehicle.id
  state.activeDialogType = 'train'
  renderTrainDialogBase(vehicle)
  if (updateUrl) setTrainDialogParams(vehicle.id)
}

function renderAlertListDialog(line, { updateUrl = true } = {}) {
  if (!line) return
  state.activeDialogType = 'alerts'
  renderAlertListDialogBase(line)
  if (updateUrl) setAlertDialogParams(line.id)
}

function closeInsightsDetailDialog() {
  if (state.activeDialogType === 'insights') state.activeDialogType = ''
  state.currentInsightsDetailType = ''
  state.currentInsightsLineId = ''
  closeDialogAnimated(insightsDetailDialog)
}

function showInsightsDetail(title, subtitle, body, { updateUrl = true, lineId = '', type = '' } = {}) {
  state.activeDialogType = 'insights'
  state.currentInsightsDetailType = type
  state.currentInsightsLineId = lineId
  showInsightsDetailBase(title, subtitle, body)
  if (updateUrl && type) setInsightsDialogParams(type, lineId)
}


function renderShellCopy() {
  const systemMeta = getActiveSystemMeta()
  document.documentElement.lang = state.language
  screenKickerElement.textContent = systemMeta.kicker
  screenTitleElement.textContent = systemMeta.title

  stationSearchToggleButton.textContent = copyValue('openStationSearch')
  stationSearchToggleButton.setAttribute('aria-label', copyValue('openStationSearch'))
  stationSearchTitleElement.textContent = copyValue('openStationSearch')
  stationSearchSummaryElement.textContent = copyValue('stationSearchHint')
  stationSearchInput.setAttribute('placeholder', copyValue('stationSearchPlaceholder'))
  if (stationSearchDialog.open) renderStationSearchResults()
  else stationSearchMetaElement.textContent = copyValue('searchShortcut')

  languageToggleButton.textContent = copyValue('languageToggle')
  languageToggleButton.setAttribute('aria-label', copyValue('languageToggleAria'))
  themeToggleButton.textContent = state.theme === 'dark' ? copyValue('themeLight') : copyValue('themeDark')
  themeToggleButton.setAttribute('aria-label', copyValue('themeToggleAria'))

  systemBarElement.setAttribute('aria-label', copyValue('transitSystems'))
  viewBarElement.setAttribute('aria-label', copyValue('boardViews'))
}

function renderDialogCopy() {
  document.querySelector('#dialog-direction-tabs')?.setAttribute('aria-label', copyValue('boardDirectionView'))
  setArrivalsTitleHtml(arrivalsTitleNb, formatDirectionLabel('▲', getDialogDirectionSummary('▲'), { includeSymbol: true }))
  setArrivalsTitleHtml(arrivalsTitleSb, formatDirectionLabel('▼', getDialogDirectionSummary('▼'), { includeSymbol: true }))
  dialogDisplay.textContent = state.dialogDisplayMode ? copyValue('exit') : copyValue('board')
  dialogDisplay.setAttribute('aria-label', state.dialogDisplayMode ? copyValue('exit') : copyValue('board'))
  if (dialogShare) {
    dialogShare.textContent = copyValue('shareArrivals')
    dialogShare.setAttribute('aria-label', copyValue('shareArrivalsAria'))
  }
  trainDialogClose.setAttribute('aria-label', copyValue('closeTrainDialog'))
  alertDialogClose.setAttribute('aria-label', copyValue('closeAlertDialog'))
  alertDialogLink.textContent = copyValue('readOfficialAlert')
  updateFavoriteButton()
  if (!dialog.open) {
    setDialogTitle(copyValue('station'))
    dialogServiceSummary.textContent = copyValue('serviceSummary')
  }
  if (!trainDialog.open) {
    trainDialogTitle.textContent = copyValue('train')
    trainDialogSubtitle.textContent = copyValue('currentMovement')
  }
  if (!alertDialog.open) {
    alertDialogTitle.textContent = copyValue('serviceAlert')
    alertDialogSubtitle.textContent = copyValue('transitAdvisory')
  }
}

function renderSkeleton() {
  const cards = Array.from({ length: 4 }, () =>
    '<div class="skeleton-card"><div class="skeleton-line skeleton-line-wide"></div><div class="skeleton-line skeleton-line-narrow"></div></div>'
  ).join('')
  return `<div class="skeleton-board">${cards}</div>`
}

function renderBoard() {
  boardElement.className = 'board'

  if (!state.fetchedAt && !state.error && !state.lines.length) {
    boardElement.innerHTML = renderSkeleton()
    return
  }

  if (state.activeTab === 'map') {
    const visibleLines = getVisibleLines()
    boardElement.innerHTML = `${renderLineSwitcher()}${visibleLines.map(renderLine).join('')}`
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }

  if (state.activeTab === 'trains') {
    boardElement.innerHTML = `${renderLineSwitcher()}${renderTrainList()}`
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }

  if (state.activeTab === 'favorites') {
    boardElement.innerHTML = renderFavoritesView()
    return
  }

  if (state.activeTab === 'insights') {
    const visibleLines = getVisibleLines()
    boardElement.innerHTML = `${renderLineSwitcher()}${renderInsightsBoard(visibleLines)}`
  }
}

function render() {
  renderShellCopy()
  renderDialogCopy()
  refreshLiveMeta()

  systemBarElement.hidden = state.systemsById.size < 2
  systemBarElement.innerHTML = renderSystemSwitcher()

  tabButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === state.activeTab)
    if (button.dataset.tab === 'map') button.textContent = copyValue('tabMap')
    if (button.dataset.tab === 'trains') button.textContent = getVehicleLabelPlural()
    if (button.dataset.tab === 'favorites') button.textContent = copyValue('tabFavorites')
    if (button.dataset.tab === 'insights') button.textContent = copyValue('tabInsights')
  })

  renderBoard()
}

function stopInsightsTickerRotation() {
  window.clearInterval(state.insightsTickerTimer)
  state.insightsTickerTimer = 0
}

function startInsightsTickerRotation() {
  stopInsightsTickerRotation()
  state.insightsTickerTimer = window.setInterval(() => {
    state.insightsTickerIndex += 1
    if (state.activeTab === 'insights') {
      render()
    }
  }, 5000)
}

function refreshLiveMeta() {
  statusPillElement.textContent = state.error ? copyValue('statusHold') : copyValue('statusSync')
  statusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  currentTimeElement.textContent = `${copyValue('nowPrefix')} ${formatCurrentTime()}`
  updatedAtElement.textContent = state.error
    ? copyValue('usingLastSnapshot')
    : formatRelativeTime(state.fetchedAt)
  dialogStatusPillElement.textContent = statusPillElement.textContent
  dialogStatusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  dialogUpdatedAtElement.textContent = updatedAtElement.textContent
}

function stopLiveRefreshLoop() {
  window.clearTimeout(state.liveRefreshTimer)
  state.liveRefreshTimer = 0
}

function startLiveRefreshLoop() {
  stopLiveRefreshLoop()

  const scheduleNextRefresh = () => {
    state.liveRefreshTimer = window.setTimeout(async () => {
      await refreshVehicles()
      scheduleNextRefresh()
    }, VEHICLE_REFRESH_INTERVAL_MS)
  }

  scheduleNextRefresh()
}

async function refreshVisibleRealtime() {
  if (!isPageRequestContextActive()) return

  await refreshVehicles()

  if (dialog.open && state.currentDialogStation) {
    await refreshStationDialog(state.currentDialogStation).catch(console.error)
  }
}

function applySystem(systemId) {
  applySystemState(state, systemId)
}

async function switchSystem(systemId, { updateUrl = true, preserveDialog = false } = {}) {
  if (!state.systemsById.has(systemId) || state.activeSystemId === systemId) {
    // 如果系统已存在但还没有加载详细数据（lines），需要加载
    if (state.systemsById.has(systemId) && !state.systemsById.get(systemId)?.lines) {
      // 继续加载数据
    } else {
      if (updateUrl) setSystemParam(state.activeSystemId)
      return
    }
  }

  // 按需加载系统数据
  if (!state.systemsById.get(systemId)?.lines) {
    try {
      await loadSystemDataById(state, systemId)
    } catch (error) {
      console.error('Failed to load system data:', error)
      showToast(copyValue('startupRequestFailed'))
      return
    }
  }

  applySystem(systemId)
  if (!preserveDialog) {
    closeStationDialog()
  }
  closeTrainDialog()
  closeAlertDialog()
  render()
  if (updateUrl) setSystemParam(systemId)
  await refreshVehicles()
}

function parseSituation(situation) {
  const affectedRouteIds = [...new Set((situation.allAffects ?? []).map((item) => item.routeId).filter(Boolean))]
  const lineIds = state.lines
    .filter((line) => affectedRouteIds.includes(getLineRouteId(line)))
    .map((line) => line.id)

  if (!lineIds.length) return null

  return {
    id: situation.id,
    effect: situation.reason ?? 'SERVICE ALERT',
    severity: situation.severity ?? 'INFO',
    title: situation.summary?.value ?? copyValue('serviceAlert'),
    description: situation.description?.value ?? '',
    url: situation.url?.value ?? '',
    lineIds,
    stopIds: [...new Set((situation.allAffects ?? []).map((item) => item.stopId).filter(Boolean))],
  }
}

async function refreshVehicles() {
  if (!isPageRequestContextActive()) return

  try {
    const payload = await fetchJsonWithRetry(getVehicleUrl(), 'Realtime')
    state.error = ''
    state.fetchedAt = new Date().toISOString()
    state.rawVehicles = payload.data.list ?? []
    state.alerts = (payload.data.references?.situations ?? []).map(parseSituation).filter(Boolean)

    const tripsById = new Map((payload.data.references?.trips ?? []).map((trip) => [trip.id, trip]))

    for (const line of state.lines) {
      const layout = state.layouts.get(line.id)
      const vehicles = state.rawVehicles
        .map((vehicle) => parseVehicle(vehicle, line, layout, tripsById, { language: state.language, copyValue }))
        .filter(Boolean)
      state.vehiclesByLine.set(line.id, vehicles)
      recordVehicleGhosts(line.id, vehicles)
    }

    const currentMetrics = computeSystemSummaryMetrics(buildInsightsItems(state.lines))
    const snapshot = state.systemSnapshots.get(state.activeSystemId)
    state.systemSnapshots.set(state.activeSystemId, {
      previous: snapshot?.current ?? null,
      current: currentMetrics,
    })
  } catch (error) {
    state.error = copyValue('realtimeOffline')
    if (error.errorType === 'rate-limit') {
      showToast(copyValue('realtimeRateLimited'))
    } else if (error.errorType === 'network') {
      showToast(copyValue('realtimeNetworkError'))
    } else {
      showToast(copyValue('realtimeRequestFailed'))
    }
    console.error(error)
  }

  render()

  if (trainDialog.open && state.currentTrainId) {
    const currentVehicle = getAllVehicles().find((vehicle) => vehicle.id === state.currentTrainId)
    if (currentVehicle) renderTrainDialog(currentVehicle, { updateUrl: false })
  }
}

const handleViewportResize = () => {
  const previousCompactLayout = state.compactLayout
  updateViewportState()
  syncDialogTitleMarquee()
  if (previousCompactLayout !== state.compactLayout) {
    render()
    return
  }

  syncCompactLayoutFromBoard()
}

state.activeTab = getPageFromUrl()
const init = bootstrapApp({
  state,
  getPreferredLanguage,
  getPreferredTheme,
  handleViewportResize,
  loadStaticData: () => loadStaticData({ state, getSystemIdFromUrl }),
  refreshVehicles,
  render,
  refreshLiveMeta,
  refreshArrivalCountdowns,
  refreshVehicleStatusMessages,
  refreshVehicleCountdownDisplays,
  startInsightsTickerRotation,
  startLiveRefreshLoop,
  syncCompactLayoutFromBoard,
  syncDialogFromUrl,
  updateViewportState,
  setLanguage,
  setTheme,
  boardElement,
})

init().catch((error) => {
  statusPillElement.textContent = copyValue('statusFail')
  showToast(copyValue('startupRequestFailed'))
  updatedAtElement.textContent = error.message
})
