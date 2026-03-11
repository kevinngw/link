import { DATA_URL, DEFAULT_SYSTEM_ID } from './config'
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

function applySystemState(state, systemId) {
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

export async function loadStaticData({ state, getSystemIdFromUrl }) {
  const STATIC_MAX_RETRIES = 4
  const STATIC_RETRY_BASE_MS = 1_000

  for (let attempt = 0; attempt <= STATIC_MAX_RETRIES; attempt += 1) {
    let response = null
    let payload = null

    try {
      response = await fetch(DATA_URL, { cache: 'no-store' })
      payload = await response.json()
    } catch (error) {
      if (attempt === STATIC_MAX_RETRIES) throw error
      await sleep(STATIC_RETRY_BASE_MS * 2 ** attempt)
      continue
    }

    if (!response.ok) {
      if (attempt === STATIC_MAX_RETRIES) {
        throw new Error(`Static data load failed with ${response.status}`)
      }
      await sleep(STATIC_RETRY_BASE_MS * 2 ** attempt)
      continue
    }

    const systems = payload.systems ?? []
    state.systemsById = new Map(systems.map((system) => [system.id, system]))
    state.layoutsBySystem = new Map(
      systems.map((system) => [system.id, new Map(system.lines.map((line) => [line.id, buildLayout(line)]))]),
    )
    applySystemState(state, getSystemIdFromUrl())
    return
  }
}

export function bootstrapApp({
  getPreferredLanguage,
  getPreferredTheme,
  handleViewportResize,
  loadStaticData,
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
    window.setInterval(() => {
      refreshLiveMeta()
      refreshArrivalCountdowns()
      refreshVehicleStatusMessages()
    }, 1000)
  }
}
