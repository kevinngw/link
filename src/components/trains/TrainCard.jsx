import { useState, useEffect } from 'react'
import { formatArrivalTime as formatArrivalTimeValue, formatEtaClockFromNow as formatEtaClockFromNowValue } from '../../formatters'

function getRealtimeOffset(offsetSeconds, fetchedAt) {
  if (!fetchedAt) return offsetSeconds
  const elapsed = Math.max(0, Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 1000))
  return offsetSeconds - elapsed
}

function getVehicleStatusClass(vehicle, nextOffset) {
  if (nextOffset <= 90) return 'status-arriving'
  return vehicle.delayInfo?.colorClass ?? ''
}

export function TrainCard({ vehicle, vehicleLabel, fetchedAt, t, language, onOpen }) {
  const nextOffsetRaw = getRealtimeOffset(vehicle.nextOffset ?? 0, fetchedAt)

  const [nextOffset, setNextOffset] = useState(nextOffsetRaw)
  const [countdown, setCountdown] = useState(() => formatArrivalTimeValue(nextOffsetRaw, t))
  const [clock, setClock] = useState(() => formatEtaClockFromNowValue(nextOffsetRaw, language))

  useEffect(() => {
    const id = window.setInterval(() => {
      const live = getRealtimeOffset(vehicle.nextOffset ?? 0, fetchedAt)
      setNextOffset(live)
      setCountdown(formatArrivalTimeValue(live, t))
      setClock(formatEtaClockFromNowValue(live, language))
    }, 1000)
    return () => window.clearInterval(id)
  }, [vehicle.nextOffset, vehicle.id, fetchedAt, t, language])

  const isSignificantDelay = vehicle.isPredicted && vehicle.scheduleDeviation > 180
  const delayCardClass = isSignificantDelay ? `train-card-delayed ${vehicle.delayInfo?.colorClass ?? ''}` : ''
  const statusClass = getVehicleStatusClass(vehicle, nextOffset)

  function getDirectionLabel() {
    const layout = null // We don't have layout here directly
    const dest = vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel || ''
    const base = vehicle.directionSymbol === '▲' ? t('northboundLabel') : vehicle.directionSymbol === '▼' ? t('southboundLabel') : t('active')
    return dest ? t('directionTo', base, dest) : base
  }

  function getStatusText() {
    if (nextOffset <= 15) return t('arrivingNow')
    if (nextOffset <= 90) return t('arrivingIn', countdown)
    const status = vehicle.serviceStatus
    if (status === 'ARR') return t('arrivingStatus')
    if (status === 'DELAY') return t('delayedStatus')
    return t('enRoute')
  }

  return (
    <button
      className={`train-focus-card train-list-item ${delayCardClass}`}
      data-train-id={vehicle.id}
      type="button"
      aria-label={`${vehicle.lineName} ${vehicleLabel} ${vehicle.label}`}
      onClick={() => onOpen?.(vehicle)}
    >
      <div className="train-focus-header">
        <div>
          <p className="train-focus-title">{vehicle.lineName} {vehicleLabel} {vehicle.label}</p>
          <span className="train-direction-badge">
            {getDirectionLabel()}
          </span>
          {isSignificantDelay && (
            <span className={`train-delay-badge ${vehicle.delayInfo?.colorClass ?? ''}`}>
              {vehicle.delayInfo?.text}
            </span>
          )}
        </div>
        <div className="train-focus-side">
          <p className="train-focus-time">{countdown}</p>
          <p className="train-focus-clock">{clock}</p>
          {vehicle.upcomingLabel && (
            <p className="train-focus-next-stop">{t('nextStop')}: {vehicle.upcomingLabel}</p>
          )}
        </div>
      </div>
      <div className="train-focus-metrics">
        <div className="train-focus-metric">
          <p className="train-focus-metric-label">{t('currentLocation')}</p>
          <p className="train-focus-metric-value">{vehicle.currentLabel || vehicle.fromLabel}</p>
        </div>
        <div className="train-focus-metric">
          <p className="train-focus-metric-label">{t('nextStop')}</p>
          <p className="train-focus-metric-value">{vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel}</p>
          <p className="train-focus-metric-copy">{countdown}</p>
        </div>
        <div className="train-focus-metric">
          <p className="train-focus-metric-label">{t('terminal')}</p>
          <p className="train-focus-metric-value">{vehicle.toLabel || vehicle.upcomingLabel || ''}</p>
        </div>
      </div>
      <p className={`train-list-status ${statusClass}`}>{getStatusText()}</p>
    </button>
  )
}
