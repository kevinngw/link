export function createInsightsRenderers(deps) {
  const {
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

  function getDirectionBalance(nb, sb) {
    const delta = Math.abs(nb.length - sb.length)
    if (delta <= 1) return { label: state.language === 'zh-CN' ? '均衡' : 'Balanced', tone: 'healthy' }
    if (nb.length > sb.length) return { label: state.language === 'zh-CN' ? '北向偏多' : 'Northbound heavier', tone: 'warn' }
    return { label: state.language === 'zh-CN' ? '南向偏多' : 'Southbound heavier', tone: 'warn' }
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
              title="${sortedVehicles[index].label}"
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
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '健康线路' : 'Healthy Lines'}</p><p class="metric-chip-value">${metrics.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? `实时${getVehicleLabelPlural()}` : `Live ${getVehicleLabelPlural()}`}</p><p class="metric-chip-value">${metrics.totalVehicles}</p></div><div class="metric-chip ${metrics.totalAlerts ? 'metric-chip-warn' : 'metric-chip-healthy'}"><p class="metric-chip-label">${state.language === 'zh-CN' ? '告警' : 'Alerts'}</p><p class="metric-chip-value">${metrics.totalAlerts}</p></div><div class="metric-chip ${metrics.attentionLineCount ? 'metric-chip-warn' : 'metric-chip-healthy'}"><p class="metric-chip-label">${state.language === 'zh-CN' ? '需关注线路' : 'Lines Needing Attention'}</p><p class="metric-chip-value">${metrics.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '影响站点' : 'Impacted Stops'}</p><p class="metric-chip-value">${metrics.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '需关注线路构成' : 'Attention Breakdown'}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? '按晚点与间隔异常拆解' : 'Split by lateness and spacing issues'}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '仅晚点' : 'Late Only'}</p><p class="metric-chip-value">${metrics.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '仅间隔不均' : 'Spacing Only'}</p><p class="metric-chip-value">${metrics.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '两者都有' : 'Both'}</p><p class="metric-chip-value">${metrics.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${state.language === 'zh-CN' ? '' : '<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${state.language === 'zh-CN' ? '基于当前快照的综合优先级' : 'Best next checks from the current snapshot'}</p></div><div class="system-priority-list">${(metrics.priorityLines.length ? metrics.priorityLines : metrics.rankedLines.slice(0, 1)).map(({ line, worstGap, severeLateCount, alertCount, attentionReasons }) => `<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? `${worstGap ? `最大间隔 ${worstGap} 分钟` : '当前无明显间隔问题'}${severeLateCount ? ` · ${severeLateCount} 辆严重晚点` : ''}${alertCount ? ` · ${alertCount} 条告警` : ''}` : `${worstGap ? `Gap ${worstGap} min` : 'No major spacing issue'}${severeLateCount ? ` · ${severeLateCount} severe late` : ''}${alertCount ? ` · ${alertCount} alert${alertCount === 1 ? '' : 's'}` : ''}`}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '关注排名' : 'Attention Ranking'}</p><p class="headway-chart-copy">${state.error ? (state.language === 'zh-CN' ? '实时数据退化，使用最近一次成功快照' : 'Realtime degraded, using last successful snapshot') : (state.language === 'zh-CN' ? '仅基于当前实时快照' : 'Derived from the current live snapshot only')}</p></div><div class="system-ranking-list">${metrics.rankedLines.slice(0, 3).map(({ line, score, worstGap, alertCount, severeLateCount, attentionReasons }) => `<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${line.name}</p><p class="headway-chart-copy">${state.language === 'zh-CN' ? `评分 ${score}${worstGap ? ` · 最大间隔 ${worstGap} 分钟` : ''}${alertCount ? ` · ${alertCount} 条告警` : ''}${severeLateCount ? ` · ${severeLateCount} 辆严重晚点` : ''}` : `Score ${score}${worstGap ? ` · gap ${worstGap} min` : ''}${alertCount ? ` · ${alertCount} alert${alertCount === 1 ? '' : 's'}` : ''}${severeLateCount ? ` · ${severeLateCount} severe late` : ''}`}</p>${renderAttentionReasonBadges(attentionReasons)}</div></div></div>`).join('')}</div></div>
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
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '运营中' : 'In Service'}</p><p class="metric-chip-value">${total}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '准点率' : 'On-Time Rate'}</p><p class="metric-chip-value">${formatPercent(delayBuckets.onTime, total)}</p></div><div class="metric-chip"><p class="metric-chip-label">${state.language === 'zh-CN' ? '最大间隔' : 'Worst Gap'}</p><p class="metric-chip-value">${worstGap != null ? `${worstGap} min` : '—'}</p></div><div class="metric-chip metric-chip-${balance.tone}"><p class="metric-chip-label">${state.language === 'zh-CN' ? '方向平衡' : 'Balance'}</p><p class="metric-chip-value">${balance.label}</p></div></div><div class="headway-health-grid">${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▲', layout, { includeSymbol: true }), nbGaps, nb.length)}${renderHeadwaySummaryCard(formatLayoutDirectionLabel('▼', layout, { includeSymbol: true }), sbGaps, sb.length)}</div>${renderDelayDistribution(delayBuckets, total)}<div class="flow-grid">${renderFlowLane(state.language === 'zh-CN' ? `${formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })} 流向` : `${formatLayoutDirectionLabel('▲', layout, { includeSymbol: true })} flow`, nb, layout, line.color)}${renderFlowLane(state.language === 'zh-CN' ? `${formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })} 流向` : `${formatLayoutDirectionLabel('▼', layout, { includeSymbol: true })} flow`, sb, layout, line.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${state.language === 'zh-CN' ? '当前' : 'Now'}</p><p class="headway-chart-copy">${lineAlerts.length ? (state.language === 'zh-CN' ? `${lineAlerts.length} 条生效告警${impactedStopCount ? ` · 影响 ${impactedStopCount} 个站点` : ''}` : `${lineAlerts.length} active alert${lineAlerts.length === 1 ? '' : 's'}${impactedStopCount ? ` · ${impactedStopCount} impacted stops` : ''}`) : (state.language === 'zh-CN' ? '本线路当前没有生效告警' : 'No active alerts on this line')}</p></div>${exceptions.map((item) => `<div class="insight-exception insight-exception-${item.tone}"><p>${item.copy}</p></div>`).join('')}</div></div>
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

  return { renderInsightsBoard }
}
