import { DATA_URL, DEFAULT_SYSTEM_ID, SYSTEM_DATA_URL } from './config'
import { normalizeName, sleep } from './utils'

export function buildLayout(line) {
  const orderedStops = [...line.stops].sort((left, right) => right.sequence - left.sequence)
  const stationGap = 48
  const topPadding = 44
  const bottomPadding = 28
  const trackX = 76
  const labelX = 106
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

export function applySystemState(state, systemId) {
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

const STATIC_MAX_RETRIES = 4
const STATIC_RETRY_BASE_MS = 1_000

async function fetchJsonWithRetries(url, errorLabel) {
  for (let attempt = 0; attempt <= STATIC_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (response.ok) return await response.json()
      if (attempt === STATIC_MAX_RETRIES) throw new Error(`${errorLabel} failed with ${response.status}`)
    } catch (error) {
      if (attempt === STATIC_MAX_RETRIES) throw error
    }
    await sleep(STATIC_RETRY_BASE_MS * 2 ** attempt)
  }
  throw new Error(`${errorLabel} failed`)
}

async function loadSystemData(systemId) {
  const payload = await fetchJsonWithRetries(SYSTEM_DATA_URL(systemId), `System data load for ${systemId}`)
  return payload.system
}

async function loadIndex() {
  const payload = await fetchJsonWithRetries(DATA_URL, 'Index load')
  return payload.systems ?? []
}

export async function loadStaticData({ state, getSystemIdFromUrl }) {
  // 加载索引（只包含系统列表）
  const indexSystems = await loadIndex()
  state.systemsById = new Map(indexSystems.map((system) => [system.id, system]))
  state.layoutsBySystem = new Map()

  // 加载默认系统的完整数据
  const targetSystemId = getSystemIdFromUrl()
  const systemToLoad = state.systemsById.has(targetSystemId) ? targetSystemId : DEFAULT_SYSTEM_ID

  const systemData = await loadSystemData(systemToLoad)
  state.systemsById.set(systemToLoad, systemData)
  state.layoutsBySystem.set(
    systemToLoad,
    new Map(systemData.lines.map((line) => [line.id, buildLayout(line)])),
  )

  applySystemState(state, targetSystemId)
}

export async function loadSystemDataById(state, systemId) {
  if (state.systemsById.get(systemId)?.lines) {
    // 已加载过完整数据
    return state.systemsById.get(systemId)
  }

  const systemData = await loadSystemData(systemId)
  state.systemsById.set(systemId, systemData)
  state.layoutsBySystem.set(
    systemId,
    new Map(systemData.lines.map((line) => [line.id, buildLayout(line)])),
  )

  return systemData
}

export function bootstrapApp({
  state,
  getPreferredLanguage,
  getPreferredTheme,
  handleViewportResize,
  loadStaticData,
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
}) {
  return async function init() {
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

    window.addEventListener('resize', handleViewportResize)
    window.visualViewport?.addEventListener('resize', handleViewportResize)

    const boardResizeObserver = new ResizeObserver(() => {
      syncCompactLayoutFromBoard()
    })
    boardResizeObserver.observe(boardElement)

    startLiveRefreshLoop()
    startInsightsTickerRotation()
    state.liveMetaTimer = window.setInterval(() => {
      refreshLiveMeta()
      refreshArrivalCountdowns()
      refreshVehicleStatusMessages()
      refreshVehicleCountdownDisplays()
    }, 1000)
  }
}
