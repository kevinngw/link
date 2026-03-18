import { clamp } from './utils'

export function inferDirectionSymbol(closestIndex, nextIndex) {
  if (closestIndex != null && nextIndex != null && closestIndex !== nextIndex) {
    return nextIndex < closestIndex ? '▲' : '▼'
  }

  return '•'
}

export function classifyVehicleStatus(rawVehicle) {
  const tripStatus = rawVehicle.tripStatus ?? {}
  const status = String(tripStatus.status ?? '').toLowerCase()
  const nextOffset = tripStatus.nextStopTimeOffset ?? 0
  const scheduleDeviation = tripStatus.scheduleDeviation ?? 0
  const isAtPlatform = tripStatus.closestStop && tripStatus.nextStop && tripStatus.closestStop === tripStatus.nextStop
  const isApproaching = status === 'approaching' || (isAtPlatform && Math.abs(nextOffset) <= 90)

  if (isApproaching) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return 'OK'
}

export function formatDelay(deviationSeconds, isPredicted, { language, copyValue }) {
  if (!isPredicted) {
    return { text: copyValue('scheduled'), colorClass: 'status-muted' }
  }

  if (deviationSeconds >= -30 && deviationSeconds <= 60) {
    return { text: copyValue('onTime'), colorClass: 'status-ontime' }
  }

  if (deviationSeconds > 60) {
    const minutes = Math.round(deviationSeconds / 60)
    let colorClass = 'status-late-minor'
    if (deviationSeconds > 600) {
      colorClass = 'status-late-severe'
    } else if (deviationSeconds > 300) {
      colorClass = 'status-late-moderate'
    }
    return { text: language === 'zh-CN' ? `晚点 ${minutes} 分钟` : `+${minutes} min late`, colorClass }
  }

  if (deviationSeconds < -60) {
    const minutes = Math.round(Math.abs(deviationSeconds) / 60)
    return { text: language === 'zh-CN' ? `早到 ${minutes} 分钟` : `${minutes} min early`, colorClass: 'status-early' }
  }

  return { text: copyValue('unknown'), colorClass: 'status-muted' }
}

export function parseVehicle(rawVehicle, line, layout, tripsById, { language, copyValue }) {
  const tripId = rawVehicle.tripStatus?.activeTripId ?? rawVehicle.tripId ?? ''
  const trip = tripsById.get(tripId)
  if (!trip || trip.routeId !== line.routeKey) return null

  const closestStop = rawVehicle.tripStatus?.closestStop
  const nextStop = rawVehicle.tripStatus?.nextStop
  const closestIndex = layout.stationIndexByStopId.get(closestStop)
  const nextIndex = layout.stationIndexByStopId.get(nextStop)

  if (closestIndex == null && nextIndex == null) return null

  let fromIndex = closestIndex ?? nextIndex
  let toIndex = nextIndex ?? closestIndex

  if (fromIndex > toIndex) [fromIndex, toIndex] = [toIndex, fromIndex]

  const currentStation = layout.stations[fromIndex]
  const nextStation = layout.stations[toIndex]
  const closestOffset = rawVehicle.tripStatus?.closestStopTimeOffset ?? 0
  const nextOffset = rawVehicle.tripStatus?.nextStopTimeOffset ?? 0

  const directionSymbol =
    trip.directionId === '1'
      ? '▲'
      : trip.directionId === '0'
        ? '▼'
        : inferDirectionSymbol(closestIndex, nextIndex)

  let progress = 0
  if (fromIndex !== toIndex && closestOffset < 0 && nextOffset > 0) {
    progress = clamp(Math.abs(closestOffset) / (Math.abs(closestOffset) + nextOffset), 0, 1)
  }

  const y = currentStation.y + (nextStation.y - currentStation.y) * progress
  const segmentMinutes = fromIndex !== toIndex ? currentStation.segmentMinutes : 0
  const minutePosition = currentStation.cumulativeMinutes + segmentMinutes * progress
  const currentIndex = closestIndex ?? nextIndex ?? fromIndex
  const currentStop = layout.stations[currentIndex] ?? currentStation
  const movingNorth = directionSymbol === '▲'
  const previousStopIndex = clamp(currentIndex + (movingNorth ? 1 : -1), 0, layout.stations.length - 1)
  const upcomingStopIndex =
    closestIndex != null && nextIndex != null && closestIndex !== nextIndex
      ? nextIndex
      : clamp(currentIndex + (movingNorth ? -1 : 1), 0, layout.stations.length - 1)
  const previousStop = layout.stations[previousStopIndex] ?? currentStop
  const upcomingStop = layout.stations[upcomingStopIndex] ?? nextStation

  const scheduleDeviation = rawVehicle.tripStatus?.scheduleDeviation ?? 0
  const isPredicted = rawVehicle.tripStatus?.predicted ?? false
  const delayInfo = formatDelay(scheduleDeviation, isPredicted, { language, copyValue })

  return {
    id: rawVehicle.vehicleId,
    label: rawVehicle.vehicleId.replace(/^\d+_/, ''),
    directionSymbol,
    fromLabel: currentStation.label,
    minutePosition,
    progress,
    serviceStatus: classifyVehicleStatus(rawVehicle),
    toLabel: nextStation.label,
    y,
    currentLabel: currentStation.label,
    nextLabel: nextStation.label,
    previousLabel: previousStop.label,
    previousStopId: previousStop.id,
    currentStopLabel: currentStop.label,
    currentStopId: currentStop.id,
    upcomingLabel: upcomingStop.label,
    upcomingStopId: upcomingStop.id,
    currentIndex,
    upcomingStopIndex,
    status: rawVehicle.tripStatus?.status ?? '',
    closestStop,
    nextStop,
    closestOffset,
    nextOffset,
    scheduleDeviation,
    isPredicted,
    delayInfo,
    rawVehicle,
  }
}
