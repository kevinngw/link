/**
 * refreshVehicles.js
 * Extracted vehicle-refresh logic from main.js.
 *
 * Fetches the OBA vehicles-for-agency endpoint, parses vehicles for every
 * loaded line, records ghost trails, computes insights metrics, and pushes
 * the result into the Zustand store.
 *
 * This module intentionally has no React import — it is plain async logic
 * that can be called from hooks or intervals.
 */

import { OBA_BASE_URL, OBA_KEY, SYSTEM_META, DEFAULT_SYSTEM_ID, UI_COPY } from '../config'
import { GHOST_HISTORY_LIMIT, GHOST_MAX_AGE_MS } from '../config'
import { appState } from './appState'
import { fetchJsonWithRetry } from './apiClient'
import { parseVehicle } from '../vehicles'
import {
  classifyHeadwayHealth,
  computeLineHeadways,
  formatPercent,
  getDelayBuckets,
  getLineAttentionReasons,
} from '../insights'
import { getLineRouteId } from '../arrivals'

// ---------------------------------------------------------------------------
// Internal helpers (mirror of main.js implementations)
// ---------------------------------------------------------------------------

function copyValue(key, ...args) {
  const lang = appState.language
  const copy = UI_COPY[lang] ?? UI_COPY.en
  const value = copy[key]
  return typeof value === 'function' ? value(...args) : (value ?? key)
}

function isPageRequestContextActive() {
  return document.visibilityState === 'visible'
}

function getActiveAgencyId() {
  const agencyId = appState.systemsById.get(appState.activeSystemId)?.agencyId
  return agencyId ?? SYSTEM_META[DEFAULT_SYSTEM_ID].agencyId
}

function getVehicleUrl() {
  return `${OBA_BASE_URL}/vehicles-for-agency/${getActiveAgencyId()}.json?key=${OBA_KEY}`
}

function getVehicleLabel() {
  const systemMeta = SYSTEM_META[appState.activeSystemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]
  if (appState.language === 'zh-CN') {
    return systemMeta.vehicleLabel === 'Train' ? '列车' : '公交'
  }
  return systemMeta.vehicleLabel ?? 'Vehicle'
}

function getVehicleLabelPlural() {
  if (appState.language === 'zh-CN') return getVehicleLabel()
  const systemMeta = SYSTEM_META[appState.activeSystemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]
  return systemMeta.vehicleLabelPlural ?? `${getVehicleLabel()}s`
}

function parseSituation(situation) {
  const affectedRouteIds = [
    ...new Set((situation.allAffects ?? []).map((item) => item.routeId).filter(Boolean)),
  ]
  const lineIds = appState.lines
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
    stopIds: [
      ...new Set((situation.allAffects ?? []).map((item) => item.stopId).filter(Boolean)),
    ],
  }
}

function recordVehicleGhosts(lineId, vehicles) {
  const now = Date.now()
  const activeKeys = new Set()

  for (const vehicle of vehicles) {
    const key = `${lineId}:${vehicle.id}`
    activeKeys.add(key)
    const existing = appState.vehicleGhosts.get(key) ?? []
    const nextHistory = [
      ...existing.filter((entry) => now - entry.timestamp <= GHOST_MAX_AGE_MS),
      { y: vehicle.y, minutePosition: vehicle.minutePosition, timestamp: now },
    ].slice(-GHOST_HISTORY_LIMIT)
    appState.vehicleGhosts.set(key, nextHistory)
  }

  for (const [key, history] of appState.vehicleGhosts.entries()) {
    if (!key.startsWith(`${lineId}:`)) continue
    const freshHistory = history.filter((entry) => now - entry.timestamp <= GHOST_MAX_AGE_MS)
    if (!activeKeys.has(key) || freshHistory.length === 0) {
      appState.vehicleGhosts.delete(key)
      continue
    }
    if (freshHistory.length !== history.length) {
      appState.vehicleGhosts.set(key, freshHistory)
    }
  }
}

function buildInsightsItems(lines) {
  return lines.map((line) => {
    const layout = appState.layouts.get(line.id)
    const vehicles = appState.vehiclesByLine.get(line.id) ?? []
    const nb = vehicles.filter((v) => v.directionSymbol === '▲')
    const sb = vehicles.filter((v) => v.directionSymbol === '▼')
    const lineAlerts = appState.alerts.filter((alert) => alert.lineIds.includes(line.id))
    return { line, layout, vehicles, nb, sb, lineAlerts }
  })
}

function computeSystemSummaryMetrics(insightsItems) {
  const totalLines = insightsItems.length
  const totalVehicles = insightsItems.reduce((sum, item) => sum + item.vehicles.length, 0)
  const totalAlerts = insightsItems.reduce((sum, item) => sum + item.lineAlerts.length, 0)
  const impactedLines = insightsItems.filter((item) => item.lineAlerts.length > 0).length
  const impactedStopCount = new Set(
    insightsItems.flatMap((item) => item.lineAlerts.flatMap((alert) => alert.stopIds ?? [])),
  ).size
  const allVehicles = insightsItems.flatMap((item) => item.vehicles)
  const delayBuckets = getDelayBuckets(allVehicles)

  const rankedLines = insightsItems
    .map((item) => {
      const { nbGaps, sbGaps } = computeLineHeadways(item.nb, item.sb)
      const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : 0
      const severeLateCount = item.vehicles.filter(
        (v) => Number(v.scheduleDeviation ?? 0) > 300,
      ).length
      const balanceDelta = Math.abs(item.nb.length - item.sb.length)
      const nbHealth = classifyHeadwayHealth(nbGaps, item.nb.length).health
      const sbHealth = classifyHeadwayHealth(sbGaps, item.sb.length).health
      const isUneven = [nbHealth, sbHealth].some(
        (h) => h === 'uneven' || h === 'bunched' || h === 'sparse',
      )
      const hasSevereLate = severeLateCount > 0
      const score =
        item.lineAlerts.length * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
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
    .sort((a, b) => b.score - a.score || b.worstGap - a.worstGap)

  const delayedLineIds = new Set(
    rankedLines.filter((item) => item.hasSevereLate).map((item) => item.line.id),
  )
  const unevenLineIds = new Set(
    rankedLines.filter((item) => item.isUneven).map((item) => item.line.id),
  )
  const lateOnlyLineCount = rankedLines.filter(
    (item) => item.hasSevereLate && !item.isUneven,
  ).length
  const unevenOnlyLineCount = rankedLines.filter(
    (item) => item.isUneven && !item.hasSevereLate,
  ).length
  const mixedIssueLineCount = rankedLines.filter(
    (item) => item.hasSevereLate && item.isUneven,
  ).length
  const attentionLineCount = new Set([...delayedLineIds, ...unevenLineIds]).size
  const healthyLineCount = Math.max(0, totalLines - attentionLineCount)
  const onTimeRate = totalVehicles
    ? Math.round((delayBuckets.onTime / totalVehicles) * 100)
    : null
  const priorityLines = rankedLines.filter((item) => item.score > 0).slice(0, 2)

  let topIssue = { tone: 'healthy', copy: copyValue('noMajorIssues') }
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
      copy: copyValue(
        'topIssueLate',
        topLine.line.name,
        topLine.severeLateCount,
        topLine.severeLateCount === 1
          ? getVehicleLabel().toLowerCase()
          : getVehicleLabelPlural().toLowerCase(),
      ),
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

// ---------------------------------------------------------------------------
// Public: refreshVehicles
// ---------------------------------------------------------------------------

/**
 * Fetches live vehicle positions, parses them for all loaded lines, records
 * ghost trails, updates system snapshot metrics, and syncs results into the
 * Zustand store.
 *
 * @returns {Promise<void>}
 */
export async function refreshVehicles() {
  if (!isPageRequestContextActive()) return

  // Lazy import to avoid circular dependency at module evaluation time
  const { useAppStore } = await import('../store/useAppStore')
  const store = useAppStore.getState()

  try {
    const payload = await fetchJsonWithRetry(getVehicleUrl(), 'Realtime')

    appState.error = ''
    appState.fetchedAt = new Date().toISOString()
    appState.rawVehicles = payload.data?.list ?? []
    appState.alerts = (payload.data?.references?.situations ?? [])
      .map(parseSituation)
      .filter(Boolean)

    const tripsById = new Map(
      (payload.data?.references?.trips ?? []).map((trip) => [trip.id, trip]),
    )

    for (const line of appState.lines) {
      const layout = appState.layouts.get(line.id)
      const vehicles = appState.rawVehicles
        .map((vehicle) =>
          parseVehicle(vehicle, line, layout, tripsById, {
            language: appState.language,
            copyValue,
          }),
        )
        .filter(Boolean)
      appState.vehiclesByLine.set(line.id, vehicles)
      recordVehicleGhosts(line.id, vehicles)
    }

    const currentMetrics = computeSystemSummaryMetrics(
      buildInsightsItems(appState.lines),
    )
    const snapshot = appState.systemSnapshots.get(appState.activeSystemId)
    appState.systemSnapshots.set(appState.activeSystemId, {
      previous: snapshot?.current ?? null,
      current: currentMetrics,
    })

    store.syncFromAppState()
  } catch (error) {
    appState.error = copyValue('realtimeOffline')

    // Show toast based on error type
    let toastMessage = copyValue('realtimeRequestFailed')
    if (error?.errorType === 'rate-limit') {
      toastMessage = copyValue('realtimeRateLimited')
    } else if (error?.errorType === 'network') {
      toastMessage = copyValue('realtimeNetworkError')
    }

    store.showToast({ message: toastMessage, tone: 'warn' })
    store.setFetchError(appState.error)

    console.error('[refreshVehicles]', error)
  }
}
