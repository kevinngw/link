import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import ServiceReminderChip from '../shared/ServiceReminderChip'
import { getTodayDateKey, formatServiceClock as formatServiceClockValue } from '../../formatters'

const VEHICLE_Y_STAGGER = 1.5

function splitStationLabel(label) {
  const words = String(label).trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1 || label.length <= 16) return [label]
  const midpoint = Math.ceil(words.length / 2)
  const firstLine = words.slice(0, midpoint).join(' ')
  const secondLine = words.slice(midpoint).join(' ')
  if (Math.max(firstLine.length, secondLine.length) > label.length - 4) return [label]
  return [firstLine, secondLine]
}

function StationLabel({ station, layout }) {
  const labelLines = splitStationLabel(station.label)
  const baseY = labelLines.length > 1 ? -5 : 5
  const labelClass = `station-label${labelLines.length > 1 ? ' station-label-multiline' : ''}`
  return (
    <text x={layout.labelX} y={baseY} className={labelClass}>
      {labelLines.map((line, index) => (
        <tspan key={index} x={layout.labelX} dy={index === 0 ? 0 : 15}>{line}</tspan>
      ))}
    </text>
  )
}

export function MapLine({ line }) {
  const { t, language } = useTranslation()
  const layout = useAppStore((s) => s.layouts.get(line.id))
  const vehicles = useAppStore((s) => s.vehiclesByLine.get(line.id) ?? [])
  const vehicleGhosts = useAppStore((s) => s.vehicleGhosts)
  const alerts = useAppStore((s) => s.alerts)
  const compactLayout = useAppStore((s) => s.compactLayout)
  const openStationDialog = useAppStore((s) => s.openStationDialog)
  const openTrainDialog = useAppStore((s) => s.openTrainDialog)
  const openAlertDialog = useAppStore((s) => s.openAlertDialog)

  if (!layout) return null

  const systemMeta = { vehicleLabel: 'Vehicle' }
  const vehicleLabel = language === 'zh-CN'
    ? (line.vehicleLabel === 'Train' ? '列车' : '公交')
    : (line.vehicleLabel ?? 'Vehicle')

  const lineAlerts = alerts.filter((a) => a.lineIds.includes(line.id))

  function getAlertsForStation(station) {
    if (!lineAlerts.length) return []
    const stopIds = new Set()
    stopIds.add(station.id)
    const aliases = line.stationAliases?.[station.id] ?? []
    for (const a of aliases) stopIds.add(a)
    return lineAlerts.filter((alert) => alert.stopIds.length > 0 && alert.stopIds.some((id) => stopIds.has(id)))
  }

  function getVehicleGhostTrail(vehicleId) {
    const history = vehicleGhosts.get(`${line.id}:${vehicleId}`) ?? []
    return history.slice(0, -1)
  }

  // Today service span
  const todayKey = getTodayDateKey()
  const span = line.serviceSpansByDate?.[todayKey]
  const todayServiceSpan = span
    ? t('todayServiceSpan', formatServiceClockValue(span.start, language, t), formatServiceClockValue(span.end, language, t))
    : t('todayServiceUnavailable')

  // Inline alerts badge
  function handleAlertClick(e) {
    e.stopPropagation()
    openAlertDialog(line.id)
  }

  const viewBoxWidth = compactLayout ? 320 : 460

  return (
    <article className="line-card" data-line-id={line.id}>
      <header className="line-card-header">
        <div className="line-title">
          <span className="line-token" style={{ '--line-color': line.color }}>{line.name[0]}</span>
          <div className="line-title-copy">
            <div className="line-title-row">
              <h2>{line.name}</h2>
              {lineAlerts.length > 0 && (
                <button className="line-alert-badge" type="button" onClick={handleAlertClick}>
                  <span className="line-alert-badge-count">{lineAlerts.length}</span>
                  <span className="line-alert-badge-copy">{lineAlerts.length === 1 ? 'alert' : 'alerts'}</span>
                </button>
              )}
            </div>
            <p>{t('liveCount', vehicles.length, vehicles.length === 1 ? vehicleLabel.toLowerCase() : vehicleLabel.toLowerCase() + 's')}</p>
            <p>{todayServiceSpan}</p>
          </div>
        </div>
        <ServiceReminderChip line={line} t={t} language={language} />
      </header>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${layout.height}`}
        className="line-diagram"
        role="img"
        aria-label={t('lineDiagramAria', line.name)}
      >
        <line
          x1={layout.trackX}
          x2={layout.trackX}
          y1={layout.stations[0]?.y ?? 0}
          y2={layout.stations.at(-1)?.y ?? 0}
          className="spine"
          style={{ '--line-color': line.color }}
        />
        {layout.stations.map((station, index) => {
          const prevStation = layout.stations[index - 1]
          const minute = index > 0 ? prevStation?.segmentMinutes : ''
          const stationAlerts = getAlertsForStation(station)
          const hasAlert = stationAlerts.length > 0
          const alertDotOffset = station.isTerminal ? 15 : 10

          return (
            <g
              key={station.id}
              transform={`translate(0, ${station.y})`}
              className={`station-group${hasAlert ? ' has-alert' : ''}`}
              data-stop-id={station.id}
              style={{ cursor: 'pointer' }}
              onClick={() => openStationDialog({ station, stationId: station.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openStationDialog({ station, stationId: station.id })
                }
              }}
            >
              {index > 0 && (
                <>
                  <text x="0" y="-14" className="segment-time">{minute}</text>
                  <line x1="18" x2={layout.trackX - 16} y1="-18" y2="-18" className="segment-line" />
                </>
              )}
              <circle
                cx={layout.trackX}
                cy="0"
                r={station.isTerminal ? 11 : 5}
                className={station.isTerminal ? 'terminal-stop' : 'station-stop'}
                style={{ '--line-color': line.color }}
              />
              {station.isTerminal && (
                <text x={layout.trackX} y="4" textAnchor="middle" className="terminal-mark">
                  {line.name[0]}
                </text>
              )}
              {hasAlert && (
                <circle
                  cx={layout.trackX + alertDotOffset}
                  cy="-8"
                  r="4"
                  className="station-alert-dot"
                />
              )}
              <StationLabel station={station} layout={layout} />
              <rect x="0" y="-30" width="420" height="60" fill="transparent" className="station-hitbox" />
            </g>
          )
        })}
        {vehicles.map((vehicle, index) => {
          const ghostTrail = getVehicleGhostTrail(vehicle.id)
          return (
            <g
              key={vehicle.id}
              transform={`translate(${layout.trackX}, 0)`}
              className="train"
              data-train-id={vehicle.id}
              onClick={(e) => { e.stopPropagation(); openTrainDialog(vehicle.id) }}
            >
              {ghostTrail.map((ghost, ghostIndex) => (
                <circle
                  key={ghostIndex}
                  cy={ghost.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER}
                  r={Math.max(3, 7 - ghostIndex)}
                  className="train-ghost-dot"
                  style={{
                    '--line-color': line.color,
                    '--ghost-opacity': Math.max(0.18, 0.56 - ghostIndex * 0.1),
                  }}
                />
              ))}
              <g transform={`translate(0, ${vehicle.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER})`}>
                <circle
                  r="13"
                  className="train-wave"
                  style={{ '--line-color': line.color, animationDelay: `${index * 0.18}s` }}
                />
                <path
                  d="M 0 -8 L 7 6 L -7 6 Z"
                  transform={vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}
                  className="train-arrow"
                  style={{ '--line-color': line.color }}
                />
              </g>
            </g>
          )
        })}
      </svg>
    </article>
  )
}
