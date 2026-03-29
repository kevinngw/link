import ServiceReminderChip from '../shared/ServiceReminderChip'
import ServiceTimeline from '../shared/ServiceTimeline'
import {
  classifyHeadwayHealth,
  computeLineHeadways,
  formatPercent,
  getDelayBuckets,
} from '../../insights'
import { getTodayDateKey, formatServiceClock as formatServiceClockValue } from '../../formatters'

export function InsightsLineCard({
  line,
  layout,
  vehicles,
  nb,
  sb,
  lineAlerts,
  vehicleLabel,
  vehicleLabelPlural,
  t,
  language,
  onInsightsClick,
  onAlertClick,
  onTrainClick,
  onStationClick,
}) {
  const total = nb.length + sb.length
  const { nbGaps, sbGaps } = computeLineHeadways(nb, sb)
  const delayBuckets = getDelayBuckets([...nb, ...sb])
  const worstGap = [...nbGaps, ...sbGaps].length ? Math.max(...nbGaps, ...sbGaps) : null
  const nbHealthResult = classifyHeadwayHealth(nbGaps, nb.length)
  const sbHealthResult = classifyHeadwayHealth(sbGaps, sb.length)
  const delta = Math.abs(nb.length - sb.length)
  const balance = delta <= 1 ? { label: t('balanceBalanced'), tone: 'healthy' }
    : nb.length > sb.length ? { label: t('balanceNorthHeavier'), tone: 'warn' }
    : { label: t('balanceSouthHeavier'), tone: 'warn' }

  const impactedStopCount = new Set(lineAlerts.flatMap((alert) => alert.stopIds ?? [])).size

  // Today service span
  const todayKey = getTodayDateKey()
  const span = line.serviceSpansByDate?.[todayKey]
  const todayServiceSpan = span
    ? t('todayServiceSpan', formatServiceClockValue(span.start, language, t), formatServiceClockValue(span.end, language, t))
    : t('todayServiceUnavailable')

  // Direction labels
  const nbLabel = (() => {
    if (!layout?.stations?.length) return t('northboundLabel')
    const station = layout.stations[0]
    const base = t('northboundLabel')
    return station?.label ? t('directionTo', base, station.label) : base
  })()
  const sbLabel = (() => {
    if (!layout?.stations?.length) return t('southboundLabel')
    const station = layout.stations.at(-1)
    const base = t('southboundLabel')
    return station?.label ? t('directionTo', base, station.label) : base
  })()

  function summarizeHeadways(gaps, count) {
    if (!gaps.length || count < 2) {
      return { averageText: '—', detailText: t('tooFewForSpacing', vehicleLabelPlural.toLowerCase()) }
    }
    const avg = Math.round(gaps.reduce((sum, g) => sum + g, 0) / gaps.length)
    const min = Math.min(...gaps)
    const max = Math.max(...gaps)
    return { averageText: `~${avg} min`, detailText: t('observedGapRange', min, max) }
  }

  const nbSummary = summarizeHeadways(nbGaps, nb.length)
  const sbSummary = summarizeHeadways(sbGaps, sb.length)

  function renderFlowLane(dirVehicles, dirLabel, dirSymbol, lineColor) {
    if (!dirVehicles.length) {
      return (
        <div className="flow-lane">
          <div className="flow-lane-header">
            <p className="flow-lane-title">{dirLabel}</p>
            <p className="flow-lane-copy">{t('noLiveVehicles', vehicleLabelPlural.toLowerCase())}</p>
          </div>
        </div>
      )
    }
    const sorted = [...dirVehicles].sort((a, b) => a.minutePosition - b.minutePosition)
    return (
      <div className="flow-lane">
        <div
          className="flow-lane-header insights-clickable"
          role="button"
          tabIndex={0}
          onClick={() => {
            const station = dirSymbol === '▲' ? layout?.stations?.[0] : layout?.stations?.at(-1)
            if (station) onStationClick?.(station)
          }}
        >
          <p className="flow-lane-title">{dirLabel}</p>
          <p className="flow-lane-copy">{t('liveCount', sorted.length, sorted.length === 1 ? vehicleLabel.toLowerCase() : vehicleLabelPlural.toLowerCase())}</p>
        </div>
        <div className="flow-track" style={{ '--line-color': lineColor }}>
          {sorted.map((v) => {
            const ratio = layout?.totalMinutes > 0 ? v.minutePosition / layout.totalMinutes : 0
            const position = Math.max(0, Math.min(100, ratio * 100))
            return (
              <span
                key={v.id}
                className="flow-vehicle insights-clickable"
                style={{ left: `${position}%`, '--line-color': lineColor }}
                title={v.label}
                data-train-id={v.id}
                onClick={() => onTrainClick?.(v.id)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <article className="panel-card panel-card-wide">
      <header className="panel-header line-card-header">
        <div className="line-title">
          <span className="line-token" style={{ '--line-color': line.color }}>{line.name[0]}</span>
          <div className="line-title-copy">
            <h2>{line.name}</h2>
            <p>{t('liveCount', vehicles.length, vehicles.length === 1 ? vehicleLabel.toLowerCase() : vehicleLabelPlural.toLowerCase())} · {todayServiceSpan}</p>
          </div>
        </div>
        <ServiceReminderChip line={line} t={t} language={language} />
      </header>
      <ServiceTimeline line={line} t={t} language={language} />
      {total === 0 ? (
        <p className="train-readout muted">{t('waitingForLiveData', vehicleLabel.toLowerCase())}</p>
      ) : (
        <div className="line-insights">
          <div className="metric-strip">
            <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('inservice', line.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('inservice', line.id) }}>
              <p className="metric-chip-label">{t('inServiceLabel')}</p>
              <p className="metric-chip-value">{total}</p>
            </div>
            <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('ontime', line.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('ontime', line.id) }}>
              <p className="metric-chip-label">{t('onTimeRateLabel')}</p>
              <p className="metric-chip-value">{formatPercent(delayBuckets.onTime, total)}</p>
            </div>
            <div className="metric-chip insights-clickable" role="button" tabIndex={0} onClick={() => onInsightsClick('gap', line.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('gap', line.id) }}>
              <p className="metric-chip-label">{t('worstGapLabel')}</p>
              <p className="metric-chip-value">{worstGap != null ? `${worstGap} min` : '—'}</p>
            </div>
            <div className={`metric-chip metric-chip-${balance.tone} insights-clickable`} role="button" tabIndex={0} onClick={() => onInsightsClick('balance', line.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick('balance', line.id) }}>
              <p className="metric-chip-label">{t('balanceChipLabel')}</p>
              <p className="metric-chip-value">{balance.label}</p>
            </div>
          </div>
          <div className="headway-health-grid">
            <div
              className="headway-health-card insights-clickable"
              role="button"
              tabIndex={0}
              onClick={() => {
                const station = layout?.stations?.[0]
                if (station) onStationClick?.(station)
              }}
            >
              <p className="headway-health-label">▲ {nbLabel}</p>
              <p className="headway-health-value">{nbSummary.averageText}</p>
              <p className="headway-health-copy">{nbSummary.detailText}</p>
            </div>
            <div
              className="headway-health-card insights-clickable"
              role="button"
              tabIndex={0}
              onClick={() => {
                const station = layout?.stations?.at(-1)
                if (station) onStationClick?.(station)
              }}
            >
              <p className="headway-health-label">▼ {sbLabel}</p>
              <p className="headway-health-value">{sbSummary.averageText}</p>
              <p className="headway-health-copy">{sbSummary.detailText}</p>
            </div>
          </div>
          <div className="delay-distribution">
            {[
              [t('delayOnTimeChip'), delayBuckets.onTime, 'healthy', 'delay-ontime'],
              [t('delayMinorChip'), delayBuckets.minorLate, 'warn', 'delay-minor'],
              [t('delaySevereChip'), delayBuckets.severeLate, 'alert', 'delay-severe'],
            ].map(([label, count, tone, type]) => (
              <div
                key={type}
                className={`delay-chip delay-chip-${tone} insights-clickable`}
                role="button"
                tabIndex={0}
                onClick={() => onInsightsClick(type, line.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onInsightsClick(type, line.id) }}
              >
                <p className="delay-chip-label">{label}</p>
                <p className="delay-chip-value">{count}</p>
                <p className="delay-chip-copy">{formatPercent(count, total)}</p>
              </div>
            ))}
          </div>
          <div className="flow-grid">
            {renderFlowLane(nb, `▲ ${nbLabel}`, '▲', line.color)}
            {renderFlowLane(sb, `▼ ${sbLabel}`, '▼', line.color)}
          </div>
        </div>
      )}
    </article>
  )
}
