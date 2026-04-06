import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { APP_BUNDLE_ID, APP_MARKETING_VERSION, ARRIVALS_CACHE_TTL_MS, COMPACT_LAYOUT_BREAKPOINT, DEFAULT_SYSTEM_ID, GHOST_HISTORY_LIMIT, GHOST_MAX_AGE_MS, LANGUAGE_STORAGE_KEY, OBA_BASE_URL, OBA_KEY, PRIVACY_POLICY_URL, SHARE_BASE_URL, SOURCE_URL, SUPPORT_URL, SYSTEM_META, THEME_STORAGE_KEY, UI_COPY, VEHICLE_REFRESH_INTERVAL_MS } from './config'
import { formatAlertEffect, formatAlertSeverity, formatArrivalTime as formatArrivalTimeValue, formatClockTime as formatClockTimeValue, formatCurrentTime as formatCurrentTimeValue, formatDurationFromMs as formatDurationFromMsValue, formatEtaClockFromNow as formatEtaClockFromNowValue, formatRelativeTime as formatRelativeTimeValue, formatServiceClock as formatServiceClockValue, getDateKeyWithOffset, getServiceDateTime, getTodayDateKey } from './formatters'
import { classifyHeadwayHealth, computeLineHeadways, formatPercent, getDelayBuckets, getLineAttentionReasons } from './insights'
import { clamp, closeDialogAnimated, getLineToken, getLineTokenType, normalizeName, pluralizeVehicleLabel, slugifyStation } from './utils'
import { createObaClient } from './oba'
import { createArrivalsHelpers, getLineRouteId, getStatusTone } from './arrivals'
import { parseVehicle } from './vehicles'
import { createMapRenderer } from './renderers/map'
import { createTrainRenderers } from './renderers/trains'
import { createInsightsRenderers } from './renderers/insights'
import { renderAppShell } from './app-shell'
import { getAppElements } from './app-dom'
import { buildInsightsItems, computeSystemSummaryMetrics } from './insights-metrics'
import { createServiceTimelineHelpers } from './service-timeline'
import { createDialogLifecycle } from './dialog-lifecycle'
import { registerAppEventHandlers } from './event-handlers'

import { getDialogElements } from './dialogs/dom'
import { createStationDialogDisplayController } from './dialogs/station-display'
import { createStationDialogRenderers } from './dialogs/station-render'
import { createOverlayDialogs } from './dialogs/overlays'
import { applySystemState, bootstrapApp, loadStaticData, loadSystemDataById } from './static-data'
import { clearDialogParams, getPageFromUrl, setAlertDialogParams, setInsightsDialogParams, setPageParam, setStationParam, setStationSearchParams, setSystemParam, setTrainDialogParams } from './url-state'
import { createToast } from './toast'
import { createVehicleDisplay } from './vehicle-display'
import { RECENT_SEARCHES_KEY, createStationSearch } from './station-search'
import { FAVORITES_STORAGE_KEY, createFavoritesManager } from './favorites'
import { RECENT_STATIONS_KEY, createRecentStationsManager } from './recent-stations'
import { createRideMode } from './ride-mode'
import { resolveVehicleForArrival } from './arrival-vehicle'
import { shouldRegisterServiceWorker } from './native/platform'
import { initializeAppStorage, getStoredString, setStoredString } from './native/storage'
import { copyTextToClipboard, shareTextContent } from './native/share'
import { lightImpact, notificationSuccess } from './native/haptics'
import { hideSplashScreen } from './native/splash'

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
  directionFilterByLine: new Map(),
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
  dialogFreshFetchActive: false,

  nearbyStations: [],
  highlightedNearbyStationIndex: 0,
  geolocationStatus: '',
  geolocationError: '',
  isLocating: false,
  userLocation: null,
  favoriteArrivals: new Map(),
  favoriteArrivalsRequestId: 0,
  favoriteArrivalsRefreshPromise: null,
  rideMode: null,
}

if (shouldRegisterServiceWorker()) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true)
    },
  })
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && !!target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]')
}

function disableDoubleTapZoom(root) {
  let lastTouchEndAt = 0

  root.addEventListener('touchend', (event) => {
    if (isEditableTarget(event.target)) return

    const now = Date.now()
    if (now - lastTouchEndAt <= 300) {
      event.preventDefault()
    }
    lastTouchEndAt = now
  }, { passive: false })

  root.addEventListener('dblclick', (event) => {
    if (isEditableTarget(event.target)) return
    event.preventDefault()
  }, { passive: false })
}

const appRootElement = document.querySelector('#app')
renderAppShell(appRootElement)
disableDoubleTapZoom(appRootElement)

const {
  boardElement,
  screenKickerElement,
  screenTitleElement,
  systemBarElement,
  viewBarElement,
  tabButtons,
  stationSearchToggleButton,
  languageToggleButton,
  themeToggleButton,
  statusPillElement,
  currentTimeElement,
  updatedAtElement,
  aboutToggleButton,
  toastRegionElement,
  stationSearchDialog,
  stationSearchTitleElement,
  stationSearchSummaryElement,
  stationSearchInput,
  stationSearchMetaElement,
  stationSearchResultsElement,
  stationSearchCloseButton,
  stationLocationButton,
  stationLocationStatusElement,
  aboutDialog,
  aboutDialogTitle,
  aboutDialogSummary,
  aboutDialogBody,
  aboutDialogCloseButton,
  stationDialogCloseButton,
  dialogFavoriteButton,
  rideModeChip,
  rideModeChipLabel,
} = getAppElements()

boardElement.innerHTML = renderSkeleton()

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
  dialogRideModeContainer,
  arrivalsNbPinned,
  arrivalsNb,
  arrivalsSbPinned,
  arrivalsSb,
  trainDialog,
  trainDialogTitle,
  trainDialogSubtitle,
  trainDialogFavorite,
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

function findStationAndLineByStopId(stopId) {
  for (const line of state.lines) {
    const layout = state.layouts.get(line.id)
    const station = layout?.stations.find((s) => s.id === stopId)
    if (station) return { station, line }
  }
  return null
}

const { showToast } = createToast(toastRegionElement)

function resolveArrivalVehicle(arrival) {
  return resolveVehicleForArrival(arrival, {
    getAllVehiclesById,
    getAllVehicles,
  })
}

const { getRecentStations, addRecentStation } = createRecentStationsManager()
const dialogLifecycleBridge = {
  showStationDialog: async () => {},
  refreshStationDialog: async () => {},
}

const {
  getActiveStationSearchResults,
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
  showStationDialog: (...args) => dialogLifecycleBridge.showStationDialog(...args),
  switchSystem,
  setStationSearchParams,
  getRecentStations,
  loadSystemDataById,
})

const {
  getFavorites,
  getStationFavorites,
  getFavoriteItem,
  isFavorite,
  isFavoriteTrain,
  toggleFavorite,
  toggleFavoriteTrain,
  moveFavorite,
  removeFavorite,
  removeFavoriteTrain,
  getFavoriteDisplayData,
  handleFavoriteClick,
} = createFavoritesManager({
  state,
  showStationDialog: (...args) => dialogLifecycleBridge.showStationDialog(...args),
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

function getTrainFavoriteTarget(trainId = state.currentTrainId) {
  if (!trainId) return null
  const vehicle = getAllVehiclesById().get(trainId)
  if (!vehicle?.lineId) return null

  return {
    vehicle,
    systemId: state.activeSystemId,
  }
}

function updateTrainFavoriteButton() {
  if (!trainDialogFavorite) return
  const target = getTrainFavoriteTarget()
  if (!target) {
    trainDialogFavorite.textContent = '☆'
    trainDialogFavorite.setAttribute('aria-label', copyValue('addFavorite'))
    trainDialogFavorite.classList.remove('is-favorite')
    trainDialogFavorite.disabled = true
    return
  }

  const fav = isFavoriteTrain(target.vehicle.id, target.systemId)
  trainDialogFavorite.textContent = fav ? '★' : '☆'
  trainDialogFavorite.setAttribute('aria-label', fav ? copyValue('removeFavorite') : copyValue('addFavorite'))
  trainDialogFavorite.classList.toggle('is-favorite', fav)
  trainDialogFavorite.disabled = false
}

function getSystemVehicleLabel(systemId, { plural = false } = {}) {
  const systemMeta = SYSTEM_META[systemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]
  if (state.language === 'zh-CN') {
    return systemMeta.vehicleLabel === 'Train' ? '列车' : '公交'
  }

  return plural
    ? (systemMeta.vehicleLabelPlural ?? pluralizeVehicleLabel(systemMeta.vehicleLabel ?? 'Vehicle'))
    : (systemMeta.vehicleLabel ?? 'Vehicle')
}

function getFavoriteKey(favorite) {
  return `${favorite.systemId}:${favorite.lineId}:${favorite.stationId}`
}

function renderFavoriteArrivalLane(directionLabel, arrivals, systemId) {
  if (!arrivals.length) {
    return `
      <div class="favorite-arrival-lane">
        <span class="favorite-arrival-direction">${directionLabel}</span>
        <span class="favorite-arrival-empty">${copyValue('favoritesNoUpcoming', getSystemVehicleLabel(systemId, { plural: true }).toLowerCase())}</span>
      </div>
    `
  }

  const chips = arrivals
    .slice(0, 2)
    .map((arrival) => `
      <span class="favorite-arrival-chip ${arrival.isRealtime ? 'is-live' : ''}">
        <span>${formatArrivalTime(Math.floor((arrival.arrivalTime - Date.now()) / 1000))}</span>
        ${arrival.isRealtime ? `<span class="favorite-arrival-chip-badge">${copyValue('realtimeBadge')}</span>` : ''}
      </span>
    `)
    .join('')

  return `
    <div class="favorite-arrival-lane">
      <span class="favorite-arrival-direction">${directionLabel}</span>
      <div class="favorite-arrival-chips">${chips}</div>
    </div>
  `
}

function renderFavoriteArrivalPreview(favorite, snapshot) {
  if (!favorite.exists) {
    return `<p class="favorite-arrival-status">${copyValue('favoritesStationMissing')}</p>`
  }

  if (!snapshot || snapshot.loading) {
    return `<p class="favorite-arrival-status">${copyValue('favoritesArrivalsLoading')}</p>`
  }

  if (snapshot.error) {
    return `<p class="favorite-arrival-status">${copyValue('favoritesArrivalsUnavailable')}</p>`
  }

  const nbLabel = copyValue('northboundShort')
  const sbLabel = copyValue('southboundShort')
  const updatedLabel = snapshot.fetchedAt ? formatRelativeTime(new Date(snapshot.fetchedAt).toISOString()) : ''

  return `
    <div class="favorite-arrivals-preview">
      <div class="favorite-arrivals-grid">
        ${renderFavoriteArrivalLane(nbLabel, snapshot.arrivals?.nb ?? [], favorite.systemId)}
        ${renderFavoriteArrivalLane(sbLabel, snapshot.arrivals?.sb ?? [], favorite.systemId)}
      </div>
      <p class="favorite-arrival-status favorite-arrival-updated">${updatedLabel || copyValue('updatedNow')}</p>
    </div>
  `
}

function renderFavoriteTrainCard(favorite) {
  const liveVehicle = favorite.systemId === state.activeSystemId
    ? getAllVehiclesById().get(favorite.vehicleId) ?? null
    : null
  const isLive = Boolean(liveVehicle)
  const vehicleLabel = getSystemVehicleLabel(favorite.systemId)
  const directionLabel = isLive
    ? formatDirectionLabel(
      liveVehicle.directionSymbol,
      getVehicleDestinationLabel(liveVehicle, state.layouts.get(liveVehicle.lineId)),
      { includeSymbol: true },
    )
    : formatDirectionLabel(favorite.directionSymbol, '', { includeSymbol: true })
  const nextOffset = isLive ? Math.max(0, getRealtimeOffset(liveVehicle.nextOffset ?? 0)) : null
  const statusTone = isLive ? getVehicleStatusClass(liveVehicle, nextOffset) : 'status-muted'
  const delayBadge = isLive && liveVehicle.isPredicted && liveVehicle.scheduleDeviation > 180
    ? `<span class="train-delay-badge ${liveVehicle.delayInfo.colorClass}">${liveVehicle.delayInfo.text}</span>`
    : ''
  const liveStatus = isLive
    ? `
        ${renderFocusMetrics(liveVehicle)}
        <p class="train-list-status ${statusTone}" data-vehicle-status="${liveVehicle.id}">${formatVehicleStatus(liveVehicle)}</p>
      `
    : `
        <div class="favorite-train-offline">
          <p class="train-list-status"><span class="status-chip status-muted">${copyValue('favoriteTrainUnavailable')}</span></p>
          <p class="favorite-arrival-status">${copyValue('favoriteTrainLiveHint')}</p>
        </div>
      `
  const tokenLabel = getLineToken(favorite.lineName)
  const tokenType = getLineTokenType(favorite.lineName)

  return `
    <div class="favorite-item favorite-train-item${isLive ? '' : ' favorite-train-item-inactive'}"
         style="--line-color:${favorite.lineColor};"
         data-favorite-item-key="${favorite.itemKey}"
         role="button" tabindex="0">
      <span class="arrival-line-token" data-line-token-type="${tokenType}" style="--line-color:${favorite.lineColor};">${tokenLabel}</span>
      <div class="favorite-item-content">
        <div class="favorite-train-header">
          <div class="favorite-train-head">
            <p class="favorite-train-title">${favorite.lineName} ${vehicleLabel} ${favorite.vehicleLabel}</p>
            <div class="favorite-train-meta">
              <span class="train-direction-badge">${directionLabel}</span>
              ${delayBadge}
            </div>
          </div>
          <div class="favorite-train-side">
            ${isLive ? `<p class="favorite-train-time" data-vehicle-next-countdown="${liveVehicle.id}">${formatArrivalTime(nextOffset)}</p>` : ''}
            ${isLive ? `<p class="favorite-train-clock" data-vehicle-next-clock="${liveVehicle.id}">${formatEtaClockFromNow(nextOffset)}</p>` : ''}
            ${!isLive ? `<p class="favorite-item-meta">${favorite.systemName}</p>` : ''}
          </div>
        </div>
        ${liveStatus}
        <div class="favorite-item-actions">
          <button type="button" class="favorite-action-btn" data-fav-item-move="up" data-fav-item-key="${favorite.itemKey}" aria-label="${copyValue('moveUp')}">▲ ${copyValue('moveUp')}</button>
          <button type="button" class="favorite-action-btn" data-fav-item-move="down" data-fav-item-key="${favorite.itemKey}" aria-label="${copyValue('moveDown')}">▼ ${copyValue('moveDown')}</button>
          <button type="button" class="favorite-action-btn favorite-action-remove" data-fav-remove-key="${favorite.itemKey}" aria-label="${copyValue('removeFavorite')}">× ${copyValue('removeFavorite')}</button>
        </div>
      </div>
    </div>
  `
}

async function handleFavoriteTrainClick(favorite) {
  if (favorite.systemId !== state.activeSystemId) {
    await switchSystem(favorite.systemId, { updateUrl: true, preserveDialog: false })
  }

  const vehicle = getAllVehiclesById().get(favorite.vehicleId)
  if (vehicle) {
    renderTrainDialog(vehicle)
    return
  }

  showToast(copyValue('favoriteTrainUnavailable'))
}

function renderFavoritesView() {
  const favoriteItems = getFavoriteDisplayData()

  if (!favoriteItems.length) {
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

  const items = favoriteItems.map((item) => {
    if (item.type === 'train') {
      return renderFavoriteTrainCard(item)
    }

    const fav = item
    const isCurrentSystem = fav.systemId === state.activeSystemId
    const snapshot = state.favoriteArrivals.get(getFavoriteKey(fav))
    const tokenLabel = getLineToken(fav.lineName)
    const tokenType = getLineTokenType(fav.lineName)
    return `
      <div class="favorite-item ${fav.exists ? '' : 'favorite-item-missing'}" 
           data-favorite-item-key="${fav.itemKey}"
           role="button" tabindex="0">
        <span class="arrival-line-token" data-line-token-type="${tokenType}" style="--line-color:${fav.lineColor};">${tokenLabel}</span>
        <div class="favorite-item-content">
          <div class="favorite-item-header">
            <div>
              <p class="favorite-item-title">${fav.stationName}</p>
              <p class="favorite-item-meta">${fav.lineName}${isCurrentSystem ? '' : ` · ${fav.systemName}`}</p>
            </div>
          </div>
          ${renderFavoriteArrivalPreview(fav, snapshot)}
          <div class="favorite-item-actions">
            <button type="button" class="favorite-action-btn" data-fav-item-move="up" data-fav-item-key="${fav.itemKey}" aria-label="${copyValue('moveUp')}">▲ ${copyValue('moveUp')}</button>
            <button type="button" class="favorite-action-btn" data-fav-item-move="down" data-fav-item-key="${fav.itemKey}" aria-label="${copyValue('moveDown')}">▼ ${copyValue('moveDown')}</button>
            <button type="button" class="favorite-action-btn favorite-action-remove" data-fav-remove-key="${fav.itemKey}" aria-label="${copyValue('removeFavorite')}">× ${copyValue('removeFavorite')}</button>
          </div>
        </div>
      </div>
    `
  }).join('')

  return `
    <article class="panel-card panel-card-wide">
      <header class="panel-header">
        <div>
          <h2>${copyValue('favoritesTitle')}</h2>
          <p class="updated-at">${copyValue('favoriteTrainLiveHint')} · ${copyValue('favoritesLiveHint')}</p>
        </div>
      </header>
      <div class="favorites-list">
        ${items}
      </div>
    </article>
  `
}

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
  return document.visibilityState === 'visible'
}

const obaClient = createObaClient(state)
const { fetchJsonWithRetry, clearQueue: clearObaQueue } = obaClient
const { buildArrivalsForLine, fetchArrivalsForStopIds, getCachedArrivalsForStation, mergeArrivalBuckets, getArrivalServiceStatus } = createArrivalsHelpers({
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

const {
  getTodayServiceSpan,
  getServiceReminder,
  renderServiceReminderChip,
  renderServiceTimeline,
} = createServiceTimelineHelpers({
  clamp,
  copyValue,
  formatDurationFromMs,
  formatServiceClock,
  getDateKeyWithOffset,
  getServiceDateTime,
  getTodayDateKey,
})

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
  const storedTheme = getStoredString(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return 'dark'
}

function getPreferredLanguage() {
  const storedLanguage = getStoredString(LANGUAGE_STORAGE_KEY)
  if (storedLanguage === 'en' || storedLanguage === 'zh-CN') return storedLanguage

  const browserLanguage = navigator.language?.toLowerCase() ?? ''
  return browserLanguage.startsWith('zh') ? 'zh-CN' : 'en'
}

function setTheme(theme) {
  state.theme = theme
  document.documentElement.dataset.theme = theme
  void setStoredString(THEME_STORAGE_KEY, theme).catch(() => {})
}

function setLanguage(language) {
  state.language = language === 'zh-CN' ? 'zh-CN' : 'en'
  document.documentElement.lang = state.language
  void setStoredString(LANGUAGE_STORAGE_KEY, state.language).catch(() => {})
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

function renderStationServiceSummary(station) {
  const summaries = getDialogStations(station)
    .map(({ line }) => {
      const reminder = getServiceReminder(line)
      return `${line.name}: ${reminder.compact}`
    })
    .slice(0, 3)

  dialogServiceSummary.textContent = summaries.join('  ·  ') || copyValue('serviceSummaryUnavailable')
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

function renderFocusMetrics(vehicle, extraContent = '') {
  const layout = state.layouts.get(vehicle.lineId)
  const terminalEta = Math.max(0, (getTrainTimelineEntries(vehicle, layout).at(-1)?.etaSeconds) ?? (vehicle.nextOffset ?? 0))
  const nextStopName = vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel

  const currentLocationName = vehicle.currentLabel || vehicle.fromLabel

  return `
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${copyValue('currentLocation')}</p>
        <p class="train-focus-metric-value">${currentLocationName}</p>
      </div>
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
      ${extraContent}
    </div>
  `
}

let _allVehiclesCache = null
let _allVehiclesByIdCache = null
let _allVehiclesCacheKey = null

function invalidateVehicleCache() {
  _allVehiclesCache = null
  _allVehiclesByIdCache = null
  _allVehiclesCacheKey = null
}

function getAllVehicles() {
  const cacheKey = state.fetchedAt + '|' + state.lines.length
  if (_allVehiclesCache && _allVehiclesCacheKey === cacheKey) return _allVehiclesCache
  _allVehiclesCache = state.lines.flatMap((line) =>
    (state.vehiclesByLine.get(line.id) ?? []).map((vehicle) => ({
      ...vehicle,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    })),
  )
  _allVehiclesCacheKey = cacheKey
  _allVehiclesByIdCache = null
  return _allVehiclesCache
}

function getAllVehiclesById() {
  if (_allVehiclesByIdCache) return _allVehiclesByIdCache
  _allVehiclesByIdCache = new Map(getAllVehicles().map((v) => [v.id, v]))
  return _allVehiclesByIdCache
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
  getAllVehiclesById,
  getTrainTimelineEntries,
})

const {
  activateRideMode,
  deactivateRideMode,
  isRideModeActive,
  getRideModeStatus,
  checkRideModeProgress,
  getNotificationPermissionState,
  requestNotificationPermission,
} = createRideMode({
  state,
  copyValue,
  getAllVehiclesById,
  getTrainTimelineEntries,
  showToast,
  lightImpact,
  notificationSuccess,
})

function getRideModeNotificationPresentation() {
  const permission = getNotificationPermissionState()
  if (permission === 'unsupported') {
    return {
      permission,
      message: copyValue('rideModeNotifyUnsupported'),
      showAction: false,
    }
  }

  if (permission === 'granted') {
    return {
      permission,
      message: copyValue('rideModeNotifyEnabled'),
      showAction: false,
    }
  }

  if (permission === 'denied') {
    return {
      permission,
      message: copyValue('rideModeNotifyBlocked'),
      showAction: false,
    }
  }

  return {
    permission,
    message: copyValue('rideModeNotifyPermission'),
    actionLabel: copyValue('rideModeNotifyPermissionAction'),
    showAction: true,
  }
}

function getRideModePresentation() {
  if (!state.rideMode) return null

  const status = getRideModeStatus()
  const trackedVehicle = getAllVehiclesById().get(state.rideMode.vehicleId) ?? null
  const destinationLabel = status?.destinationLabel ?? state.rideMode.destinationLabel
  const stopsAway = status?.stopsAway ?? null
  const etaSeconds = status?.etaSeconds ?? null

  return {
    vehicleId: state.rideMode.vehicleId,
    destinationLabel,
    stopsAway,
    etaSeconds,
    statusLabel: stopsAway === null
      ? copyValue('rideModeActivated', destinationLabel)
      : copyValue('rideModeBanner', destinationLabel, stopsAway),
    vehicleLabel: trackedVehicle ? `${trackedVehicle.lineName} ${getVehicleLabel()} ${trackedVehicle.label}` : '',
    canOpenVehicle: Boolean(trackedVehicle),
    notification: getRideModeNotificationPresentation(),
  }
}

function renderStationRideModePanel() {
  if (!dialogRideModeContainer) return

  const ridePresentation = getRideModePresentation()
  if (!ridePresentation) {
    dialogRideModeContainer.hidden = true
    dialogRideModeContainer.innerHTML = ''
    return
  }

  const metaParts = [
    ridePresentation.vehicleLabel,
    ridePresentation.etaSeconds === null ? '' : copyValue('rideModeEta', formatArrivalTime(ridePresentation.etaSeconds)),
  ].filter(Boolean)

  dialogRideModeContainer.hidden = false
  dialogRideModeContainer.innerHTML = `
    <section class="ride-mode-context-panel">
      <div class="ride-mode-context-copy">
        <p class="ride-mode-context-kicker">${copyValue('rideModeActiveTitle')}</p>
        <p class="ride-mode-context-title">${ridePresentation.statusLabel}</p>
        ${metaParts.length ? `<p class="ride-mode-context-meta">${metaParts.join(' · ')}</p>` : ''}
        ${ridePresentation.notification ? `
          <div class="ride-mode-notification-note is-${ridePresentation.notification.permission}">
            <span>${ridePresentation.notification.message}</span>
            ${ridePresentation.notification.showAction ? `<button class="ride-mode-notification-action" data-ride-mode-request-notification type="button">${ridePresentation.notification.actionLabel}</button>` : ''}
          </div>
        ` : ''}
      </div>
      <div class="ride-mode-context-actions">
        ${ridePresentation.canOpenVehicle ? `<button class="ride-mode-banner-open" data-ride-mode-open type="button">${copyValue('rideModeOpenTracked')}</button>` : ''}
        <button class="ride-mode-banner-cancel" data-ride-mode-cancel type="button" aria-label="${copyValue('rideModeCancel')}">&times;</button>
      </div>
    </section>
  `
}

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
    shareText += `\n${copyValue('northboundLabel')}:\n`
    nbArrivals.forEach((a) => {
      const timeStr = formatArrivalTime(Math.floor((a.arrivalTime - Date.now()) / 1000))
      shareText += `• ${a.lineName} ${getVehicleLabel()} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
    })
  }

  if (sbArrivals.length > 0) {
    shareText += `\n${copyValue('southboundLabel')}:\n`
    sbArrivals.forEach((a) => {
      const timeStr = formatArrivalTime(Math.floor((a.arrivalTime - Date.now()) / 1000))
      shareText += `• ${a.lineName} ${getVehicleLabel()} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
    })
  }
  
  // Add app link
  const stationParam = station.name.toLowerCase().replace(/\s+/g, '-')
  const shareUrl = new URL(SHARE_BASE_URL)
  shareUrl.searchParams.set('system', state.activeSystemId)
  shareUrl.searchParams.set('station', stationParam)
  shareText += `\n${shareUrl.toString()}`
  
  try {
    const result = await shareTextContent({
      title: `${station.name} - ${getActiveSystemMeta().title}`,
      text: shareText,
      url: shareUrl.toString(),
    })
    if (result.method === 'clipboard') {
      showToast(copyValue('shareCopied'))
    } else if (result.method !== 'unavailable') {
      showToast(copyValue('shareSuccess'))
    } else {
      const copied = await copyTextToClipboard(shareText)
      showToast(copyValue(copied ? 'shareCopied' : 'shareFailed'))
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
      const tokenLabel = getLineToken(line.name)
      const tokenType = getLineTokenType(line.name)
      return `
        <button
          class="line-switcher-button ${line.id === state.activeLineId ? 'is-active' : ''}"
          data-line-switch="${line.id}"
          type="button"
          aria-pressed="${line.id === state.activeLineId ? 'true' : 'false'}"
          aria-label="${line.name}"
          style="--line-color:${line.color};"
        >
          <span class="line-token line-switcher-token" data-line-token-type="${tokenType}" style="--line-color:${line.color};">${tokenLabel}</span>
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

  // Include sibling platform IDs (e.g. E19-T1 → also E19-T2 for the opposite-direction platform)
  const platformMatch = station.id.match(/^(.+)-T(\d+)$/)
  if (platformMatch) {
    aliases.add(`${platformMatch[1]}-T${platformMatch[2] === '1' ? '2' : '1'}`)
  }

  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith(`${line.agencyId}_`) ? alias : `${line.agencyId}_${alias}`
    candidates.add(normalized)
  }

  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith(`${line.agencyId}_`) ? baseId : `${line.agencyId}_${baseId}`)

  return [...candidates]
}

function getDialogStationTitle(station) {
  const stripDir = (s) => s.replace(/\s+(NB|SB|EB|WB)\b/gi, '')
  const stripBay = (s) => s.replace(/\s*[-–]?\s*Bay\s+\S+$/i, '')
  const mainName = normalizeName(station.name)
  for (const line of state.lines) {
    const oppName = line.oppositeStopNames?.[station.id]
    if (!oppName) continue
    const oppNormalized = normalizeName(oppName)
    const mainClean = stripDir(mainName)
    const oppClean = stripDir(oppNormalized)
    if (mainClean === oppClean) return mainClean
    // If only Bay number differs, use base name
    if (stripBay(mainClean) === stripBay(oppClean)) return stripBay(mainClean)
    return `${mainClean} / ${oppClean}`
  }
  return mainName
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

const stationDialogDisplay = createStationDialogDisplayController({
  state,
  elements: dialogElements,
  copyValue,
  refreshStationDialog: async (station) => {
    try {
      await dialogLifecycleBridge.refreshStationDialog(station)
    } catch (error) {
      if (error.errorType === 'rate-limit') {
        showToast(copyValue('stationRateLimited'))
      } else {
        showToast(copyValue('stationRequestFailed'))
      }
      throw error
    }
  },
  clearStationParam: () => clearDialogParams({ keepPage: true, keepSystem: true }),
})

const {
  setDialogDisplayMode,
  toggleDialogDisplayMode,
  renderDialogDirectionView,
  stopDialogAutoRefresh,
  stopDialogDisplayScroll,
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
  formatClockTime,
  formatDirectionLabel,
  getDialogDirectionSummary,
  getVehicleLabel,
  getVehicleLabelPlural,
  getStatusTone,
  getArrivalServiceStatus,
  resolveVehicleForArrival: resolveArrivalVehicle,
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
    if (station) {
      closeTrainDialog()
      dialogLifecycleBridge.showStationDialog(station)
    }
  },
  isRideModeActive,
  getRideModePresentation,
  onRideDestinationSelect: (vehicleId, stationId, label) => {
    const vehicle = getAllVehiclesById().get(vehicleId)
    if (!vehicle) return
    if (state.rideMode?.destinationStationId === stationId && state.rideMode?.vehicleId === vehicleId) {
      showToast(copyValue('rideModeAlreadySet', label))
      return
    }
    const layout = state.layouts.get(vehicle.lineId)
    if (!layout?.stations?.length) return
    const destinationIndex = layout.stations.findIndex((s) => s.id === stationId)
    if (destinationIndex < 0) return
    activateRideMode({
      vehicleId,
      lineId: vehicle.lineId,
      destinationStationId: stationId,
      destinationLabel: label,
      destinationIndex,
      directionSymbol: vehicle.directionSymbol,
      currentIndex: vehicle.currentIndex ?? 0,
    })
    updateRideModeChip()
    // Re-render the train dialog to show the banner + active bell
    renderTrainDialogBase(vehicle)
  },
  onRideModeOpen: () => {
    if (!state.rideMode) return
    const vehicle = getAllVehiclesById().get(state.rideMode.vehicleId)
    if (vehicle) renderTrainDialog(vehicle)
  },
  onRideModeNotificationRequest: async () => {
    const permission = await requestNotificationPermission()
    updateRideModeChip()
    if (trainDialog.open && state.currentTrainId) {
      const vehicle = getAllVehiclesById().get(state.currentTrainId)
      if (vehicle) renderTrainDialogBase(vehicle)
    }
    if (permission === 'granted') {
      showToast(copyValue('rideModeNotifyEnabled'))
    } else if (permission === 'denied') {
      showToast(copyValue('rideModeNotifyBlocked'))
    } else if (permission === 'unsupported') {
      showToast(copyValue('rideModeNotifyUnsupported'))
    }
  },
  onRideModeCancel: () => {
    deactivateRideMode(copyValue('rideModeDeactivated'))
    updateRideModeChip()
    // Re-render train dialog if open
    if (trainDialog.open && state.currentTrainId) {
      const v = getAllVehiclesById().get(state.currentTrainId)
      if (v) renderTrainDialogBase(v)
    }
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
  if (updateUrl) void lightImpact()
  renderTrainDialogBase(vehicle)
  updateTrainFavoriteButton()
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

const dialogLifecycle = createDialogLifecycle({
  state,
  obaClient,
  appElements: {
    stationSearchDialog,
    stationDialogCloseButton,
  },
  dialogElements,
  copyValue,
  isPageRequestContextActive,
  getPageFromUrl,
  switchSystem,
  render,
  closeStationDialog,
  closeTrainDialog,
  closeAlertDialog,
  closeStationSearch,
  closeInsightsDetailDialog,
  openStationSearch,
  showInsightsDetail,
  buildInsightsDetailContent,
  renderTrainDialog,
  renderAlertListDialog,
  getAllVehiclesById,
  findStationByParam,
  getDialogStations,
  getDialogStationTitle,
  getCachedArrivalsForStation,
  mergeArrivalBuckets,
  renderArrivalLists,
  renderDialogDirectionView,
  syncDialogTitleMarquee,
  fetchArrivalsForStopIds,
  buildArrivalsForLine,
  getStationStopIds,
  getStationDialogAlerts,
  addRecentStation,
  getActiveSystemMeta,
  clearStationDialogContent,
  renderStationServiceSummary,
  lightImpact,
  setStationParam,
  startDialogAutoRefresh,
  setDialogTitle,
  showToast,
})

const {
  refreshStationDialog,
  showStationDialog,
  syncDialogFromUrl,
  registerBackgroundDialogRefresh,
} = dialogLifecycle

dialogLifecycleBridge.showStationDialog = (...args) => showStationDialog(...args)
dialogLifecycleBridge.refreshStationDialog = (...args) => refreshStationDialog(...args)
registerBackgroundDialogRefresh()

function renderAboutDialogContent() {
  aboutDialogTitle.textContent = copyValue('aboutTitle')
  aboutDialogSummary.textContent = copyValue('aboutSummary')
  aboutDialogBody.innerHTML = `
    <section class="about-panel">
      <p class="about-panel-label">${copyValue('aboutProductTitle')}</p>
      <p class="about-panel-copy">${copyValue('aboutProductBody', APP_MARKETING_VERSION)}</p>
    </section>
    <section class="about-panel">
      <p class="about-panel-label">${copyValue('aboutPrivacyTitle')}</p>
      <p class="about-panel-copy">${copyValue('aboutPrivacyBody')}</p>
      <a class="about-link" href="${PRIVACY_POLICY_URL}" target="_blank" rel="noreferrer">${copyValue('aboutPrivacyLink')}</a>
    </section>
    <section class="about-panel">
      <p class="about-panel-label">${copyValue('aboutSupportTitle')}</p>
      <p class="about-panel-copy">${copyValue('aboutSupportBody')}</p>
      <a class="about-link" href="${SUPPORT_URL}" target="_blank" rel="noreferrer">${copyValue('aboutSupportLink')}</a>
    </section>
    <section class="about-panel">
      <p class="about-panel-label">${copyValue('aboutSourceTitle')}</p>
      <p class="about-panel-copy">${copyValue('aboutSourceBody', APP_BUNDLE_ID)}</p>
      <a class="about-link" href="${SOURCE_URL}" target="_blank" rel="noreferrer">${copyValue('aboutSourceLink')}</a>
    </section>
  `
}

function openAboutDialog() {
  state.activeDialogType = 'about'
  renderAboutDialogContent()
  aboutDialog.showModal()
  aboutDialogCloseButton.focus()
}

function closeAboutDialog() {
  if (!aboutDialog.open) return
  closeDialogAnimated(aboutDialog)
}

registerAppEventHandlers({
  state,
  appElements: {
    boardElement,
    systemBarElement,
    tabButtons,
    stationSearchToggleButton,
    languageToggleButton,
    themeToggleButton,
    statusPillElement,
    aboutToggleButton,
    stationSearchDialog,
    stationSearchInput,
    stationSearchCloseButton,
    stationLocationButton,
    aboutDialog,
    aboutDialogCloseButton,
    stationDialogCloseButton,
    dialogFavoriteButton,
  },
  dialogElements,
  copyValue,
  toggleDialogDisplayMode,
  shareArrivals,
  closeTrainDialog,
  closeAlertDialog,
  closeInsightsDetailDialog,
  openAboutDialog,
  closeAboutDialog,
  setLanguage,
  setTheme,
  render,
  renderDialogDirectionView,
  closeStationDialog,
  clearDialogParams,
  stopDialogAutoRefresh,
  stopDialogDisplayScroll,
  setDialogDisplayMode,
  clearStationDialogContent,
  clearObaQueue,
  setDialogTitle,
  openStationSearch,
  findNearbyStations,
  closeStationSearch,
  setStationSearchParams,
  renderStationSearchResults,
  getActiveStationSearchResults,
  handleStationSearchSelection,
  refreshVisibleRealtime,
  showToast,
  setPageParam,
  findStationAndLineByStopId,
  getAllVehiclesById,
  resolveArrivalVehicle,
  renderTrainDialog,
  renderAlertListDialog,
  buildInsightsDetailContent,
  showInsightsDetail,
  showStationDialog,
  switchSystem,
  getFavoriteItem,
  handleFavoriteClick,
  handleFavoriteTrainClick,
  moveFavorite,
  removeFavorite,
  removeFavoriteTrain,
  getDialogStations,
  toggleFavorite,
  toggleFavoriteTrain,
  getFavoriteKey,
  refreshFavoriteArrivals,
  updateFavoriteButton,
  getTrainFavoriteTarget,
  updateTrainFavoriteButton,
  notificationSuccess,
  lightImpact,
  rideModeChip,
  deactivateRideMode,
  isRideModeActive,
  updateRideModeChip,
  onRideModeChipClick: () => {
    if (!state.rideMode) return
    const vehicle = getAllVehiclesById().get(state.rideMode.vehicleId)
    if (vehicle) renderTrainDialog(vehicle)
  },
  requestRideModeNotificationPermission: async () => {
    const permission = await requestNotificationPermission()
    updateRideModeChip()
    if (trainDialog.open && state.currentTrainId) {
      const vehicle = getAllVehiclesById().get(state.currentTrainId)
      if (vehicle) renderTrainDialogBase(vehicle)
    }
    if (permission === 'granted') {
      showToast(copyValue('rideModeNotifyEnabled'))
    } else if (permission === 'denied') {
      showToast(copyValue('rideModeNotifyBlocked'))
    } else if (permission === 'unsupported') {
      showToast(copyValue('rideModeNotifyUnsupported'))
    }
  },
})


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
  aboutToggleButton.textContent = copyValue('openAbout')
  aboutToggleButton.setAttribute('aria-label', copyValue('aboutTitle'))

  statusPillElement.setAttribute('aria-label', copyValue('manualRefresh'))
  dialogStatusPillElement.setAttribute('aria-label', copyValue('manualRefresh'))

  systemBarElement.setAttribute('aria-label', copyValue('transitSystems'))
  viewBarElement.setAttribute('aria-label', copyValue('boardViews'))
}

function renderDialogCopy() {
  document.querySelector('#dialog-direction-tabs')?.setAttribute('aria-label', copyValue('boardDirectionView'))
  document.querySelector('[data-dialog-direction="auto"]')?.remove()
  dialogDirectionTabs.forEach((button) => {
    if (button.dataset.dialogDirection === 'both') button.textContent = copyValue('both')
    if (button.dataset.dialogDirection === 'nb') button.textContent = copyValue('directionUp')
    if (button.dataset.dialogDirection === 'sb') button.textContent = copyValue('directionDown')
  })
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
  aboutDialogCloseButton.setAttribute('aria-label', copyValue('closeAboutDialog'))
  if (!aboutDialog.open) {
    renderAboutDialogContent()
  }
  updateFavoriteButton()
  if (!dialog.open) {
    setDialogTitle(copyValue('station'))
    dialogServiceSummary.textContent = copyValue('serviceSummary')
  }
  renderStationRideModePanel()
  if (!trainDialog.open) {
    trainDialogTitle.textContent = copyValue('train')
    trainDialogSubtitle.textContent = copyValue('currentMovement')
  }
  updateTrainFavoriteButton()
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
    queueMicrotask(() => {
      refreshFavoriteArrivals().catch(console.error)
    })
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
  if (document.hidden) return
  statusPillElement.textContent = state.error ? copyValue('statusHold') : copyValue('statusSync')
  statusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  const timeStr = formatCurrentTime()
  currentTimeElement.innerHTML = timeStr.split('').map((ch) =>
    ch === ':' ? '<span class="dot-matrix-colon">:</span>' : `<span class="dot-matrix-digit">${ch}</span>`
  ).join('')
  updatedAtElement.textContent = state.error
    ? copyValue('usingLastSnapshot')
    : formatRelativeTime(state.fetchedAt)
  dialogStatusPillElement.textContent = statusPillElement.textContent
  dialogStatusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  dialogUpdatedAtElement.textContent = updatedAtElement.textContent
}

function updateRideModeChip() {
  const ridePresentation = getRideModePresentation()
  renderStationRideModePanel()

  if (!ridePresentation) {
    rideModeChip.hidden = true
    return
  }
  rideModeChip.hidden = false
  rideModeChipLabel.textContent = ridePresentation.stopsAway === null
    ? copyValue('rideModeActivated', ridePresentation.destinationLabel)
    : copyValue('rideModeChip', ridePresentation.destinationLabel, ridePresentation.stopsAway)
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

  if (state.activeTab === 'favorites') {
    await refreshFavoriteArrivals({ force: true }).catch(console.error)
  }

  if (dialog.open && state.currentDialogStation) {
    await refreshStationDialog(state.currentDialogStation).catch(console.error)
  }
}

async function resolveFavoriteRecord(favorite) {
  let system = state.systemsById.get(favorite.systemId)
  if (!system?.lines) {
    system = await loadSystemDataById(state, favorite.systemId)
  }

  const line = system?.lines?.find((candidate) => candidate.id === favorite.lineId)
  const station = line?.stops?.find((candidate) => candidate.id === favorite.stationId)

  return { system, line, station }
}

async function refreshFavoriteArrivals({ force = false } = {}) {
  if (state.favoriteArrivalsRefreshPromise && !force) return state.favoriteArrivalsRefreshPromise

  const run = (async () => {
    const favorites = getStationFavorites()
    const validKeys = new Set(favorites.map((favorite) => getFavoriteKey(favorite)))

    for (const key of [...state.favoriteArrivals.keys()]) {
      if (!validKeys.has(key)) state.favoriteArrivals.delete(key)
    }

    if (!favorites.length) {
      if (state.activeTab === 'favorites') render()
      return
    }

    const now = Date.now()
    const requestId = state.favoriteArrivalsRequestId + 1
    state.favoriteArrivalsRequestId = requestId

    let didPrimeLoadingState = false
    for (const favorite of favorites) {
      const key = getFavoriteKey(favorite)
      const cached = state.favoriteArrivals.get(key)
      const isFresh = cached?.fetchedAt && (now - cached.fetchedAt) < ARRIVALS_CACHE_TTL_MS && !cached?.error
      if (!force && (cached?.loading || isFresh)) continue
      state.favoriteArrivals.set(key, { ...cached, loading: true, error: '', arrivals: cached?.arrivals ?? { nb: [], sb: [] } })
      didPrimeLoadingState = true
    }

    if (didPrimeLoadingState && state.activeTab === 'favorites') render()

    for (const favorite of favorites) {
      if (state.favoriteArrivalsRequestId !== requestId) return

      const key = getFavoriteKey(favorite)
      const cached = state.favoriteArrivals.get(key)
      const isFresh = cached?.fetchedAt && (Date.now() - cached.fetchedAt) < ARRIVALS_CACHE_TTL_MS && !cached?.error
      if (!force && (cached?.loading === false && isFresh)) continue

      try {
        const { line, station } = await resolveFavoriteRecord(favorite)
        if (!line || !station) {
          state.favoriteArrivals.set(key, { loading: false, error: 'missing', fetchedAt: Date.now(), arrivals: { nb: [], sb: [] } })
          if (state.activeTab === 'favorites') render()
          continue
        }

        const stopIds = getStationStopIds(station, line)
        const arrivalFeed = await fetchArrivalsForStopIds(stopIds)
        const arrivals = buildArrivalsForLine(arrivalFeed, line, stopIds)

        state.favoriteArrivals.set(key, {
          loading: false,
          error: '',
          fetchedAt: Date.now(),
          arrivals,
        })
      } catch (error) {
        console.warn(`Failed to refresh favorite arrivals for ${favorite.stationName}:`, error)
        state.favoriteArrivals.set(key, {
          loading: false,
          error: error?.errorType || error?.message || 'request-failed',
          fetchedAt: Date.now(),
          arrivals: { nb: [], sb: [] },
        })
      }

      if (state.activeTab === 'favorites') render()
    }
  })()

  state.favoriteArrivalsRefreshPromise = run
  try {
    await run
  } finally {
    if (state.favoriteArrivalsRefreshPromise === run) {
      state.favoriteArrivalsRefreshPromise = null
    }
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

async function refreshVehicles({ renderAfter = true } = {}) {
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

    const currentMetrics = computeSystemSummaryMetrics({
      insightsItems: buildInsightsItems({
        lines: state.lines,
        layouts: state.layouts,
        vehiclesByLine: state.vehiclesByLine,
        getAlertsForLine,
      }),
      classifyHeadwayHealth,
      computeLineHeadways,
      copyValue,
      getDelayBuckets,
      getLineAttentionReasons,
      getVehicleLabel,
      getVehicleLabelPlural,
    })
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

  if (state.rideMode) checkRideModeProgress()

  if (renderAfter) {
    render()
  }

  if (renderAfter && trainDialog.open && state.currentTrainId) {
    const currentVehicle = getAllVehiclesById().get(state.currentTrainId)
    if (currentVehicle) renderTrainDialog(currentVehicle, { updateUrl: false })
  }

  if (trainDialog.open) updateTrainFavoriteButton()
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
  initializeStorage: () => initializeAppStorage({
    persistentKeys: [
      THEME_STORAGE_KEY,
      LANGUAGE_STORAGE_KEY,
      FAVORITES_STORAGE_KEY,
      RECENT_SEARCHES_KEY,
    ],
    sessionKeys: [
      RECENT_STATIONS_KEY,
    ],
  }),
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
  updateRideModeChip,
})

init().catch((error) => {
  statusPillElement.textContent = copyValue('statusFail')
  showToast(copyValue('startupRequestFailed'))
  updatedAtElement.textContent = error.message
}).finally(() => {
  hideSplashScreen().catch(() => {})
})
