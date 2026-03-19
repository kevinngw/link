export function createInsightsRenderers(deps) {
  const {
    state,
    classifyHeadwayHealth,
    computeLineHeadways,
    copyValue,
    elements,
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
  } = deps

  function summarizeHeadways(gaps, count) {
    if (!gaps.length || count < 2) {
      return {
        averageText: '—',
        detailText: copyValue('tooFewForSpacing', getVehicleLabelPlural().toLowerCase()),
      }
    }

    const avg = Math.round(gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length)
    const min = Math.min(...gaps)
    const max = Math.max(...gaps)

    return {
      averageText: `~${avg} min`,
      detailText: copyValue('observedGapRange', min, max),
    }
  }

  function renderHeadwaySummaryCard(label, gaps, count, lineId, direction) {
    const { averageText, detailText } = summarizeHeadways(gaps, count)
    const clickAttrs = lineId ? `data-terminal-line-id="${lineId}" data-terminal-direction="${direction}" role="button" tabindex="0" class="headway-health-card insights-clickable"` : `class="headway-health-card"`

    return `
      <div ${clickAttrs}>
        <p class="headway-health-label">${label}</p>
        <p class="headway-health-value">${averageText}</p>
        <p class="headway-health-copy">${detailText}</p>
      </div>
    `
  }

  function getDirectionBalance(nb, sb) {
    const delta = Math.abs(nb.length - sb.length)
    if (delta <= 1) return { label: copyValue('balanceBalanced'), tone: 'healthy' }
    if (nb.length > sb.length) return { label: copyValue('balanceNorthHeavier'), tone: 'warn' }
    return { label: copyValue('balanceSouthHeavier'), tone: 'warn' }
  }

  function renderDelayDistribution(delayBuckets, total, lineId) {
    const items = [
      [copyValue('delayOnTimeChip'), delayBuckets.onTime, 'healthy', 'delay-ontime'],
      [copyValue('delayMinorChip'), delayBuckets.minorLate, 'warn', 'delay-minor'],
      [copyValue('delaySevereChip'), delayBuckets.severeLate, 'alert', 'delay-severe'],
    ]

    return `
      <div class="delay-distribution">
        ${items.map(([label, count, tone, type]) => `
          <div class="delay-chip delay-chip-${tone}${lineId ? ' insights-clickable' : ''}"${lineId ? ` data-insights-line-id="${lineId}" data-insights-type="${type}" role="button" tabindex="0"` : ''}>
            <p class="delay-chip-label">${label}</p>
            <p class="delay-chip-value">${count}</p>
            <p class="delay-chip-copy">${formatPercent(count, total)}</p>
          </div>
        `).join('')}
      </div>
    `
  }

  function renderFlowLane(label, directionVehicles, layout, lineColor, lineId, directionSymbol) {
    const terminalStation = lineId && layout ? (directionSymbol === '▲' ? layout.stations[0] : layout.stations.at(-1)) : null
    const headerClickAttrs = terminalStation ? `data-terminal-line-id="${lineId}" data-terminal-direction="${directionSymbol === '▲' ? 'nb' : 'sb'}" role="button" tabindex="0" class="flow-lane-header insights-clickable"` : `class="flow-lane-header"`

    if (!directionVehicles.length) {
      return `
        <div class="flow-lane">
          <div ${headerClickAttrs}>
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
        <div ${headerClickAttrs}>
          <p class="flow-lane-title">${label}</p>
          <p class="flow-lane-copy">${copyValue('liveCount', sortedVehicles.length, sortedVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${lineColor};">
          ${positions.map((position, index) => `
            <span
              class="flow-vehicle insights-clickable"
              style="left:${position}%; --line-color:${lineColor};"
              title="${sortedVehicles[index].label}"
              data-train-id="${sortedVehicles[index].id}"
            ></span>
          `).join('')}
        </div>
      </div>
    `
  }

  function buildLineExceptions(line, nb, sb, lineAlerts) {
    const exceptions = []
    const layout = state.layouts.get(line.id)
    const nbDirectionLabel = formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })
    const sbDirectionLabel = formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })
    const { stats: nbStats } = classifyHeadwayHealth(computeLineHeadways(nb, []).nbGaps, nb.length)
    const { stats: sbStats } = classifyHeadwayHealth(computeLineHeadways([], sb).sbGaps, sb.length)
    const severeLateVehicles = [...nb, ...sb].filter((vehicle) => Number(vehicle.scheduleDeviation ?? 0) > 300)
    const imbalance = Math.abs(nb.length - sb.length)

    if (nbStats.max != null && nbStats.max >= 12) {
      exceptions.push({ tone: 'alert', copy: copyValue('serviceHole', nbDirectionLabel, nbStats.max) })
    }
    if (sbStats.max != null && sbStats.max >= 12) {
      exceptions.push({ tone: 'alert', copy: copyValue('serviceHole', sbDirectionLabel, sbStats.max) })
    }
    if (imbalance >= 2) {
      exceptions.push({
        tone: 'warn',
        copy: nb.length > sb.length
          ? copyValue('vehicleTilt', nbDirectionLabel, imbalance)
          : copyValue('vehicleTilt', sbDirectionLabel, imbalance),
      })
    }
    if (severeLateVehicles.length) {
      exceptions.push({ tone: 'warn', copy: copyValue('vehiclesRunningLate', severeLateVehicles.length, severeLateVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()) })
    }
    if (lineAlerts.length) {
      exceptions.push({ tone: 'info', copy: copyValue('alertsAffecting', line.name, lineAlerts.length) })
    }
    if (!exceptions.length) {
      exceptions.push({ tone: 'healthy', copy: copyValue('spacingStable') })
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

      return { line, layout, vehicles, nb, sb, lineAlerts, exceptions: buildLineExceptions(line, nb, sb, lineAlerts) }
    })
  }

  function renderAttentionReasonBadges(reasons) {
    return `
      <div class="attention-reason-badges">
        ${reasons.map((reason) => `<span class="attention-reason-badge attention-reason-badge-${reason.tone}">${reason.label}</span>`).join('')}
      </div>
    `
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
        const attentionReasons = getLineAttentionReasons({ worstGap, severeLateCount, alertCount: item.lineAlerts.length, balanceDelta, copyValue })

        return { line: item.line, score, worstGap, severeLateCount, alertCount: item.lineAlerts.length, balanceDelta, hasSevereLate, isUneven, attentionReasons }
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
    if (topLine?.alertCount) topIssue = { tone: 'info', copy: copyValue('topIssueAlerts', topLine.line.name, topLine.alertCount) }
    else if (topLine?.worstGap >= 12) topIssue = { tone: 'alert', copy: copyValue('topIssueGap', topLine.line.name, topLine.worstGap) }
    else if (topLine?.severeLateCount) topIssue = { tone: 'warn', copy: copyValue('topIssueLate', topLine.line.name, topLine.severeLateCount, topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()) }

    return { totalLines, totalVehicles, totalAlerts, impactedLines, impactedStopCount, delayedLineIds, unevenLineIds, lateOnlyLineCount, unevenOnlyLineCount, mixedIssueLineCount, attentionLineCount, healthyLineCount, onTimeRate, rankedLines, priorityLines, topIssue }
  }

  function formatMetricDelta(current, previous, { suffix = '', invert = false } = {}) {
    if (current == null || previous == null || current === previous) return copyValue('flatVsSnapshot')
    const delta = current - previous
    const positiveIsGood = invert ? delta < 0 : delta > 0
    const arrow = delta > 0 ? '↑' : '↓'
    return `${positiveIsGood ? copyValue('metricImproving') : copyValue('metricWorse')} ${arrow} ${Math.abs(delta)}${suffix}`
  }

  function computeStationHotspots(insightsItems) {
    const stationMap = new Map()

    for (const item of insightsItems) {
      for (const vehicle of item.vehicles) {
        if (!vehicle.currentStopId || !vehicle.isPredicted) continue
        const delay = Number(vehicle.scheduleDeviation ?? 0)
        const key = vehicle.currentStopId

        if (!stationMap.has(key)) {
          stationMap.set(key, {
            stopId: key,
            label: vehicle.currentStopLabel,
            totalDelay: 0,
            worstDelay: 0,
            vehicleCount: 0,
            lines: new Map(),
            vehicles: [],
          })
        }

        const entry = stationMap.get(key)
        entry.totalDelay += delay
        entry.worstDelay = Math.max(entry.worstDelay, delay)
        entry.vehicleCount += 1
        entry.vehicles.push({ ...vehicle, lineName: item.line.name, lineColor: item.line.color })
        if (!entry.lines.has(item.line.id)) {
          entry.lines.set(item.line.id, { name: item.line.name, color: item.line.color })
        }
      }
    }

    return [...stationMap.values()]
      .filter((s) => s.vehicleCount > 0)
      .map((s) => ({ ...s, avgDelay: Math.round(s.totalDelay / s.vehicleCount) }))
      .sort((a, b) => b.avgDelay - a.avgDelay)
      .slice(0, 5)
  }

  function getHotspotTone(avgDelaySeconds) {
    if (avgDelaySeconds > 300) return 'alert'
    if (avgDelaySeconds > 120) return 'warn'
    return 'healthy'
  }

  function renderStationHotspots(hotspots) {
    const hotspotCount = hotspots.filter((s) => s.avgDelay > 120).length

    return `
      <div class="station-hotspots"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('hotspotTitle')}</p><p class="headway-chart-copy">${hotspotCount ? copyValue('hotspotNotableDelays', hotspotCount) : copyValue('hotspotAllNormal')}</p></div>${hotspots.length ? `<div class="station-hotspot-list">${hotspots.map((s) => {
        const tone = getHotspotTone(s.avgDelay)
        const avgMin = Math.round(s.avgDelay / 60)
        const worstMin = Math.round(s.worstDelay / 60)
        const lines = [...s.lines.values()]
        const vehicleLabel = s.vehicleCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()

        return `<div class="station-hotspot-item station-hotspot-item-${tone} insights-clickable" data-insights-type="station-hotspot" data-hotspot-stop-id="${s.stopId}" role="button" tabindex="0"><div class="station-hotspot-main"><p class="station-hotspot-name">${s.label}</p><p class="station-hotspot-meta">${copyValue('hotspotAvgDelay', avgMin)}</p><div class="station-hotspot-lines">${lines.map((l) => `<span class="station-hotspot-line-dot" style="--line-color:${l.color};" title="${l.name}"></span>`).join('')}</div></div><div class="station-hotspot-stats"><p class="station-hotspot-stat-value">${s.vehicleCount}</p><p class="station-hotspot-stat-label">${vehicleLabel}</p><p class="station-hotspot-stat-sub">${copyValue('hotspotWorstDelay', worstMin)}</p></div></div>`
      }).join('')}</div>` : ''}</div>
    `
  }

  function renderSystemSummary(insightsItems) {
    const metrics = computeSystemSummaryMetrics(insightsItems)
    const stationHotspots = computeStationHotspots(insightsItems)
    const previousSnapshot = state.systemSnapshots.get(state.activeSystemId)?.previous ?? null
    const exceptions = []
    if (metrics.totalAlerts > 0) exceptions.push({ tone: 'info', copy: copyValue('alertsAcrossLines', metrics.totalAlerts, metrics.impactedLines) })
    if (metrics.delayedLineIds.size > 0) exceptions.push({ tone: 'warn', copy: copyValue('linesWithLateVehicles', metrics.delayedLineIds.size) })
    if (metrics.unevenLineIds.size > 0) exceptions.push({ tone: 'alert', copy: copyValue('linesUnevenSpacing', metrics.unevenLineIds.size) })
    if (!exceptions.length) exceptions.push({ tone: 'healthy', copy: copyValue('systemStable') })

    const trendItems = [
      { label: copyValue('onTimeRateLabel'), value: metrics.onTimeRate != null ? `${metrics.onTimeRate}%` : '—', delta: formatMetricDelta(metrics.onTimeRate, previousSnapshot?.onTimeRate, { suffix: '%' }) },
      { label: copyValue('attentionLinesLabel'), value: metrics.attentionLineCount, delta: formatMetricDelta(metrics.attentionLineCount, previousSnapshot?.attentionLineCount, { invert: true }) },
    ]

    return `
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${getActiveSystemMeta().label[0]}</span><div class="line-title-copy"><h2>${getActiveSystemMeta().label} ${copyValue('summaryTitle')}</h2><p>${copyValue('systemLinesUpdated', metrics.totalLines, formatCurrentTime())}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${metrics.topIssue.tone}"><p>${metrics.topIssue.copy}</p></div><div class="system-trend-strip">${trendItems.map((item) => `<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${item.label}</p><p class="metric-chip-value">${item.value}</p><p class="system-trend-copy">${item.delta}</p></div>`).join('')}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip insights-clickable" data-insights-type="sys-healthy" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('healthyLinesLabel')}</p><p class="metric-chip-value">${metrics.healthyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-vehicles" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('liveVehiclesLabel', getVehicleLabelPlural())}</p><p class="metric-chip-value">${metrics.totalVehicles}</p></div><div class="metric-chip ${metrics.totalAlerts ? 'metric-chip-warn' : 'metric-chip-healthy'} insights-clickable" data-insights-type="sys-alerts" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('alertsChipLabel')}</p><p class="metric-chip-value">${metrics.totalAlerts}</p></div><div class="metric-chip ${metrics.attentionLineCount ? 'metric-chip-warn' : 'metric-chip-healthy'} insights-clickable" data-insights-type="sys-attention" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('linesNeedingAttention')}</p><p class="metric-chip-value">${metrics.attentionLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-stops" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('impactedStopsChipLabel')}</p><p class="metric-chip-value">${metrics.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('attentionBreakdown')}</p><p class="headway-chart-copy">${copyValue('attentionBreakdownNote')}</p></div><div class="attention-breakdown-grid"><div class="metric-chip insights-clickable" data-insights-type="sys-late-only" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('lateOnlyLabel')}</p><p class="metric-chip-value">${metrics.lateOnlyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-spacing-only" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('spacingOnlyLabel')}</p><p class="metric-chip-value">${metrics.unevenOnlyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-both" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('bothIssuesChipLabel')}</p><p class="metric-chip-value">${metrics.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('recommendedNext')}</p><p class="headway-chart-copy">${copyValue('recommendedNextNote')}</p></div><div class="system-priority-list">${(metrics.priorityLines.length ? metrics.priorityLines : metrics.rankedLines.slice(0, 1)).map(({ line, worstGap, severeLateCount, alertCount, attentionReasons }) => `<div class="system-priority-item insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ranking" role="button" tabindex="0"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${worstGap ? copyValue('gapMinSummary', worstGap) : copyValue('noMajorSpacingIssue')}${severeLateCount ? ` · ${copyValue('severeLateCountText', severeLateCount)}` : ''}${alertCount ? ` · ${copyValue('alertCountText', alertCount)}` : ''}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('attentionRanking')}</p><p class="headway-chart-copy">${state.error ? copyValue('realtimeDegraded') : copyValue('fromLiveSnapshot')}</p></div><div class="system-ranking-list">${metrics.rankedLines.slice(0, 3).map(({ line, score, worstGap, alertCount, severeLateCount, attentionReasons }) => `<div class="system-ranking-item insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ranking" role="button" tabindex="0"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${copyValue('scoreSummary', score)}${worstGap ? ` · ${copyValue('gapMinSummary', worstGap)}` : ''}${alertCount ? ` · ${copyValue('alertCountText', alertCount)}` : ''}${severeLateCount ? ` · ${copyValue('severeLateCountText', severeLateCount)}` : ''}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
        ${renderStationHotspots(stationHotspots)}
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('systemStatusTitle')}</p><p class="headway-chart-copy">${state.error ? copyValue('realtimeDegraded') : copyValue('fromLiveSnapshot')}</p></div>${exceptions.map((item) => `<div class="insight-exception insight-exception-${item.tone}"><p>${item.copy}</p></div>`).join('')}</div>
      </article>
    `
  }

  function buildInsightsTicker(items) {
    const entries = items.flatMap((item) => item.exceptions.map((exception) => ({ tone: exception.tone, copy: `${item.line.name}: ${exception.copy}`, lineColor: item.line.color })))
    if (!entries.length) return `
      <section class="insights-ticker insights-ticker-empty" aria-label="${copyValue('insightsSummaryAria')}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${copyValue('noActiveIssues')}</span></div></section>
    `
    const pageSize = getInsightsTickerPageSize()
    const totalPages = Math.ceil(entries.length / pageSize)
    const activePage = state.insightsTickerIndex % totalPages
    const visibleEntries = entries.slice(activePage * pageSize, activePage * pageSize + pageSize)
    return `
      <section class="insights-ticker" aria-label="${copyValue('insightsSummaryAria')}"><div class="insights-ticker-viewport">${visibleEntries.map((entry) => `<span class="insights-ticker-item insights-ticker-item-${entry.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${entry.lineColor};"></span><span class="insights-ticker-copy">${entry.copy}</span></span>`).join('')}</div></section>
    `
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
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="inservice" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('inServiceLabel')}</p><p class="metric-chip-value">${total}</p></div><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ontime" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('onTimeRateLabel')}</p><p class="metric-chip-value">${formatPercent(delayBuckets.onTime, total)}</p></div><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="gap" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('worstGapLabel')}</p><p class="metric-chip-value">${worstGap != null ? `${worstGap} min` : '—'}</p></div><div class="metric-chip metric-chip-${balance.tone} insights-clickable" data-insights-line-id="${line.id}" data-insights-type="balance" role="button" tabindex="0"><p class="metric-chip-label">${copyValue('balanceChipLabel')}</p><p class="metric-chip-value">${balance.label}</p></div></div><div class="headway-health-grid">${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▲', layout, { includeSymbol: true }), nbGaps, nb.length, line.id, 'nb')}${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▼', layout, { includeSymbol: true }), sbGaps, sb.length, line.id, 'sb')}</div>${renderDelayDistribution(delayBuckets, total, line.id)}<div class="flow-grid">${renderFlowLane(copyValue('directionFlow', formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })), nb, layout, line.color, line.id, '▲')}${renderFlowLane(copyValue('directionFlow', formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })), sb, layout, line.color, line.id, '▼')}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${copyValue('now')}</p><p class="headway-chart-copy">${lineAlerts.length ? copyValue('lineAlertsNote', lineAlerts.length, impactedStopCount) : copyValue('noAlertsOnLine')}</p></div>${exceptions.map((item) => `<div class="insight-exception insight-exception-${item.tone}${item.tone === 'info' && lineAlerts.length ? ' insights-clickable' : ''}"${item.tone === 'info' && lineAlerts.length ? ` data-alert-line-id="${line.id}" role="button" tabindex="0"` : ''}><p>${item.copy}</p></div>`).join('')}</div></div>
    `
  }

  function renderInsightsBoard(visibleLines) {
    const systemInsightsItems = buildInsightsItems(state.lines)
    const vehicleLabel = getVehicleLabel()
    const insightsItems = buildInsightsItems(visibleLines)

    return `
      ${buildInsightsTicker(insightsItems)}
      ${renderSystemSummary(systemInsightsItems)}
      ${insightsItems.map(({ line, layout, vehicles, nb, sb, lineAlerts }) => {
        const insightsHtml = renderLineInsights(line, layout, nb, sb, lineAlerts)
        return `
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><h2>${line.name}</h2><p>${copyValue('liveCount', vehicles.length, vehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase())} · ${getTodayServiceSpan(line)}</p></div></div>${renderServiceReminderChip(line)}</header>
            ${renderServiceTimeline(line)}
            ${insightsHtml || `<p class="train-readout muted">${copyValue('waitingForLiveData', vehicleLabel.toLowerCase())}</p>`}
          </article>
        `
      }).join('')}
    `
  }

  function buildInsightsDetailContent(lineId, type, options = {}) {
    const line = lineId ? state.lines.find((l) => l.id === lineId) : null
    const vehicles = lineId ? (state.vehiclesByLine.get(lineId) ?? []) : []
    const nb = vehicles.filter((v) => v.directionSymbol === '▲')
    const sb = vehicles.filter((v) => v.directionSymbol === '▼')
    const { nbGaps, sbGaps } = lineId ? computeLineHeadways(nb, sb) : { nbGaps: [], sbGaps: [] }
    const layout = lineId ? state.layouts.get(lineId) : null
    const formatVehicleRow = (v) => {
      const delay = Number(v.scheduleDeviation ?? 0)
      const delayText = delay > 300 ? copyValue('delayMinutesText', Math.round(delay / 60)) : delay < -60 ? copyValue('earlyLabel') : copyValue('delayOnTimeChip')
      const tone = delay > 300 ? 'alert' : delay < -60 ? 'info' : 'healthy'
      return `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${v.directionSymbol === '▲' ? copyValue('northboundShort') : copyValue('southboundShort')} · ${copyValue('vehicleWord')} ${v.label}</p><p class="alert-dialog-item-title">${v.currentStopLabel ?? '—'}</p><p class="alert-dialog-item-copy insights-detail-tone-${tone}">${delayText}</p></div>`
    }
    const formatGapList = (gaps, dirLabel) => {
      if (!gaps.length) return `<p class="train-readout muted">${copyValue('noGapDataFor', dirLabel)}</p>`
      return gaps.map((g, i) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${dirLabel} · Gap ${i + 1}</p><p class="alert-dialog-item-title">${g} min</p></div>`).join('')
    }

    if (type === 'inservice' && line) {
      const allV = [...nb, ...sb]
      return { title: copyValue('detailInServiceTitle', line.name), subtitle: copyValue('vehiclesTotal', allV.length), body: allV.length ? allV.map(formatVehicleRow).join('') : `<p class="train-readout muted">${copyValue('noVehicleData')}</p>` }
    }

    if (type === 'ontime' && line) {
      const delayBuckets = getDelayBuckets(vehicles)
      const rate = vehicles.length ? Math.round((delayBuckets.onTime / vehicles.length) * 100) : null
      return { title: copyValue('detailOnTimeTitle', line.name), subtitle: rate != null ? `${rate}%` : '—', body: `<div class="delay-distribution" style="margin-bottom:12px"><div class="delay-chip delay-chip-healthy"><p class="delay-chip-label">${copyValue('delayOnTimeChip')}</p><p class="delay-chip-value">${delayBuckets.onTime}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.onTime, vehicles.length)}</p></div><div class="delay-chip delay-chip-warn"><p class="delay-chip-label">${copyValue('delayMinorChip')}</p><p class="delay-chip-value">${delayBuckets.minorLate}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.minorLate, vehicles.length)}</p></div><div class="delay-chip delay-chip-alert"><p class="delay-chip-label">${copyValue('delaySevereChip')}</p><p class="delay-chip-value">${delayBuckets.severeLate}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.severeLate, vehicles.length)}</p></div></div>${vehicles.map(formatVehicleRow).join('')}` }
    }

    if (type === 'gap' && line) {
      const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : null
      const nbLabel = formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })
      const sbLabel = formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })
      return { title: copyValue('detailSpacingTitle', line.name), subtitle: worstGap != null ? copyValue('worstGapSubtitle', worstGap) : copyValue('noGapData'), body: formatGapList(nbGaps, nbLabel) + formatGapList(sbGaps, sbLabel) }
    }

    if (type === 'balance' && line) {
      const nbLabel = formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })
      const sbLabel = formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })
      return { title: copyValue('detailBalanceTitle', line.name), subtitle: copyValue('directionVehicleCounts', nbLabel, nb.length, sbLabel, sb.length), body: `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${nbLabel}</p><p class="alert-dialog-item-title">${copyValue('vehicleCountUnit', nb.length)}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${sbLabel}</p><p class="alert-dialog-item-title">${copyValue('vehicleCountUnit', sb.length)}</p></div>` }
    }

    if ((type === 'headway-nb' || type === 'headway-sb') && line) {
      const isNb = type === 'headway-nb'
      const gaps = isNb ? nbGaps : sbGaps
      const dirVehicles = isNb ? nb : sb
      const dirLabel = formatLayoutDirectionLabel(isNb ? '▲' : '▼', layout, { includeSymbol: true })
      const avg = gaps.length ? Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length) : null
      return { title: copyValue('detailHeadwayTitle', dirLabel, line.name), subtitle: avg != null ? copyValue('averageMinutes', avg) : copyValue('noGapData'), body: gaps.length ? formatGapList(gaps, dirLabel) : `<p class="train-readout muted">${copyValue('tooFewVehiclesForSpacing')}</p>${dirVehicles.map(formatVehicleRow).join('')}` }
    }

    if ((type === 'delay-ontime' || type === 'delay-minor' || type === 'delay-severe') && line) {
      const bucket = type === 'delay-ontime' ? 'onTime' : type === 'delay-minor' ? 'minorLate' : 'severeLate'
      const filtered = vehicles.filter((v) => {
        const d = Number(v.scheduleDeviation ?? 0)
        if (bucket === 'onTime') return d <= 120 && d >= -60
        if (bucket === 'minorLate') return d > 120 && d <= 300
        return d > 300
      })
      const label = type === 'delay-ontime' ? copyValue('delayOnTimeTitle') : type === 'delay-minor' ? copyValue('delayMinorTitle') : copyValue('delaySevereTitle')
      return { title: `${label} — ${line.name}`, subtitle: copyValue('vehicleCountUnit', filtered.length), body: filtered.length ? filtered.map(formatVehicleRow).join('') : `<p class="train-readout muted">${copyValue('noVehiclesInCategory')}</p>` }
    }

    if (type === 'ranking' && line) {
      const { nbGaps: ng, sbGaps: sg } = computeLineHeadways(nb, sb)
      const worstGap = [...ng, ...sg].length ? Math.max(...ng, ...sg) : 0
      const severeLateCount = vehicles.filter((v) => Number(v.scheduleDeviation ?? 0) > 300).length
      const alertCount = getAlertsForLine(lineId).length
      const balanceDelta = Math.abs(nb.length - sb.length)
      const score = alertCount * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
      const attentionReasons = getLineAttentionReasons({ worstGap, severeLateCount, alertCount, balanceDelta, copyValue })
      return {
        title: copyValue('detailAttentionTitle', line.name),
        subtitle: copyValue('scoreSubtitle', score),
        body: `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${copyValue('scoreChipLabel')}</p><p class="alert-dialog-item-title">${score}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${copyValue('worstGapLabel')}</p><p class="alert-dialog-item-title">${worstGap ? `${worstGap} min` : '—'}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${copyValue('severeLateChipLabel')}</p><p class="alert-dialog-item-title">${severeLateCount}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${copyValue('activeAlertsChipLabel')}</p><p class="alert-dialog-item-title">${alertCount}</p></div>${attentionReasons.map((r) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${copyValue('reasonChipLabel')}</p><p class="alert-dialog-item-title insights-detail-tone-${r.tone}">${r.label}</p></div>`).join('')}`
      }
    }

    if (type === 'station-hotspot' && options.stopId) {
      const allVehiclesAtStop = state.lines.flatMap((l) => {
        const lVehicles = state.vehiclesByLine.get(l.id) ?? []
        return lVehicles
          .filter((v) => v.currentStopId === options.stopId && v.isPredicted)
          .map((v) => ({ ...v, lineName: l.name, lineColor: l.color }))
      })
      const stationLabel = allVehiclesAtStop[0]?.currentStopLabel ?? options.stopId
      const avgDelay = allVehiclesAtStop.length ? Math.round(allVehiclesAtStop.reduce((s, v) => s + Number(v.scheduleDeviation ?? 0), 0) / allVehiclesAtStop.length) : 0
      const avgMin = Math.round(avgDelay / 60)

      const vehicleLabel = allVehiclesAtStop.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()

      return {
        title: copyValue('hotspotDetailTitle', stationLabel),
        subtitle: copyValue('hotspotDetailSubtitle', allVehiclesAtStop.length, vehicleLabel, avgMin),
        body: allVehiclesAtStop.length
          ? allVehiclesAtStop
            .sort((a, b) => Number(b.scheduleDeviation ?? 0) - Number(a.scheduleDeviation ?? 0))
            .map((v) => {
              const delay = Number(v.scheduleDeviation ?? 0)
              const delayMin = Math.round(delay / 60)
              const delayText = delay > 60 ? copyValue('hotspotDelayText', delayMin) : copyValue('onTime')
              const tone = delay > 300 ? 'alert' : delay > 120 ? 'warn' : 'healthy'
              return `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${v.lineColor}">${v.lineName} · ${v.directionSymbol === '▲' ? copyValue('northboundShort') : copyValue('southboundShort')} · ${copyValue('vehicleWord')} ${v.label}</p><p class="alert-dialog-item-title">${v.currentStopLabel}</p><p class="alert-dialog-item-copy insights-detail-tone-${tone}">${delayText}</p></div>`
            }).join('')
          : `<p class="train-readout muted">${copyValue('hotspotNoVehicles')}</p>`,
      }
    }

    // System-level types
    const allInsightsItems = state.lines.map((l) => {
      const lVehicles = state.vehiclesByLine.get(l.id) ?? []
      const lNb = lVehicles.filter((v) => v.directionSymbol === '▲')
      const lSb = lVehicles.filter((v) => v.directionSymbol === '▼')
      const lAlerts = getAlertsForLine(l.id)
      const { nbGaps: lng, sbGaps: lsg } = computeLineHeadways(lNb, lSb)
      const lWorstGap = [...lng, ...lsg].length ? Math.max(...lng, ...lsg) : 0
      const lSevereLate = lVehicles.filter((v) => Number(v.scheduleDeviation ?? 0) > 300).length
      const lNbHealth = classifyHeadwayHealth(lng, lNb.length).health
      const lSbHealth = classifyHeadwayHealth(lsg, lSb.length).health
      const lIsUneven = [lNbHealth, lSbHealth].some((h) => h === 'uneven' || h === 'bunched' || h === 'sparse')
      const lHasSevereLate = lSevereLate > 0
      return { line: l, vehicles: lVehicles, nb: lNb, sb: lSb, alerts: lAlerts, worstGap: lWorstGap, severeLate: lSevereLate, isUneven: lIsUneven, hasSevereLate: lHasSevereLate }
    })

    if (type === 'sys-healthy') {
      const healthy = allInsightsItems.filter((item) => !item.isUneven && !item.hasSevereLate)
      return { title: copyValue('healthyLinesLabel'), subtitle: copyValue('healthyLinesSubtitle', healthy.length), body: healthy.length ? healthy.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${copyValue('vehiclesInServiceText', item.vehicles.length)}</p><p class="alert-dialog-item-copy insights-detail-tone-healthy">${copyValue('spacingPunctualityNormal')}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noHealthyLines')}</p>` }
    }

    if (type === 'sys-vehicles') {
      return { title: copyValue('liveVehiclesLabel', getVehicleLabelPlural()), subtitle: copyValue('vehiclesSystemTotal', allInsightsItems.reduce((s, i) => s + i.vehicles.length, 0)), body: allInsightsItems.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${copyValue('vehicleCountUnit', item.vehicles.length)}</p><p class="alert-dialog-item-copy">${copyValue('nbSbCountsText', item.nb.length, item.sb.length)}</p></div>`).join('') }
    }

    if (type === 'sys-alerts') {
      const linesWithAlerts = allInsightsItems.filter((item) => item.alerts.length > 0)
      return { title: copyValue('activeAlertsChipLabel'), subtitle: copyValue('alertsDetailSubtitle', linesWithAlerts.reduce((s, i) => s + i.alerts.length, 0), linesWithAlerts.length), body: linesWithAlerts.length ? linesWithAlerts.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${copyValue('activeAlertCountText', item.alerts.length)}</p>${item.alerts.map((a) => `<p class="alert-dialog-item-copy">${a.title || copyValue('serviceAlert')}</p>`).join('')}</div>`).join('') : `<p class="train-readout muted">${copyValue('noActiveAlertsNow')}</p>` }
    }

    if (type === 'sys-attention') {
      const attention = allInsightsItems.filter((item) => item.isUneven || item.hasSevereLate)
      return { title: copyValue('linesNeedingAttention'), subtitle: copyValue('attentionLinesSubtitle', attention.length), body: attention.length ? attention.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${item.worstGap ? copyValue('gapMinSummary', item.worstGap) : ''}</p><p class="alert-dialog-item-copy">${[item.hasSevereLate ? copyValue('severelyLateVehicles', item.severeLate) : '', item.isUneven ? copyValue('unevenSpacingText') : ''].filter(Boolean).join(' · ')}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noAttentionLines')}</p>` }
    }

    if (type === 'sys-stops') {
      const allAlerts = allInsightsItems.flatMap((item) => item.alerts)
      const stopIds = [...new Set(allAlerts.flatMap((a) => a.stopIds ?? []))]
      return { title: copyValue('impactedStopsTitle'), subtitle: copyValue('stopsAffected', stopIds.length), body: stopIds.length ? stopIds.map((id) => `<div class="alert-dialog-item"><p class="alert-dialog-item-title">${id}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noImpactedStops')}</p>` }
    }

    if (type === 'sys-late-only') {
      const filtered = allInsightsItems.filter((item) => item.hasSevereLate && !item.isUneven)
      return { title: copyValue('lateOnlyLinesTitle'), subtitle: copyValue('lineCountText', filtered.length), body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title insights-detail-tone-warn">${copyValue('severelyLateVehicles', item.severeLate)}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noLateOnlyLines')}</p>` }
    }

    if (type === 'sys-spacing-only') {
      const filtered = allInsightsItems.filter((item) => item.isUneven && !item.hasSevereLate)
      return { title: copyValue('spacingOnlyLinesTitle'), subtitle: copyValue('lineCountText', filtered.length), body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title insights-detail-tone-alert">${copyValue('gapMinSummary', item.worstGap)}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noSpacingOnlyLines')}</p>` }
    }

    if (type === 'sys-both') {
      const filtered = allInsightsItems.filter((item) => item.hasSevereLate && item.isUneven)
      return { title: copyValue('bothIssuesTitle'), subtitle: copyValue('lineCountText', filtered.length), body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${copyValue('bothIssuesSummary', item.worstGap, item.severeLate)}</p></div>`).join('') : `<p class="train-readout muted">${copyValue('noBothIssueLines')}</p>` }
    }

    return null
  }

  function showInsightsDetail(title, subtitle, bodyHtml) {
    const { insightsDetailTitle, insightsDetailSubtitle, insightsDetailBody, insightsDetailDialog } = elements
    insightsDetailTitle.textContent = title
    insightsDetailSubtitle.textContent = subtitle
    insightsDetailBody.innerHTML = bodyHtml
    if (!insightsDetailDialog.open) insightsDetailDialog.showModal()
  }

  return { renderInsightsBoard, buildInsightsDetailContent, showInsightsDetail }
}
