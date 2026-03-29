import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import LineSwitcher from './LineSwitcher'
import { TrainCard } from './trains/TrainCard'
import { DirectionFilter } from './trains/DirectionFilter'
import ServiceReminderChip from './shared/ServiceReminderChip'
import StatusPills from './shared/StatusPills'
import { SYSTEM_META } from '../config'
import { formatRelativeTime as formatRelativeTimeValue } from '../formatters'
import { getDateKeyWithOffset, getTodayDateKey, getServiceDateTime } from '../formatters'
import { formatServiceClock as formatServiceClockValue } from '../formatters'
import { formatDurationFromMs as formatDurationFromMsValue } from '../formatters'

function getTodayServiceSpan(line, t, language) {
  const todayKey = getTodayDateKey()
  const span = line.serviceSpansByDate?.[todayKey]
  if (!span) return t('todayServiceUnavailable')
  const start = formatServiceClockValue(span.start, language, t)
  const end = formatServiceClockValue(span.end, language, t)
  return t('todayServiceSpan', start, end)
}

function renderInlineAlerts(lineAlerts, lineId) {
  if (!lineAlerts.length) return null
  return (
    <button className="line-alert-badge" type="button" data-alert-line-id={lineId}>
      <span className="line-alert-badge-count">{lineAlerts.length}</span>
      <span className="line-alert-badge-copy">{lineAlerts.length === 1 ? 'alert' : 'alerts'}</span>
    </button>
  )
}

export default function TrainsBoard() {
  const { t, language } = useTranslation()
  const compactLayout = useAppStore((s) => s.compactLayout)
  const lines = useAppStore((s) => s.lines)
  const activeLineId = useAppStore((s) => s.activeLineId)
  const vehiclesByLine = useAppStore((s) => s.vehiclesByLine)
  const alerts = useAppStore((s) => s.alerts)
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const directionFilterByLine = useAppStore((s) => s.directionFilterByLine)
  const setDirectionFilter = useAppStore((s) => s.setDirectionFilter)
  const openTrainDialog = useAppStore((s) => s.openTrainDialog)
  const openAlertDialog = useAppStore((s) => s.openAlertDialog)
  const fetchedAt = useAppStore((s) => s.fetchedAt)

  const systemMeta = SYSTEM_META[activeSystemId] ?? SYSTEM_META['link']
  const vehicleLabel = language === 'zh-CN'
    ? (systemMeta.vehicleLabel === 'Train' ? '列车' : '公交')
    : (systemMeta.vehicleLabel ?? 'Vehicle')
  const vehicleLabelPlural = language === 'zh-CN'
    ? vehicleLabel
    : (systemMeta.vehicleLabelPlural ?? `${vehicleLabel}s`)

  const visibleLines = compactLayout
    ? lines.filter((line) => line.id === activeLineId)
    : lines

  const allVehicles = lines.flatMap((line) =>
    (vehiclesByLine.get(line.id) ?? []).map((v) => ({
      ...v,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    }))
  )

  if (!allVehicles.length) {
    return (
      <>
        <LineSwitcher />
        <article className="panel-card">
          <h2>{t('activeVehicles', vehicleLabelPlural)}</h2>
          <p>{t('noLiveVehicles', vehicleLabelPlural.toLowerCase())}</p>
        </article>
      </>
    )
  }

  function getLineAlerts(lineId) {
    return alerts.filter((alert) => alert.lineIds.includes(lineId))
  }

  function getRealtimeOffset(offsetSeconds) {
    if (!fetchedAt) return offsetSeconds
    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 1000))
    return offsetSeconds - elapsed
  }

  return (
    <>
      <LineSwitcher />
      {visibleLines.map((line) => {
        const lineVehicles = allVehicles.filter((v) => v.lineId === line.id)
        const lineAlerts = getLineAlerts(line.id)
        const directionFilter = directionFilterByLine.get(line.id) || 'all'

        const sortedVehicles = [...lineVehicles].sort((a, b) => {
          if (a.directionSymbol !== b.directionSymbol) {
            if (a.directionSymbol === '▲') return -1
            if (b.directionSymbol === '▲') return 1
            return 0
          }
          if (a.directionSymbol === '▲') return b.minutePosition - a.minutePosition
          return a.minutePosition - b.minutePosition
        })

        const filteredVehicles = directionFilter === 'all'
          ? sortedVehicles
          : sortedVehicles.filter((v) => v.directionSymbol === directionFilter)

        return (
          <article key={line.id} className="line-card train-line-card" style={{ '--line-color': line.color }}>
            <header className="line-card-header train-list-section-header">
              <div className="line-title">
                <span className="line-token" style={{ '--line-color': line.color }}>{line.name[0]}</span>
                <div className="line-title-copy">
                  <div className="line-title-row">
                    <h2>{line.name}</h2>
                    {renderInlineAlerts(lineAlerts, line.id)}
                  </div>
                  <p>
                    {t('inServiceCount', lineVehicles.length, lineVehicles.length === 1 ? vehicleLabel.toLowerCase() : vehicleLabelPlural.toLowerCase())}
                    {' · '}
                    {getTodayServiceSpan(line, t, language)}
                  </p>
                </div>
              </div>
              <DirectionFilter lineId={line.id} current={directionFilter} onChange={setDirectionFilter} t={t} />
              <ServiceReminderChip line={line} t={t} language={language} />
            </header>
            <div className="line-readout train-columns train-stack-layout">
              {filteredVehicles.length === 0 ? (
                <p className="train-readout muted">{t('noLiveVehicles', vehicleLabelPlural.toLowerCase())}</p>
              ) : (
                filteredVehicles.map((vehicle, i) => {
                  const prev = filteredVehicles[i - 1]
                  const showGap = i > 0 && prev && prev.directionSymbol === vehicle.directionSymbol
                  const gapMinutes = showGap ? Math.abs(vehicle.minutePosition - prev.minutePosition) : 0
                  return (
                    <div key={vehicle.id}>
                      {showGap && gapMinutes >= 2 && (
                        <div
                          className={`train-headway-gap${gapMinutes >= 15 ? ' gap-large' : gapMinutes >= 10 ? ' gap-medium' : ''}`}
                          aria-label={t('headwayGap', Math.round(gapMinutes))}
                        >
                          <span className="train-headway-line"></span>
                          <span className="train-headway-label">{t('headwayGapLabel', Math.round(gapMinutes))}</span>
                          <span className="train-headway-line"></span>
                        </div>
                      )}
                      <TrainCard
                        vehicle={vehicle}
                        vehicleLabel={vehicleLabel}
                        fetchedAt={fetchedAt}
                        t={t}
                        language={language}
                        onOpen={(v) => openTrainDialog(v.id)}
                      />
                    </div>
                  )
                })
              )}
            </div>
          </article>
        )
      })}
    </>
  )
}
