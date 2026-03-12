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
    if (delta <= 1) return { label: state.language === 'zh-CN' ? '均衡' : 'Balanced', tone: 'healthy' }
    if (nb.length > sb.length) return { label: state.language === 'zh-CN' ? '北向偏多' : 'Northbound heavier', tone: 'warn' }
    return { label: state.language === 'zh-CN' ? '南向偏多' : 'Southbound heavier', tone: 'warn' }
  }

  function renderDelayDistribution(delayBuckets, total, lineId) {
    const items = [
      [state.language === 'zh-CN' ? '准点' : 'On time', delayBuckets.onTime, 'healthy', 'delay-ontime'],
      [state.language === 'zh-CN' ? '晚点 2-5 分钟' : '2-5 min late', delayBuckets.minorLate, 'warn', 'delay-minor'],
      [state.language === 'zh-CN' ? '晚点 5+ 分钟' : '5+ min late', delayBuckets.severeLate, 'alert', 'delay-severe'],
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
      exceptions.push({ tone: 'alert', copy: state.language === 'zh-CN' ? `${nbDirectionLabel} 当前有 ${nbStats.max} 分钟的服务空档。` : `${nbDirectionLabel} has a ${nbStats.max} min service hole right now.` })
    }
    if (sbStats.max != null && sbStats.max >= 12) {
      exceptions.push({ tone: 'alert', copy: state.language === 'zh-CN' ? `${sbDirectionLabel} 当前有 ${sbStats.max} 分钟的服务空档。` : `${sbDirectionLabel} has a ${sbStats.max} min service hole right now.` })
    }
    if (imbalance >= 2) {
      exceptions.push({
        tone: 'warn',
        copy: nb.length > sb.length
          ? state.language === 'zh-CN' ? `车辆分布向 ${nbDirectionLabel} 偏多 ${imbalance} 辆。` : `Vehicle distribution is tilted toward ${nbDirectionLabel} by ${imbalance}.`
          : state.language === 'zh-CN' ? `车辆分布向 ${sbDirectionLabel} 偏多 ${imbalance} 辆。` : `Vehicle distribution is tilted toward ${sbDirectionLabel} by ${imbalance}.`,
      })
    }
    if (severeLateVehicles.length) {
      exceptions.push({ tone: 'warn', copy: state.language === 'zh-CN' ? `${severeLateVehicles.length} 辆${severeLateVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()}晚点超过 5 分钟。` : `${severeLateVehicles.length} ${severeLateVehicles.length === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()} are running 5+ min late.` })
    }
    if (lineAlerts.length) {
      exceptions.push({ tone: 'info', copy: state.language === 'zh-CN' ? `${line.name} 当前受 ${lineAlerts.length} 条告警影响。` : `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'} affecting ${line.name}.` })
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
        const attentionReasons = getLineAttentionReasons({ worstGap, severeLateCount, alertCount: item.lineAlerts.length, balanceDelta, language: state.language })

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

    let topIssue = { tone: 'healthy', copy: state.language === 'zh-CN' ? '当前没有明显的主要问题。' : 'No major active issues right now.' }
    const topLine = rankedLines[0] ?? null
    if (topLine?.alertCount) topIssue = { tone: 'info', copy: state.language === 'zh-CN' ? `${topLine.line.name} 当前有 ${topLine.alertCount} 条生效告警。` : `${topLine.line.name} has ${topLine.alertCount} active alert${topLine.alertCount === 1 ? '' : 's'}.` }
    else if (topLine?.worstGap >= 12) topIssue = { tone: 'alert', copy: state.language === 'zh-CN' ? `当前最大实时间隔为空 ${topLine.line.name} 的 ${topLine.worstGap} 分钟。` : `Largest live gap: ${topLine.worstGap} min on ${topLine.line.name}.` }
    else if (topLine?.severeLateCount) topIssue = { tone: 'warn', copy: state.language === 'zh-CN' ? `${topLine.line.name} 有 ${topLine.severeLateCount} 辆${topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()}晚点超过 5 分钟。` : `${topLine.line.name} has ${topLine.severeLateCount} ${topLine.severeLateCount === 1 ? getVehicleLabel().toLowerCase() : getVehicleLabelPlural().toLowerCase()} running 5+ min late.` }

    return { totalLines, totalVehicles, totalAlerts, impactedLines, impactedStopCount, delayedLineIds, unevenLineIds, lateOnlyLineCount, unevenOnlyLineCount, mixedIssueLineCount, attentionLineCount, healthyLineCount, onTimeRate, rankedLines, priorityLines, topIssue }
  }

  function formatMetricDelta(current, previous, { suffix = '', invert = false } = {}) {
    if (current == null || previous == null || current === previous) return state.language === 'zh-CN' ? '与上次快照持平' : 'Flat vs last snapshot'
    const delta = current - previous
    const positiveIsGood = invert ? delta < 0 : delta > 0
    const arrow = delta > 0 ? '↑' : '↓'
    return state.language === 'zh-CN' ? `${positiveIsGood ? '改善' : '变差'} ${arrow} ${Math.abs(delta)}${suffix}` : `${positiveIsGood ? 'Improving' : 'Worse'} ${arrow} ${Math.abs(delta)}${suffix}`
  }

  function renderSystemSummary(insightsItems) {
    const metrics = computeSystemSummaryMetrics(insightsItems)
    const previousSnapshot = state.systemSnapshots.get(state.activeSystemId)?.previous ?? null
    const exceptions = []
    if (metrics.totalAlerts > 0) exceptions.push({ tone: 'info', copy: state.language === 'zh-CN' ? `${metrics.impactedLines} 条线路共受 ${metrics.totalAlerts} 条告警影响。` : `${metrics.totalAlerts} active alert${metrics.totalAlerts === 1 ? '' : 's'} across ${metrics.impactedLines} line${metrics.impactedLines === 1 ? '' : 's'}.` })
    if (metrics.delayedLineIds.size > 0) exceptions.push({ tone: 'warn', copy: state.language === 'zh-CN' ? `${metrics.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。` : `${metrics.delayedLineIds.size} line${metrics.delayedLineIds.size === 1 ? '' : 's'} have vehicles running 5+ min late.` })
    if (metrics.unevenLineIds.size > 0) exceptions.push({ tone: 'alert', copy: state.language === 'zh-CN' ? `${metrics.unevenLineIds.size} 条线路当前发车间隔不均。` : `${metrics.unevenLineIds.size} line${metrics.unevenLineIds.size === 1 ? '' : 's'} show uneven spacing right now.` })
    if (!exceptions.length) exceptions.push({ tone: 'healthy', copy: state.language === 'zh-CN' ? '系统整体稳定，当前没有明显问题。' : 'System looks stable right now with no major active issues.' })

    const trendItems = [
      { label: state.language === 'zh-CN' ? '准点率' : 'On-Time Rate', value: metrics.onTimeRate != null ? `${metrics.onTimeRate}%` : '—', delta: formatMetricDelta(metrics.onTimeRate, previousSnapshot?.onTimeRate, { suffix: '%' }) },
      { label: state.language === 'zh-CN' ? '需关注线路' : 'Attention Lines', value: metrics.attentionLineCount, delta: formatMetricDelta(metrics.attentionLineCount, previousSnapshot?.attentionLineCount, { invert: true }) },
    ]

    return `
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${getActiveSystemMeta().label[0]}</span><div class="line-title-copy"><h2>${getActiveSystemMeta().label} ${state.language === 'zh-CN' ? '概览' : 'Summary'}</h2><p>${state.language === 'zh-CN' ? `系统内 ${metrics.totalLines} 条线路 · 更新于 ${formatCurrentTime()}` : `${metrics.totalLines} line${metrics.totalLines === 1 ? '' : 's'} in system · Updated ${formatCurrentTime()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${metrics.topIssue.tone}"><p>${metrics.topIssue.copy}</p></div><div class="system-trend-strip">${trendItems.map((item) => `<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${item.label}</p><p class="metric-chip-value">${item.value}</p><p class="system-trend-copy">${item.delta}</p></div>`).join('')}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip insights-clickable" data-insights-type="sys-healthy" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '健康线路' : 'Healthy Lines'}</p><p class="metric-chip-value">${metrics.healthyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-vehicles" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? `实时${getVehicleLabelPlural()}` : `Live ${getVehicleLabelPlural()}`}</p><p class="metric-chip-value">${metrics.totalVehicles}</p></div><div class="metric-chip ${metrics.totalAlerts ? 'metric-chip-warn' : 'metric-chip-healthy'} insights-clickable" data-insights-type="sys-alerts" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '告警' : 'Alerts'}</p><p class="metric-chip-value">${metrics.totalAlerts}</p></div><div class="metric-chip ${metrics.attentionLineCount ? 'metric-chip-warn' : 'metric-chip-healthy'} insights-clickable" data-insights-type="sys-attention" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '需关注线路' : 'Lines Needing Attention'}</p><p class="metric-chip-value">${metrics.attentionLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-stops" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '影响站点' : 'Impacted Stops'}</p><p class="metric-chip-value">${metrics.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '需关注线路构成' : 'Attention Breakdown'}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? '按晚点与间隔异常拆解' : 'Split by lateness and spacing issues'}</p></div><div class="attention-breakdown-grid"><div class="metric-chip insights-clickable" data-insights-type="sys-late-only" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '仅晚点' : 'Late Only'}</p><p class="metric-chip-value">${metrics.lateOnlyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-spacing-only" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '仅间隔不均' : 'Spacing Only'}</p><p class="metric-chip-value">${metrics.unevenOnlyLineCount}</p></div><div class="metric-chip insights-clickable" data-insights-type="sys-both" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '两者都有' : 'Both'}</p><p class="metric-chip-value">${metrics.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${state.language === 'zh-CN' ? '' : '<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${state.language === 'zh-CN' ? '基于当前快照的综合优先级' : 'Best next checks from the current snapshot'}</p></div><div class="system-priority-list">${(metrics.priorityLines.length ? metrics.priorityLines : metrics.rankedLines.slice(0, 1)).map(({ line, worstGap, severeLateCount, alertCount, attentionReasons }) => `<div class="system-priority-item insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ranking" role="button" tabindex="0"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? `${worstGap ? `最大间隔 ${worstGap} 分钟` : '当前无明显间隔问题'}${severeLateCount ? ` · ${severeLateCount} 辆严重晚点` : ''}${alertCount ? ` · ${alertCount} 条告警` : ''}` : `${worstGap ? `Gap ${worstGap} min` : 'No major spacing issue'}${severeLateCount ? ` · ${severeLateCount} severe late` : ''}${alertCount ? ` · ${alertCount} alert${alertCount === 1 ? '' : 's'}` : ''}`}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '关注排名' : 'Attention Ranking'}</p><p class="headway-chart-copy">${state.error ? (state.language === 'zh-CN' ? '实时数据退化，使用最近一次成功快照' : 'Realtime degraded, using last successful snapshot') : (state.language === 'zh-CN' ? '仅基于当前实时快照' : 'Derived from the current live snapshot only')}</p></div><div class="system-ranking-list">${metrics.rankedLines.slice(0, 3).map(({ line, score, worstGap, alertCount, severeLateCount, attentionReasons }) => `<div class="system-ranking-item insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ranking" role="button" tabindex="0"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? `评分 ${score}${worstGap ? ` · 最大间隔 ${worstGap} 分钟` : ''}${alertCount ? ` · ${alertCount} 条告警` : ''}${severeLateCount ? ` · ${severeLateCount} 辆严重晚点` : ''}` : `Score ${score}${worstGap ? ` · gap ${worstGap} min` : ''}${alertCount ? ` · ${alertCount} alert${alertCount === 1 ? '' : 's'}` : ''}${severeLateCount ? ` · ${severeLateCount} severe late` : ''}`}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '系统状态' : 'System Status'}</p><p class="headway-chart-copy">${state.error ? (state.language === 'zh-CN' ? '实时数据退化，使用最近一次成功快照' : 'Realtime degraded, using last successful snapshot') : (state.language === 'zh-CN' ? '仅基于当前实时快照' : 'Derived from the current live snapshot only')}</p></div>${exceptions.map((item) => `<div class="insight-exception insight-exception-${item.tone}"><p>${item.copy}</p></div>`).join('')}</div>
      </article>
    `
  }

  function buildInsightsTicker(items) {
    const entries = items.flatMap((item) => item.exceptions.map((exception) => ({ tone: exception.tone, copy: `${item.line.name}: ${exception.copy}`, lineColor: item.line.color })))
    if (!entries.length) return `
      <section class="insights-ticker insights-ticker-empty" aria-label="${state.language === 'zh-CN' ? '当前洞察摘要' : 'Current insights summary'}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${state.language === 'zh-CN' ? '当前没有活跃问题。' : 'No active issues right now.'}</span></div></section>
    `
    const pageSize = getInsightsTickerPageSize()
    const totalPages = Math.ceil(entries.length / pageSize)
    const activePage = state.insightsTickerIndex % totalPages
    const visibleEntries = entries.slice(activePage * pageSize, activePage * pageSize + pageSize)
    return `
      <section class="insights-ticker" aria-label="${state.language === 'zh-CN' ? '当前洞察摘要' : 'Current insights summary'}"><div class="insights-ticker-viewport">${visibleEntries.map((entry) => `<span class="insights-ticker-item insights-ticker-item-${entry.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${entry.lineColor};"></span><span class="insights-ticker-copy">${entry.copy}</span></span>`).join('')}</div></section>
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
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="inservice" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '运营中' : 'In Service'}</p><p class="metric-chip-value">${total}</p></div><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="ontime" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '准点率' : 'On-Time Rate'}</p><p class="metric-chip-value">${formatPercent(delayBuckets.onTime, total)}</p></div><div class="metric-chip insights-clickable" data-insights-line-id="${line.id}" data-insights-type="gap" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '最大间隔' : 'Worst Gap'}</p><p class="metric-chip-value">${worstGap != null ? `${worstGap} min` : '—'}</p></div><div class="metric-chip metric-chip-${balance.tone} insights-clickable" data-insights-line-id="${line.id}" data-insights-type="balance" role="button" tabindex="0"><p class="metric-chip-label">${state.language === 'zh-CN' ? '方向平衡' : 'Balance'}</p><p class="metric-chip-value">${balance.label}</p></div></div><div class="headway-health-grid">${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▲', layout, { includeSymbol: true }), nbGaps, nb.length, line.id, 'nb')}${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▼', layout, { includeSymbol: true }), sbGaps, sb.length, line.id, 'sb')}</div>${renderDelayDistribution(delayBuckets, total, line.id)}<div class="flow-grid">${renderFlowLane(state.language === 'zh-CN' ? `${formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })} 流向` : `${formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })} flow`, nb, layout, line.color, line.id, '▲')}${renderFlowLane(state.language === 'zh-CN' ? `${formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })} 流向` : `${formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })} flow`, sb, layout, line.color, line.id, '▼')}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '当前' : 'Now'}</p><p class="headway-chart-copy">${lineAlerts.length ? (state.language === 'zh-CN' ? `${lineAlerts.length} 条生效告警${impactedStopCount ? ` · 影响 ${impactedStopCount} 个站点` : ''}` : `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'}${impactedStopCount ? ` · ${impactedStopCount} impacted stops` : ''}`) : (state.language === 'zh-CN' ? '本线路当前没有生效告警' : 'No active alerts on this line')}</p></div>${exceptions.map((item) => `<div class="insight-exception insight-exception-${item.tone}${item.tone === 'info' && lineAlerts.length ? ' insights-clickable' : ''}"${item.tone === 'info' && lineAlerts.length ? ` data-alert-line-id="${line.id}" role="button" tabindex="0"` : ''}><p>${item.copy}</p></div>`).join('')}</div></div>
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
            ${insightsHtml || `<p class="train-readout muted">${state.language === 'zh-CN' ? `等待实时${vehicleLabel.toLowerCase()}数据…` : `Waiting for live ${vehicleLabel.toLowerCase()} data…`}</p>`}
          </article>
        `
      }).join('')}
    `
  }

  function buildInsightsDetailContent(lineId, type) {
    const isZh = state.language === 'zh-CN'
    const line = lineId ? state.lines.find((l) => l.id === lineId) : null
    const vehicles = lineId ? (state.vehiclesByLine.get(lineId) ?? []) : []
    const nb = vehicles.filter((v) => v.directionSymbol === '▲')
    const sb = vehicles.filter((v) => v.directionSymbol === '▼')
    const { nbGaps, sbGaps } = lineId ? computeLineHeadways(nb, sb) : { nbGaps: [], sbGaps: [] }
    const layout = lineId ? state.layouts.get(lineId) : null
    const formatVehicleRow = (v) => {
      const delay = Number(v.scheduleDeviation ?? 0)
      const delayText = delay > 300 ? (isZh ? `晚点 ${Math.round(delay / 60)} 分钟` : `${Math.round(delay / 60)} min late`) : delay < -60 ? (isZh ? '早点' : 'Early') : (isZh ? '准点' : 'On time')
      const tone = delay > 300 ? 'alert' : delay < -60 ? 'info' : 'healthy'
      return `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${v.directionSymbol === '▲' ? (isZh ? '北行' : 'Northbound') : (isZh ? '南行' : 'Southbound')} · ${isZh ? '车辆' : 'Vehicle'} ${v.label}</p><p class="alert-dialog-item-title">${v.currentStopLabel ?? '—'}</p><p class="alert-dialog-item-copy insights-detail-tone-${tone}">${delayText}</p></div>`
    }
    const formatGapList = (gaps, dirLabel) => {
      if (!gaps.length) return `<p class="train-readout muted">${isZh ? `${dirLabel} 暂无间隔数据` : `No gap data for ${dirLabel}`}</p>`
      return gaps.map((g, i) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${dirLabel} · Gap ${i + 1}</p><p class="alert-dialog-item-title">${g} min</p></div>`).join('')
    }

    if (type === 'inservice' && line) {
      const allV = [...nb, ...sb]
      return { title: isZh ? `运营中 — ${line.name}` : `In Service — ${line.name}`, subtitle: isZh ? `共 ${allV.length} 辆` : `${allV.length} vehicles total`, body: allV.length ? allV.map(formatVehicleRow).join('') : `<p class="train-readout muted">${isZh ? '暂无车辆数据' : 'No vehicle data'}</p>` }
    }

    if (type === 'ontime' && line) {
      const delayBuckets = getDelayBuckets(vehicles)
      const rate = vehicles.length ? Math.round((delayBuckets.onTime / vehicles.length) * 100) : null
      return { title: isZh ? `准点率 — ${line.name}` : `On-Time Rate — ${line.name}`, subtitle: rate != null ? `${rate}%` : '—', body: `<div class="delay-distribution" style="margin-bottom:12px"><div class="delay-chip delay-chip-healthy"><p class="delay-chip-label">${isZh ? '准点' : 'On time'}</p><p class="delay-chip-value">${delayBuckets.onTime}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.onTime, vehicles.length)}</p></div><div class="delay-chip delay-chip-warn"><p class="delay-chip-label">${isZh ? '晚点 2-5 分钟' : '2-5 min late'}</p><p class="delay-chip-value">${delayBuckets.minorLate}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.minorLate, vehicles.length)}</p></div><div class="delay-chip delay-chip-alert"><p class="delay-chip-label">${isZh ? '晚点 5+ 分钟' : '5+ min late'}</p><p class="delay-chip-value">${delayBuckets.severeLate}</p><p class="delay-chip-copy">${formatPercent(delayBuckets.severeLate, vehicles.length)}</p></div></div>${vehicles.map(formatVehicleRow).join('')}` }
    }

    if (type === 'gap' && line) {
      const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : null
      const nbLabel = formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })
      const sbLabel = formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })
      return { title: isZh ? `间隔详情 — ${line.name}` : `Spacing — ${line.name}`, subtitle: worstGap != null ? (isZh ? `最大间隔 ${worstGap} 分钟` : `Worst gap: ${worstGap} min`) : (isZh ? '暂无间隔数据' : 'No gap data'), body: formatGapList(nbGaps, nbLabel) + formatGapList(sbGaps, sbLabel) }
    }

    if (type === 'balance' && line) {
      const nbLabel = formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })
      const sbLabel = formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })
      return { title: isZh ? `方向平衡 — ${line.name}` : `Direction Balance — ${line.name}`, subtitle: isZh ? `北行 ${nb.length} · 南行 ${sb.length}` : `${nbLabel}: ${nb.length} · ${sbLabel}: ${sb.length}`, body: `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${nbLabel}</p><p class="alert-dialog-item-title">${nb.length} ${isZh ? '辆' : 'vehicle' + (nb.length !== 1 ? 's' : '')}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${sbLabel}</p><p class="alert-dialog-item-title">${sb.length} ${isZh ? '辆' : 'vehicle' + (sb.length !== 1 ? 's' : '')}</p></div>` }
    }

    if ((type === 'headway-nb' || type === 'headway-sb') && line) {
      const isNb = type === 'headway-nb'
      const gaps = isNb ? nbGaps : sbGaps
      const dirVehicles = isNb ? nb : sb
      const dirLabel = formatLayoutDirectionLabel(isNb ? '▲' : '▼', layout, { includeSymbol: true })
      const avg = gaps.length ? Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length) : null
      return { title: isZh ? `${dirLabel} 间隔 — ${line.name}` : `${dirLabel} Spacing — ${line.name}`, subtitle: avg != null ? (isZh ? `平均 ${avg} 分钟` : `Average: ${avg} min`) : (isZh ? '暂无间隔数据' : 'No gap data'), body: gaps.length ? formatGapList(gaps, dirLabel) : `<p class="train-readout muted">${isZh ? '车辆不足，无法计算间隔' : 'Too few vehicles for a spacing read'}</p>${dirVehicles.map(formatVehicleRow).join('')}` }
    }

    if ((type === 'delay-ontime' || type === 'delay-minor' || type === 'delay-severe') && line) {
      const bucket = type === 'delay-ontime' ? 'onTime' : type === 'delay-minor' ? 'minorLate' : 'severeLate'
      const filtered = vehicles.filter((v) => {
        const d = Number(v.scheduleDeviation ?? 0)
        if (bucket === 'onTime') return d <= 120 && d >= -60
        if (bucket === 'minorLate') return d > 120 && d <= 300
        return d > 300
      })
      const label = type === 'delay-ontime' ? (isZh ? '准点' : 'On Time') : type === 'delay-minor' ? (isZh ? '晚点 2-5 分钟' : '2-5 Min Late') : (isZh ? '晚点 5+ 分钟' : '5+ Min Late')
      return { title: `${label} — ${line.name}`, subtitle: isZh ? `${filtered.length} 辆` : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''}`, body: filtered.length ? filtered.map(formatVehicleRow).join('') : `<p class="train-readout muted">${isZh ? '本分类暂无车辆' : 'No vehicles in this category'}</p>` }
    }

    if (type === 'ranking' && line) {
      const { nbGaps: ng, sbGaps: sg } = computeLineHeadways(nb, sb)
      const worstGap = [...ng, ...sg].length ? Math.max(...ng, ...sg) : 0
      const severeLateCount = vehicles.filter((v) => Number(v.scheduleDeviation ?? 0) > 300).length
      const alertCount = getAlertsForLine(lineId).length
      const balanceDelta = Math.abs(nb.length - sb.length)
      const score = alertCount * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
      const attentionReasons = getLineAttentionReasons({ worstGap, severeLateCount, alertCount, balanceDelta, language: state.language })
      return {
        title: isZh ? `关注评分 — ${line.name}` : `Attention Score — ${line.name}`,
        subtitle: isZh ? `综合评分 ${score}` : `Score: ${score}`,
        body: `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${isZh ? '综合评分' : 'Score'}</p><p class="alert-dialog-item-title">${score}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${isZh ? '最大间隔' : 'Worst Gap'}</p><p class="alert-dialog-item-title">${worstGap ? `${worstGap} min` : '—'}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${isZh ? '严重晚点' : 'Severe Late'}</p><p class="alert-dialog-item-title">${severeLateCount}</p></div><div class="alert-dialog-item"><p class="alert-dialog-item-meta">${isZh ? '活跃告警' : 'Active Alerts'}</p><p class="alert-dialog-item-title">${alertCount}</p></div>${attentionReasons.map((r) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta">${isZh ? '关注原因' : 'Reason'}</p><p class="alert-dialog-item-title insights-detail-tone-${r.tone}">${r.label}</p></div>`).join('')}`
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
      return { title: isZh ? '健康线路' : 'Healthy Lines', subtitle: isZh ? `${healthy.length} 条线路运行稳定` : `${healthy.length} line${healthy.length !== 1 ? 's' : ''} running smoothly`, body: healthy.length ? healthy.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${item.vehicles.length} ${isZh ? '辆运营中' : 'in service'}</p><p class="alert-dialog-item-copy insights-detail-tone-healthy">${isZh ? '间隔和准点性均正常' : 'Spacing and punctuality normal'}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有完全健康的线路' : 'No fully healthy lines right now'}</p>` }
    }

    if (type === 'sys-vehicles') {
      return { title: isZh ? `实时${getVehicleLabelPlural()}` : `Live ${getVehicleLabelPlural()}`, subtitle: isZh ? `全系统共 ${allInsightsItems.reduce((s, i) => s + i.vehicles.length, 0)} 辆` : `${allInsightsItems.reduce((s, i) => s + i.vehicles.length, 0)} total`, body: allInsightsItems.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${item.vehicles.length} ${isZh ? '辆' : 'vehicle' + (item.vehicles.length !== 1 ? 's' : '')}</p><p class="alert-dialog-item-copy">${isZh ? `北行 ${item.nb.length} · 南行 ${item.sb.length}` : `NB: ${item.nb.length} · SB: ${item.sb.length}`}</p></div>`).join('') }
    }

    if (type === 'sys-alerts') {
      const linesWithAlerts = allInsightsItems.filter((item) => item.alerts.length > 0)
      return { title: isZh ? '活跃告警' : 'Active Alerts', subtitle: isZh ? `${linesWithAlerts.reduce((s, i) => s + i.alerts.length, 0)} 条告警影响 ${linesWithAlerts.length} 条线路` : `${linesWithAlerts.reduce((s, i) => s + i.alerts.length, 0)} alerts across ${linesWithAlerts.length} line${linesWithAlerts.length !== 1 ? 's' : ''}`, body: linesWithAlerts.length ? linesWithAlerts.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${item.alerts.length} ${isZh ? '条活跃告警' : `active alert${item.alerts.length !== 1 ? 's' : ''}`}</p>${item.alerts.map((a) => `<p class="alert-dialog-item-copy">${a.title || (isZh ? '服务告警' : 'Service alert')}</p>`).join('')}</div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有活跃告警' : 'No active alerts right now'}</p>` }
    }

    if (type === 'sys-attention') {
      const attention = allInsightsItems.filter((item) => item.isUneven || item.hasSevereLate)
      return { title: isZh ? '需关注线路' : 'Lines Needing Attention', subtitle: isZh ? `${attention.length} 条线路` : `${attention.length} line${attention.length !== 1 ? 's' : ''}`, body: attention.length ? attention.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${item.worstGap ? (isZh ? `最大间隔 ${item.worstGap} 分钟` : `Gap ${item.worstGap} min`) : ''}</p><p class="alert-dialog-item-copy">${[item.hasSevereLate ? (isZh ? `${item.severeLate} 辆严重晚点` : `${item.severeLate} severely late`) : '', item.isUneven ? (isZh ? '间隔不均' : 'Uneven spacing') : ''].filter(Boolean).join(' · ')}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有需关注的线路' : 'No lines needing attention right now'}</p>` }
    }

    if (type === 'sys-stops') {
      const allAlerts = allInsightsItems.flatMap((item) => item.alerts)
      const stopIds = [...new Set(allAlerts.flatMap((a) => a.stopIds ?? []))]
      return { title: isZh ? '受影响站点' : 'Impacted Stops', subtitle: isZh ? `${stopIds.length} 个站点受告警影响` : `${stopIds.length} stop${stopIds.length !== 1 ? 's' : ''} affected`, body: stopIds.length ? stopIds.map((id) => `<div class="alert-dialog-item"><p class="alert-dialog-item-title">${id}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有受影响的站点' : 'No impacted stops right now'}</p>` }
    }

    if (type === 'sys-late-only') {
      const filtered = allInsightsItems.filter((item) => item.hasSevereLate && !item.isUneven)
      return { title: isZh ? '仅晚点线路' : 'Late Only Lines', subtitle: isZh ? `${filtered.length} 条线路` : `${filtered.length} line${filtered.length !== 1 ? 's' : ''}`, body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title insights-detail-tone-warn">${item.severeLate} ${isZh ? '辆严重晚点' : `severely late vehicle${item.severeLate !== 1 ? 's' : ''}`}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有仅晚点的线路' : 'No late-only lines right now'}</p>` }
    }

    if (type === 'sys-spacing-only') {
      const filtered = allInsightsItems.filter((item) => item.isUneven && !item.hasSevereLate)
      return { title: isZh ? '仅间隔不均线路' : 'Spacing Only Lines', subtitle: isZh ? `${filtered.length} 条线路` : `${filtered.length} line${filtered.length !== 1 ? 's' : ''}`, body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title insights-detail-tone-alert">${isZh ? `最大间隔 ${item.worstGap} 分钟` : `Gap ${item.worstGap} min`}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有仅间隔不均的线路' : 'No spacing-only lines right now'}</p>` }
    }

    if (type === 'sys-both') {
      const filtered = allInsightsItems.filter((item) => item.hasSevereLate && item.isUneven)
      return { title: isZh ? '晚点且间隔不均' : 'Both Issues', subtitle: isZh ? `${filtered.length} 条线路` : `${filtered.length} line${filtered.length !== 1 ? 's' : ''}`, body: filtered.length ? filtered.map((item) => `<div class="alert-dialog-item"><p class="alert-dialog-item-meta" style="color:${item.line.color}">${item.line.name}</p><p class="alert-dialog-item-title">${isZh ? `最大间隔 ${item.worstGap} 分钟 · ${item.severeLate} 辆严重晚点` : `Gap ${item.worstGap} min · ${item.severeLate} severely late`}</p></div>`).join('') : `<p class="train-readout muted">${isZh ? '当前没有两者都有问题的线路' : 'No lines with both issues right now'}</p>` }
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
