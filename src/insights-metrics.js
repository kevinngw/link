export function splitVehiclesByDirection(vehicles) {
  return {
    nb: vehicles.filter((vehicle) => vehicle.directionSymbol === '▲'),
    sb: vehicles.filter((vehicle) => vehicle.directionSymbol === '▼'),
  }
}

export function buildInsightsItems({
  lines,
  layouts,
  vehiclesByLine,
  getAlertsForLine,
  decorateItem,
}) {
  return lines.map((line) => {
    const layout = layouts.get(line.id)
    const vehicles = vehiclesByLine.get(line.id) ?? []
    const { nb, sb } = splitVehiclesByDirection(vehicles)
    const lineAlerts = getAlertsForLine(line.id)
    const baseItem = { line, layout, vehicles, nb, sb, lineAlerts }

    return decorateItem
      ? { ...baseItem, ...decorateItem(baseItem) }
      : baseItem
  })
}

export function computeSystemSummaryMetrics({
  insightsItems,
  classifyHeadwayHealth,
  computeLineHeadways,
  copyValue,
  getDelayBuckets,
  getLineAttentionReasons,
  getVehicleLabel,
  getVehicleLabelPlural,
}) {
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

  let topIssue = { tone: 'healthy', copy: copyValue('noMajorIssues') }
  const topLine = rankedLines[0] ?? null
  if (topLine?.alertCount) {
    topIssue = { tone: 'info', copy: copyValue('topIssueAlerts', topLine.line.name, topLine.alertCount) }
  } else if (topLine?.worstGap >= 12) {
    topIssue = { tone: 'alert', copy: copyValue('topIssueGap', topLine.line.name, topLine.worstGap) }
  } else if (topLine?.severeLateCount) {
    const vehicleLabel = topLine.severeLateCount === 1
      ? getVehicleLabel().toLowerCase()
      : getVehicleLabelPlural().toLowerCase()
    topIssue = { tone: 'warn', copy: copyValue('topIssueLate', topLine.line.name, topLine.severeLateCount, vehicleLabel) }
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
