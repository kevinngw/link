import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { ARRIVALS_CACHE_TTL_MS, COMPACT_LAYOUT_BREAKPOINT, DEFAULT_SYSTEM_ID, FAVORITES_STORAGE_KEY, GHOST_HISTORY_LIMIT, GHOST_MAX_AGE_MS, IS_PUBLIC_TEST_KEY, LANGUAGE_STORAGE_KEY, OBA_BASE_URL, OBA_KEY, SYSTEM_META, THEME_STORAGE_KEY, UI_COPY, VEHICLE_REFRESH_INTERVAL_MS } from './config'
import { formatAlertEffect, formatAlertSeverity, formatArrivalTime as formatArrivalTimeValue, formatClockTime as formatClockTimeValue, formatCurrentTime as formatCurrentTimeValue, formatDurationFromMs as formatDurationFromMsValue, formatEtaClockFromNow as formatEtaClockFromNowValue, formatRelativeTime as formatRelativeTimeValue, formatServiceClock as formatServiceClockValue, getDateKeyWithOffset, getServiceDateTime, getTodayDateKey } from './formatters'
import { classifyHeadwayHealth, computeGapStats, computeLineHeadways, formatPercent, getDelayBuckets, getLineAttentionReasons } from './insights'
import { clamp, formatDistanceMeters, getDistanceMeters, normalizeName, parseClockToSeconds, pluralizeVehicleLabel, sleep, slugifyStation } from './utils'
import { createObaClient } from './oba'
import { createArrivalsHelpers, getLineRouteId, getStatusTone } from './arrivals'
import { parseVehicle } from './vehicles'
import { createMapRenderer } from './renderers/map'
import { createTrainRenderers } from './renderers/trains'
import { createInsightsRenderers } from './renderers/insights'
import { createFavoritesRenderer } from './renderers/favorites'
import { getDialogElements } from './dialogs/dom'
import { createStationDialogDisplayController } from './dialogs/station-display'
import { createStationDialogRenderers } from './dialogs/station-render'
import { createOverlayDialogs } from './dialogs/overlays'
import { bootstrapApp, loadStaticData, loadSystemDataById } from './static-data'

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
  dialogRefreshTimer: 0,
  liveRefreshTimer: 0,
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
  obaCooldownUntil: 0,
  obaRateLimitStreak: 0,
  systemSnapshots: new Map(),
  vehicleGhosts: new Map(),
  language: 'en',
  stationSearchQuery: '',
  stationSearchResults: [],
  highlightedStationSearchIndex: 0,
  activeDialogType: '',
  currentInsightsDetailType: '',
  currentInsightsLineId: '',
  favoriteStations: new Set(),
  nearbyStations: [],
  highlightedNearbyStationIndex: 0,
  geolocationStatus: '',
  geolocationError: '',
  isLocating: false,
  userLocation: null,
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
          <button id="dialog-favorite" class="dialog-favorite-button" type="button" aria-label="Save station">☆ Save</button>
          <button id="dialog-display" class="dialog-close dialog-mode-button" type="button" aria-label="Toggle display mode">Board</button>
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
          <h4 id="arrivals-title-nb" class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 id="arrivals-title-sb" class="arrivals-title">Southbound (▼)</h4>
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
const dialogFavoriteButton = document.querySelector('#dialog-favorite')
const dialogElements = getDialogElements()
const {
  dialog,
  dialogServiceSummary,
  dialogStatusPillElement,
  dialogUpdatedAtElement,
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

dialogDisplay.addEventListener('click', () => toggleDialogDisplayMode())
dialogFavoriteButton.addEventListener('click', () => {
  if (!state.currentDialogStation) return
  toggleFavoriteStation(state.currentDialogStation)
})
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
  stopDialogAutoRefresh()
  stopDialogDisplayScroll()
  stopDialogDirectionRotation()
  setDialogDisplayMode(false)
  clearStationDialogContent()
  state.arrivalsCache.clear()
  setDialogTitle(copyValue('station'))
  if (!state.isSyncingFromUrl) {
    clearDialogParams({ keepPage: true, keepSystem: true })
  }
})
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.activeTab = button.dataset.tab
    setPageParam(state.activeTab)
    render()
  })
})
themeToggleButton.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
  render()
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

let toastHideTimer = 0
let lastToastMessage = ''
let lastToastAt = 0

function getFavoriteStationKey(station) {
  if (!station?.id) return ''
  return station.id
}

function loadFavoriteStations() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((value) => typeof value === 'string' && value.trim()))
  } catch (error) {
    console.warn('Failed to load favorites:', error)
    return new Set()
  }
}

function saveFavoriteStations() {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...state.favoriteStations]))
}

function isFavoriteStation(station) {
  if (!station?.id) return false
  return state.favoriteStations.has(getFavoriteStationKey(station))
}

function syncDialogFavoriteButton() {
  if (!dialogFavoriteButton) return
  const isFavorite = state.currentDialogStation ? isFavoriteStation(state.currentDialogStation) : false
  dialogFavoriteButton.textContent = isFavorite
    ? (state.language === 'zh-CN' ? '★ 已收藏' : '★ Saved')
    : (state.language === 'zh-CN' ? '☆ 收藏' : '☆ Save')
  dialogFavoriteButton.setAttribute('aria-label', isFavorite ? copyValue('unfavoriteStation') : copyValue('favoriteStation'))
  dialogFavoriteButton.classList.toggle('is-active', isFavorite)
  dialogFavoriteButton.disabled = !state.currentDialogStation
}

function toggleFavoriteStation(station) {
  if (!station?.id) return
  const key = getFavoriteStationKey(station)
  const alreadyFavorite = isFavoriteStation(station)
  if (alreadyFavorite) {
    state.favoriteStations.delete(key)
    showToast(copyValue('removedFavorite', normalizeName(station.name)), { tone: 'info', dedupeMs: 1000 })
  } else {
    state.favoriteStations.add(key)
    showToast(copyValue('addedFavorite', normalizeName(station.name)), { tone: 'info', dedupeMs: 1000 })
  }
  saveFavoriteStations()
  syncDialogFavoriteButton()
  if (stationSearchDialog.open) renderStationSearchResults()
}

function getStationSearchEntries() {
  const entries = []

  for (const system of state.systemsById.values()) {
    for (const line of system.lines ?? []) {
      for (const station of line.stops ?? []) {
        entries.push({
          key: `${system.id}:${line.id}:${station.id}`,
          systemId: system.id,
          systemName: system.name,
          lineId: line.id,
          lineName: line.name,
          lineColor: line.color,
          stationId: station.id,
          stationName: station.name,
          normalizedStationName: normalizeName(station.name),
          aliases: line.stationAliases?.[station.id] ?? [],
          lat: station.lat,
          lon: station.lon,
        })
      }
    }
  }

  return entries
}


function getActiveStationSearchResults() {
  return state.stationSearchQuery.trim() ? getStationSearchResults() : getNearbyStationResults()
}

function getNearbyStationResults() {
  return state.nearbyStations.slice(0, 8)
}

function getNearbyStationSearchEntries(latitude, longitude) {
  const deduped = new Map()

  for (const entry of getStationSearchEntries()) {
    const lat = Number(entry.lat)
    const lon = Number(entry.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
    const distanceMeters = getDistanceMeters(latitude, longitude, lat, lon)
    const dedupeKey = `${entry.systemId}:${entry.normalizedStationName}`
    const existing = deduped.get(dedupeKey)
    const candidate = { ...entry, distanceMeters, isFavorite: isFavoriteStation({ id: entry.stationId, name: entry.stationName }) }
    if (!existing || candidate.distanceMeters < existing.distanceMeters) {
      deduped.set(dedupeKey, candidate)
    }
  }

  return [...deduped.values()]
    .sort((left, right) => left.distanceMeters - right.distanceMeters || left.stationName.localeCompare(right.stationName))
    .slice(0, 8)
}

async function findNearbyStations() {
  if (!navigator.geolocation) {
    state.geolocationError = copyValue('locationUnsupported')
    state.geolocationStatus = ''
    state.nearbyStations = []
    renderStationSearchResults()
    return
  }

  state.isLocating = true
  state.geolocationError = ''
  state.geolocationStatus = copyValue('locationFinding')
  state.stationSearchQuery = ''
  state.highlightedNearbyStationIndex = 0
  renderStationSearchResults()

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 120000,
      })
    })

    const latitude = position.coords?.latitude
    const longitude = position.coords?.longitude
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('invalid-location')
    }

    state.userLocation = { latitude, longitude }
    state.nearbyStations = getNearbyStationSearchEntries(latitude, longitude)
    state.geolocationStatus = state.nearbyStations.length
      ? copyValue('locationFoundNearby', state.nearbyStations.length)
      : copyValue('locationNoNearby')
    state.geolocationError = ''
  } catch (error) {
    const code = error?.code
    state.nearbyStations = []
    state.geolocationStatus = ''
    state.geolocationError = code === 1
      ? copyValue('locationPermissionDenied')
      : code === 2
        ? copyValue('locationUnavailable')
        : code === 3
          ? copyValue('locationTimedOut')
          : copyValue('locationFailed')
  } finally {
    state.isLocating = false
    renderStationSearchResults()
  }
}

function getStationSearchResults() {
  const query = state.stationSearchQuery.trim().toLowerCase()
  const entries = getStationSearchEntries()

  const scored = entries.map((entry) => {
    const searchHaystack = [
      entry.stationName,
      entry.normalizedStationName,
      entry.lineName,
      entry.systemName,
      ...entry.aliases,
    ].join(' | ').toLowerCase()

    let score = query ? 0 : 1
    if (query) {
      const stationLower = entry.stationName.toLowerCase()
      const normalizedLower = entry.normalizedStationName.toLowerCase()
      const lineLower = entry.lineName.toLowerCase()
      const systemLower = entry.systemName.toLowerCase()
      const aliasHit = entry.aliases.some((alias) => alias.toLowerCase().includes(query))

      if (stationLower === query || normalizedLower === query) score += 120
      if (stationLower.startsWith(query) || normalizedLower.startsWith(query)) score += 90
      if (stationLower.includes(query) || normalizedLower.includes(query)) score += 70
      if (lineLower.includes(query)) score += 20
      if (systemLower.includes(query)) score += 12
      if (aliasHit) score += 18
      if (!searchHaystack.includes(query)) return null
    }

    const favoriteBoost = isFavoriteStation({ id: entry.stationId, name: entry.stationName }) ? 500 : 0
    return { ...entry, score: score + favoriteBoost, isFavorite: favoriteBoost > 0 }
  }).filter(Boolean)

  return scored
    .sort((left, right) => Number(right.isFavorite) - Number(left.isFavorite) || right.score - left.score || left.stationName.localeCompare(right.stationName) || left.lineName.localeCompare(right.lineName))
    .slice(0, 12)
}

function renderStationSearchResults() {
  const hasQuery = Boolean(state.stationSearchQuery.trim())
  const results = hasQuery ? getStationSearchResults() : getNearbyStationResults()

  state.stationSearchResults = hasQuery ? results : []
  state.highlightedStationSearchIndex = Math.min(state.highlightedStationSearchIndex, Math.max(0, (hasQuery ? results.length : 0) - 1))
  state.highlightedNearbyStationIndex = Math.min(state.highlightedNearbyStationIndex, Math.max(0, (hasQuery ? 0 : results.length) - 1))

  stationLocationButton.textContent = state.isLocating ? copyValue('locationFindingButton') : copyValue('useMyLocation')
  stationLocationButton.disabled = state.isLocating
  stationLocationStatusElement.textContent = state.geolocationError || state.geolocationStatus
  stationLocationStatusElement.classList.toggle('is-error', Boolean(state.geolocationError))

  stationSearchMetaElement.textContent = results.length
    ? (hasQuery
      ? copyValue('stationSearchResults', results.length)
      : copyValue('nearbyStationsFound', results.length))
    : (hasQuery
      ? copyValue('noStationSearchResults')
      : (state.geolocationError || state.geolocationStatus || copyValue('nearbyStationsHint')))

  stationSearchResultsElement.innerHTML = results.length
    ? results.map((result, index) => {
        const isNearby = !hasQuery
        const isActive = hasQuery
          ? index === state.highlightedStationSearchIndex
          : index === state.highlightedNearbyStationIndex
        const meta = isNearby
          ? `${formatDistanceMeters(result.distanceMeters)} · ${result.lineName} · ${result.systemName}`
          : `${result.lineName} · ${result.systemName}`
        return `
          <div
            class="station-search-result${isActive ? ' is-active' : ''}"
            data-station-search-index="${index}"
            role="button"
            tabindex="0"
          >
            <span class="station-search-result-main">
              <span class="arrival-line-token station-search-result-token" style="--line-color:${result.lineColor};">${result.lineName[0]}</span>
              <span class="station-search-result-copy">
                <span class="station-search-result-title">${result.isFavorite ? '★ ' : ''}${normalizeName(result.stationName)}</span>
                <span class="station-search-result-meta">${meta}</span>
              </span>
            </span>
            <span class="station-search-result-actions">
              <span class="station-search-result-badge">${isNearby ? copyValue('nearbyStationBadge') : (result.isFavorite ? copyValue('stationFavorites') : '')}</span>
              <button type="button" class="station-favorite-toggle${result.isFavorite ? ' is-active' : ''}" data-station-favorite-index="${index}" aria-label="${result.isFavorite ? copyValue('unfavoriteStation') : copyValue('favoriteStation')}">${result.isFavorite ? '★' : '☆'}</button>
            </span>
          </div>
        `
      }).join('')
    : `<div class="arrival-item muted">${hasQuery ? copyValue('noStationSearchResults') : (state.geolocationError || state.geolocationStatus || copyValue('nearbyStationsHint'))}</div>`

  const buttons = stationSearchResultsElement.querySelectorAll('[data-station-search-index]')
  buttons.forEach((button) => {
    const selectResult = async () => {
      const source = hasQuery ? state.stationSearchResults : state.nearbyStations
      const selected = source[Number(button.dataset.stationSearchIndex)]
      if (selected) await handleStationSearchSelection(selected)
    }
    button.addEventListener('click', selectResult)
    button.addEventListener('keydown', async (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      await selectResult()
    })
  })

  const favoriteButtons = stationSearchResultsElement.querySelectorAll('[data-station-favorite-index]')
  favoriteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const source = hasQuery ? state.stationSearchResults : state.nearbyStations
      const selected = source[Number(button.dataset.stationFavoriteIndex)]
      if (!selected) return
      toggleFavoriteStation({ id: selected.stationId, name: selected.stationName })
    })
  })
}

function openStationSearch(prefill = '', { updateUrl = true } = {}) {
  state.stationSearchQuery = prefill
  state.highlightedStationSearchIndex = 0
  state.highlightedNearbyStationIndex = 0
  if (prefill.trim()) {
    state.nearbyStations = []
    state.geolocationStatus = ''
    state.geolocationError = ''
  }
  state.activeDialogType = 'search'
  if (!stationSearchDialog.open) stationSearchDialog.showModal()
  stationSearchInput.value = prefill
  renderStationSearchResults()
  if (updateUrl) setStationSearchParams(prefill)
  requestAnimationFrame(() => {
    stationSearchInput.focus()
    stationSearchInput.select()
  })
}

function closeStationSearch() {
  state.stationSearchQuery = ''
  state.stationSearchResults = []
  state.highlightedStationSearchIndex = 0
  state.highlightedNearbyStationIndex = 0
  state.nearbyStations = []
  state.geolocationStatus = ''
  state.geolocationError = ''
  state.isLocating = false
  if (state.activeDialogType === 'search') state.activeDialogType = ''
  if (stationSearchDialog.open) stationSearchDialog.close()
}

async function handleStationSearchSelection(result) {
  closeStationSearch()
  if (result.systemId !== state.activeSystemId) {
    await switchSystem(result.systemId, { updateUrl: true, preserveDialog: false })
  }
  const line = state.lines.find((candidate) => candidate.id === result.lineId)
  const station = line?.stops?.find((candidate) => candidate.id === result.stationId)
  if (station) {
    await showStationDialog(station)
  }
}

function hideToast() {
  window.clearTimeout(toastHideTimer)
  toastHideTimer = 0
  toastRegionElement.innerHTML = ''
}

function showToast(message, { tone = 'error', dedupeMs = 15_000 } = {}) {
  if (!message) return

  const now = Date.now()
  if (message === lastToastMessage && now - lastToastAt < dedupeMs) return

  lastToastMessage = message
  lastToastAt = now
  toastRegionElement.innerHTML = `<div class="toast toast-${tone}" role="status">${message}</div>`
  window.clearTimeout(toastHideTimer)
  toastHideTimer = window.setTimeout(() => {
    hideToast()
  }, 4500)
}

function clearStationDialogContent() {
  stationAlertsContainer.innerHTML = ''
  arrivalsNbPinned.innerHTML = ''
  arrivalsSbPinned.innerHTML = ''
  arrivalsNb.innerHTML = ''
  arrivalsSb.innerHTML = ''
  arrivalsTitleNb.textContent = formatDirectionLabel('▲', '', { includeSymbol: true })
  arrivalsTitleSb.textContent = formatDirectionLabel('▼', '', { includeSymbol: true })
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

const { fetchJsonWithRetry } = createObaClient(state)
const { buildArrivalsForLine, fetchArrivalsForStopIds, getCachedArrivalsForStation, getArrivalsForStation, mergeArrivalBuckets, getArrivalServiceStatus } = createArrivalsHelpers({
  state,
  fetchJsonWithRetry,
  getStationStopIds: (...args) => getStationStopIds(...args),
  copyValue,
  getLanguage: () => state.language,
})

function formatRelativeTime(dateString) {
  return formatRelativeTimeValue(dateString, copyValue)
}

function formatCurrentTime() {
  return formatCurrentTimeValue(state.language)
}

function formatArrivalTime(offsetSeconds) {
  return formatArrivalTimeValue(offsetSeconds, state.language, copyValue)
}

function formatDurationFromMs(ms) {
  return formatDurationFromMsValue(ms, state.language)
}

function formatServiceClock(clockValue) {
  return formatServiceClockValue(clockValue, state.language)
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
    return `${symbolPrefix}${state.language === 'zh-CN' ? '北向' : 'Northbound'}`
  }

  if (directionSymbol === '▼') {
    return `${symbolPrefix}${state.language === 'zh-CN' ? '南向' : 'Southbound'}`
  }

  return copyValue('active')
}

function formatDirectionLabel(directionSymbol, destination = '', { includeSymbol = false } = {}) {
  const baseLabel = getDirectionBaseLabel(directionSymbol, includeSymbol)
  if (!destination) return baseLabel
  return state.language === 'zh-CN'
    ? `${baseLabel} · 开往 ${destination}`
    : `${baseLabel} to ${destination}`
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
    labels.push(state.language === 'zh-CN' ? '等' : 'etc.')
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
    return state.language === 'zh-CN' ? '00:00' : '12:00 AM'
  }
  return state.language === 'zh-CN' ? '24:00' : '12:00 AM'
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
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '今日运营时间带' : 'Today Service Window'}</p>
          <p class="headway-chart-copy">${timeline.overflowLabel
            ? (state.language === 'zh-CN' ? `今日覆盖到午夜，继续运营至 ${timeline.overflowLabel}` : `Covers today through midnight, then continues to ${timeline.overflowLabel}`)
            : (state.language === 'zh-CN' ? '首末班与当前时刻' : 'First trip, last trip, and current time')}</p>
        </div>
        <span class="service-timeline-badge ${timeline.isLive ? 'is-live' : 'is-off'}">${timeline.isLive ? (state.language === 'zh-CN' ? '运营中' : 'In service') : (state.language === 'zh-CN' ? '未运营' : 'Off hours')}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${startPercent}%; width:${Math.max(2, endPercent - startPercent)}%;"></div>
        <div class="service-timeline-now" style="left:${nowPercent}%;" aria-label="${state.language === 'zh-CN' ? '当前时间' : 'Current time'}">
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

function formatServiceStatus(serviceStatus) {
  switch (serviceStatus) {
    case 'ARR':
      return copyValue('arrivingStatus')
    case 'DELAY':
      return copyValue('delayedStatus')
    case 'OK':
      return copyValue('enRoute')
    default:
      return ''
  }
}

function getRealtimeOffset(offsetSeconds) {
  if (!state.fetchedAt) return offsetSeconds
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(state.fetchedAt).getTime()) / 1000))
  return offsetSeconds - elapsedSeconds
}

function getVehicleStatusClass(vehicle, nextOffset) {
  if (nextOffset <= 90) return 'status-arriving'
  return vehicle.delayInfo.colorClass
}

function getVehicleStatusPills(vehicle) {
  const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
  const liveClosestOffset = getRealtimeOffset(vehicle.closestOffset ?? 0)
  const delayText = vehicle.delayInfo.text

  if (liveNextOffset <= 15) {
    return [
      { text: copyValue('arrivingNow'), toneClass: 'status-arriving' },
      { text: delayText, toneClass: vehicle.delayInfo.colorClass },
    ]
  }

  if (liveNextOffset <= 90) {
    return [
      { text: copyValue('arrivingIn', formatArrivalTime(liveNextOffset)), toneClass: 'status-arriving' },
      { text: delayText, toneClass: vehicle.delayInfo.colorClass },
    ]
  }

  if (liveClosestOffset < 0 && liveNextOffset > 0) {
    return [
      { text: copyValue('nextStopIn', formatArrivalTime(liveNextOffset)), toneClass: 'status-arriving' },
      { text: delayText, toneClass: vehicle.delayInfo.colorClass },
    ]
  }

  const statusText = formatServiceStatus(vehicle.serviceStatus)
  return [
    { text: statusText, toneClass: getVehicleStatusClass(vehicle, liveNextOffset) },
    { text: delayText, toneClass: vehicle.delayInfo.colorClass },
  ]
}

function renderStatusPills(pills) {
  return pills
    .map(
      (pill) => `
        <span class="status-chip ${pill.toneClass}">
          ${pill.text}
        </span>
      `,
    )
    .join('')
}

function formatVehicleArrivalMessage(vehicle) {
  const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
  const liveClosestOffset = getRealtimeOffset(vehicle.closestOffset ?? 0)
  const stopLabel = vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel
  const [statusPill, delayPill] = getVehicleStatusPills(vehicle)

  if (liveNextOffset <= 15) {
    return `${vehicle.label} at ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
  }

  if (liveNextOffset <= 90) {
    return `${vehicle.label} at ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
  }

  if (liveClosestOffset < 0 && liveNextOffset > 0) {
    return `${vehicle.label} ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
  }

  return `${vehicle.label} to ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
}

function formatVehicleStatus(vehicle) {
  return renderStatusPills(getVehicleStatusPills(vehicle))
}

function renderLineStatusMarquee(lineColor, vehicles) {
  if (!vehicles.length) return ''

  const visibleVehicles = [...vehicles]
    .sort((left, right) => getRealtimeOffset(left.nextOffset ?? 0) - getRealtimeOffset(right.nextOffset ?? 0))
    .slice(0, 8)

  const entries = [...visibleVehicles, ...visibleVehicles]

  return `
    <div class="line-marquee" style="--line-color:${lineColor};">
      <div class="line-marquee-track">
        ${entries.map((vehicle) => `
          <span
            class="line-marquee-item ${getVehicleStatusClass(vehicle, getRealtimeOffset(vehicle.nextOffset ?? 0))}"
            data-vehicle-marquee="${vehicle.id}"
          >
            <span class="line-marquee-token">${vehicle.lineToken}</span>
            <span class="line-marquee-copy">${formatVehicleArrivalMessage(vehicle)}</span>
          </span>
        `).join('')}
      </div>
    </div>
  `
}

function refreshVehicleStatusMessages() {
  const statusElements = document.querySelectorAll('[data-vehicle-status]')
  statusElements.forEach((element) => {
    const vehicleId = element.dataset.vehicleStatus
    const vehicle = getAllVehicles().find((candidate) => candidate.id === vehicleId)
    if (!vehicle) return
    const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    element.innerHTML = formatVehicleStatus(vehicle)
    element.className = `train-list-status ${getVehicleStatusClass(vehicle, liveNextOffset)}`
  })

  const marqueeElements = document.querySelectorAll('[data-vehicle-marquee]')
  marqueeElements.forEach((element) => {
    const vehicleId = element.dataset.vehicleMarquee
    const vehicle = getAllVehicles().find((candidate) => candidate.id === vehicleId)
    if (!vehicle) return
    const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    element.className = `line-marquee-item ${getVehicleStatusClass(vehicle, liveNextOffset)}`
    const copyElement = element.querySelector('.line-marquee-copy')
    if (copyElement) {
      copyElement.innerHTML = formatVehicleArrivalMessage(vehicle)
    }
  })
}

function refreshVehicleCountdownDisplays() {
  const vehiclesById = new Map(getAllVehicles().map((vehicle) => [vehicle.id, vehicle]))

  document.querySelectorAll('[data-vehicle-next-countdown]').forEach((element) => {
    const vehicle = vehiclesById.get(element.dataset.vehicleNextCountdown ?? '')
    if (!vehicle) return
    element.textContent = formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))
  })

  document.querySelectorAll('[data-vehicle-next-clock]').forEach((element) => {
    const vehicle = vehiclesById.get(element.dataset.vehicleNextClock ?? '')
    if (!vehicle) return
    element.textContent = formatEtaClockFromNow(getRealtimeOffset(vehicle.nextOffset ?? 0))
  })

  document.querySelectorAll('[data-vehicle-terminal-countdown]').forEach((element) => {
    const vehicle = vehiclesById.get(element.dataset.vehicleTerminalCountdown ?? '')
    if (!vehicle) return
    const layout = state.layouts.get(vehicle.lineId)
    const terminalEta = Math.max(0, (getTrainTimelineEntries(vehicle, layout).at(-1)?.etaSeconds) ?? (vehicle.nextOffset ?? 0))
    element.textContent = formatArrivalTime(getRealtimeOffset(terminalEta))
  })

  document.querySelectorAll('[data-train-timeline-entry]').forEach((element) => {
    const baseEtaSeconds = Number(element.dataset.baseEtaSeconds)
    const renderedAt = Number(element.dataset.renderedAt)
    if (!Number.isFinite(baseEtaSeconds) || !Number.isFinite(renderedAt)) return

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - renderedAt) / 1000))
    const liveEtaSeconds = Math.max(0, baseEtaSeconds - elapsedSeconds)
    const countdownElement = element.querySelector('[data-train-timeline-countdown]')
    const clockElement = element.querySelector('[data-train-timeline-clock]')

    if (countdownElement) countdownElement.textContent = formatArrivalTime(liveEtaSeconds)
    if (clockElement) clockElement.textContent = formatEtaClockFromNow(liveEtaSeconds)
  })
}

function refreshArrivalCountdowns() {
  const arrivalElements = document.querySelectorAll('.arrival-item[data-arrival-time]')
  arrivalElements.forEach((element) => {
    const arrivalTime = Number(element.dataset.arrivalTime)
    if (!Number.isFinite(arrivalTime)) return

    const countdownElement = element.querySelector('.arrival-countdown')
    const statusElement = element.querySelector('.arrival-status')
    if (!countdownElement || !statusElement) return

    const diffSeconds = Math.floor((arrivalTime - Date.now()) / 1000)
    const scheduleDeviation = Number(element.dataset.scheduleDeviation ?? 0)
    const serviceStatus = getArrivalServiceStatus(arrivalTime, scheduleDeviation)
    const serviceTone = getStatusTone(serviceStatus)

    countdownElement.textContent = formatArrivalTime(diffSeconds)
    statusElement.textContent = serviceStatus
    statusElement.className = `arrival-status arrival-status-${serviceTone}`
  })
}

function formatVehicleSegment(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return state.language === 'zh-CN' ? `位于 ${vehicle.fromLabel}` : `At ${vehicle.fromLabel}`
  }

  return `${vehicle.fromLabel} -> ${vehicle.toLabel}`
}

function formatVehicleLocationSummary(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return state.language === 'zh-CN' ? `当前位于 ${vehicle.fromLabel}` : `Currently at ${vehicle.fromLabel}`
  }

  return state.language === 'zh-CN'
    ? `正从 ${vehicle.fromLabel} 开往 ${vehicle.toLabel}`
    : `Running from ${vehicle.fromLabel} to ${vehicle.toLabel}`
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
        <p class="train-focus-metric-label">${state.language === 'zh-CN' ? '下一站' : 'Next stop'}</p>
        <p class="train-focus-metric-value">${nextStopName}</p>
        <p class="train-focus-metric-copy" data-vehicle-next-countdown="${vehicle.id}">${formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${state.language === 'zh-CN' ? '终点' : 'Terminal'}</p>
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

function updateUrlParams(mutator) {
  const url = new URL(window.location.href)
  const before = url.search
  mutator(url.searchParams, url)
  if (url.search === before) return
  window.history.pushState({}, '', url)
}

function setPageParam(page) {
  const nextPage = ['map', 'trains', 'favorites', 'insights'].includes(page) ? page : 'map'
  updateUrlParams((params) => {
    if (nextPage === 'map') params.delete('page')
    else params.set('page', nextPage)
  })
}

function getPageFromUrl() {
  const url = new URL(window.location.href)
  const requestedPage = (url.searchParams.get('page') ?? '').trim().toLowerCase()
  return ['map', 'trains', 'favorites', 'insights'].includes(requestedPage) ? requestedPage : 'map'
}

function setSystemParam(systemId) {
  updateUrlParams((params) => {
    if (systemId === DEFAULT_SYSTEM_ID) {
      params.delete('system')
    } else {
      params.set('system', systemId)
    }
  })
}

function setStationParam(station) {
  updateUrlParams((params) => {
    params.set('dialog', 'station')
    params.set('station', slugifyStation(station.name))
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
  })
}

function setTrainDialogParams(trainId) {
  updateUrlParams((params) => {
    params.set('dialog', 'train')
    params.set('train', trainId)
    params.delete('station')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
  })
}

function setAlertDialogParams(lineId) {
  updateUrlParams((params) => {
    params.set('dialog', 'alerts')
    params.set('line', lineId)
    params.delete('station')
    params.delete('train')
    params.delete('detail')
    params.delete('q')
  })
}

function setStationSearchParams(prefill = '') {
  updateUrlParams((params) => {
    params.set('dialog', 'search')
    params.delete('station')
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    if (prefill) params.set('q', prefill)
    else params.delete('q')
  })
}

function setInsightsDialogParams(type, lineId = '') {
  updateUrlParams((params) => {
    params.set('dialog', 'insights')
    params.set('detail', type)
    params.delete('station')
    params.delete('train')
    params.delete('q')
    if (lineId) params.set('line', lineId)
    else params.delete('line')
  })
}

function clearDialogParams({ keepPage = true, keepSystem = true, keepStation = false } = {}) {
  updateUrlParams((params) => {
    params.delete('dialog')
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
    if (!keepStation) params.delete('station')
    if (!keepPage) params.delete('page')
    if (!keepSystem) params.delete('system')
  })
}

function clearStationParam() {
  clearDialogParams({ keepPage: true, keepSystem: true })
}

function isOptionalNavigationEnabled() {
  const url = new URL(window.location.href)
  const value = (url.searchParams.get('navigate') ?? '').trim().toLowerCase()
  return value === '1' || value === 'true' || value === 'yes'
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
      showToast(copyValue('stationRequestFailed'))
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
        language: state.language,
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
    copy: state.language === 'zh-CN' ? '当前没有明显的主要问题。' : 'No major active issues right now.',
  }
  const topLine = rankedLines[0] ?? null
  if (topLine?.alertCount) {
    topIssue = {
      tone: 'info',
      copy: state.language === 'zh-CN'
        ? `${topLine.line.name} 当前有 ${topLine.alertCount} 条生效告警。`
        : `${topLine.line.name} has ${topLine.alertCount} active alert${topLine.alertCount === 1 ? '' : 's'}.`,
    }
  } else if (topLine?.worstGap >= 12) {
    topIssue = {
      tone: 'alert',
      copy: state.language === 'zh-CN'
        ? `当前最大实时间隔为空 ${topLine.line.name} 的 ${topLine.worstGap} 分钟。`
        : `Largest live gap: ${topLine.worstGap} min on ${topLine.line.name}.`,
    }
  } else if (topLine?.severeLateCount) {
    topIssue = {
      tone: 'warn',
      copy: state.language === 'zh-CN'
        ? `${topLine.line.name} 有 ${topLine.severeLateCount} 辆${topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()}晚点超过 5 分钟。`
        : `${topLine.line.name} has ${topLine.severeLateCount} ${topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()} running 5+ min late.`,
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

  // Phase 2: fetch fresh arrivals and re-render
  const arrivalsByLine = await Promise.all(dialogStations.map(({ station: matchedStation, line }) => getArrivalsForStation(matchedStation, line)))
  
  // Safeguard: abort if station changed during fetch
  if (state.currentDialogStationId !== station.id) {
    console.debug(`[refreshStationDialog] Station changed during fetch (expected: ${station.id}, actual: ${state.currentDialogStationId}), aborting render`)
    return
  }
  
  if (!isActiveStationDialogRequest(station, requestId)) {
    console.debug(`[refreshStationDialog] Request ID mismatch (expected: ${requestId}, actual: ${state.activeDialogRequest}), aborting render`)
    return
  }
  
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
  syncDialogFavoriteButton()
  renderStationServiceSummary(station)
  clearStationDialogContent()
  renderArrivalLists({ nb: [], sb: [] }, true)
  if (!dialog.open) dialog.showModal()
  if (updateUrl) setStationParam(station)
  startDialogAutoRefresh()
  try {
    await refreshStationDialog(station, { requestId, skipCache: true })
  } catch (e) {
    if (state.activeDialogRequest !== requestId) return
    showToast(copyValue('stationRequestFailed'))
    console.warn('Station refresh failed:', e)
  }
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
  attachDialogArrivalClickHandlers: () => attachDialogArrivalClickHandlers(),
})

function attachSystemSwitcherHandlers() {
  const buttons = document.querySelectorAll('[data-system-switch]')
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      await switchSystem(button.dataset.systemSwitch, { updateUrl: true, preserveDialog: false })
    })
  })
}

function attachLineSwitcherHandlers() {
  const buttons = document.querySelectorAll('[data-line-switch]')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      state.activeLineId = button.dataset.lineSwitch
      render()
    })
  })
}

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
  if (insightsDetailDialog.open) insightsDetailDialog.close()
}

function showInsightsDetail(title, subtitle, body, { updateUrl = true, lineId = '', type = '' } = {}) {
  state.activeDialogType = 'insights'
  state.currentInsightsDetailType = type
  state.currentInsightsLineId = lineId
  showInsightsDetailBase(title, subtitle, body)
  if (updateUrl && type) setInsightsDialogParams(type, lineId)
}

function attachTrainClickHandlers() {
  const trainItems = document.querySelectorAll('[data-train-id]')
  trainItems.forEach((item) => {
    item.addEventListener('click', () => {
      const trainId = item.dataset.trainId
      const vehicle = getAllVehicles().find((candidate) => candidate.id === trainId)
      if (!vehicle) return
      state.currentTrainId = trainId
      renderTrainDialog(vehicle)
    })
  })
}

function attachAlertClickHandlers() {
  const alertButtons = document.querySelectorAll('[data-alert-line-id]')
  alertButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const line = state.lines.find((candidate) => candidate.id === button.dataset.alertLineId)
      if (!line) return
      renderAlertListDialog(line)
    })
  })
}

function attachDialogArrivalClickHandlers() {
  const items = document.querySelectorAll('[data-arrival-vehicle-id]')
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const vehicleId = item.dataset.arrivalVehicleId
      const vehicle = getAllVehicles().find((candidate) => candidate.id === vehicleId)
      if (!vehicle) return
      state.currentTrainId = vehicleId
      renderTrainDialog(vehicle)
    })
  })
}

function attachInsightsClickHandlers() {
  const elements = document.querySelectorAll('[data-insights-type]')
  elements.forEach((el) => {
    el.addEventListener('click', () => {
      const lineId = el.dataset.insightsLineId ?? null
      const type = el.dataset.insightsType
      const content = buildInsightsDetailContent(lineId, type)
      if (!content) return
      showInsightsDetail(content.title, content.subtitle, content.body, { type, lineId: lineId ?? '' })
    })
  })
}

function attachInsightsStationClickHandlers() {
  const elements = document.querySelectorAll('[data-terminal-line-id]')
  elements.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-train-id]')) return
      const lineId = el.dataset.terminalLineId
      const direction = el.dataset.terminalDirection
      const layout = state.layouts.get(lineId)
      if (!layout) return
      const station = direction === 'nb' ? layout.stations[0] : layout.stations.at(-1)
      if (station) showStationDialog(station)
    })
  })
}

function attachStationClickHandlers() {
  state.lines.forEach((line) => {
    const layout = state.layouts.get(line.id)
    const card = document.querySelector(`.line-card[data-line-id="${line.id}"]`)
    if (!card) return

    const stationGroups = card.querySelectorAll('.station-group')
    stationGroups.forEach((group) => {
      group.addEventListener('click', () => {
        const stopId = group.dataset.stopId
        const station = layout.stations.find((candidate) => candidate.id === stopId)
        if (station) {
          showStationDialog(station)
        }
      })
    })
  })
}

function render() {
  const systemMeta = getActiveSystemMeta()
  document.documentElement.lang = state.language
  stationSearchToggleButton.textContent = copyValue('openStationSearch')
  stationSearchToggleButton.setAttribute('aria-label', copyValue('openStationSearch'))
  stationSearchTitleElement.textContent = copyValue('openStationSearch')
  stationSearchSummaryElement.textContent = copyValue('stationSearchHint')
  stationSearchInput.setAttribute('placeholder', copyValue('stationSearchPlaceholder'))
  if (stationSearchDialog.open) renderStationSearchResults()
  else stationSearchMetaElement.textContent = copyValue('searchShortcut')
  syncDialogFavoriteButton()
  languageToggleButton.textContent = copyValue('languageToggle')
  languageToggleButton.setAttribute('aria-label', copyValue('languageToggleAria'))
  themeToggleButton.textContent = state.theme === 'dark' ? copyValue('themeLight') : copyValue('themeDark')
  themeToggleButton.setAttribute('aria-label', copyValue('themeToggleAria'))
  screenKickerElement.textContent = systemMeta.kicker
  screenTitleElement.textContent = systemMeta.title
  systemBarElement.setAttribute('aria-label', copyValue('transitSystems'))
  viewBarElement.setAttribute('aria-label', copyValue('boardViews'))
  document.querySelector('#dialog-direction-tabs')?.setAttribute('aria-label', copyValue('boardDirectionView'))
  arrivalsTitleNb.textContent = formatDirectionLabel('▲', getDialogDirectionSummary('▲'), { includeSymbol: true })
  arrivalsTitleSb.textContent = formatDirectionLabel('▼', getDialogDirectionSummary('▼'), { includeSymbol: true })
  dialogDisplay.textContent = state.dialogDisplayMode ? copyValue('exit') : copyValue('board')
  dialogDisplay.setAttribute('aria-label', state.dialogDisplayMode ? copyValue('exit') : copyValue('board'))
  trainDialogClose.setAttribute('aria-label', copyValue('closeTrainDialog'))
  alertDialogClose.setAttribute('aria-label', copyValue('closeAlertDialog'))
  if (!dialog.open) {
    setDialogTitle(copyValue('station'))
    syncDialogFavoriteButton()
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
  alertDialogLink.textContent = copyValue('readOfficialAlert')
  systemBarElement.hidden = state.systemsById.size < 2
  systemBarElement.innerHTML = renderSystemSwitcher()
  refreshLiveMeta()

  tabButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.tab === state.activeTab))
  tabButtons.forEach((button) => {
    if (button.dataset.tab === 'map') button.textContent = copyValue('tabMap')
    if (button.dataset.tab === 'trains') button.textContent = getVehicleLabelPlural()
    if (button.dataset.tab === 'favorites') button.textContent = copyValue('favorites')
    if (button.dataset.tab === 'insights') button.textContent = copyValue('tabInsights')
  })
  attachSystemSwitcherHandlers()

  if (state.activeTab === 'map') {
    boardElement.className = 'board'
    const visibleLines = getVisibleLines()
    boardElement.innerHTML = `${renderLineSwitcher()}${visibleLines.map(renderLine).join('')}`
    attachLineSwitcherHandlers()
    attachAlertClickHandlers()
    attachStationClickHandlers()
    attachTrainClickHandlers()
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }

  if (state.activeTab === 'trains') {
    boardElement.className = 'board'
    boardElement.innerHTML = `${renderLineSwitcher()}${renderTrainList()}`
    attachLineSwitcherHandlers()
    attachAlertClickHandlers()
    attachTrainClickHandlers()
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }

  if (state.activeTab === 'favorites') {
    boardElement.className = 'board'
    renderFavorites().then((html) => {
      if (state.activeTab === 'favorites') {
        boardElement.innerHTML = html
        attachDialogArrivalClickHandlers()
        attachTrainClickHandlers() // To handle clicks on vehicles if any
      }
    })
    return
  }

  if (state.activeTab === 'insights') {
    boardElement.className = 'board'
    const visibleLines = getVisibleLines()
    boardElement.innerHTML = `${renderLineSwitcher()}${renderInsightsBoard(visibleLines)}`
    attachLineSwitcherHandlers()
    attachAlertClickHandlers()
    attachTrainClickHandlers()
    attachInsightsClickHandlers()
    attachInsightsStationClickHandlers()
  }
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
    ? (state.language === 'zh-CN' ? '使用最近一次成功快照' : 'Using last successful snapshot')
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
  const resolvedSystemId = state.systemsById.has(systemId) ? systemId : DEFAULT_SYSTEM_ID
  const system = state.systemsById.get(resolvedSystemId)
  state.activeSystemId = resolvedSystemId
  state.lines = system?.lines ?? []
  state.layouts = state.layoutsBySystem.get(resolvedSystemId) ?? new Map()
  if (!state.lines.some((line) => line.id === state.activeLineId)) {
    state.activeLineId = state.lines[0]?.id ?? ''
  }
  state.vehiclesByLine = new Map()
  state.rawVehicles = []
  state.arrivalsCache.clear()
  state.alerts = []
  state.error = ''
  state.fetchedAt = ''
  state.insightsTickerIndex = 0
  state.vehicleGhosts = new Map()
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
    showToast(copyValue('realtimeRequestFailed'))
    console.error(error)
  }

  render()

  if (state.activeDialogType === 'train' && state.currentTrainId) {
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
state.favoriteStations = loadFavoriteStations()

const init = bootstrapApp({
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

const { renderFavorites } = createFavoritesRenderer({
  state,
  copyValue,
  getVehicleLabel,
  getVehicleLabelPlural,
  formatArrivalTime,
  getStatusTone,
  getArrivalServiceStatus,
  getAllVehicles,
  getArrivalsForStation,
  formatDirectionLabel,
  getVehicleDestinationLabel
})

init().catch((error) => {
  statusPillElement.textContent = copyValue('statusFail')
  showToast(copyValue('startupRequestFailed'))
  updatedAtElement.textContent = error.message
})
