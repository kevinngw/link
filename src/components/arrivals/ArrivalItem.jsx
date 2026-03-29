import { useState, useEffect } from 'react'
import { formatArrivalTime as formatArrivalTimeValue } from '../../formatters'
import { getStatusTone } from '../../arrivals'

function getArrivalServiceStatus(arrivalTime, scheduleDeviation) {
  const diffSeconds = Math.floor((arrivalTime - Date.now()) / 1000)
  if (diffSeconds <= 30) return 'ARR'
  if (scheduleDeviation > 180) return 'DELAY'
  return 'OK'
}

export function ArrivalItem({ arrival, t, language, allVehicles, onVehicleClick }) {
  const [countdown, setCountdown] = useState(() => {
    const diff = Math.floor((arrival.arrivalTime - Date.now()) / 1000)
    return formatArrivalTimeValue(diff, t)
  })
  const [serviceStatus, setServiceStatus] = useState(() =>
    getArrivalServiceStatus(arrival.arrivalTime, arrival.scheduleDeviation ?? 0)
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      const diff = Math.floor((arrival.arrivalTime - Date.now()) / 1000)
      setCountdown(formatArrivalTimeValue(diff, t))
      setServiceStatus(getArrivalServiceStatus(arrival.arrivalTime, arrival.scheduleDeviation ?? 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [arrival.arrivalTime, arrival.scheduleDeviation, t])

  const serviceTone = getStatusTone(serviceStatus)
  const statusLabel = serviceStatus === 'ARR'
    ? (t('arrivingStatus') || 'ARRIVING')
    : serviceStatus === 'DELAY'
      ? (t('delayedStatus') || 'DELAYED')
      : t('onTimeStatus') || 'ON TIME'

  const sourceBadge = arrival.isRealtime ? t('realtimeBadge') : t('scheduleBadge')
  const sourceClass = arrival.isRealtime ? 'live' : 'sched'

  const diffSec = Math.floor((arrival.arrivalTime - Date.now()) / 1000)
  const clockTime = diffSec > 0
    ? new Intl.DateTimeFormat(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric', minute: '2-digit', hour12: language !== 'zh-CN',
      }).format(new Date(arrival.arrivalTime))
    : ''

  let precisionInfo = ''
  if (arrival.distanceFromStop > 0) {
    const distanceMiles = arrival.distanceFromStop * 0.000621371
    const distanceStr = distanceMiles >= 0.1
      ? `${distanceMiles.toFixed(1)} mi`
      : `${Math.round(arrival.distanceFromStop * 3.28084)} ft`
    const stopsStr = t('stopAway', arrival.numberOfStopsAway)
    precisionInfo = ` • ${distanceStr} • ${stopsStr}`
  }

  const liveVehicle = arrival.rawVehicleId
    ? (allVehicles ?? []).find((v) => v.id === arrival.rawVehicleId)
    : null

  const content = (
    <>
      <span className="arrival-row arrival-row-top">
        <span className="arrival-meta">
          <span className="arrival-line-token" style={{ '--line-color': arrival.lineColor }}>{arrival.lineToken}</span>
          <span className="arrival-destination">{arrival.destination}</span>
        </span>
        <span className={`arrival-source arrival-source-${sourceClass}`}>{sourceBadge}</span>
      </span>
      <span className="arrival-row arrival-row-mid">
        {statusLabel && (
          <span className={`arrival-status arrival-status-${serviceTone}`}>{statusLabel}</span>
        )}
        {clockTime && <span className="arrival-clock">{clockTime}</span>}
        <span className="arrival-countdown">{countdown}</span>
      </span>
      <span className="arrival-row arrival-row-bottom">
        <span className="arrival-vehicle">{arrival.lineName} {t('train') !== 'train' ? '' : ''} {arrival.vehicleId}</span>
        {precisionInfo && <span className="arrival-precision">{precisionInfo}</span>}
      </span>
    </>
  )

  if (liveVehicle) {
    return (
      <button
        className="arrival-item arrival-item-clickable"
        data-arrival-time={arrival.arrivalTime}
        data-schedule-deviation={arrival.scheduleDeviation ?? 0}
        type="button"
        data-arrival-vehicle-id={liveVehicle.id}
        aria-label={`${arrival.lineName} vehicle ${arrival.vehicleId}`}
        onClick={() => onVehicleClick?.(liveVehicle)}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      className="arrival-item"
      data-arrival-time={arrival.arrivalTime}
      data-schedule-deviation={arrival.scheduleDeviation ?? 0}
    >
      {content}
    </div>
  )
}
