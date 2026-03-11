import './style.css'
import { registerSW } from 'virtual:pwa-register'

const DATA_URL = './pulse-data.json'
const OBA_BASE_URL = 'https://api.pugetsound.onebusaway.org/api/where'
const OBA_KEY = (import.meta.env.VITE_OBA_KEY || 'TEST').trim() || 'TEST'
const IS_PUBLIC_TEST_KEY = OBA_KEY === 'TEST'
const ARRIVALS_CACHE_TTL_MS = IS_PUBLIC_TEST_KEY ? 60_000 : 20_000
const OBA_MAX_RETRIES = 3
const OBA_RETRY_BASE_DELAY_MS = 800
const OBA_COOLDOWN_BASE_MS = IS_PUBLIC_TEST_KEY ? 20_000 : 5_000
const OBA_COOLDOWN_MAX_MS = IS_PUBLIC_TEST_KEY ? 120_000 : 30_000
const OBA_INTER_REQUEST_DELAY_MS = IS_PUBLIC_TEST_KEY ? 1_200 : 0
const OBA_ARRIVALS_CONCURRENCY = IS_PUBLIC_TEST_KEY ? 1 : 3
const COMPACT_LAYOUT_BREAKPOINT = 1100
const VEHICLE_REFRESH_INTERVAL_MS = IS_PUBLIC_TEST_KEY ? 45_000 : 15_000
const DIALOG_REFRESH_INTERVAL_MS = IS_PUBLIC_TEST_KEY ? 90_000 : 30_000
const DIALOG_DISPLAY_SCROLL_INTERVAL_MS = 4_000
const DIALOG_DISPLAY_DIRECTION_ROTATE_MS = 15_000
const GHOST_HISTORY_LIMIT = 6
const GHOST_MAX_AGE_MS = 4 * 60_000
const TRANSFER_WALKING_SPEED_KMPH = 4.8
const TRANSFER_MAX_WALK_KM = 0.35
const TRANSFER_BOARDING_BUFFER_MS = 45_000
const MAX_TRANSFER_RECOMMENDATIONS = 4
const THEME_STORAGE_KEY = 'link-pulse-theme'
const LANGUAGE_STORAGE_KEY = 'link-pulse-language'
const DEFAULT_SYSTEM_ID = 'link'
const SYSTEM_META = {
  link: {
    id: 'link',
    agencyId: '40',
    label: 'Link',
    kicker: 'SEATTLE LIGHT RAIL',
    title: 'LINK PULSE',
    vehicleLabel: 'Train',
    vehicleLabelPlural: 'Trains',
  },
  rapidride: {
    id: 'rapidride',
    agencyId: '1',
    label: 'RapidRide',
    kicker: 'KING COUNTY METRO',
    title: 'RAPIDRIDE PULSE',
    vehicleLabel: 'Bus',
    vehicleLabelPlural: 'Buses',
  },
  swift: {
    id: 'swift',
    agencyId: '29',
    label: 'Swift',
    kicker: 'COMMUNITY TRANSIT',
    title: 'SWIFT PULSE',
    vehicleLabel: 'Bus',
    vehicleLabelPlural: 'Buses',
  },
}

const UI_COPY = {
  en: {
    languageToggle: '中文',
    languageToggleAria: 'Switch to Chinese',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeToggleAria: 'Toggle color theme',
    transitSystems: 'Transit systems',
    boardViews: 'Board views',
    tabMap: 'Map',
    tabInsights: 'Insights',
    statusSync: 'SYNC',
    statusHold: 'HOLD',
    statusFail: 'FAIL',
    nowPrefix: 'Now',
    waitingSnapshot: 'Waiting for snapshot',
    updatedNow: 'Updated now',
    updatedSecondsAgo: (seconds) => `Updated ${seconds}s ago`,
    updatedMinutesAgo: (minutes) => `Updated ${minutes}m ago`,
    station: 'Station',
    serviceSummary: 'Service summary',
    boardDirectionView: 'Board direction view',
    both: 'Both',
    auto: 'Auto',
    board: 'Board',
    exit: 'Exit',
    northbound: 'Northbound (▲)',
    southbound: 'Southbound (▼)',
    train: 'Train',
    currentMovement: 'Current movement',
    closeTrainDialog: 'Close train dialog',
    serviceAlert: 'Service Alert',
    transitAdvisory: 'Transit advisory',
    closeAlertDialog: 'Close alert dialog',
    readOfficialAlert: 'Read official alert',
    arriving: 'Arriving',
    todayServiceUnavailable: 'Today service hours unavailable',
    todayServiceSpan: (start, end) => `Today ${start} - ${end}`,
    lastTrip: (time) => `Last trip ${time}`,
    endsIn: (duration) => `Ends in ${duration}`,
    firstTrip: (time) => `First trip ${time}`,
    startsIn: (duration) => `Starts in ${duration}`,
    serviceEnded: (time) => `Service ended ${time}`,
    nextStart: (time) => `Next start ${time}`,
    noNextServiceLoaded: 'No next service loaded',
    ended: 'Ended',
    nextFirstTrip: (time) => `Next first trip ${time}`,
    noServiceRemainingToday: 'No service remaining today',
    serviceHoursUnavailable: 'Service hours unavailable',
    staticScheduleMissing: 'Static schedule data missing for this date',
    unavailable: 'Unavailable',
    serviceSummaryUnavailable: 'Service summary unavailable',
    alertsWord: (count) => `alert${count === 1 ? '' : 's'}`,
    scheduled: 'Scheduled',
    onTime: 'On Time',
    unknown: 'Unknown',
    arrivingStatus: 'ARRIVING',
    delayedStatus: 'DELAYED',
    enRoute: 'EN ROUTE',
    arrivingNow: 'Arriving now',
    arrivingIn: (time) => `Arriving in ${time}`,
    nextStopIn: (time) => `Next stop in ${time}`,
    active: 'Active',
    noLiveVehicles: (label) => `No live ${label}`,
    liveCount: (count, label) => `${count} live ${label}`,
    inServiceCount: (count, label) => `${count} ${label} in service`,
    activeVehicles: (label) => `Active ${label}`,
    previous: 'Previous',
    now: 'Now',
    next: 'Next',
    direction: 'Direction',
    terminal: 'Terminal',
    etaToTerminal: 'ETA to Terminal',
    upcomingStops: 'Upcoming stops',
    liveEtaNow: 'Live ETA now',
    nextStop: 'Next stop',
    upcoming: 'Upcoming',
    noDownstreamEta: 'No downstream ETA available for this train right now.',
    terminalFallback: 'Terminal',
    loadingArrivals: 'Loading arrivals...',
    noUpcomingVehicles: (label) => `No upcoming ${label}`,
    noAdditionalVehicles: (label) => `No additional ${label}`,
    stopAway: (count) => `${count} stop${count === 1 ? '' : 's'} away`,
    toDestination: (name) => `To ${name}`,
    transfers: 'Transfers',
    checkingNearbyConnections: 'Checking nearby connections...',
    loadingTransferRecommendations: 'Loading transfer recommendations...',
    closestBoardableConnections: 'Closest boardable connections from this station',
    walkToStop: (minutes, stopName) => `Walk ${minutes} min to ${stopName}`,
    walkKm: (distanceKm) => `${distanceKm.toFixed(1)} km walk`,
    walkMeters: (meters) => `${meters} m walk`,
    leaveNow: 'Leave now',
    boardInOneMinute: 'Board in ~1 min',
    boardInMinutes: (minutes) => `Board in ~${minutes} min`,
    activeAlerts: (count) => `${count} active ${count === 1 ? 'alert' : 'alerts'}`,
    noActiveAlerts: 'No active alerts.',
    noAdditionalAlertDetails: 'No additional alert details available.',
    affectedLineAlerts: (lineName, count) => `${lineName} Alerts`,
    realtimeOffline: 'Realtime offline',
  },
  'zh-CN': {
    languageToggle: 'EN',
    languageToggleAria: '切换到英文',
    themeLight: '浅色',
    themeDark: '深色',
    themeToggleAria: '切换主题',
    transitSystems: '交通系统',
    boardViews: '视图切换',
    tabMap: '地图',
    tabInsights: '洞察',
    statusSync: '同步',
    statusHold: '保留',
    statusFail: '失败',
    nowPrefix: '当前',
    waitingSnapshot: '等待快照',
    updatedNow: '刚刚更新',
    updatedSecondsAgo: (seconds) => `${seconds} 秒前更新`,
    updatedMinutesAgo: (minutes) => `${minutes} 分钟前更新`,
    station: '站点',
    serviceSummary: '服务摘要',
    boardDirectionView: '到站屏方向视图',
    both: '双向',
    auto: '自动',
    board: '到站屏',
    exit: '退出',
    northbound: '北向 (▲)',
    southbound: '南向 (▼)',
    train: '列车',
    currentMovement: '当前位置',
    closeTrainDialog: '关闭列车详情',
    serviceAlert: '服务告警',
    transitAdvisory: '交通提示',
    closeAlertDialog: '关闭告警详情',
    readOfficialAlert: '查看官方告警',
    arriving: '即将到站',
    todayServiceUnavailable: '今日运营时间不可用',
    todayServiceSpan: (start, end) => `今日 ${start} - ${end}`,
    lastTrip: (time) => `末班 ${time}`,
    endsIn: (duration) => `${duration} 后结束`,
    firstTrip: (time) => `首班 ${time}`,
    startsIn: (duration) => `${duration} 后开始`,
    serviceEnded: (time) => `已于 ${time} 收班`,
    nextStart: (time) => `下次首班 ${time}`,
    noNextServiceLoaded: '暂无下一班服务数据',
    ended: '已结束',
    nextFirstTrip: (time) => `下一次首班 ${time}`,
    noServiceRemainingToday: '今日无剩余服务',
    serviceHoursUnavailable: '运营时间不可用',
    staticScheduleMissing: '当前日期缺少静态时刻表数据',
    unavailable: '不可用',
    serviceSummaryUnavailable: '暂无服务摘要',
    alertsWord: () => '告警',
    scheduled: '按时刻表',
    onTime: '准点',
    unknown: '未知',
    arrivingStatus: '即将到站',
    delayedStatus: '晚点',
    enRoute: '运行中',
    arrivingNow: '正在进站',
    arrivingIn: (time) => `${time} 后到站`,
    nextStopIn: (time) => `下一站 ${time}`,
    active: '运营中',
    noLiveVehicles: (label) => `暂无实时${label}`,
    liveCount: (count, label) => `${count} 辆实时${label}`,
    inServiceCount: (count, label) => `${count} 辆${label}运营中`,
    activeVehicles: (label) => `${label}列表`,
    previous: '上一站',
    now: '当前',
    next: '下一站',
    direction: '方向',
    terminal: '终点',
    etaToTerminal: '到终点 ETA',
    upcomingStops: '后续站点',
    liveEtaNow: '实时 ETA',
    nextStop: '下一站',
    upcoming: '后续',
    noDownstreamEta: '当前暂无这趟列车后续站点 ETA。',
    terminalFallback: '终点',
    loadingArrivals: '正在加载到站信息...',
    noUpcomingVehicles: (label) => `暂无即将到站的${label}`,
    noAdditionalVehicles: (label) => `暂无更多${label}`,
    stopAway: (count) => `还有 ${count} 站`,
    toDestination: (name) => `开往 ${name}`,
    transfers: '换乘',
    checkingNearbyConnections: '正在检查附近可换乘线路...',
    loadingTransferRecommendations: '正在加载换乘建议...',
    closestBoardableConnections: '从本站步行可达的最近可上车连接',
    walkToStop: (minutes, stopName) => `步行 ${minutes} 分钟到 ${stopName}`,
    walkKm: (distanceKm) => `步行 ${distanceKm.toFixed(1)} 公里`,
    walkMeters: (meters) => `步行 ${meters} 米`,
    leaveNow: '现在出发',
    boardInOneMinute: '约 1 分钟后上车',
    boardInMinutes: (minutes) => `约 ${minutes} 分钟后上车`,
    activeAlerts: (count) => `${count} 条生效告警`,
    noActiveAlerts: '当前没有生效告警。',
    noAdditionalAlertDetails: '暂无更多告警详情。',
    affectedLineAlerts: (lineName) => `${lineName} 告警`,
    realtimeOffline: '实时数据离线',
  },
}

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
const dialog = document.querySelector('#station-dialog')
const dialogTitle = document.querySelector('#dialog-title')
const dialogTitleTrack = document.querySelector('#dialog-title-track')
const dialogTitleText = document.querySelector('#dialog-title-text')
const dialogTitleTextClone = document.querySelector('#dialog-title-text-clone')
const dialogServiceSummary = document.querySelector('#dialog-service-summary')
const dialogStatusPillElement = document.querySelector('#dialog-status-pill')
const dialogUpdatedAtElement = document.querySelector('#dialog-updated-at')
const dialogDisplay = document.querySelector('#dialog-display')
const dialogDirectionTabs = [...document.querySelectorAll('[data-dialog-direction]')]
const arrivalsTitleNb = document.querySelector('#arrivals-title-nb')
const arrivalsTitleSb = document.querySelector('#arrivals-title-sb')
const stationAlertsContainer = document.querySelector('#station-alerts-container')
const transferSection = document.querySelector('#transfer-section')
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

function pluralizeVehicleLabel(label) {
  if (/bus$/i.test(label)) {
    return `${label}es`
  }

  return `${label}s`
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
  if (!dateString) return copyValue('waitingSnapshot')

  const deltaSeconds = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 1000))
  if (deltaSeconds < 10) return copyValue('updatedNow')
  if (deltaSeconds < 60) return copyValue('updatedSecondsAgo', deltaSeconds)
  return copyValue('updatedMinutesAgo', Math.round(deltaSeconds / 60))
}

function formatCurrentTime() {
  return new Intl.DateTimeFormat(state.language === 'zh-CN' ? 'zh-CN' : 'en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: state.language !== 'zh-CN',
  }).format(new Date())
}

function formatArrivalTime(offsetSeconds) {
  if (offsetSeconds <= 0) return copyValue('arriving')
  const minutes = Math.floor(offsetSeconds / 60)
  const seconds = offsetSeconds % 60
  if (state.language === 'zh-CN') {
    if (minutes > 0) return `${minutes}分 ${seconds}秒`
    return `${seconds}秒`
  }

  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
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

function getDateKeyWithOffset(offsetDays) {
  const now = new Date()
  now.setDate(now.getDate() + offsetDays)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(now)
}

function parseClockToSeconds(value) {
  const [hours = '0', minutes = '0', seconds = '0'] = String(value).split(':')
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

function getServiceDateTime(dateKey, clockValue) {
  if (!dateKey || !clockValue) return null
  const [year, month, day] = dateKey.split('-').map(Number)
  const totalSeconds = parseClockToSeconds(clockValue)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return new Date(year, month - 1, day, hours, minutes, seconds)
}

function formatDurationFromMs(ms) {
  const totalMinutes = Math.max(0, Math.round(ms / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (state.language === 'zh-CN') {
    if (hours && minutes) return `${hours}小时${minutes}分钟`
    if (hours) return `${hours}小时`
    return `${minutes}分钟`
  }

  if (hours && minutes) return `${hours}h ${minutes}m`
  if (hours) return `${hours}h`
  return `${minutes}m`
}

function formatServiceClock(clockValue) {
  if (!clockValue) return ''
  const [rawHours = '0', rawMinutes = '0'] = String(clockValue).split(':')
  const hours24 = Number(rawHours)
  const minutes = Number(rawMinutes)
  const normalizedHours = ((hours24 % 24) + 24) % 24
  if (state.language === 'zh-CN') {
    return `${String(normalizedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
  const period = normalizedHours >= 12 ? 'PM' : 'AM'
  const hours12 = normalizedHours % 12 || 12
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`
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

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getGlobalCooldownMs() {
  const exponent = Math.max(0, state.obaRateLimitStreak - 1)
  const baseDelayMs = Math.min(OBA_COOLDOWN_MAX_MS, OBA_COOLDOWN_BASE_MS * 2 ** exponent)
  const jitterMs = Math.round(baseDelayMs * (0.15 + Math.random() * 0.2))
  return Math.min(OBA_COOLDOWN_MAX_MS, baseDelayMs + jitterMs)
}

async function waitForObaCooldown() {
  const remainingMs = state.obaCooldownUntil - Date.now()
  if (remainingMs > 0) {
    await sleep(remainingMs)
  }
}

function isRateLimitedPayload(payload) {
  return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
}

async function fetchJsonWithRetry(url, label) {
  for (let attempt = 0; attempt <= OBA_MAX_RETRIES; attempt += 1) {
    await waitForObaCooldown()
    const response = await fetch(url, { cache: 'no-store' })
    let payload = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    const isRateLimitedResponse = response.status === 429 || isRateLimitedPayload(payload)
    if (response.ok && !isRateLimitedResponse) {
      state.obaRateLimitStreak = 0
      state.obaCooldownUntil = 0
      return payload
    }

    if (attempt === OBA_MAX_RETRIES || !isRateLimitedResponse) {
      if (payload?.text) throw new Error(payload.text)
      throw new Error(`${label} request failed with ${response.status}`)
    }

    state.obaRateLimitStreak += 1
    const retryDelayMs = OBA_RETRY_BASE_DELAY_MS * 2 ** attempt
    const cooldownMs = Math.max(retryDelayMs, getGlobalCooldownMs())
    state.obaCooldownUntil = Date.now() + cooldownMs
    await sleep(cooldownMs)
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
    stationIndexByStopId.set(`${line.agencyId}_${stop.id}`, index)
    for (const alias of line.stationAliases?.[stop.id] ?? []) {
      stationIndexByStopId.set(alias, index)
      stationIndexByStopId.set(`${line.agencyId}_${alias}`, index)
    }

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

function inferDirectionSymbol(closestIndex, nextIndex) {
  if (closestIndex != null && nextIndex != null && closestIndex !== nextIndex) {
    return nextIndex < closestIndex ? '▲' : '▼'
  }

  return '•'
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
  return 'OK'
}

function formatDelay(deviationSeconds, isPredicted) {
  if (!isPredicted) {
    return { text: copyValue('scheduled'), colorClass: 'status-muted' }
  }

  if (deviationSeconds >= -30 && deviationSeconds <= 60) {
    return { text: copyValue('onTime'), colorClass: 'status-ontime' }
  }

  if (deviationSeconds > 60) {
    const minutes = Math.round(deviationSeconds / 60)
    let colorClass = 'status-late-minor'
    if (deviationSeconds > 600) {
      colorClass = 'status-late-severe'
    } else if (deviationSeconds > 300) {
      colorClass = 'status-late-moderate'
    }
    return { text: state.language === 'zh-CN' ? `晚点 ${minutes} 分钟` : `+${minutes} min late`, colorClass }
  }

  if (deviationSeconds < -60) {
    const minutes = Math.round(Math.abs(deviationSeconds) / 60)
    return { text: state.language === 'zh-CN' ? `早到 ${minutes} 分钟` : `${minutes} min early`, colorClass: 'status-early' }
  }

  return { text: copyValue('unknown'), colorClass: 'status-muted' }
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

function parseVehicle(rawVehicle, line, layout, tripsById) {
  const tripId = rawVehicle.tripStatus?.activeTripId ?? rawVehicle.tripId ?? ''
  const trip = tripsById.get(tripId)
  if (!trip || trip.routeId !== line.routeKey) return null

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

  const directionSymbol =
    trip.directionId === '1'
      ? '▲'
      : trip.directionId === '0'
        ? '▼'
        : inferDirectionSymbol(closestIndex, nextIndex)

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
    label: rawVehicle.vehicleId.replace(/^\d+_/, ''),
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
    currentIndex,
    upcomingStopIndex,
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

function computeLineHeadways(nb, sb) {
  const sortedNb = [...nb].sort((a, b) => a.minutePosition - b.minutePosition)
  const sortedSb = [...sb].sort((a, b) => a.minutePosition - b.minutePosition)
  const gaps = (sorted) => sorted.slice(1).map((v, i) => Math.round(v.minutePosition - sorted[i].minutePosition))
  return { nbGaps: gaps(sortedNb), sbGaps: gaps(sortedSb) }
}

function computeGapStats(gaps) {
  if (!gaps.length) {
    return { avg: null, max: null, min: null, spread: null, ratio: null }
  }

  const avg = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
  const max = Math.max(...gaps)
  const min = Math.min(...gaps)
  return {
    avg: Math.round(avg),
    max,
    min,
    spread: max - min,
    ratio: max / Math.max(min, 1),
  }
}

function classifyHeadwayHealth(gaps, count) {
  const stats = computeGapStats(gaps)
  if (count < 2 || stats.avg == null) return { health: 'quiet', stats }

  let health = 'healthy'
  if ((stats.max >= 12 && stats.min <= 4) || stats.ratio >= 3) health = 'bunched'
  else if (stats.max >= 12 || stats.spread >= 6) health = 'uneven'
  else if (stats.avg >= 18) health = 'sparse'

  return { health, stats }
}

function summarizeHeadways(gaps, count) {
  if (!gaps.length || count < 2) {
    return {
      averageText: '—',
      detailText: state.language === 'zh-CN'
        ? `${getVehicleLabelPlural()}数量不足，无法判断间隔`
        : `Too few ${getVehicleLabelPlural().toLowerCase()} for a spacing read`,
    }
  }

  const avg = Math.round(gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length)
  const min = Math.min(...gaps)
  const max = Math.max(...gaps)

  return {
    averageText: `~${avg} min`,
    detailText: state.language === 'zh-CN' ? `观测间隔 ${min}-${max} 分钟` : `${min}-${max} min observed gap`,
  }
}

function renderHeadwaySummaryCard(label, gaps, count) {
  const { averageText, detailText } = summarizeHeadways(gaps, count)

  return `
    <div class="headway-health-card">
      <p class="headway-health-label">${label}</p>
      <p class="headway-health-value">${averageText}</p>
      <p class="headway-health-copy">${detailText}</p>
    </div>
  `
}

function getDelayBuckets(vehicles) {
  return vehicles.reduce((acc, vehicle) => {
    const delay = Number(vehicle.scheduleDeviation ?? 0)
    if (delay <= 60) acc.onTime += 1
    else if (delay <= 300) acc.minorLate += 1
    else acc.severeLate += 1
    return acc
  }, { onTime: 0, minorLate: 0, severeLate: 0 })
}

function formatPercent(value, total) {
  if (!total) return '—'
  return `${Math.round((value / total) * 100)}%`
}

function getDirectionBalance(nb, sb) {
  const delta = Math.abs(nb.length - sb.length)
  if (delta <= 1) return { label: state.language === 'zh-CN' ? '均衡' : 'Balanced', tone: 'healthy' }
  if (nb.length > sb.length) return { label: state.language === 'zh-CN' ? '▲ 偏多' : '▲ Heavier', tone: 'warn' }
  return { label: state.language === 'zh-CN' ? '▼ 偏多' : '▼ Heavier', tone: 'warn' }
}

function renderDelayDistribution(delayBuckets, total) {
  const items = [
    [state.language === 'zh-CN' ? '准点' : 'On time', delayBuckets.onTime, 'healthy'],
    [state.language === 'zh-CN' ? '晚点 2-5 分钟' : '2-5 min late', delayBuckets.minorLate, 'warn'],
    [state.language === 'zh-CN' ? '晚点 5+ 分钟' : '5+ min late', delayBuckets.severeLate, 'alert'],
  ]

  return `
    <div class="delay-distribution">
      ${items.map(([label, count, tone]) => `
        <div class="delay-chip delay-chip-${tone}">
          <p class="delay-chip-label">${label}</p>
          <p class="delay-chip-value">${count}</p>
          <p class="delay-chip-copy">${formatPercent(count, total)}</p>
        </div>
      `).join('')}
    </div>
  `
}

function renderFlowLane(label, directionVehicles, layout, lineColor) {
  if (!directionVehicles.length) {
    return `
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${label}</p>
          <p class="flow-lane-copy">${copyValue('noLiveVehicles', getVehicleLabelPlural().toLowerCase())}</p>
        </div>
      </div>
    `
  }

  const sortedVehicles = [...directionVehicles].sort((a, b) => a.minutePosition - b.minutePosition)
  const positions = sortedVehicles.map((vehicle) => {
    const ratio = layout.totalMinutes > 0 ? vehicle.minutePosition / layout.totalMinutes : 0
    return Math.max(0, Math.min(100, ratio * 100))
  })

  return `
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${label}</p>
        <p class="flow-lane-copy">${copyValue('liveCount', sortedVehicles.length, sortedVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${lineColor};">
        ${positions.map((position, index) => `
          <span
            class="flow-vehicle"
            style="left:${position}%; --line-color:${lineColor};"
            title="${sortedVehicles[index].label} · ${formatVehicleSegment(sortedVehicles[index])}"
          ></span>
        `).join('')}
      </div>
    </div>
  `
}

function buildLineExceptions(line, nb, sb, lineAlerts) {
  const exceptions = []
  const { stats: nbStats } = classifyHeadwayHealth(computeLineHeadways(nb, []).nbGaps, nb.length)
  const { stats: sbStats } = classifyHeadwayHealth(computeLineHeadways([], sb).sbGaps, sb.length)
  const severeLateVehicles = [...nb, ...sb].filter((vehicle) => Number(vehicle.scheduleDeviation ?? 0) > 300)
  const imbalance = Math.abs(nb.length - sb.length)

  if (nbStats.max != null && nbStats.max >= 12) {
    exceptions.push({ tone: 'alert', copy: state.language === 'zh-CN' ? `▲ 方向当前有 ${nbStats.max} 分钟的服务空档。` : `Direction ▲ has a ${nbStats.max} min service hole right now.` })
  }
  if (sbStats.max != null && sbStats.max >= 12) {
    exceptions.push({ tone: 'alert', copy: state.language === 'zh-CN' ? `▼ 方向当前有 ${sbStats.max} 分钟的服务空档。` : `Direction ▼ has a ${sbStats.max} min service hole right now.` })
  }
  if (imbalance >= 2) {
    exceptions.push({
      tone: 'warn',
      copy: nb.length > sb.length
        ? state.language === 'zh-CN' ? `车辆分布向 ▲ 方向偏多 ${imbalance} 辆。` : `Vehicle distribution is tilted toward ▲ by ${imbalance}.`
        : state.language === 'zh-CN' ? `车辆分布向 ▼ 方向偏多 ${imbalance} 辆。` : `Vehicle distribution is tilted toward ▼ by ${imbalance}.`,
    })
  }
  if (severeLateVehicles.length) {
    exceptions.push({
      tone: 'warn',
      copy: state.language === 'zh-CN'
        ? `${severeLateVehicles.length} 辆${severeLateVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()}晚点超过 5 分钟。`
        : `${severeLateVehicles.length} ${severeLateVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()} are running 5+ min late.`,
    })
  }
  if (lineAlerts.length) {
    exceptions.push({
      tone: 'info',
      copy: state.language === 'zh-CN'
        ? `${line.name} 当前受 ${lineAlerts.length} 条告警影响。`
        : `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'} affecting ${line.name}.`,
    })
  }

  if (!exceptions.length) {
    exceptions.push({ tone: 'healthy', copy: state.language === 'zh-CN' ? '当前间隔和准点性都比较稳定。' : 'Spacing and punctuality look stable right now.' })
  }

  return exceptions.slice(0, 4)
}

function buildInsightsItems(lines) {
  return lines.map((line) => {
    const layout = state.layouts.get(line.id)
    const vehicles = state.vehiclesByLine.get(line.id) ?? []
    const nb = vehicles.filter((v) => v.directionSymbol === '▲')
    const sb = vehicles.filter((v) => v.directionSymbol === '▼')
    const lineAlerts = getAlertsForLine(line.id)

    return {
      line,
      layout,
      vehicles,
      nb,
      sb,
      lineAlerts,
      exceptions: buildLineExceptions(line, nb, sb, lineAlerts),
    }
  })
}

function computeSystemSummaryMetrics(insightsItems) {
  const totalLines = insightsItems.length
  const totalVehicles = insightsItems.reduce((sum, item) => sum + item.vehicles.length, 0)
  const totalAlerts = insightsItems.reduce((sum, item) => sum + item.lineAlerts.length, 0)
  const impactedLines = insightsItems.filter((item) => item.lineAlerts.length > 0).length
  const allVehicles = insightsItems.flatMap((item) => item.vehicles)
  const delayBuckets = getDelayBuckets(allVehicles)
  const delayedLineIds = new Set(
    insightsItems
      .filter((item) => item.vehicles.some((vehicle) => Number(vehicle.scheduleDeviation ?? 0) > 300))
      .map((item) => item.line.id),
  )
  const unevenLineIds = new Set(
    insightsItems
      .filter((item) => {
        const { nbGaps, sbGaps } = computeLineHeadways(item.nb, item.sb)
        const nbHealth = classifyHeadwayHealth(nbGaps, item.nb.length).health
        const sbHealth = classifyHeadwayHealth(sbGaps, item.sb.length).health
        return [nbHealth, sbHealth].some((health) => health === 'uneven' || health === 'bunched' || health === 'sparse')
      })
      .map((item) => item.line.id),
  )
  const attentionLineCount = new Set([...delayedLineIds, ...unevenLineIds]).size
  const healthyLineCount = Math.max(0, totalLines - attentionLineCount)
  const onTimeRate = totalVehicles ? Math.round((delayBuckets.onTime / totalVehicles) * 100) : null

  const rankedLines = insightsItems
    .map((item) => {
      const { nbGaps, sbGaps } = computeLineHeadways(item.nb, item.sb)
      const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : 0
      const severeLateCount = item.vehicles.filter((vehicle) => Number(vehicle.scheduleDeviation ?? 0) > 300).length
      const score = item.lineAlerts.length * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
      return { line: item.line, score, worstGap, severeLateCount, alertCount: item.lineAlerts.length }
    })
    .sort((left, right) => right.score - left.score || right.worstGap - left.worstGap)

  let topIssue = { tone: 'healthy', copy: state.language === 'zh-CN' ? '当前没有明显的主要问题。' : 'No major active issues right now.' }
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
    delayedLineIds,
    unevenLineIds,
    attentionLineCount,
    healthyLineCount,
    onTimeRate,
    rankedLines,
    topIssue,
  }
}

function formatMetricDelta(current, previous, { suffix = '', invert = false } = {}) {
  if (current == null || previous == null || current === previous) return state.language === 'zh-CN' ? '与上次快照持平' : 'Flat vs last snapshot'

  const delta = current - previous
  const positiveIsGood = invert ? delta < 0 : delta > 0
  const arrow = delta > 0 ? '↑' : '↓'
  return state.language === 'zh-CN'
    ? `${positiveIsGood ? '改善' : '变差'} ${arrow} ${Math.abs(delta)}${suffix}`
    : `${positiveIsGood ? 'Improving' : 'Worse'} ${arrow} ${Math.abs(delta)}${suffix}`
}

function renderSystemSummary(insightsItems) {
  const metrics = computeSystemSummaryMetrics(insightsItems)
  const previousSnapshot = state.systemSnapshots.get(state.activeSystemId)?.previous ?? null

  const exceptions = []
  if (metrics.totalAlerts > 0) {
    exceptions.push({
      tone: 'info',
      copy: state.language === 'zh-CN'
        ? `${metrics.impactedLines} 条线路共受 ${metrics.totalAlerts} 条告警影响。`
        : `${metrics.totalAlerts} active alert${metrics.totalAlerts === 1 ? '' : 's'} across ${metrics.impactedLines} line${metrics.impactedLines === 1 ? '' : 's'}.`,
    })
  }
  if (metrics.delayedLineIds.size > 0) {
    exceptions.push({
      tone: 'warn',
      copy: state.language === 'zh-CN'
        ? `${metrics.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`
        : `${metrics.delayedLineIds.size} line${metrics.delayedLineIds.size === 1 ? '' : 's'} have vehicles running 5+ min late.`,
    })
  }
  if (metrics.unevenLineIds.size > 0) {
    exceptions.push({
      tone: 'alert',
      copy: state.language === 'zh-CN'
        ? `${metrics.unevenLineIds.size} 条线路当前发车间隔不均。`
        : `${metrics.unevenLineIds.size} line${metrics.unevenLineIds.size === 1 ? '' : 's'} show uneven spacing right now.`,
    })
  }
  if (!exceptions.length) {
    exceptions.push({ tone: 'healthy', copy: state.language === 'zh-CN' ? '系统整体稳定，当前没有明显问题。' : 'System looks stable right now with no major active issues.' })
  }

  const trendItems = [
    {
      label: state.language === 'zh-CN' ? '准点率' : 'On-Time Rate',
      value: metrics.onTimeRate != null ? `${metrics.onTimeRate}%` : '—',
      delta: formatMetricDelta(metrics.onTimeRate, previousSnapshot?.onTimeRate, { suffix: '%' }),
    },
    {
      label: state.language === 'zh-CN' ? '需关注线路' : 'Attention Lines',
      value: metrics.attentionLineCount,
      delta: formatMetricDelta(metrics.attentionLineCount, previousSnapshot?.attentionLineCount, { invert: true }),
    },
  ]

  return `
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${getActiveSystemMeta().label[0]}</span>
            <div class="line-title-copy">
              <h2>${getActiveSystemMeta().label} ${state.language === 'zh-CN' ? '概览' : 'Summary'}</h2>
              <p>${state.language === 'zh-CN' ? `系统内 ${metrics.totalLines} 条线路 · 更新于 ${formatCurrentTime()}` : `${metrics.totalLines} line${metrics.totalLines === 1 ? '' : 's'} in system · Updated ${formatCurrentTime()}`}</p>
            </div>
          </div>
        </div>
      </header>
      <div class="system-summary-hero">
        <div class="insight-exception insight-exception-${metrics.topIssue.tone}">
          <p>${metrics.topIssue.copy}</p>
        </div>
        <div class="system-trend-strip">
          ${trendItems.map((item) => `
            <div class="metric-chip system-trend-chip">
              <p class="metric-chip-label">${item.label}</p>
              <p class="metric-chip-value">${item.value}</p>
              <p class="system-trend-copy">${item.delta}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="metric-strip system-summary-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '健康线路' : 'Healthy Lines'}</p>
          <p class="metric-chip-value">${metrics.healthyLineCount}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? `实时${getVehicleLabelPlural()}` : `Live ${getVehicleLabelPlural()}`}</p>
          <p class="metric-chip-value">${metrics.totalVehicles}</p>
        </div>
        <div class="metric-chip ${metrics.totalAlerts ? 'metric-chip-warn' : 'metric-chip-healthy'}">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '告警' : 'Alerts'}</p>
          <p class="metric-chip-value">${metrics.totalAlerts}</p>
        </div>
        <div class="metric-chip ${metrics.attentionLineCount ? 'metric-chip-warn' : 'metric-chip-healthy'}">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '需关注线路' : 'Lines Needing Attention'}</p>
          <p class="metric-chip-value">${metrics.attentionLineCount}</p>
        </div>
      </div>
      <div class="system-ranking">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '关注排名' : 'Attention Ranking'}</p>
          <p class="headway-chart-copy">${state.error ? (state.language === 'zh-CN' ? '实时数据退化，使用最近一次成功快照' : 'Realtime degraded, using last successful snapshot') : (state.language === 'zh-CN' ? '仅基于当前实时快照' : 'Derived from the current live snapshot only')}</p>
        </div>
        <div class="system-ranking-list">
          ${metrics.rankedLines.slice(0, 3).map(({ line, score, worstGap, alertCount, severeLateCount }) => `
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${line.name}</p>
                  <p class="headway-chart-copy">${state.language === 'zh-CN' ? `评分 ${score}${worstGap ? ` · 最大间隔 ${worstGap} 分钟` : ''}${alertCount ? ` · ${alertCount} 条告警` : ''}${severeLateCount ? ` · ${severeLateCount} 辆严重晚点` : ''}` : `Score ${score}${worstGap ? ` · gap ${worstGap} min` : ''}${alertCount ? ` · ${alertCount} alert${alertCount === 1 ? '' : 's'}` : ''}${severeLateCount ? ` · ${severeLateCount} severe late` : ''}`}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '系统状态' : 'System Status'}</p>
          <p class="headway-chart-copy">${state.error ? (state.language === 'zh-CN' ? '实时数据退化，使用最近一次成功快照' : 'Realtime degraded, using last successful snapshot') : (state.language === 'zh-CN' ? '仅基于当前实时快照' : 'Derived from the current live snapshot only')}</p>
        </div>
        ${exceptions.map((item) => `
          <div class="insight-exception insight-exception-${item.tone}">
            <p>${item.copy}</p>
          </div>
        `).join('')}
      </div>
    </article>
  `
}

function buildInsightsTicker(items) {
  const entries = items.flatMap((item) =>
    item.exceptions.map((exception) => ({
      tone: exception.tone,
      copy: `${item.line.name}: ${exception.copy}`,
      lineColor: item.line.color,
    })),
  )

  if (!entries.length) {
    return `
      <section class="insights-ticker insights-ticker-empty" aria-label="${state.language === 'zh-CN' ? '当前洞察摘要' : 'Current insights summary'}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${state.language === 'zh-CN' ? '当前没有活跃问题。' : 'No active issues right now.'}</span>
        </div>
      </section>
    `
  }

  const pageSize = getInsightsTickerPageSize()
  const totalPages = Math.ceil(entries.length / pageSize)
  const activePage = state.insightsTickerIndex % totalPages
  const visibleEntries = entries.slice(activePage * pageSize, activePage * pageSize + pageSize)
  return `
    <section class="insights-ticker" aria-label="${state.language === 'zh-CN' ? '当前洞察摘要' : 'Current insights summary'}">
      <div class="insights-ticker-viewport">
        ${visibleEntries
          .map(
            (entry) => `
              <span class="insights-ticker-item insights-ticker-item-${entry.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${entry.lineColor};"></span>
                <span class="insights-ticker-copy">${entry.copy}</span>
              </span>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function getInsightsTickerPageSize() {
  const visualViewportWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY
  const innerWidth = window.innerWidth || Number.POSITIVE_INFINITY
  const documentWidth = document.documentElement?.clientWidth || Number.POSITIVE_INFINITY
  const viewportWidth = Math.min(innerWidth, visualViewportWidth, documentWidth)

  if (viewportWidth >= 1680) return 3
  if (viewportWidth >= 980) return 2
  return 1
}

function renderLineInsights(line, layout, nb, sb, lineAlerts) {
  const total = nb.length + sb.length
  if (!total) return ''

  const { nbGaps, sbGaps } = computeLineHeadways(nb, sb)
  const delayBuckets = getDelayBuckets([...nb, ...sb])
  const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : null
  const balance = getDirectionBalance(nb, sb)
  const exceptions = buildLineExceptions(line, nb, sb, lineAlerts)
  const impactedStopCount = new Set(lineAlerts.flatMap((alert) => alert.stopIds ?? [])).size

  return `
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '运营中' : 'In Service'}</p>
          <p class="metric-chip-value">${total}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '准点率' : 'On-Time Rate'}</p>
          <p class="metric-chip-value">${formatPercent(delayBuckets.onTime, total)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '最大间隔' : 'Worst Gap'}</p>
          <p class="metric-chip-value">${worstGap != null ? `${worstGap} min` : '—'}</p>
        </div>
        <div class="metric-chip metric-chip-${balance.tone}">
          <p class="metric-chip-label">${state.language === 'zh-CN' ? '方向平衡' : 'Balance'}</p>
          <p class="metric-chip-value">${balance.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${renderHeadwaySummaryCard(state.language === 'zh-CN' ? '▲ 方向' : 'Direction ▲', nbGaps, nb.length)}
        ${renderHeadwaySummaryCard(state.language === 'zh-CN' ? '▼ 方向' : 'Direction ▼', sbGaps, sb.length)}
      </div>
      ${renderDelayDistribution(delayBuckets, total)}
      <div class="flow-grid">
        ${renderFlowLane(state.language === 'zh-CN' ? '▲ 方向流向' : 'Direction ▲ Flow', nb, layout, line.color)}
        ${renderFlowLane(state.language === 'zh-CN' ? '▼ 方向流向' : 'Direction ▼ Flow', sb, layout, line.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '当前' : 'Now'}</p>
          <p class="headway-chart-copy">${lineAlerts.length ? (state.language === 'zh-CN' ? `${lineAlerts.length} 条生效告警${impactedStopCount ? ` · 影响 ${impactedStopCount} 个站点` : ''}` : `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'}${impactedStopCount ? ` · ${impactedStopCount} impacted stops` : ''}`) : (state.language === 'zh-CN' ? '本线路当前没有生效告警' : 'No active alerts on this line')}</p>
        </div>
        ${exceptions.map((item) => `
          <div class="insight-exception insight-exception-${item.tone}">
            <p>${item.copy}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `
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
          <span class="arrival-time"><span class="arrival-countdown">${timeStr}</span><span class="arrival-precision">${precisionInfo}</span></span>
        </span>
      </div>
    `
  }

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

function setDialogDisplayMode(isDisplayMode) {
  state.dialogDisplayMode = isDisplayMode
  dialog.classList.toggle('is-display-mode', isDisplayMode)
  dialogDisplay.textContent = isDisplayMode ? copyValue('exit') : copyValue('board')
  dialogDisplay.setAttribute('aria-label', isDisplayMode ? copyValue('exit') : copyValue('board'))
  state.dialogDisplayDirection = 'both'
  state.dialogDisplayAutoPhase = 'nb'
  renderDialogDirectionView()

  if (dialog.open && state.currentDialogStation) {
    refreshStationDialog(state.currentDialogStation).catch(console.error)
  }

  syncDialogTitleMarquee()
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
    window.clearTimeout(state.dialogRefreshTimer)
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

  const scheduleNextRefresh = () => {
    state.dialogRefreshTimer = window.setTimeout(async () => {
      if (!dialog.open || !state.currentDialogStation) return
      await refreshStationDialog(state.currentDialogStation).catch(console.error)
      scheduleNextRefresh()
    }, DIALOG_REFRESH_INTERVAL_MS)
  }

  scheduleNextRefresh()
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
  const requestedSystemId = getSystemIdFromUrl()
  if (requestedSystemId !== state.activeSystemId) {
    await switchSystem(requestedSystemId, { updateUrl: false, preserveDialog: false })
  }

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
  const lookedUpDirection = line.directionLookup?.[arrival.tripId ?? '']
  if (lookedUpDirection === '1') return 'nb'
  if (lookedUpDirection === '0') return 'sb'

  const headsign = arrival.tripHeadsign ?? ''
  const headsignLower = headsign.toLowerCase()

  if (line.nbTerminusPrefix && headsignLower.startsWith(line.nbTerminusPrefix)) return 'nb'
  if (line.sbTerminusPrefix && headsignLower.startsWith(line.sbTerminusPrefix)) return 'sb'

  if (/Lynnwood|Downtown Redmond/i.test(headsign)) return 'nb'
  if (/Federal Way|South Bellevue/i.test(headsign)) return 'sb'
  return ''
}

function getLineRouteId(line) {
  return line.routeKey ?? `${line.agencyId}_${line.id}`
}

function formatArrivalDestination(arrival) {
  const headsign = arrival.tripHeadsign?.trim()
  if (headsign) return normalizeName(headsign.replace(/^to\s+/i, ''))
  return copyValue('terminalFallback')
}

function getArrivalServiceStatus(arrivalTime, scheduleDeviation) {
  const secondsUntilArrival = Math.floor((arrivalTime - Date.now()) / 1000)

  if (secondsUntilArrival <= 90) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return state.language === 'zh-CN' ? '准点' : 'ON TIME'
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
  const results = []
  const arrivals = []

  for (let index = 0; index < dedupedStopIds.length; index += OBA_ARRIVALS_CONCURRENCY) {
    const batch = dedupedStopIds.slice(index, index + OBA_ARRIVALS_CONCURRENCY)
    const batchResults = await Promise.allSettled(batch.map((stopId) => fetchArrivalsForStop(stopId)))
    results.push(...batchResults)

    if (OBA_INTER_REQUEST_DELAY_MS > 0 && index + OBA_ARRIVALS_CONCURRENCY < dedupedStopIds.length) {
      await sleep(OBA_INTER_REQUEST_DELAY_MS)
    }
  }

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    arrivals.push(...result.value)
  }

  return arrivals
}

function buildArrivalsForLine(arrivalFeed, line, allowedStopIds = null) {
  const now = Date.now()
  const seen = new Set()
  const arrivals = { nb: [], sb: [] }
  const stopIdFilter = allowedStopIds ? new Set(allowedStopIds) : null

  for (const arrival of arrivalFeed) {
    if (arrival.routeId !== getLineRouteId(line)) continue
    if (stopIdFilter && !stopIdFilter.has(arrival.stopId)) continue
    const arrivalTime = arrival.predictedArrivalTime || arrival.scheduledArrivalTime
    if (!arrivalTime || arrivalTime <= now) continue

    const bucket = classifyArrivalDirection(arrival, line)
    if (!bucket) continue

    const dedupeKey = `${arrival.tripId}:${arrival.stopId}:${arrivalTime}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)

    arrivals[bucket].push({
      vehicleId: (arrival.vehicleId || '').replace(/^\d+_/, '') || '--',
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
  const cacheKey = `${state.activeSystemId}:${line.id}:${station.id}`
  const cached = state.arrivalsCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS) {
    return cached.value
  }

  const stopIds = getStationStopIds(station, line)
  const arrivalFeed = prefetchedFeed ?? (await fetchArrivalsForStopIds(stopIds))
  const arrivals = buildArrivalsForLine(arrivalFeed, line, stopIds)
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

function renderStationAlertPills(station) {
  const alerts = getStationDialogAlerts(station)
  if (!alerts.length) {
    stationAlertsContainer.innerHTML = ''
    stationAlertsContainer.hidden = true
    return
  }
  stationAlertsContainer.hidden = false
  stationAlertsContainer.innerHTML = `
    <div class="station-alerts">
      ${alerts
        .map(
          (alert, i) => `
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${formatAlertSeverity(alert.severity)} · ${formatAlertEffect(alert.effect)}</span>
          <span class="station-alert-pill-copy">${alert.title || copyValue('serviceAlert')}</span>
        </button>
      `,
        )
        .join('')}
    </div>
  `
  stationAlertsContainer.querySelectorAll('.station-alert-pill').forEach((button) => {
    const alert = alerts[Number(button.dataset.alertIdx)]
    if (!alert) return
    button.addEventListener('click', () => {
      const line = state.lines.find((l) => alert.lineIds.includes(l.id))
      if (line) renderAlertListDialog(line)
    })
  })
}

async function showStationDialog(station, updateUrl = true) {
  setDialogTitle(station.name)
  renderStationServiceSummary(station)
  state.currentDialogStationId = station.id
  state.currentDialogStation = station

  renderStationAlertPills(station)
  renderTransferRecommendations([], true)
  renderArrivalLists({ nb: [], sb: [] }, true)
  if (updateUrl) {
    setStationParam(station)
  }
  dialog.showModal()
  syncDialogTitleMarquee()
  startDialogAutoRefresh()

  await refreshStationDialog(station)
}

async function refreshStationDialog(station) {
  const requestId = state.activeDialogRequest + 1
  state.activeDialogRequest = requestId

  try {
    const dialogStations = getDialogStations(station)
    const transferCandidates = getNearbyTransferCandidates(station)
    const sharedStopIds = dialogStations.flatMap(({ station: matchedStation, line }) => getStationStopIds(matchedStation, line))
    const transferStopIds = transferCandidates.flatMap(({ stop, line }) => getStationStopIds(stop, line))
    const arrivalFeed = await fetchArrivalsForStopIds([...sharedStopIds, ...transferStopIds])
    const arrivalsByLine = await Promise.all(
      dialogStations.map(({ station: matchedStation, line }) => getArrivalsForStation(matchedStation, line, arrivalFeed)),
    )
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    renderTransferRecommendations(buildTransferRecommendations(transferCandidates, arrivalFeed), false, station)
    renderStationAlertPills(station)
    renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))
  } catch (error) {
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    renderTransferRecommendations([], false, station)
    arrivalsNb.innerHTML = `<div class="arrival-item muted">${error.message}</div>`
    arrivalsSb.innerHTML = `<div class="arrival-item muted">${state.language === 'zh-CN' ? '请稍后重试' : 'Retry in a moment'}</div>`
  }
}

function renderLine(line) {
  const layout = state.layouts.get(line.id)
  const vehicles = state.vehiclesByLine.get(line.id) ?? []
  const lineAlerts = getAlertsForLine(line.id)

  const rows = layout.stations
    .map((station, index) => {
      const prevStation = layout.stations[index - 1]
      const minute = index > 0 ? prevStation.segmentMinutes : ''
      const stationAlerts = getAlertsForStation(station, line)
      const hasAlert = stationAlerts.length > 0
      const alertDotOffset = station.isTerminal ? 15 : 10

      return `
        <g transform="translate(0, ${station.y})" class="station-group${hasAlert ? ' has-alert' : ''}" data-stop-id="${station.id}" style="cursor: pointer;">
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
          ${hasAlert ? `<circle cx="${layout.trackX + alertDotOffset}" cy="-8" r="4" class="station-alert-dot"></circle>` : ''}
          <text x="${layout.labelX}" y="5" class="station-label">${station.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `
    })
    .join('')

  const trainDots = vehicles
    .map((vehicle, index) => {
      const ghostTrail = getVehicleGhostTrail(line.id, vehicle.id)
      return `
        <g transform="translate(${layout.trackX}, 0)" class="train" data-train-id="${vehicle.id}">
          ${ghostTrail
            .map(
              (ghost, ghostIndex) => `
                <circle
                  cy="${ghost.y + ((index % 3) - 1) * 1.5}"
                  r="${Math.max(3, 7 - ghostIndex)}"
                  class="train-ghost-dot"
                  style="--line-color:${line.color}; --ghost-opacity:${Math.max(0.18, 0.56 - ghostIndex * 0.1)};"
                ></circle>
              `,
            )
            .join('')}
          <g transform="translate(0, ${vehicle.y + ((index % 3) - 1) * 1.5})">
            <circle r="13" class="train-wave" style="--line-color:${line.color}; animation-delay:${index * 0.18}s;"></circle>
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}" class="train-arrow" style="--line-color:${line.color};"></path>
          </g>
        </g>
      `
    })
    .join('')

  const vehicleLabel = getVehicleLabel()
  return `
    <article class="line-card" data-line-id="${line.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${line.name}</h2>
              ${renderInlineAlerts(lineAlerts, line.id)}
            </div>
            <p>${copyValue('liveCount', vehicles.length, vehicles.length === 1 ? vehicleLabel.toLowerCase() : getVehicleLabelPlural().toLowerCase())}</p>
            <p>${getTodayServiceSpan(line)}</p>
          </div>
        </div>
        ${renderServiceReminderChip(line)}
      </header>
      ${renderLineStatusMarquee(line.color, vehicles.map((vehicle) => ({ ...vehicle, lineToken: line.name[0] })))}
      <svg viewBox="0 0 460 ${layout.height}" class="line-diagram" role="img" aria-label="${state.language === 'zh-CN' ? `${line.name} 实时线路图` : `${line.name} live LED board`}">
        <line x1="${layout.trackX}" x2="${layout.trackX}" y1="${layout.stations[0].y}" y2="${layout.stations.at(-1).y}" class="spine" style="--line-color:${line.color};"></line>
        ${rows}
        ${trainDots}
      </svg>
    </article>
  `
}

function renderTrainList() {
  const vehicles = getAllVehicles().sort((left, right) => left.minutePosition - right.minutePosition)
  const vehicleLabel = getVehicleLabel()
  const vehicleLabelPlural = getVehicleLabelPlural()
  const vehicleLabelPluralLower = vehicleLabelPlural.toLowerCase()

  if (!vehicles.length) {
    return `
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>${copyValue('activeVehicles', vehicleLabelPlural)}</h2>
          <p>${copyValue('noLiveVehicles', vehicleLabelPluralLower)}</p>
        </article>
      </section>
    `
  }

  const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
  const groupedRows = visibleLines
    .map((line) => {
      const lineVehicles = vehicles.filter((vehicle) => vehicle.lineId === line.id)
      const lineAlerts = getAlertsForLine(line.id)
      const sortedLineVehicles = [...lineVehicles].sort(
        (left, right) => getRealtimeOffset(left.nextOffset ?? 0) - getRealtimeOffset(right.nextOffset ?? 0),
      )
      const focusVehicle = sortedLineVehicles[0] ?? null
      const queueVehicles = sortedLineVehicles.slice(1)
      const renderDirectionBadge = (vehicle) => `
        <span class="train-direction-badge">
          ${vehicle.directionSymbol === '▲'
            ? (state.language === 'zh-CN' ? '▲ 北向' : '▲ Northbound')
            : vehicle.directionSymbol === '▼'
              ? (state.language === 'zh-CN' ? '▼ 南向' : '▼ Southbound')
              : (state.language === 'zh-CN' ? '运营中' : 'Active')}
        </span>
      `
      const renderQueueItem = (vehicle) => `
        <article class="train-list-item train-queue-item" data-train-id="${vehicle.id}">
          <div class="train-list-main">
            <span class="line-token train-list-token" style="--line-color:${vehicle.lineColor};">${vehicle.lineToken}</span>
            <div>
              <div class="train-list-row">
                <p class="train-list-title">${vehicle.lineName} ${vehicleLabel} ${vehicle.label}</p>
                ${renderDirectionBadge(vehicle)}
              </div>
              <p class="train-list-subtitle">${copyValue('toDestination', getVehicleDestinationLabel(vehicle, state.layouts.get(vehicle.lineId)))}</p>
              <p class="train-list-status ${getVehicleStatusClass(vehicle, getRealtimeOffset(vehicle.nextOffset ?? 0))}" data-vehicle-status="${vehicle.id}">${formatVehicleStatus(vehicle)}</p>
            </div>
          </div>
          <div class="train-queue-side">
            <p class="train-queue-time">${formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))}</p>
            <p class="train-queue-clock">${formatEtaClockFromNow(getRealtimeOffset(vehicle.nextOffset ?? 0))}</p>
          </div>
        </article>
      `

      return `
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
              <div class="line-title-copy">
                <div class="line-title-row">
                  <h2>${line.name}</h2>
                  ${renderInlineAlerts(lineAlerts, line.id)}
                </div>
                <p>${copyValue('inServiceCount', lineVehicles.length, lineVehicles.length === 1 ? vehicleLabel.toLowerCase() : getVehicleLabelPlural().toLowerCase())} · ${getTodayServiceSpan(line)}</p>
              </div>
            </div>
            ${renderServiceReminderChip(line)}
          </header>
          ${renderLineStatusMarquee(line.color, lineVehicles)}
          <div class="line-readout train-columns train-stack-layout">
            ${
              focusVehicle
                ? `
                  <article class="train-focus-card train-list-item" data-train-id="${focusVehicle.id}">
                    <div class="train-focus-header">
                      <div>
                        <p class="train-focus-kicker">${state.language === 'zh-CN' ? '最近一班' : 'Next up'}</p>
                        <div class="train-list-row">
                          <p class="train-focus-title">${focusVehicle.lineName} ${vehicleLabel} ${focusVehicle.label}</p>
                          ${renderDirectionBadge(focusVehicle)}
                        </div>
                      </div>
                      <div class="train-focus-side">
                        <p class="train-focus-time">${formatArrivalTime(getRealtimeOffset(focusVehicle.nextOffset ?? 0))}</p>
                        <p class="train-focus-clock">${formatEtaClockFromNow(getRealtimeOffset(focusVehicle.nextOffset ?? 0))}</p>
                      </div>
                    </div>
                    <p class="train-focus-destination">${copyValue('toDestination', getVehicleDestinationLabel(focusVehicle, state.layouts.get(focusVehicle.lineId)))}</p>
                    <p class="train-focus-segment">${formatVehicleLocationSummary(focusVehicle)}</p>
                    ${renderFocusMetrics(focusVehicle)}
                    <p class="train-list-status ${getVehicleStatusClass(focusVehicle, getRealtimeOffset(focusVehicle.nextOffset ?? 0))}" data-vehicle-status="${focusVehicle.id}">${formatVehicleStatus(focusVehicle)}</p>
                  </article>
                `
                : `<p class="train-readout muted">${copyValue('noLiveVehicles', getVehicleLabelPlural().toLowerCase())}</p>`
            }
            ${
              queueVehicles.length
                ? `
                  <div class="train-queue-list">
                    <p class="train-queue-heading">${state.language === 'zh-CN' ? '后续车次' : 'Following vehicles'}</p>
                    ${queueVehicles.map(renderQueueItem).join('')}
                  </div>
                `
                : ''
            }
          </div>
        </article>
      `
    })
    .join('')

  return groupedRows
}

function formatClockTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(state.language === 'zh-CN' ? 'zh-CN' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: state.language !== 'zh-CN',
  })
}

function formatEtaClockFromNow(offsetSeconds) {
  return formatClockTime(Date.now() + Math.max(0, offsetSeconds) * 1000)
}

function getVehicleDestinationLabel(vehicle, layout) {
  const terminalIndex = vehicle.directionSymbol === '▲' ? 0 : layout.stations.length - 1
  return layout.stations[terminalIndex]?.label ?? vehicle.upcomingLabel
}

function getTrainTimelineEntries(vehicle, layout, maxEntries = 6) {
  if (!layout?.stations?.length) return []

  const directionStep = vehicle.directionSymbol === '▲' ? -1 : 1
  const timeline = []
  const seenIndexes = new Set()
  const nextIndex = vehicle.upcomingStopIndex ?? vehicle.currentIndex
  const nextOffset = Math.max(0, vehicle.nextOffset ?? 0)

  const pushEntry = (stationIndex, etaSeconds, { isNext = false, isTerminal = false } = {}) => {
    if (stationIndex == null || seenIndexes.has(stationIndex)) return
    const station = layout.stations[stationIndex]
    if (!station) return
    seenIndexes.add(stationIndex)
    timeline.push({
      id: `${vehicle.id}:${station.id}`,
      label: station.label,
      etaSeconds: Math.max(0, Math.round(etaSeconds)),
      clockTime: formatEtaClockFromNow(etaSeconds),
      isNext,
      isTerminal,
    })
  }

  pushEntry(nextIndex, nextOffset, { isNext: true })

  let runningEtaSeconds = nextOffset
  for (let stationIndex = nextIndex + directionStep; timeline.length < maxEntries; stationIndex += directionStep) {
    if (stationIndex < 0 || stationIndex >= layout.stations.length) break

    const previousIndex = stationIndex - directionStep
    const previousStation = layout.stations[previousIndex]
    runningEtaSeconds += Math.max(0, Math.round((previousStation?.segmentMinutes ?? 0) * 60))
    const isTerminal = stationIndex === 0 || stationIndex === layout.stations.length - 1
    pushEntry(stationIndex, runningEtaSeconds, { isTerminal })
  }

  return timeline
}

function setDialogTitle(title) {
  dialogTitleText.textContent = title
  dialogTitleTextClone.textContent = title
  syncDialogTitleMarquee()
}

function syncDialogTitleMarquee() {
  const title = dialogTitle
  const track = dialogTitleTrack
  if (!title || !track) return

  const shouldMarquee =
    state.dialogDisplayMode &&
    dialog.open &&
    dialogTitleText.scrollWidth > title.clientWidth

  title.classList.toggle('is-marquee', shouldMarquee)
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function getWalkMinutes(distanceKm) {
  return Math.max(1, Math.round((distanceKm / TRANSFER_WALKING_SPEED_KMPH) * 60))
}

function formatWalkDistance(distanceKm) {
  if (distanceKm >= 1) return copyValue('walkKm', distanceKm)
  return copyValue('walkMeters', Math.round(distanceKm * 1000))
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

function getBearingDegrees(origin, target) {
  const lat1 = (origin.lat * Math.PI) / 180
  const lat2 = (target.lat * Math.PI) / 180
  const deltaLon = ((target.lon - origin.lon) * Math.PI) / 180
  const y = Math.sin(deltaLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
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

function renderInsightsBoard() {
  const visibleLines = getVisibleLines()
  const systemInsightsItems = buildInsightsItems(state.lines)
  const vehicleLabel = getVehicleLabel()
  const insightsItems = buildInsightsItems(visibleLines)

  return `
    ${buildInsightsTicker(insightsItems)}
    ${renderSystemSummary(systemInsightsItems)}
    ${insightsItems
      .map(({ line, layout, vehicles, nb, sb, lineAlerts }) => {
        const insightsHtml = renderLineInsights(line, layout, nb, sb, lineAlerts)

        return `
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
              <div class="line-title-copy">
                <h2>${line.name}</h2>
                <p>${copyValue('liveCount', vehicles.length, vehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase())} · ${getTodayServiceSpan(line)}</p>
              </div>
            </div>
            ${renderServiceReminderChip(line)}
          </header>
          ${renderServiceTimeline(line)}
          ${insightsHtml || `<p class="train-readout muted">${state.language === 'zh-CN' ? `等待实时${vehicleLabel.toLowerCase()}数据…` : `Waiting for live ${vehicleLabel.toLowerCase()} data…`}</p>`}
        </article>
      `
      })
      .join('')}
  `
}

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

function closeTrainDialog() {
  state.currentTrainId = ''
  if (trainDialog.open) trainDialog.close()
}

function closeAlertDialog() {
  if (alertDialog.open) alertDialog.close()
}

function renderAlertListDialog(line) {
  const lineAlerts = getAlertsForLine(line.id)
  alertDialogTitle.textContent = copyValue('affectedLineAlerts', line.name, lineAlerts.length)
  alertDialogSubtitle.textContent = copyValue('activeAlerts', lineAlerts.length)
  alertDialogLines.textContent = line.name
  alertDialogBody.textContent = ''
  alertDialogBody.innerHTML = lineAlerts.length
    ? lineAlerts
        .map(
          (alert) => `
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${formatAlertSeverity(alert.severity)} • ${formatAlertEffect(alert.effect)}</p>
              <p class="alert-dialog-item-title">${alert.title || copyValue('serviceAlert')}</p>
              <p class="alert-dialog-item-copy">${alert.description || copyValue('noAdditionalAlertDetails')}</p>
              ${
                alert.url
                  ? `<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${alert.url}" target="_blank" rel="noreferrer">${copyValue('readOfficialAlert')}</a></p>`
                  : ''
              }
            </article>
          `,
        )
        .join('')
    : `<p class="alert-dialog-item-copy">${copyValue('noActiveAlerts')}</p>`
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
  const layout = state.layouts.get(vehicle.lineId)
  const timelineEntries = getTrainTimelineEntries(vehicle, layout)
  const destinationLabel = layout ? getVehicleDestinationLabel(vehicle, layout) : vehicle.upcomingLabel
  const terminalEtaSeconds = timelineEntries.at(-1)?.etaSeconds ?? Math.max(0, vehicle.nextOffset ?? 0)
  const directionLabel = vehicle.directionSymbol === '▲'
    ? (state.language === 'zh-CN' ? '北向' : 'Northbound')
    : vehicle.directionSymbol === '▼'
      ? (state.language === 'zh-CN' ? '南向' : 'Southbound')
      : copyValue('active')

  trainDialogTitle.textContent = `${vehicle.lineName} ${getVehicleLabel()} ${vehicle.label}`
  trainDialogSubtitle.textContent = state.language === 'zh-CN' ? `${directionLabel} · ${copyValue('toDestination', destinationLabel)}` : `${directionLabel} to ${destinationLabel}`
  trainDialogStatus.className = `train-detail-status train-list-status-${getStatusTone(vehicle.serviceStatus)}`
  trainDialogStatus.innerHTML = renderStatusPills(getVehicleStatusPills(vehicle))
  trainDialog.querySelector('.train-eta-panel')?.remove()
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
        <p class="train-detail-label">${copyValue('previous')}</p>
        <p class="train-detail-name">${previousName}</p>
      </div>
    </div>
    <div class="train-detail-stop is-current">
      <span class="train-detail-marker train-detail-marker-ghost"></span>
      <div>
        <p class="train-detail-label">${currentLabel === 'Between' ? (state.language === 'zh-CN' ? '区间' : 'Between') : copyValue('now')}</p>
        <p class="train-detail-name">${currentName}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">${copyValue('next')}</p>
        <p class="train-detail-name">${nextName}</p>
      </div>
    </div>
  `
  trainDialogLine.insertAdjacentHTML(
    'afterend',
    `
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${copyValue('direction')}</p>
            <p class="metric-chip-value">${directionLabel}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${copyValue('terminal')}</p>
            <p class="metric-chip-value">${destinationLabel}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${copyValue('etaToTerminal')}</p>
            <p class="metric-chip-value">${formatArrivalTime(terminalEtaSeconds)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">${copyValue('upcomingStops')}</p>
            <p class="train-eta-header-copy">${copyValue('liveEtaNow')}</p>
          </div>
          ${timelineEntries.length
            ? timelineEntries
              .map(
                (entry) => `
                  <article class="train-eta-stop${entry.isNext ? ' is-next' : ''}${entry.isTerminal ? ' is-terminal' : ''}">
                    <div>
                      <p class="train-eta-stop-label">${entry.isNext ? copyValue('nextStop') : entry.isTerminal ? copyValue('terminal') : copyValue('upcoming')}</p>
                      <p class="train-eta-stop-name">${entry.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${formatArrivalTime(entry.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${entry.clockTime}</p>
                    </div>
                  </article>
                `,
              )
              .join('')
            : `<p class="train-readout muted">${copyValue('noDownstreamEta')}</p>`}
        </div>
      </section>
    `,
  )

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
  arrivalsTitleNb.textContent = copyValue('northbound')
  arrivalsTitleSb.textContent = copyValue('southbound')
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
    boardElement.innerHTML = `${renderLineSwitcher()}${renderInsightsBoard()}`
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

async function loadStaticData() {
  const response = await fetch(DATA_URL, { cache: 'no-store' })
  const payload = await response.json()
  const systems = payload.systems ?? []
  state.systemsById = new Map(systems.map((system) => [system.id, system]))
  state.layoutsBySystem = new Map(
    systems.map((system) => [system.id, new Map(system.lines.map((line) => [line.id, buildLayout(line)]))]),
  )
  applySystem(getSystemIdFromUrl())
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
        .map((vehicle) => parseVehicle(vehicle, line, layout, tripsById))
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

async function init() {
  setLanguage(getPreferredLanguage())
  setTheme(getPreferredTheme())
  updateViewportState()
  await loadStaticData()
  render()
  await refreshVehicles()
  await syncDialogFromUrl()

  window.addEventListener('popstate', () => {
    syncDialogFromUrl().catch(console.error)
  })

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

  window.addEventListener('resize', handleViewportResize)
  window.visualViewport?.addEventListener('resize', handleViewportResize)

  const boardResizeObserver = new ResizeObserver(() => {
    syncCompactLayoutFromBoard()
  })
  boardResizeObserver.observe(boardElement)

  startLiveRefreshLoop()
  startInsightsTickerRotation()
  window.setInterval(() => {
    refreshLiveMeta()
    refreshArrivalCountdowns()
    refreshVehicleStatusMessages()
  }, 1000)
}

init().catch((error) => {
  statusPillElement.textContent = copyValue('statusFail')
  updatedAtElement.textContent = error.message
})
