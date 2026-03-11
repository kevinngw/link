import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { ARRIVALS_CACHE_TTL_MS, COMPACT_LAYOUT_BREAKPOINT, DEFAULT_SYSTEM_ID, GHOST_HISTORY_LIMIT, GHOST_MAX_AGE_MS, IS_PUBLIC_TEST_KEY, LANGUAGE_STORAGE_KEY, MAX_TRANSFER_RECOMMENDATIONS, OBA_ARRIVALS_CONCURRENCY, OBA_BASE_URL, OBA_COOLDOWN_BASE_MS, OBA_COOLDOWN_MAX_MS, OBA_INTER_REQUEST_DELAY_MS, OBA_KEY, OBA_MAX_RETRIES, OBA_RETRY_BASE_DELAY_MS, SYSTEM_META, THEME_STORAGE_KEY, TRANSFER_BOARDING_BUFFER_MS, TRANSFER_FETCH_DELAY_MS, TRANSFER_MAX_WALK_KM, TRANSFER_WALKING_SPEED_KMPH, UI_COPY, VEHICLE_REFRESH_INTERVAL_MS } from './config'
import { formatAlertEffect, formatAlertSeverity, formatArrivalTime as formatArrivalTimeValue, formatClockTime as formatClockTimeValue, formatCurrentTime as formatCurrentTimeValue, formatDurationFromMs as formatDurationFromMsValue, formatEtaClockFromNow as formatEtaClockFromNowValue, formatRelativeTime as formatRelativeTimeValue, formatServiceClock as formatServiceClockValue, formatWalkDistance as formatWalkDistanceValue, getDateKeyWithOffset, getServiceDateTime, getTodayDateKey } from './formatters'
import { classifyHeadwayHealth, computeGapStats, computeLineHeadways, formatPercent, getDelayBuckets, getLineAttentionReasons } from './insights'
import { clamp, getBearingDegrees, haversineKm, parseClockToSeconds, pluralizeVehicleLabel, slugifyStation } from './utils'
import { createObaClient } from './oba'
import { createArrivalsHelpers, getLineRouteId, getStatusTone } from './arrivals'
import { parseVehicle } from './vehicles'
import { createMapRenderer } from './renderers/map'
import { createTrainRenderers } from './renderers/trains'
import { createInsightsRenderers } from './renderers/insights'
import { getDialogElements } from './dialogs/dom'
import { createStationDialogDisplayController } from './dialogs/station-display'
import { createOverlayDialogs } from './dialogs/overlays'
import { bootstrapApp, loadStaticData } from './static-data'

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
        <button class="tab-button" data-tab="insights" type="button">Insights</button>
      </section>
    </div>
    <section id="board" class="board"></section>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="dialog-title" class="dialog-title">
            <span id="dialog-title-track" class="dialog-title-track">
              <span id="dialog-title-text" class="dialog-title-text">Station</span>
              <span id="dialog-title-text-clone" class="dialog-title-text dialog-title-text-clone" aria-hidden="true">Station</span>
            </span>
          </h3>
          <p id="dialog-service-summary" class="dialog-service-summary">Service summary</p>
        </div>
        <div class="dialog-actions">
          <div class="dialog-actions-top">
            <div id="dialog-direction-tabs" class="dialog-direction-tabs" aria-label="Board direction view">
              <button class="dialog-direction-tab is-active" data-dialog-direction="both" type="button">Both</button>
              <button class="dialog-direction-tab" data-dialog-direction="nb" type="button">NB</button>
              <button class="dialog-direction-tab" data-dialog-direction="sb" type="button">SB</button>
              <button class="dialog-direction-tab" data-dialog-direction="auto" type="button">Auto</button>
            </div>
            <p id="dialog-status-pill" class="status-pill">SYNC</p>
            <button id="dialog-display" class="dialog-close dialog-mode-button" type="button" aria-label="Toggle display mode">Board</button>
          </div>
          <div id="dialog-meta" class="dialog-meta">
            <p id="dialog-updated-at" class="updated-at">Waiting for snapshot</p>
          </div>
        </div>
      </header>
      <div id="station-alerts-container"></div>
      <div class="dialog-body">
        <section id="transfer-section" class="transfer-section" hidden></section>
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
`

const boardElement = document.querySelector('#board')
const screenKickerElement = document.querySelector('#screen-kicker')
const screenTitleElement = document.querySelector('#screen-title')
const systemBarElement = document.querySelector('#system-bar')
const viewBarElement = document.querySelector('#view-bar')
const tabButtons = [...document.querySelectorAll('.tab-button')]
const languageToggleButton = document.querySelector('#language-toggle')
const themeToggleButton = document.querySelector('#theme-toggle')
const statusPillElement = document.querySelector('#status-pill')
const currentTimeElement = document.querySelector('#current-time')
const updatedAtElement = document.querySelector('#updated-at')
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
  transferSection,
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
} = dialogElements

dialogDisplay.addEventListener('click', () => toggleDialogDisplayMode())
trainDialogClose.addEventListener('click', () => closeTrainDialog())
alertDialogClose.addEventListener('click', () => closeAlertDialog())
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
dialog.addEventListener('close', () => {
  stopDialogAutoRefresh()
  stopDialogDisplayScroll()
  stopDialogDirectionRotation()
  setDialogDisplayMode(false)
  if (!state.isSyncingFromUrl) {
    clearStationParam()
  }
})
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.activeTab = button.dataset.tab
    render()
  })
})
themeToggleButton.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
  render()
})

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

const { fetchJsonWithRetry } = createObaClient(state)
const { buildArrivalsForLine, fetchArrivalsForStopIds, getArrivalsForStation, mergeArrivalBuckets, getArrivalServiceStatus } = createArrivalsHelpers({
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

function formatWalkDistance(distanceKm) {
  return formatWalkDistanceValue(distanceKm, copyValue)
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

function getServiceTimelineData(line) {
  const todayKey = getDateKeyWithOffset(0)
  const span = line.serviceSpansByDate?.[todayKey]
  if (!span) return null

  const startHours = parseClockToSeconds(span.start) / 3600
  const endHours = parseClockToSeconds(span.end) / 3600
  const nowHours = getTimelineHour(new Date())
  const axisMax = Math.max(24, endHours, nowHours, 1)

  return {
    startHours,
    endHours,
    nowHours,
    axisMax,
    startLabel: formatServiceClock(span.start),
    endLabel: formatServiceClock(span.end),
  }
}

function renderServiceTimeline(line) {
  const timeline = getServiceTimelineData(line)
  if (!timeline) return ''

  const startPercent = clamp((timeline.startHours / timeline.axisMax) * 100, 0, 100)
  const endPercent = clamp((timeline.endHours / timeline.axisMax) * 100, startPercent, 100)
  const nowPercent = clamp((timeline.nowHours / timeline.axisMax) * 100, 0, 100)
  const isLive = timeline.nowHours >= timeline.startHours && timeline.nowHours <= timeline.endHours

  return `
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '今日运营时间带' : 'Today Service Window'}</p>
          <p class="headway-chart-copy">${state.language === 'zh-CN' ? '首末班与当前时刻' : 'First trip, last trip, and current time'}</p>
        </div>
        <span class="service-timeline-badge ${isLive ? 'is-live' : 'is-off'}">${isLive ? (state.language === 'zh-CN' ? '运营中' : 'In service') : (state.language === 'zh-CN' ? '未运营' : 'Off hours')}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${startPercent}%; width:${Math.max(2, endPercent - startPercent)}%;"></div>
        <div class="service-timeline-now" style="left:${nowPercent}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${state.language === 'zh-CN' ? '当前' : 'Now'}</span>
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
        <p class="train-focus-metric-copy">${formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${state.language === 'zh-CN' ? '终点' : 'Terminal'}</p>
        <p class="train-focus-metric-value">${getVehicleDestinationLabel(vehicle, layout)}</p>
        <p class="train-focus-metric-copy">${formatArrivalTime(getRealtimeOffset(terminalEta))}</p>
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

function renderLineSwitcher() {
  if (!state.compactLayout || state.lines.length < 2) return ''

  const buttons = state.lines
    .map(
      (line) => `
        <button
          class="line-switcher-button ${line.id === state.activeLineId ? 'is-active' : ''}"
          data-line-switch="${line.id}"
          type="button"
          style="--line-color:${line.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <span>${line.name}</span>
        </button>
      `,
    )
    .join('')

  return `<section class="line-switcher">${buttons}</section>`
}

function getVisibleLines() {
  return state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
}

function renderArrivalLists(arrivals, loading = false) {
  const now = Date.now()

  const renderArrival = (arrival) => {
    const arrivalMs = arrival.arrivalTime
    const diffSec = Math.floor((arrivalMs - now) / 1000)
    const timeStr = formatArrivalTime(diffSec)
    const serviceStatus = getArrivalServiceStatus(arrival.arrivalTime, arrival.scheduleDeviation ?? 0)
    const serviceTone = getStatusTone(serviceStatus)

    let precisionInfo = ''
    if (arrival.distanceFromStop > 0) {
      const distanceStr = arrival.distanceFromStop >= 1000
        ? `${(arrival.distanceFromStop / 1000).toFixed(1)}km`
        : `${Math.round(arrival.distanceFromStop)}m`
      const stopsStr = copyValue('stopAway', arrival.numberOfStopsAway)
      precisionInfo = ` • ${distanceStr} • ${stopsStr}`
    }

    return `
      <div class="arrival-item" data-arrival-time="${arrival.arrivalTime}" data-schedule-deviation="${arrival.scheduleDeviation ?? 0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}</span>
            <span class="arrival-destination">${copyValue('toDestination', arrival.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${serviceTone}">${serviceStatus}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${timeStr}</span>
            <span class="arrival-precision">${precisionInfo}</span>
          </span>
        </span>
      </div>
    `
  }

  const nbSummary = getDialogDirectionSummary('▲', arrivals.nb)
  const sbSummary = getDialogDirectionSummary('▼', arrivals.sb)

  if (loading) {
    arrivalsNbPinned.innerHTML = ''
    arrivalsSbPinned.innerHTML = ''
    arrivalsNb.innerHTML = `<div class="arrival-item muted">${copyValue('loadingArrivals')}</div>`
    arrivalsSb.innerHTML = `<div class="arrival-item muted">${copyValue('loadingArrivals')}</div>`
    syncDialogDisplayScroll()
    return
  }

  const renderBucket = (bucket, pinnedElement, listElement) => {
    if (!bucket.length) {
      pinnedElement.innerHTML = ''
      listElement.innerHTML = `<div class="arrival-item muted">${copyValue('noUpcomingVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
      return
    }

    const pinnedItems = state.dialogDisplayMode ? bucket.slice(0, 2) : []
    const scrollingItems = state.dialogDisplayMode ? bucket.slice(2) : bucket

    pinnedElement.innerHTML = pinnedItems.map(renderArrival).join('')
    listElement.innerHTML = scrollingItems.length
      ? scrollingItems.map(renderArrival).join('')
      : state.dialogDisplayMode
        ? `<div class="arrival-item muted">${copyValue('noAdditionalVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
        : ''
  }

  renderBucket(arrivals.nb, arrivalsNbPinned, arrivalsNb)
  renderBucket(arrivals.sb, arrivalsSbPinned, arrivalsSb)
  arrivalsTitleNb.textContent = formatDirectionLabel('▲', nbSummary, { includeSymbol: true })
  arrivalsTitleSb.textContent = formatDirectionLabel('▼', sbSummary, { includeSymbol: true })

  syncDialogDisplayScroll()
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

function setStationParam(station) {
  const url = new URL(window.location.href)
  url.searchParams.set('station', slugifyStation(station.name))
  window.history.pushState({}, '', url)
}

function clearStationParam() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('station')) return
  url.searchParams.delete('station')
  window.history.pushState({}, '', url)
}

function setSystemParam(systemId) {
  const url = new URL(window.location.href)
  if (systemId === DEFAULT_SYSTEM_ID) {
    url.searchParams.delete('system')
  } else {
    url.searchParams.set('system', systemId)
  }
  window.history.pushState({}, '', url)
}

function getSystemIdFromUrl() {
  const url = new URL(window.location.href)
  const requested = url.searchParams.get('system')
  if (requested && state.systemsById.has(requested)) return requested
  return DEFAULT_SYSTEM_ID
}

async function syncDialogFromUrl() {
  const url = new URL(window.location.href)
  const requestedSystemId = url.searchParams.get('system')
  if (requestedSystemId && state.systemsById.has(requestedSystemId) && requestedSystemId !== state.activeSystemId) {
    await switchSystem(requestedSystemId, { updateUrl: false, preserveDialog: false })
  }

  const requestedStation = url.searchParams.get('station')
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
}

const stationDialogDisplay = createStationDialogDisplayController({
  state,
  elements: dialogElements,
  copyValue,
  refreshStationDialog: (station) => refreshStationDialog(station),
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

function getWalkMinutes(distanceKm) {
  return Math.max(1, Math.round((distanceKm / TRANSFER_WALKING_SPEED_KMPH) * 60))
}

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

function renderTransferRadar(station, recommendations) {
  if (!station || !recommendations.length) return ''

  const maxDistance = Math.max(...recommendations.map((item) => item.distanceKm), TRANSFER_MAX_WALK_KM / 2)
  const center = 82

  return `
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${center}" cy="${center}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${center}" cy="${center}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${center}" cy="${center}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${center}" cy="${center}" r="8" class="transfer-radar-core"></circle>
        ${recommendations
          .map((item) => {
            const bearing = getBearingDegrees(station, item.stop)
            const radius = 22 + (item.distanceKm / maxDistance) * 44
            const x = center + Math.sin((bearing * Math.PI) / 180) * radius
            const y = center - Math.cos((bearing * Math.PI) / 180) * radius
            return `
              <g>
                <line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${item.line.color};"></circle>
              </g>
            `
          })
          .join('')}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${state.language === 'zh-CN' ? '换乘雷达' : 'Transfer Radar'}</p>
        <p class="headway-chart-copy">${state.language === 'zh-CN' ? '中心为当前站，越远表示步行越久' : 'Center is this station; farther dots mean longer walks'}</p>
      </div>
    </div>
  `
}

function getNearbyTransferCandidates(station) {
  if (!station) return []

  const dialogStations = getDialogStations(station)
  const excludedStops = new Set(dialogStations.map(({ line, station: matchedStation }) => `${line.agencyId}:${line.id}:${matchedStation.id}`))
  const candidatesByLine = new Map()

  for (const system of state.systemsById.values()) {
    for (const line of system.lines ?? []) {
      for (const stop of line.stops ?? []) {
        if (excludedStops.has(`${line.agencyId}:${line.id}:${stop.id}`)) continue

        const distanceKm = haversineKm(station.lat, station.lon, stop.lat, stop.lon)
        if (distanceKm > TRANSFER_MAX_WALK_KM) continue

        const key = `${system.id}:${line.id}`
        const existing = candidatesByLine.get(key)
        if (!existing || distanceKm < existing.distanceKm) {
          candidatesByLine.set(key, {
            systemId: system.id,
            systemName: system.name,
            line,
            stop,
            distanceKm,
            walkMinutes: getWalkMinutes(distanceKm),
          })
        }
      }
    }
  }

  return [...candidatesByLine.values()]
    .sort((left, right) => left.distanceKm - right.distanceKm || left.line.name.localeCompare(right.line.name))
    .slice(0, MAX_TRANSFER_RECOMMENDATIONS * 2)
}

function renderTransferRecommendations(recommendations, loading = false, station = state.currentDialogStation) {
  if (loading) {
    transferSection.hidden = false
    transferSection.innerHTML = `
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${copyValue('transfers')}</h4>
          <p class="transfer-panel-copy">${copyValue('checkingNearbyConnections')}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${copyValue('loadingTransferRecommendations')}</div>
        </div>
      </div>
    `
    return
  }

  if (!recommendations.length) {
    transferSection.hidden = true
    transferSection.innerHTML = ''
    return
  }

  transferSection.hidden = false
  transferSection.innerHTML = `
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${copyValue('transfers')}</h4>
        <p class="transfer-panel-copy">${copyValue('closestBoardableConnections')}</p>
      </div>
      ${renderTransferRadar(station, recommendations)}
      <div class="transfer-list">
        ${recommendations
          .map(
            (recommendation) => `
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${recommendation.line.color};">${recommendation.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${recommendation.line.name} <span class="transfer-system-chip">${recommendation.systemName}</span></p>
                    <p class="transfer-card-stop">${copyValue('walkToStop', recommendation.walkMinutes, recommendation.stop.name)}</p>
                    <p class="transfer-card-meta">${formatWalkDistance(recommendation.distanceKm)}${recommendation.arrival ? ` • ${copyValue('toDestination', recommendation.arrival.destination)}` : ''}</p>
                  </div>
                </div>
                <div class="transfer-card-side">
                  <span class="transfer-card-badge transfer-card-badge-${recommendation.tone}">${recommendation.badge}</span>
                  <span class="transfer-card-time">${recommendation.timeText}</span>
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
    </div>
  `
}

function buildTransferRecommendations(candidates, arrivalFeed) {
  const now = Date.now()
  const recommendations = []

  for (const candidate of candidates) {
    const stopIds = getStationStopIds(candidate.stop, candidate.line)
    const arrivals = buildArrivalsForLine(arrivalFeed, candidate.line, stopIds)
    const merged = [...arrivals.nb, ...arrivals.sb].sort((left, right) => left.arrivalTime - right.arrivalTime)
    if (!merged.length) continue

    const readyAt = now + candidate.walkMinutes * 60_000 + TRANSFER_BOARDING_BUFFER_MS
    const boardableArrival = merged.find((arrival) => arrival.arrivalTime >= readyAt) ?? merged[0]
    const rawWaitMs = boardableArrival.arrivalTime - now - candidate.walkMinutes * 60_000
    const waitMinutes = Math.max(0, Math.round(rawWaitMs / 60_000))

    recommendations.push({
      ...candidate,
      arrival: boardableArrival,
      boardAt: boardableArrival.arrivalTime,
      badge:
        rawWaitMs <= 0
          ? copyValue('leaveNow')
          : waitMinutes <= 1
            ? copyValue('boardInOneMinute')
            : copyValue('boardInMinutes', waitMinutes),
      tone: waitMinutes <= 2 ? 'hot' : waitMinutes <= 8 ? 'good' : 'calm',
      timeText: formatClockTime(boardableArrival.arrivalTime),
    })
  }

  return recommendations
    .sort((left, right) => left.boardAt - right.boardAt || left.distanceKm - right.distanceKm)
    .slice(0, MAX_TRANSFER_RECOMMENDATIONS)
}

async function refreshStationDialog(station) {
  if (!station) return

  state.currentDialogStation = station
  state.currentDialogStationId = station.id
  setDialogTitle(station.name)
  renderStationServiceSummary(station)

  const dialogStations = getDialogStations(station)
  const arrivalsByLine = await Promise.all(dialogStations.map(({ station: matchedStation, line }) => getArrivalsForStation(matchedStation, line)))
  renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))

  const stationAlerts = getStationDialogAlerts(station)
  stationAlertsContainer.innerHTML = stationAlerts.length
    ? stationAlerts.map((alert) => `
        <article class="insight-exception insight-exception-warn">
          <p>${alert.title || copyValue('serviceAlert')}</p>
        </article>
      `).join('')
    : ''

  const transferCandidates = getNearbyTransferCandidates(station)
  if (!transferCandidates.length) {
    renderTransferRecommendations([], false, station)
    renderDialogDirectionView()
    syncDialogTitleMarquee()
    return
  }

  renderTransferRecommendations([], true, station)
  const transferFeed = await fetchArrivalsForStopIds(transferCandidates.flatMap((candidate) => getStationStopIds(candidate.stop, candidate.line)))
  renderTransferRecommendations(buildTransferRecommendations(transferCandidates, transferFeed), false, station)
  renderDialogDirectionView()
  syncDialogTitleMarquee()
}

async function showStationDialog(station, { updateUrl = true } = {}) {
  await refreshStationDialog(station)
  if (!dialog.open) dialog.showModal()
  if (updateUrl) setStationParam(station)
  startDialogAutoRefresh()
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

const { renderInsightsBoard } = createInsightsRenderers({
  state,
  classifyHeadwayHealth,
  computeLineHeadways,
  copyValue,
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
})

const {
  closeTrainDialog,
  closeAlertDialog,
  renderAlertListDialog,
  renderTrainDialog,
} = overlayDialogs

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

  if (state.activeTab === 'insights') {
    boardElement.className = 'board'
    const visibleLines = getVisibleLines()
    boardElement.innerHTML = `${renderLineSwitcher()}${renderInsightsBoard(visibleLines)}`
    attachLineSwitcherHandlers()
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
    if (updateUrl) setSystemParam(state.activeSystemId)
    return
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
    console.error(error)
  }

  render()
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
  updatedAtElement.textContent = error.message
})
