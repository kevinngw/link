import {
  classifyHeadwayHealth,
  computeLineHeadways,
  formatPercent,
  getDelayBuckets,
  getLineAttentionReasons,
} from '../../insights'
import { formatCurrentTime as formatCurrentTimeValue } from '../../formatters'

function computeSystemSummaryMetrics(insightsItems, vehicleLabel, vehicleLabelPlural, t) {
  const totalLines = insightsItems.length
  const totalVehicles = insightsItems.reduce((sum, item) => sum + item.vehicles.length, 0)
  const totalAlerts = insightsItems.reduce((sum, item) => sum + item.lineAlerts.length, 0)
  const impactedLines = insightsItems.filter((item) => item.lineAlerts.length > 0).length
  const impactedStopCount = new Set(insightsItems.flatMap((item) => item.lineAlerts.flatMap((alert) => alert.stopIds ?? []))).size
  const allVehicles = insightsItems.flatMap((item) => item.vehicles)
  const delayBuckets = getDelayBuckets(allVehicles)

  const rankedLines = insightsItems.map((item) => {
    const { nbGaps, sbGaps } = computeLineHeadways(item.nb, item.sb)
    const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : 0
    const severeLateCount = item.vehicles.filter((v) => Number(v.scheduleDeviation ?? 0) > 300).length
    const balanceDelta = Math.abs(item.nb.length - item.sb.length)
    const nbHealth = classifyHeadwayHealth(nbGaps, item.nb.length).health
    const sbHealth = classifyHeadwayHealth(sbGaps, item.sb.length).health
    const isUneven = [nbHealth, sbHealth].some((h) => h === 'uneven' || h === 'bunched' || h === 'sparse')
    const hasSevereLate = severeLateCount > 0
    const score = item.lineAlerts.length * 5 + severeLateCount * 3 + Math.max(0, worstGap - 10)
    const attentionReasons = getLineAttentionReasons({ worstGap, severeLateCount, alertCount: item.lineAlerts.length, balanceDelta, copyValue: t })
    return { line: item.line, score, worstGap, severeLateCount, alertCount: item.lineAlerts.length, balanceDelta, hasSevereLate, isUneven, attentionReasons }
  }).sort((a, b) => b.score - a.score || b.worstGap - a.worstGap)

  const delayedLineIds = new Set(rankedLines.filter((item) => item.hasSevereLate).map((item) => item.line.id))
  const unevenLineIds = new Set(rankedLines.filter((item) => item.isUneven).map((item) => item.line.id))
  const lateOnlyLineCount = rankedLines.filter((item) => item.hasSevereLate && !item.isUneven).length
  const unevenOnlyLineCount = rankedLines.filter((item) => item.isUneven && !item.hasSevereLate).length
  const mixedIssueLineCount = rankedLines.filter((item) => item.hasSevereLate && item.isUneven).length
  const attentionLineCount = new Set([...delayedLineIds, ...unevenLineIds]).size
  const healthyLineCount = Math.max(0, totalLines - attentionLineCount)
  const onTimeRate = totalVehicles ? Math.round((delayBuckets.onTime / totalVehicles) * 100) : null
  const priorityLines = rankedLines.filter((item) => item.score > 0).slice(0, 2)

  let topIssue = { tone: 'healthy', copy: t('noMajorIssues') }
  const topLine = rankedLines[0] ?? null
  if (topLine?.alertCount) {
    topIssue = { tone: 'info', copy: t('topIssueAlerts', topLine.line.name, topLine.alertCount) }
  } else if (topLine?.worstGap >= 12) {
    topIssue = { tone: 'alert', copy: t('topIssueGap', topLine.line.name, topLine.worstGap) }
  } else if (topLine?.severeLateCount) {
    topIssue = { tone: 'warn', copy: t('topIssueLate', topLine.line.name, topLine.severeLateCount, topLine.severeLateCount === 1 ? vehicleLabel.toLowerCase() : vehicleLabelPlural.toLowerCase()) }
  }

  return { totalLines, totalVehicles, totalAlerts, impactedLines, impactedStopCount, delayedLineIds, unevenLineIds, lateOnlyLineCount, unevenOnlyLineCount, mixedIssueLineCount, attentionLineCount, healthyLineCount, onTimeRate, rankedLines, priorityLines, topIssue }
}

export function InsightsSystemSummary({
  items,
  systemMeta,
  systemSnapshots,
  error,
  fetchedAt,
  vehicleLabel,
  vehicleLabelPlural,
  t,
  language,
  onInsightsClick,
  onTrainClick,
}) {
  if (!items.length) return null

  const metrics = computeSystemSummaryMetrics(items, vehicleLabel, vehicleLabelPlural, t)
  const previousSnapshot = systemSnapshots.get(systemMeta.id)?.previous ?? null

  const exceptions = []
  if (metrics.totalAlerts > 0) exceptions.push({ tone: 'info', copy: t('alertsAcrossLines', metrics.totalAlerts, metrics.impactedLines) })
  if (metrics.delayedLineIds.size > 0) exceptions.push({ tone: 'warn', copy: t('linesWithLateVehicles', metrics.delayedLineIds.size) })
  if (metrics.unevenLineIds.size > 0) exceptions.push({ tone: 'alert', copy: t('linesUnevenSpacing', metrics.unevenLineIds.size) })
  if (!exceptions.length) exceptions.push({ tone: 'healthy', copy: t('systemStable') })

  function formatMetricDelta(current, previous, { suffix = '', invert = false } = {}) {
    if (current == null || previous == null || current === previous) return t('flatVsSnapshot')
    const delta = current - previous
    const positiveIsGood = invert ? delta < 0 : delta > 0
    const arrow = delta > 0 ? '↑' : '↓'
    return `${positiveIsGood ? t('metricImproving') : t('metricWorse')} ${arrow} ${Math.abs(delta)}${suffix}`
  }

  const trendItems = [
    { label: t('onTimeRateLabel'), value: metrics.onTimeRate != null ? `${metrics.onTimeRate}%` : '—', delta: formatMetricDelta(metrics.onTimeRate, previousSnapshot?.onTimeRate, { suffix: '%' }) },
    { label: t('attentionLinesLabel'), value: metrics.attentionLineCount, delta: formatMetricDelta(metrics.attentionLineCount, previousSnapshot?.attentionLineCount, { invert: true }) },
  ]

  const currentTime = formatCurrentTimeValue(language)
  const priorityList = metrics.priorityLines.length ? metrics.priorityLines : metrics.rankedLines.slice(0, 1)

  return (
    <article className="panel-card panel-card-wide system-summary-card">
      <header className="panel-header">
        <div className="system-summary-header">
          <div className="line-title">
            <span className="line-token" style={{ '--line-color': 'var(--accent-strong)' }}>{systemMeta.label[0]}</span>
            <div className="line-title-copy">
              <h2>{systemMeta.label} {t('summaryTitle')}</h2>
              <p>{t('systemLinesUpdated', metrics.totalLines, currentTime)}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="system-summary-hero">
        <div className={`insight-exception insight-exception-${metrics.topIssue.tone}`}>
          <p>{metrics.topIssue.copy}</p>
        </div>
        <div className="system-trend-strip">
          {trendItems.map((item, i) => (
            <div key={i} className="metric-chip system-trend-chip">
              <p className="metric-chip-label">{item.label}</p>
              <p className="metric-chip-value">{item.value}</p>
              <p className="system-trend-copy">{item.delta}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="metric-strip system-summary-strip">
        <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-healthy', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-healthy', null) }}>
          <p className="metric-chip-label">{t('healthyLinesLabel')}</p>
          <p className="metric-chip-value">{metrics.healthyLineCount}</p>
        </div>
        <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-vehicles', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-vehicles', null) }}>
          <p className="metric-chip-label">{t('liveVehiclesLabel', vehicleLabelPlural)}</p>
          <p className="metric-chip-value">{metrics.totalVehicles}</p>
        </div>
        <div className={`metric-chip${metrics.totalAlerts ? ' metric-chip-warn' : ' metric-chip-healthy'} insights-clickable`} role="button" tabIndex={0} onClick={() => onInsightsClick('sys-alerts', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-alerts', null) }}>
          <p className="metric-chip-label">{t('alertsChipLabel')}</p>
          <p className="metric-chip-value">{metrics.totalAlerts}</p>
        </div>
        <div className={`metric-chip${metrics.attentionLineCount ? ' metric-chip-warn' : ' metric-chip-healthy'} insights-clickable`} role="button" tabIndex={0} onClick={() => onInsightsClick('sys-attention', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-attention', null) }}>
          <p className="metric-chip-label">{t('linesNeedingAttention')}</p>
          <p className="metric-chip-value">{metrics.attentionLineCount}</p>
        </div>
        <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-stops', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-stops', null) }}>
          <p className="metric-chip-label">{t('impactedStopsChipLabel')}</p>
          <p className="metric-chip-value">{metrics.impactedStopCount}</p>
        </div>
      </div>
      <div className="system-composition">
        <div className="insight-exceptions-header">
          <p className="headway-chart-title">{t('attentionBreakdown')}</p>
          <p className="headway-chart-copy">{t('attentionBreakdownNote')}</p>
        </div>
        <div className="attention-breakdown-grid">
          <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-late-only', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-late-only', null) }}>
            <p className="metric-chip-label">{t('lateOnlyLabel')}</p>
            <p className="metric-chip-value">{metrics.lateOnlyLineCount}</p>
          </div>
          <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-spacing-only', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-spacing-only', null) }}>
            <p className="metric-chip-label">{t('spacingOnlyLabel')}</p>
            <p className="metric-chip-value">{metrics.unevenOnlyLineCount}</p>
          </div>
          <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('sys-both', null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('sys-both', null) }}>
            <p className="metric-chip-label">{t('bothIssuesChipLabel')}</p>
            <p className="metric-chip-value">{metrics.mixedIssueLineCount}</p>
          </div>
        </div>
      </div>
      <div className="system-priority">
        <div className="insight-exceptions-header">
          <p className="headway-chart-title">{t('recommendedNext')}</p>
          <p className="headway-chart-copy">{t('recommendedNextNote')}</p>
        </div>
        <div className="system-priority-list">
          {priorityList.map(({ line, worstGap, severeLateCount, alertCount, attentionReasons }) => (
            <div
              key={line.id}
              className="system-priority-item insights-clickable"
              role="button"
              tabIndex={0}
              onClick={() => onInsightsClick('ranking', line.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('ranking', line.id) }}
            >
              <div className="line-title">
                <span className="line-token" style={{ '--line-color': line.color }}>{line.name[0]}</span>
                <div className="line-title-copy">
                  <p className="headway-chart-title">{line.name}</p>
                  <p className="headway-chart-copy">
                    {worstGap ? t('gapMinSummary', worstGap) : t('noMajorSpacingIssue')}
                    {severeLateCount ? ` · ${t('severeLateCountText', severeLateCount)}` : ''}
                    {alertCount ? ` · ${t('alertCountText', alertCount)}` : ''}
                  </p>
                  <div className="attention-reason-badges">
                    {attentionReasons.map((reason, i) => (
                      <span key={i} className={`attention-reason-badge attention-reason-badge-${reason.tone}`}>{reason.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="system-ranking">
        <div className="insight-exceptions-header">
          <p className="headway-chart-title">{t('attentionRanking')}</p>
          <p className="headway-chart-copy">{error ? t('realtimeDegraded') : t('fromLiveSnapshot')}</p>
        </div>
        <div className="system-ranking-list">
          {metrics.rankedLines.slice(0, 3).map(({ line, score, worstGap, alertCount, severeLateCount, attentionReasons }) => (
            <div
              key={line.id}
              className="system-ranking-item insights-clickable"
              role="button"
              tabIndex={0}
              onClick={() => onInsightsClick('ranking', line.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('ranking', line.id) }}
            >
              <div className="line-title">
                <span className="line-token" style={{ '--line-color': line.color }}>{line.name[0]}</span>
                <div className="line-title-copy">
                  <p className="headway-chart-title">{line.name}</p>
                  <p className="headway-chart-copy">
                    {t('scoreSummary', score)}
                    {worstGap ? ` · ${t('gapMinSummary', worstGap)}` : ''}
                    {alertCount ? ` · ${t('alertCountText', alertCount)}` : ''}
                    {severeLateCount ? ` · ${t('severeLateCountText', severeLateCount)}` : ''}
                  </p>
                  <div className="attention-reason-badges">
                    {attentionReasons.map((reason, i) => (
                      <span key={i} className={`attention-reason-badge attention-reason-badge-${reason.tone}`}>{reason.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="insight-exceptions">
        <div className="insight-exceptions-header">
          <p className="headway-chart-title">{t('systemStatusTitle')}</p>
          <p className="headway-chart-copy">{error ? t('realtimeDegraded') : t('fromLiveSnapshot')}</p>
        </div>
        {exceptions.map((item, i) => (
          <div key={i} className={`insight-exception insight-exception-${item.tone}`}>
            <p>{item.copy}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
