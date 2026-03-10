import './style.css'
import { registerSW } from 'virtual:pwa-register'

const DATA_URL = './link-data.json'
const VEHICLE_URL = 'https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST'
const ALERTS_URL = 'https://s3.amazonaws.com/st-service-alerts-prod/alerts_pb.json'
const OBA_BASE_URL = 'https://api.pugetsound.onebusaway.org/api/where'
const OBA_KEY = 'TEST'
const ARRIVALS_CACHE_TTL_MS = 20_000
const OBA_MAX_RETRIES = 3
const OBA_RETRY_BASE_DELAY_MS = 800
const COMPACT_LAYOUT_BREAKPOINT = 1100
const DIALOG_REFRESH_INTERVAL_MS = 30_000
const DIALOG_DISPLAY_SCROLL_INTERVAL_MS = 4_000
const DIALOG_DISPLAY_DIRECTION_ROTATE_MS = 15_000
const THEME_STORAGE_KEY = 'link-pulse-theme'
const LINE_MATCHERS = {
  '100479': /100479/,
  '2LINE': /2LINE/,
}

const state = {
  fetchedAt: '',
  error: '',
  activeTab: 'map',
  activeLineId: '100479',
  compactLayout: false,
  theme: 'dark',
  currentDialogStationId: '',
  lines: [],
  layouts: new Map(),
  vehiclesByLine: new Map(),
  rawVehicles: [],
  arrivalsCache: new Map(),
  activeDialogRequest: 0,
  isSyncingFromUrl: false,
  currentDialogStation: null,
  dialogRefreshTimer: 0,
  dialogDisplayMode: false,
  dialogDisplayDirection: 'both',
  dialogDisplayAutoPhase: 'nb',
  dialogDisplayDirectionTimer: 0,
  dialogDisplayTimer: 0,
  dialogDisplayIndexes: { nb: 0, sb: 0 },
  currentTrainId: '',
  alerts: [],
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
        <p class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1>LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="current-time" class="updated-at">Now --:--</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <section class="tab-bar" aria-label="Board views">
      <button class="tab-button is-active" data-tab="map" type="button">Map</button>
      <button class="tab-button" data-tab="trains" type="button">Trains</button>
      <button class="tab-button" data-tab="times" type="button">Times</button>
    </section>
    <section id="board" class="board"></section>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="dialog-title">Station</h3>
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
      <div class="dialog-body">
        <div class="arrivals-section" data-direction-section="nb">
          <h4 class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 class="arrivals-title">Southbound (▼)</h4>
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
          <p id="alert-dialog-subtitle" class="updated-at">Link rail advisory</p>
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
const tabButtons = [...document.querySelectorAll('.tab-button')]
const themeToggleButton = document.querySelector('#theme-toggle')
const statusPillElement = document.querySelector('#status-pill')
const currentTimeElement = document.querySelector('#current-time')
const updatedAtElement = document.querySelector('#updated-at')
const dialog = document.querySelector('#station-dialog')
const dialogTitle = document.querySelector('#dialog-title')
const dialogStatusPillElement = document.querySelector('#dialog-status-pill')
const dialogUpdatedAtElement = document.querySelector('#dialog-updated-at')
const dialogDisplay = document.querySelector('#dialog-display')
const dialogDirectionTabs = [...document.querySelectorAll('[data-dialog-direction]')]
const arrivalsNbPinned = document.querySelector('#arrivals-nb-pinned')
const arrivalsNb = document.querySelector('#arrivals-nb')
const arrivalsSbPinned = document.querySelector('#arrivals-sb-pinned')
const arrivalsSb = document.querySelector('#arrivals-sb')
const trainDialog = document.querySelector('#train-dialog')
const trainDialogTitle = document.querySelector('#train-dialog-title')
const trainDialogSubtitle = document.querySelector('#train-dialog-subtitle')
const trainDialogLine = document.querySelector('#train-dialog-line')
const trainDialogStatus = document.querySelector('#train-dialog-status')
const trainDialogClose = document.querySelector('#train-dialog-close')
const alertDialog = document.querySelector('#alert-dialog')
const alertDialogTitle = document.querySelector('#alert-dialog-title')
const alertDialogSubtitle = document.querySelector('#alert-dialog-subtitle')
const alertDialogLines = document.querySelector('#alert-dialog-lines')
const alertDialogBody = document.querySelector('#alert-dialog-body')
const alertDialogLink = document.querySelector('#alert-dialog-link')
const alertDialogClose = document.querySelector('#alert-dialog-close')

dialogDisplay.addEventListener('click', () => toggleDialogDisplayMode())
trainDialogClose.addEventListener('click', () => closeTrainDialog())
alertDialogClose.addEventListener('click', () => closeAlertDialog())
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
  button.addEventListener('click', async () => {
    state.activeTab = button.dataset.tab
    render()

    if (state.activeTab === 'times') {
      await prefetchVisibleLineArrivals()
      if (state.activeTab === 'times') render()
    }
  })
})
themeToggleButton.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
  render()
})

function normalizeName(name) {
  return name
    .replace('Station', '')
    .replace('Univ of Washington', 'UW')
    .replace("Int'l", 'Intl')
    .trim()
}

function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return 'dark'
}

function setTheme(theme) {
  state.theme = theme
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
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

function slugifyStation(value) {
  return value
    .toLowerCase()
    .replace(/['.]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Waiting for snapshot'

  const deltaSeconds = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 1000))
  if (deltaSeconds < 10) return 'Updated now'
  if (deltaSeconds < 60) return `Updated ${deltaSeconds}s ago`
  return `Updated ${Math.round(deltaSeconds / 60)}m ago`
}

function formatCurrentTime() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function formatArrivalTime(offsetSeconds) {
  if (offsetSeconds <= 0) return 'Arriving'
  const minutes = Math.floor(offsetSeconds / 60)
  const seconds = offsetSeconds % 60
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function getTranslationText(field) {
  return field?.translation?.find((entry) => entry.text)?.text ?? ''
}

function getTodayDateKey() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}

function formatServiceClock(clockValue) {
  if (!clockValue) return ''
  const [rawHours = '0', rawMinutes = '0'] = String(clockValue).split(':')
  const hours24 = Number(rawHours)
  const minutes = Number(rawMinutes)
  const normalizedHours = ((hours24 % 24) + 24) % 24
  const period = normalizedHours >= 12 ? 'PM' : 'AM'
  const hours12 = normalizedHours % 12 || 12
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`
}

function getTodayServiceSpan(line) {
  const todayKey = getTodayDateKey()
  const span = line.serviceSpansByDate?.[todayKey]
  if (!span) return 'Today service hours unavailable'
  return `Today ${formatServiceClock(span.start)} - ${formatServiceClock(span.end)}`
}

function parseAlertEntity(entity) {
  const alert = entity.alert ?? {}
  const informedEntities = alert.informed_entity ?? []
  const lineIds = [...new Set(informedEntities.map((item) => item.route_id).filter((routeId) => routeId === '100479' || routeId === '2LINE'))]
  if (!lineIds.length) return null

  return {
    id: entity.id,
    effect: alert.effect ?? 'UNKNOWN_EFFECT',
    severity: alert.severity_level ?? 'INFO',
    title: getTranslationText(alert.header_text),
    description: getTranslationText(alert.description_text),
    url: getTranslationText(alert.url),
    lineIds,
    stopIds: [...new Set(informedEntities.map((item) => item.stop_id).filter(Boolean))],
  }
}

function getAlertsForLine(lineId) {
  return state.alerts.filter((alert) => alert.lineIds.includes(lineId))
}

function formatAlertEffect(effect) {
  return String(effect || 'SERVICE ALERT')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function formatAlertSeverity(severity) {
  return String(severity || 'INFO')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function renderInlineAlerts(lineAlerts, lineId) {
  if (!lineAlerts.length) return ''

  return `
    <button class="line-alert-badge" type="button" data-alert-line-id="${lineId}">
      <span class="line-alert-badge-count">${lineAlerts.length}</span>
      <span class="line-alert-badge-copy">alert${lineAlerts.length === 1 ? '' : 's'}</span>
    </button>
  `
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isRateLimitedPayload(payload) {
  return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
}

async function fetchJsonWithRetry(url, label) {
  for (let attempt = 0; attempt <= OBA_MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, { cache: 'no-store' })
    let payload = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    const isRateLimitedResponse = response.status === 429 || isRateLimitedPayload(payload)
    if (response.ok && !isRateLimitedResponse) {
      return payload
    }

    if (attempt === OBA_MAX_RETRIES || !isRateLimitedResponse) {
      if (payload?.text) throw new Error(payload.text)
      throw new Error(`${label} request failed with ${response.status}`)
    }

    const delayMs = OBA_RETRY_BASE_DELAY_MS * 2 ** attempt
    await sleep(delayMs)
  }

  throw new Error(`${label} request failed`)
}

function buildLayout(line) {
  const orderedStops = [...line.stops].sort((left, right) => right.sequence - left.sequence)
  const stationGap = 48
  const topPadding = 44
  const bottomPadding = 28
  const trackX = 88
  const labelX = 122
  const height = topPadding + bottomPadding + (orderedStops.length - 1) * stationGap
  const stationIndexByStopId = new Map()

  const stations = orderedStops.map((stop, index) => {
    const station = {
      ...stop,
      label: normalizeName(stop.name),
      y: topPadding + index * stationGap,
      index,
      isTerminal: index === 0 || index === orderedStops.length - 1,
    }

    stationIndexByStopId.set(stop.id, index)
    for (const alias of line.stationAliases?.[stop.id] ?? []) {
      stationIndexByStopId.set(alias, index)
      stationIndexByStopId.set(`40_${alias}`, index)
    }

    stationIndexByStopId.set(`40_${stop.id}`, index)
    return station
  })

  let cumulativeMinutes = 0
  for (let index = 0; index < stations.length; index += 1) {
    stations[index].cumulativeMinutes = cumulativeMinutes
    cumulativeMinutes += index < stations.length - 1 ? stations[index].segmentMinutes : 0
  }

  return {
    totalMinutes: cumulativeMinutes,
    height,
    labelX,
    stationGap,
    stationIndexByStopId,
    stations,
    trackX,
  }
}

function inferDirectionSymbol(closestIndex, nextIndex, tripId) {
  if (closestIndex != null && nextIndex != null && closestIndex !== nextIndex) {
    return nextIndex < closestIndex ? '▲' : '▼'
  }

  if (/Lynnwood City Center|Downtown Redmond/.test(tripId)) return '▲'
  if (/Federal Way Downtown|South Bellevue/.test(tripId)) return '▼'
  return '•'
}

function extractTripKey(routeId, tripId) {
  const marker = `_${routeId}_`
  const markerIndex = tripId.lastIndexOf(marker)
  if (markerIndex === -1) return ''
  return tripId.slice(markerIndex + marker.length).replace(/\.\d+$/, '')
}

function classifyVehicleStatus(rawVehicle) {
  const tripStatus = rawVehicle.tripStatus ?? {}
  const status = String(tripStatus.status ?? '').toLowerCase()
  const closestOffset = tripStatus.closestStopTimeOffset ?? 0
  const nextOffset = tripStatus.nextStopTimeOffset ?? 0
  const scheduleDeviation = tripStatus.scheduleDeviation ?? 0
  const isAtPlatform = tripStatus.closestStop && tripStatus.nextStop && tripStatus.closestStop === tripStatus.nextStop
  const isApproaching = status === 'approaching' || (isAtPlatform && Math.abs(nextOffset) <= 90)

  if (isApproaching) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return 'ON TIME'
}

function formatDelay(deviationSeconds, isPredicted) {
  if (!isPredicted) {
    return { text: 'Scheduled', colorClass: 'status-muted' }
  }

  if (deviationSeconds >= -30 && deviationSeconds <= 60) {
    return { text: 'On Time', colorClass: 'status-ontime' }
  }

  if (deviationSeconds > 60) {
    const minutes = Math.round(deviationSeconds / 60)
    let colorClass = 'status-late-minor'
    if (deviationSeconds > 600) {
      colorClass = 'status-late-severe'
    } else if (deviationSeconds > 300) {
      colorClass = 'status-late-moderate'
    }
    return { text: `+${minutes} min late`, colorClass }
  }

  if (deviationSeconds < -60) {
    const minutes = Math.round(Math.abs(deviationSeconds) / 60)
    return { text: `${minutes} min early`, colorClass: 'status-early' }
  }

  return { text: 'Unknown', colorClass: 'status-muted' }
}

function formatServiceStatus(serviceStatus) {
  switch (serviceStatus) {
    case 'ARR':
      return 'ARRIVING'
    case 'DELAY':
      return 'DELAYED'
    case 'OK':
      return 'EN ROUTE'
    default:
      return ''
  }
}

function formatVehicleStatus(vehicle) {
  const statusText = formatServiceStatus(vehicle.serviceStatus)
  const delayText = vehicle.delayInfo.text
  return `${statusText} (${delayText})`
}

function parseVehicle(rawVehicle, line, layout) {
  const tripId = rawVehicle.tripStatus?.activeTripId ?? ''
  if (!LINE_MATCHERS[line.id].test(tripId)) return null

  const closestStop = rawVehicle.tripStatus?.closestStop
  const nextStop = rawVehicle.tripStatus?.nextStop
  const closestIndex = layout.stationIndexByStopId.get(closestStop)
  const nextIndex = layout.stationIndexByStopId.get(nextStop)

  if (closestIndex == null && nextIndex == null) return null

  let fromIndex = closestIndex ?? nextIndex
  let toIndex = nextIndex ?? closestIndex

  if (fromIndex > toIndex) {
    const swap = fromIndex
    fromIndex = toIndex
    toIndex = swap
  }

  const currentStation = layout.stations[fromIndex]
  const nextStation = layout.stations[toIndex]
  const closestOffset = rawVehicle.tripStatus?.closestStopTimeOffset ?? 0
  const nextOffset = rawVehicle.tripStatus?.nextStopTimeOffset ?? 0
  const tripKey = extractTripKey(line.id, tripId)
  const lookedUpDirection = line.directionLookup?.[tripKey]
  const directionSymbol =
    lookedUpDirection === '1'
      ? '▲'
      : lookedUpDirection === '0'
        ? '▼'
        : inferDirectionSymbol(closestIndex, nextIndex, tripId)

  let progress = 0
  if (fromIndex !== toIndex && closestOffset < 0 && nextOffset > 0) {
    progress = clamp(Math.abs(closestOffset) / (Math.abs(closestOffset) + nextOffset), 0, 1)
  }

  const y = currentStation.y + (nextStation.y - currentStation.y) * progress
  const segmentMinutes = fromIndex !== toIndex ? currentStation.segmentMinutes : 0
  const minutePosition = currentStation.cumulativeMinutes + segmentMinutes * progress
  const currentIndex = closestIndex ?? nextIndex ?? fromIndex
  const currentStop = layout.stations[currentIndex] ?? currentStation
  const movingNorth = directionSymbol === '▲'
  const previousStopIndex = clamp(currentIndex + (movingNorth ? 1 : -1), 0, layout.stations.length - 1)
  const upcomingStopIndex =
    closestIndex != null && nextIndex != null && closestIndex !== nextIndex
      ? nextIndex
      : clamp(currentIndex + (movingNorth ? -1 : 1), 0, layout.stations.length - 1)
  const previousStop = layout.stations[previousStopIndex] ?? currentStop
  const upcomingStop = layout.stations[upcomingStopIndex] ?? nextStation

  const scheduleDeviation = rawVehicle.tripStatus?.scheduleDeviation ?? 0
  const isPredicted = rawVehicle.tripStatus?.predicted ?? false
  const delayInfo = formatDelay(scheduleDeviation, isPredicted)

  return {
    id: rawVehicle.vehicleId,
    label: rawVehicle.vehicleId.replace(/^40_/, ''),
    directionSymbol,
    fromLabel: currentStation.label,
    minutePosition,
    progress,
    serviceStatus: classifyVehicleStatus(rawVehicle),
    toLabel: nextStation.label,
    y,
    currentLabel: currentStation.label,
    nextLabel: nextStation.label,
    previousLabel: previousStop.label,
    currentStopLabel: currentStop.label,
    upcomingLabel: upcomingStop.label,
    status: rawVehicle.tripStatus?.status ?? '',
    closestStop,
    nextStop,
    closestOffset,
    nextOffset,
    scheduleDeviation,
    isPredicted,
    delayInfo,
    rawVehicle,
  }
}

function formatVehicleSegment(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return `At ${vehicle.fromLabel}`
  }

  return `${vehicle.fromLabel} -> ${vehicle.toLabel}`
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
      const stopsStr = arrival.numberOfStopsAway === 1
        ? '1 stop away'
        : `${arrival.numberOfStopsAway} stops away`
      precisionInfo = ` • ${distanceStr} • ${stopsStr}`
    }

    return `
      <div class="arrival-item" data-arrival-time="${arrival.arrivalTime}" data-schedule-deviation="${arrival.scheduleDeviation ?? 0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${arrival.lineName} Train ${arrival.vehicleId}</span>
            <span class="arrival-destination">To ${arrival.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${serviceTone}">${serviceStatus}</span>
          <span class="arrival-time"><span class="arrival-countdown">${timeStr}</span><span class="arrival-precision">${precisionInfo}</span></span>
        </span>
      </div>
    `
  }

  if (loading) {
    arrivalsNbPinned.innerHTML = ''
    arrivalsSbPinned.innerHTML = ''
    arrivalsNb.innerHTML = '<div class="arrival-item muted">Loading arrivals...</div>'
    arrivalsSb.innerHTML = '<div class="arrival-item muted">Loading arrivals...</div>'
    syncDialogDisplayScroll()
    return
  }

  const renderBucket = (bucket, pinnedElement, listElement) => {
    if (!bucket.length) {
      pinnedElement.innerHTML = ''
      listElement.innerHTML = '<div class="arrival-item muted">No upcoming trains</div>'
      return
    }

    const pinnedItems = state.dialogDisplayMode ? bucket.slice(0, 2) : []
    const scrollingItems = state.dialogDisplayMode ? bucket.slice(2) : bucket

    pinnedElement.innerHTML = pinnedItems.map(renderArrival).join('')
    listElement.innerHTML = scrollingItems.length
      ? scrollingItems.map(renderArrival).join('')
      : state.dialogDisplayMode
        ? '<div class="arrival-item muted">No additional trains</div>'
        : ''
  }

  renderBucket(arrivals.nb, arrivalsNbPinned, arrivalsNb)
  renderBucket(arrivals.sb, arrivalsSbPinned, arrivalsSb)

  syncDialogDisplayScroll()
}

function getStationStopIds(station, line) {
  const aliases = new Set(line.stationAliases?.[station.id] ?? [])
  aliases.add(station.id)

  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith('40_') ? alias : `40_${alias}`
    candidates.add(normalized)
  }

  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith('40_') ? baseId : `40_${baseId}`)

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
        `40_${station.id}`,
        station.name,
        normalizeName(station.name),
        slugifyStation(station.name),
        slugifyStation(normalizeName(station.name)),
      ])

      for (const alias of line.stationAliases?.[station.id] ?? []) {
        candidates.add(alias)
        candidates.add(`40_${alias}`)
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

function setDialogDisplayMode(isDisplayMode) {
  state.dialogDisplayMode = isDisplayMode
  dialog.classList.toggle('is-display-mode', isDisplayMode)
  dialogDisplay.textContent = isDisplayMode ? 'Exit' : 'Board'
  dialogDisplay.setAttribute('aria-label', isDisplayMode ? 'Exit display mode' : 'Toggle display mode')
  state.dialogDisplayDirection = 'both'
  state.dialogDisplayAutoPhase = 'nb'
  renderDialogDirectionView()

  if (dialog.open && state.currentDialogStation) {
    refreshStationDialog(state.currentDialogStation).catch(console.error)
  }

  syncDialogDisplayScroll()
}

function toggleDialogDisplayMode() {
  setDialogDisplayMode(!state.dialogDisplayMode)
}

function stopDialogDirectionRotation() {
  if (state.dialogDisplayDirectionTimer) {
    window.clearInterval(state.dialogDisplayDirectionTimer)
    state.dialogDisplayDirectionTimer = 0
  }
}

function renderDialogDirectionView() {
  stopDialogDirectionRotation()
  const requestedDirection = state.dialogDisplayDirection
  const direction = requestedDirection === 'auto' ? state.dialogDisplayAutoPhase : requestedDirection
  dialogDirectionTabs.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.dialogDirection === requestedDirection)
  })

  dialog.classList.toggle('show-nb-only', state.dialogDisplayMode && direction === 'nb')
  dialog.classList.toggle('show-sb-only', state.dialogDisplayMode && direction === 'sb')

  if (state.dialogDisplayMode && requestedDirection === 'auto') {
    state.dialogDisplayDirectionTimer = window.setInterval(() => {
      state.dialogDisplayAutoPhase = state.dialogDisplayAutoPhase === 'nb' ? 'sb' : 'nb'
      renderDialogDirectionView()
    }, DIALOG_DISPLAY_DIRECTION_ROTATE_MS)
  }
}

function stopDialogAutoRefresh() {
  if (state.dialogRefreshTimer) {
    window.clearInterval(state.dialogRefreshTimer)
    state.dialogRefreshTimer = 0
  }
}

function stopDialogDisplayScroll() {
  if (state.dialogDisplayTimer) {
    window.clearInterval(state.dialogDisplayTimer)
    state.dialogDisplayTimer = 0
  }
}

function applyDialogDisplayOffset(listElement, key) {
  const items = [...listElement.querySelectorAll('.arrival-item:not(.muted)')]
  listElement.style.transform = 'translateY(0)'

  if (!state.dialogDisplayMode || items.length <= 3) return

  const rowGap = Number.parseFloat(window.getComputedStyle(listElement).rowGap || '0') || 0
  const itemHeight = items[0].getBoundingClientRect().height + rowGap
  const maxIndex = Math.max(0, items.length - 3)
  const safeIndex = Math.min(state.dialogDisplayIndexes[key], maxIndex)
  listElement.style.transform = `translateY(-${safeIndex * itemHeight}px)`
}

function syncDialogDisplayScroll() {
  stopDialogDisplayScroll()
  state.dialogDisplayIndexes = { nb: 0, sb: 0 }
  applyDialogDisplayOffset(arrivalsNb, 'nb')
  applyDialogDisplayOffset(arrivalsSb, 'sb')

  if (!state.dialogDisplayMode) return

  state.dialogDisplayTimer = window.setInterval(() => {
    for (const [key, listElement] of [['nb', arrivalsNb], ['sb', arrivalsSb]]) {
      const items = [...listElement.querySelectorAll('.arrival-item:not(.muted)')]
      if (items.length <= 3) continue

      const maxIndex = Math.max(0, items.length - 3)
      state.dialogDisplayIndexes[key] = state.dialogDisplayIndexes[key] >= maxIndex ? 0 : state.dialogDisplayIndexes[key] + 1
      applyDialogDisplayOffset(listElement, key)
    }
  }, DIALOG_DISPLAY_SCROLL_INTERVAL_MS)
}

function refreshArrivalCountdowns() {
  if (!dialog.open) return

  const arrivalItems = dialog.querySelectorAll('.arrival-item[data-arrival-time]')
  arrivalItems.forEach((item) => {
    const arrivalTime = Number(item.dataset.arrivalTime)
    const scheduleDeviation = Number(item.dataset.scheduleDeviation || 0)
    const timeElement = item.querySelector('.arrival-countdown')
    const statusElement = item.querySelector('.arrival-status')
    if (!timeElement || !statusElement) return

    timeElement.textContent = formatArrivalTime(Math.floor((arrivalTime - Date.now()) / 1000))

    const serviceStatus = getArrivalServiceStatus(arrivalTime, scheduleDeviation)
    const serviceTone = getStatusTone(serviceStatus)
    statusElement.textContent = serviceStatus
    statusElement.className = `arrival-status arrival-status-${serviceTone}`
  })
}

function startDialogAutoRefresh() {
  stopDialogAutoRefresh()
  if (!state.currentDialogStation) return

  state.dialogRefreshTimer = window.setInterval(() => {
    if (!dialog.open || !state.currentDialogStation) return
    refreshStationDialog(state.currentDialogStation).catch(console.error)
  }, DIALOG_REFRESH_INTERVAL_MS)
}

function closeStationDialog() {
  state.currentDialogStationId = ''
  state.currentDialogStation = null
  if (dialog.open) {
    dialog.close()
  } else {
    stopDialogAutoRefresh()
    stopDialogDisplayScroll()
    stopDialogDirectionRotation()
    setDialogDisplayMode(false)
    clearStationParam()
  }
}

async function syncDialogFromUrl() {
  const stationParam = new URL(window.location.href).searchParams.get('station')
  const station = findStationByParam(stationParam)

  state.isSyncingFromUrl = true
  try {
    if (!station) {
      state.currentDialogStationId = ''
      if (dialog.open) dialog.close()
      return
    }

    state.activeTab = 'map'
    render()

    if (state.currentDialogStationId === station.id && dialog.open) {
      return
    }

    await showStationDialog(station, false)
  } finally {
    state.isSyncingFromUrl = false
  }
}

function classifyArrivalDirection(arrival, line) {
  const tripKey = extractTripKey(line.id, arrival.tripId ?? '')
  const lookedUpDirection = line.directionLookup?.[tripKey]
  if (lookedUpDirection === '1') return 'nb'
  if (lookedUpDirection === '0') return 'sb'

  const headsign = arrival.tripHeadsign ?? ''
  if (/Lynnwood|Downtown Redmond/i.test(headsign)) return 'nb'
  if (/Federal Way|South Bellevue/i.test(headsign)) return 'sb'
  return ''
}

function getLineRouteId(line) {
  return `40_${line.id}`
}

function formatArrivalDestination(arrival) {
  const headsign = arrival.tripHeadsign?.trim()
  if (headsign) return normalizeName(headsign.replace(/^to\s+/i, ''))
  return 'Terminal'
}

function getArrivalServiceStatus(arrivalTime, scheduleDeviation) {
  const secondsUntilArrival = Math.floor((arrivalTime - Date.now()) / 1000)

  if (secondsUntilArrival <= 90) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return 'ON TIME'
}

function getStatusTone(status) {
  if (status === 'DELAY') return 'delay'
  if (status === 'ARR') return 'arr'
  return 'ok'
}

async function fetchArrivalsForStop(stopId) {
  const url = `${OBA_BASE_URL}/arrivals-and-departures-for-stop/${stopId}.json?key=${OBA_KEY}&minutesAfter=120`
  const payload = await fetchJsonWithRetry(url, 'Arrivals')
  if (payload.code !== 200) {
    throw new Error(payload.text || `Arrivals request failed for ${stopId}`)
  }
  return payload.data?.entry?.arrivalsAndDepartures ?? []
}

async function fetchArrivalsForStopIds(stopIds) {
  const dedupedStopIds = [...new Set(stopIds)]
  const results = await Promise.allSettled(dedupedStopIds.map((stopId) => fetchArrivalsForStop(stopId)))
  const arrivals = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    arrivals.push(...result.value)
  }

  return arrivals
}

function buildArrivalsForLine(arrivalFeed, line) {
  const now = Date.now()
  const seen = new Set()
  const arrivals = { nb: [], sb: [] }

  for (const arrival of arrivalFeed) {
    if (arrival.routeId !== getLineRouteId(line)) continue
    const arrivalTime = arrival.predictedArrivalTime || arrival.scheduledArrivalTime
    if (!arrivalTime || arrivalTime <= now) continue

    const bucket = classifyArrivalDirection(arrival, line)
    if (!bucket) continue

    const dedupeKey = `${arrival.tripId}:${arrival.stopId}:${arrivalTime}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)

    arrivals[bucket].push({
      vehicleId: (arrival.vehicleId || '').replace(/^40_/, '') || '--',
      arrivalTime,
      destination: formatArrivalDestination(arrival),
      scheduleDeviation: arrival.scheduleDeviation ?? 0,
      tripId: arrival.tripId,
      lineColor: line.color,
      lineName: line.name,
      lineToken: line.name[0],
      distanceFromStop: arrival.distanceFromStop ?? 0,
      numberOfStopsAway: arrival.numberOfStopsAway ?? 0,
    })
  }

  arrivals.nb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  arrivals.sb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  arrivals.nb = arrivals.nb.slice(0, 4)
  arrivals.sb = arrivals.sb.slice(0, 4)
  return arrivals
}

async function getArrivalsForStation(station, line, prefetchedFeed = null) {
  const cacheKey = `${line.id}:${station.id}`
  const cached = state.arrivalsCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS) {
    return cached.value
  }

  const stopIds = getStationStopIds(station, line)
  const arrivalFeed = prefetchedFeed ?? (await fetchArrivalsForStopIds(stopIds))
  const arrivals = buildArrivalsForLine(arrivalFeed, line)
  state.arrivalsCache.set(cacheKey, { fetchedAt: Date.now(), value: arrivals })
  return arrivals
}

function mergeArrivalBuckets(collections) {
  const merged = { nb: [], sb: [] }

  for (const arrivals of collections) {
    merged.nb.push(...arrivals.nb)
    merged.sb.push(...arrivals.sb)
  }

  merged.nb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  merged.sb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  return merged
}

async function showStationDialog(station, updateUrl = true) {
  dialogTitle.textContent = station.name
  state.currentDialogStationId = station.id
  state.currentDialogStation = station

  renderArrivalLists({ nb: [], sb: [] }, true)
  if (updateUrl) {
    setStationParam(station)
  }
  dialog.showModal()
  startDialogAutoRefresh()

  await refreshStationDialog(station)
}

async function refreshStationDialog(station) {
  const requestId = state.activeDialogRequest + 1
  state.activeDialogRequest = requestId

  try {
    const dialogStations = getDialogStations(station)
    const sharedStopIds = dialogStations.flatMap(({ station: matchedStation, line }) => getStationStopIds(matchedStation, line))
    const arrivalFeed = await fetchArrivalsForStopIds(sharedStopIds)
    const arrivalsByLine = await Promise.all(
      dialogStations.map(({ station: matchedStation, line }) => getArrivalsForStation(matchedStation, line, arrivalFeed)),
    )
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))
  } catch (error) {
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    arrivalsNb.innerHTML = `<div class="arrival-item muted">${error.message}</div>`
    arrivalsSb.innerHTML = '<div class="arrival-item muted">Retry in a moment</div>'
  }
}

function renderLine(line) {
  const layout = state.layouts.get(line.id)
  const vehicles = state.vehiclesByLine.get(line.id) ?? []
  const lineAlerts = getAlertsForLine(line.id)
  const northboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
  const southboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▼')

  const rows = layout.stations
    .map((station, index) => {
      const prevStation = layout.stations[index - 1]
      const minute = index > 0 ? prevStation.segmentMinutes : ''

      return `
        <g transform="translate(0, ${station.y})" class="station-group" data-stop-id="${station.id}" style="cursor: pointer;">
          ${
            index > 0
              ? `<text x="0" y="-14" class="segment-time">${minute}</text>
                 <line x1="18" x2="${layout.trackX - 16}" y1="-18" y2="-18" class="segment-line"></line>`
              : ''
          }
          <circle cx="${layout.trackX}" cy="0" r="${station.isTerminal ? 11 : 5}" class="${station.isTerminal ? 'terminal-stop' : 'station-stop'}" style="--line-color:${line.color};"></circle>
          ${
            station.isTerminal
              ? `<text x="${layout.trackX}" y="4" text-anchor="middle" class="terminal-mark">${line.name[0]}</text>`
              : ''
          }
          <text x="${layout.labelX}" y="5" class="station-label">${station.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `
    })
    .join('')

  const trainDots = vehicles
    .map(
      (vehicle, index) => `
        <g transform="translate(${layout.trackX}, ${vehicle.y + ((index % 3) - 1) * 1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${line.color}; animation-delay:${index * 0.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}" class="train-arrow" style="--line-color:${line.color};"></path>
        </g>
      `,
    )
    .join('')

  const renderDirectionColumn = (label, directionVehicles) => `
    <div class="direction-column">
      <p class="direction-column-title">${label}</p>
      ${
        directionVehicles.length
          ? directionVehicles
              .sort((left, right) => left.minutePosition - right.minutePosition)
              .map(
                (vehicle) =>
                  `<p class="train-readout"><span class="train-id">${vehicle.label}</span>${formatVehicleSegment(vehicle)} <span class="train-delay ${vehicle.delayInfo.colorClass}">${formatVehicleStatus(vehicle)}</span></p>`,
              )
              .join('')
          : '<p class="train-readout muted">No trains</p>'
      }
    </div>
  `

  return `
    <article class="line-card" data-line-id="${line.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${line.name}</h2>
              ${renderInlineAlerts(lineAlerts, line.id)}
            </div>
            <p>${vehicles.length} live trains</p>
            <p>${getTodayServiceSpan(line)}</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${layout.height}" class="line-diagram" role="img" aria-label="${line.name} live LED board">
        <line x1="${layout.trackX}" x2="${layout.trackX}" y1="${layout.stations[0].y}" y2="${layout.stations.at(-1).y}" class="spine" style="--line-color:${line.color};"></line>
        ${rows}
        ${trainDots}
      </svg>
      <div class="line-readout line-readout-grid">
        ${renderDirectionColumn('NB', northboundVehicles)}
        ${renderDirectionColumn('SB', southboundVehicles)}
      </div>
    </article>
  `
}

function renderTrainList() {
  const vehicles = getAllVehicles().sort((left, right) => left.minutePosition - right.minutePosition)

  if (!vehicles.length) {
    return `
      <section class="line-card">
        <header class="panel-header">
          <h2>Active Trains</h2>
          <p>No live trains</p>
        </header>
      </section>
    `
  }

  const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
  const groupedRows = visibleLines
    .map((line) => {
      const lineVehicles = vehicles.filter((vehicle) => vehicle.lineId === line.id)
      const lineAlerts = getAlertsForLine(line.id)
      const northboundVehicles = lineVehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
      const southboundVehicles = lineVehicles.filter((vehicle) => vehicle.directionSymbol === '▼')
      const renderTrainColumn = (label, directionVehicles) => `
        <div class="train-direction-column">
          <p class="direction-column-title">${label}</p>
          ${
            directionVehicles.length
              ? directionVehicles
                  .map(
                    (vehicle) => `
                      <article class="train-list-item" data-train-id="${vehicle.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${vehicle.lineColor};">${vehicle.lineToken}</span>
                          <div>
                            <p class="train-list-title">${vehicle.lineName} Train ${vehicle.label}</p>
                            <p class="train-list-subtitle">${formatVehicleSegment(vehicle)}</p>
                            <p class="train-list-status ${vehicle.delayInfo.colorClass}">${formatVehicleStatus(vehicle)}</p>
                          </div>
                        </div>
                      </article>
                    `,
                  )
                  .join('')
              : '<p class="train-readout muted">No trains</p>'
          }
        </div>
      `

      return `
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
              <div>
                <div class="line-title-row">
                  <h2>${line.name}</h2>
                  ${renderInlineAlerts(lineAlerts, line.id)}
                </div>
                <p>${lineVehicles.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${renderTrainColumn('NB', northboundVehicles)}
            ${renderTrainColumn('SB', southboundVehicles)}
          </div>
        </article>
      `
    })
    .join('')

  return groupedRows
}

function formatClockTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getUpcomingArrivalsForLine(line) {
  const now = Date.now()
  const arrivals = { nb: [], sb: [] }

  for (const station of line.stops) {
    const cached = state.arrivalsCache.get(`${line.id}:${station.id}`)?.value
    if (!cached) continue

    for (const direction of ['nb', 'sb']) {
      for (const arrival of cached[direction] ?? []) {
        if (!arrival.arrivalTime || arrival.arrivalTime <= now) continue
        arrivals[direction].push({
          ...arrival,
          stationName: normalizeName(station.name),
        })
      }
    }
  }

  for (const direction of ['nb', 'sb']) {
    arrivals[direction].sort((left, right) => left.arrivalTime - right.arrivalTime)
    arrivals[direction] = arrivals[direction].slice(0, 8)
  }

  return arrivals
}

function renderTimesBoard() {
  const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines

  const renderDirectionColumn = (label, arrivals) => `
    <div class="times-direction-column">
      <p class="direction-column-title">${label}</p>
      ${
        arrivals.length
          ? arrivals
              .map((arrival) => {
                const diffSec = Math.floor((arrival.arrivalTime - Date.now()) / 1000)
                const relativeTime = formatArrivalTime(diffSec)
                const clockTime = formatClockTime(arrival.arrivalTime)
                const stopCount = arrival.numberOfStopsAway > 0
                  ? (arrival.numberOfStopsAway === 1 ? '1 stop away' : `${arrival.numberOfStopsAway} stops away`)
                  : 'Boarding now'
                const distanceLabel = arrival.distanceFromStop > 0
                  ? arrival.distanceFromStop >= 1000
                    ? `${(arrival.distanceFromStop / 1000).toFixed(1)} km away`
                    : `${Math.round(arrival.distanceFromStop)} m away`
                  : 'At platform'

                return `
                  <article class="times-item">
                    <div class="times-item-main">
                      <div>
                        <p class="times-item-title">${arrival.stationName}</p>
                        <p class="times-item-subtitle">${arrival.lineName} Train ${arrival.vehicleId} • ${stopCount} • ${distanceLabel}</p>
                      </div>
                      <div class="times-item-right">
                        <p class="times-item-relative">${relativeTime}</p>
                        <p class="times-item-clock">${clockTime}</p>
                      </div>
                    </div>
                  </article>
                `
              })
              .join('')
          : '<p class="train-readout muted">Open a station first to warm the live arrivals cache.</p>'
      }
    </div>
  `

  return visibleLines
    .map((line) => {
      const arrivals = getUpcomingArrivalsForLine(line)
      const totalArrivals = arrivals.nb.length + arrivals.sb.length

      return `
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
              <div>
                <h2>${line.name}</h2>
                <p>${totalArrivals} upcoming live arrivals in cache</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${renderDirectionColumn('NB', arrivals.nb)}
            ${renderDirectionColumn('SB', arrivals.sb)}
          </div>
        </article>
      `
    })
    .join('')
}

async function prefetchVisibleLineArrivals() {
  const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines

  await Promise.allSettled(
    visibleLines.flatMap((line) =>
      line.stops.map((station) => getArrivalsForStation(station, line)),
    ),
  )
}

function attachLineSwitcherHandlers() {
  const buttons = document.querySelectorAll('[data-line-switch]')
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      state.activeLineId = button.dataset.lineSwitch
      render()

      if (state.activeTab === 'times') {
        await prefetchVisibleLineArrivals()
        if (state.activeTab === 'times') render()
      }
    })
  })
}

function closeTrainDialog() {
  state.currentTrainId = ''
  if (trainDialog.open) trainDialog.close()
}

function closeAlertDialog() {
  if (alertDialog.open) alertDialog.close()
}

function renderAlertDialog(alert) {
  alertDialogTitle.textContent = alert.title || 'Service Alert'
  alertDialogSubtitle.textContent = `${formatAlertEffect(alert.effect)} • ${formatAlertSeverity(alert.severity)}`
  alertDialogLines.textContent = 'Link light rail'
  alertDialogBody.textContent = alert.description || 'No additional alert details available.'
  alertDialogLink.hidden = true
  alertDialogLink.removeAttribute('href')

  if (!alertDialog.open) alertDialog.showModal()
}

function renderAlertListDialog(line) {
  const lineAlerts = getAlertsForLine(line.id)
  alertDialogTitle.textContent = `${line.name} Alerts`
  alertDialogSubtitle.textContent = `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'}`
  alertDialogLines.textContent = line.name
  alertDialogBody.textContent = ''
  alertDialogBody.innerHTML = lineAlerts.length
    ? lineAlerts
        .map(
          (alert) => `
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${formatAlertSeverity(alert.severity)} • ${formatAlertEffect(alert.effect)}</p>
              <p class="alert-dialog-item-title">${alert.title || 'Service alert'}</p>
              <p class="alert-dialog-item-copy">${alert.description || 'No additional alert details available.'}</p>
              ${
                alert.url
                  ? `<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${alert.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`
                  : ''
              }
            </article>
          `,
        )
        .join('')
    : '<p class="alert-dialog-item-copy">No active alerts.</p>'
  alertDialogLink.hidden = true
  alertDialogLink.removeAttribute('href')

  if (!alertDialog.open) alertDialog.showModal()
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

function renderTrainDialog(vehicle) {
  const isBetweenStops = vehicle.fromLabel !== vehicle.toLabel && vehicle.progress > 0 && vehicle.progress < 1
  const previousName = isBetweenStops ? vehicle.fromLabel : vehicle.previousLabel
  const currentName = isBetweenStops ? `${vehicle.fromLabel} -> ${vehicle.toLabel}` : vehicle.currentStopLabel
  const currentLabel = isBetweenStops ? 'Between' : 'Now'
  const nextName = isBetweenStops ? vehicle.toLabel : vehicle.upcomingLabel
  const segmentProgress = isBetweenStops ? vehicle.progress : 0.5

  trainDialogTitle.textContent = `${vehicle.lineName} Train ${vehicle.label}`
  trainDialogSubtitle.textContent = vehicle.directionSymbol === '▲' ? 'Northbound movement' : 'Southbound movement'
  trainDialogStatus.className = `train-detail-status train-list-status-${getStatusTone(vehicle.serviceStatus)}`
  trainDialogStatus.textContent = vehicle.serviceStatus
  trainDialogLine.innerHTML = `
    <div class="train-detail-spine" style="--line-color:${vehicle.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${vehicle.lineColor}; --segment-progress:${segmentProgress}; --direction-offset:${vehicle.directionSymbol === '▼' ? '10px' : '-10px'};"
    >
      <span class="train-detail-vehicle-marker">
        <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}"></path>
        </svg>
      </span>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Previous</p>
        <p class="train-detail-name">${previousName}</p>
      </div>
    </div>
    <div class="train-detail-stop is-current">
      <span class="train-detail-marker train-detail-marker-ghost"></span>
      <div>
        <p class="train-detail-label">${currentLabel}</p>
        <p class="train-detail-name">${currentName}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Next</p>
        <p class="train-detail-name">${nextName}</p>
      </div>
    </div>
  `

  if (!trainDialog.open) trainDialog.showModal()
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

function attachStationClickHandlers() {
  state.lines.forEach(line => {
    const layout = state.layouts.get(line.id)
    const card = document.querySelector(`.line-card[data-line-id="${line.id}"]`)
    if (!card) return
    
    const stationGroups = card.querySelectorAll('.station-group')
    stationGroups.forEach(group => {
      group.addEventListener('click', () => {
        const stopId = group.dataset.stopId
    const station = layout.stations.find(s => s.id === stopId)
        if (station) {
          showStationDialog(station)
        }
      })
    })
  })
}

function render() {
  themeToggleButton.textContent = state.theme === 'dark' ? 'Light' : 'Dark'
  statusPillElement.textContent = state.error ? 'HOLD' : 'SYNC'
  statusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  currentTimeElement.textContent = `Now ${formatCurrentTime()}`
  updatedAtElement.textContent = state.error
    ? 'Using last successful snapshot'
    : formatRelativeTime(state.fetchedAt)
  dialogStatusPillElement.textContent = statusPillElement.textContent
  dialogStatusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  dialogUpdatedAtElement.textContent = updatedAtElement.textContent
  tabButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.tab === state.activeTab))

  if (state.activeTab === 'map') {
    boardElement.className = 'board'
    const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
    boardElement.innerHTML = `${renderLineSwitcher()}${visibleLines.map(renderLine).join('')}`
    attachLineSwitcherHandlers()
    attachAlertClickHandlers()
    attachStationClickHandlers()
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

  if (state.activeTab === 'times') {
    boardElement.className = 'board'
    boardElement.innerHTML = `${renderLineSwitcher()}${renderTimesBoard()}`
    attachLineSwitcherHandlers()
    return
  }
}

async function loadStaticData() {
  const response = await fetch(DATA_URL)
  const payload = await response.json()
  state.lines = payload.lines
  state.layouts = new Map(payload.lines.map((line) => [line.id, buildLayout(line)]))
}

async function refreshVehicles() {
  try {
    const payload = await fetchJsonWithRetry(VEHICLE_URL, 'Realtime')
    state.error = ''
    state.fetchedAt = new Date().toISOString()
    state.rawVehicles = payload.data.list

    for (const line of state.lines) {
      const layout = state.layouts.get(line.id)
      const vehicles = payload.data.list
        .map((vehicle) => parseVehicle(vehicle, line, layout))
        .filter(Boolean)
      state.vehiclesByLine.set(line.id, vehicles)
    }
  } catch (error) {
    state.error = 'Realtime offline'
    console.error(error)
  }

  render()
}

async function refreshAlerts() {
  try {
    const payload = await fetchJsonWithRetry(ALERTS_URL, 'Alerts')
    const entities = payload.entity ?? []
    state.alerts = entities.map(parseAlertEntity).filter(Boolean)
  } catch (error) {
    console.error(error)
  }

  render()
}

async function init() {
  setTheme(getPreferredTheme())
  updateViewportState()
  await loadStaticData()
  render()
  await refreshVehicles()
  await refreshAlerts()
  await syncDialogFromUrl()
  window.addEventListener('popstate', () => {
    syncDialogFromUrl().catch(console.error)
  })

  const handleViewportResize = () => {
    const previousCompactLayout = state.compactLayout
    updateViewportState()
    if (previousCompactLayout !== state.compactLayout) {
      render()
      return
    }

    syncCompactLayoutFromBoard()
  }

  window.addEventListener('resize', handleViewportResize)
  window.visualViewport?.addEventListener('resize', handleViewportResize)

  const boardResizeObserver = new ResizeObserver(() => {
    syncCompactLayoutFromBoard()
  })
  boardResizeObserver.observe(boardElement)

  window.setInterval(refreshVehicles, 15000)
  window.setInterval(refreshAlerts, 60000)
  window.setInterval(() => {
    render()
    refreshArrivalCountdowns()
  }, 1000)
}

init().catch((error) => {
  statusPillElement.textContent = 'FAIL'
  updatedAtElement.textContent = error.message
  console.error(error)
})
