import { formatArrivalStatusLabel } from './arrivals'

/**
 * Vehicle status rendering, countdown refresh, and marquee display
 */
export function createVehicleDisplay({ state, copyValue, formatArrivalTime, formatEtaClockFromNow, getArrivalServiceStatus, getStatusTone, getAllVehicles, getAllVehiclesById, getTrainTimelineEntries }) {

  function formatServiceStatus(serviceStatus) {
    switch (serviceStatus) {
      case 'ARR':
        return copyValue('arrivingStatus')
      case 'DELAY':
        return copyValue('delayedStatus')
      case 'OK':
        return copyValue('enRoute')
      default:
        return ''
    }
  }

  function getRealtimeOffset(offsetSeconds) {
    if (!state.fetchedAt) return offsetSeconds
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(state.fetchedAt).getTime()) / 1000))
    return offsetSeconds - elapsedSeconds
  }

  function getVehicleStatusClass(vehicle, nextOffset) {
    if (nextOffset <= 90) return 'status-arriving'
    return vehicle.delayInfo.colorClass
  }

  function getVehicleStatusPills(vehicle) {
    const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    const liveClosestOffset = getRealtimeOffset(vehicle.closestOffset ?? 0)
    const delayText = vehicle.delayInfo.text

    if (liveNextOffset <= 15) {
      return [
        { text: copyValue('arrivingNow'), toneClass: 'status-arriving' },
        { text: delayText, toneClass: vehicle.delayInfo.colorClass },
      ]
    }

    if (liveNextOffset <= 90) {
      return [
        { text: copyValue('arrivingIn', formatArrivalTime(liveNextOffset)), toneClass: 'status-arriving' },
        { text: delayText, toneClass: vehicle.delayInfo.colorClass },
      ]
    }

    if (liveClosestOffset < 0 && liveNextOffset > 0) {
      return [
        { text: copyValue('nextStopIn', formatArrivalTime(liveNextOffset)), toneClass: 'status-arriving' },
        { text: delayText, toneClass: vehicle.delayInfo.colorClass },
      ]
    }

    const statusText = formatServiceStatus(vehicle.serviceStatus)
    return [
      { text: statusText, toneClass: getVehicleStatusClass(vehicle, liveNextOffset) },
      { text: delayText, toneClass: vehicle.delayInfo.colorClass },
    ]
  }

  function renderStatusPills(pills) {
    return pills
      .map(
        (pill) => `
          <span class="status-chip ${pill.toneClass}">
            ${pill.text}
          </span>
        `,
      )
      .join('')
  }

  function formatVehicleArrivalMessage(vehicle) {
    const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    const liveClosestOffset = getRealtimeOffset(vehicle.closestOffset ?? 0)
    const stopLabel = vehicle.upcomingLabel || vehicle.toLabel || vehicle.currentStopLabel
    const [statusPill, delayPill] = getVehicleStatusPills(vehicle)

    if (liveNextOffset <= 15) {
      return `${vehicle.label} at ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
    }

    if (liveNextOffset <= 90) {
      return `${vehicle.label} at ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
    }

    if (liveClosestOffset < 0 && liveNextOffset > 0) {
      return `${vehicle.label} ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
    }

    return `${vehicle.label} to ${stopLabel} ${renderStatusPills([statusPill, delayPill])}`
  }

  function formatVehicleStatus(vehicle) {
    return renderStatusPills(getVehicleStatusPills(vehicle))
  }

  function renderLineStatusMarquee(lineColor, vehicles) {
    if (!vehicles.length) return ''

    const visibleVehicles = [...vehicles]
      .sort((left, right) => getRealtimeOffset(left.nextOffset ?? 0) - getRealtimeOffset(right.nextOffset ?? 0))
      .slice(0, 8)

    const entries = [...visibleVehicles, ...visibleVehicles]

    return `
      <div class="line-marquee" style="--line-color:${lineColor};">
        <div class="line-marquee-track">
          ${entries.map((vehicle) => `
            <span
              class="line-marquee-item ${getVehicleStatusClass(vehicle, getRealtimeOffset(vehicle.nextOffset ?? 0))}"
              data-vehicle-marquee="${vehicle.id}"
            >
              <span class="line-marquee-token">${vehicle.lineToken}</span>
              <span class="line-marquee-copy">${formatVehicleArrivalMessage(vehicle)}</span>
            </span>
          `).join('')}
        </div>
      </div>
    `
  }

  function refreshVehicleStatusMessages() {
    if (document.hidden) return
    const vehiclesById = getAllVehiclesById()
    if (!vehiclesById.size) return

    const statusElements = document.querySelectorAll('[data-vehicle-status]')
    const marqueeElements = document.querySelectorAll('[data-vehicle-marquee]')

    statusElements.forEach((element) => {
      const vehicle = vehiclesById.get(element.dataset.vehicleStatus)
      if (!vehicle) return
      const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
      element.innerHTML = formatVehicleStatus(vehicle)
      element.className = `train-list-status ${getVehicleStatusClass(vehicle, liveNextOffset)}`
    })

    marqueeElements.forEach((element) => {
      const vehicle = vehiclesById.get(element.dataset.vehicleMarquee)
      if (!vehicle) return
      const liveNextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
      element.className = `line-marquee-item ${getVehicleStatusClass(vehicle, liveNextOffset)}`
      const copyElement = element.querySelector('.line-marquee-copy')
      if (copyElement) copyElement.innerHTML = formatVehicleArrivalMessage(vehicle)
    })
  }

  function refreshVehicleCountdownDisplays() {
    if (document.hidden) return
    const vehiclesById = getAllVehiclesById()
    if (!vehiclesById.size) return

    document.querySelectorAll('[data-vehicle-next-countdown]').forEach((element) => {
      const vehicle = vehiclesById.get(element.dataset.vehicleNextCountdown ?? '')
      if (!vehicle) return
      element.textContent = formatArrivalTime(getRealtimeOffset(vehicle.nextOffset ?? 0))
    })

    document.querySelectorAll('[data-vehicle-next-clock]').forEach((element) => {
      const vehicle = vehiclesById.get(element.dataset.vehicleNextClock ?? '')
      if (!vehicle) return
      element.textContent = formatEtaClockFromNow(getRealtimeOffset(vehicle.nextOffset ?? 0))
    })

    document.querySelectorAll('[data-vehicle-terminal-countdown]').forEach((element) => {
      const vehicle = vehiclesById.get(element.dataset.vehicleTerminalCountdown ?? '')
      if (!vehicle) return
      const layout = state.layouts.get(vehicle.lineId)
      const terminalEta = Math.max(0, (getTrainTimelineEntries(vehicle, layout).at(-1)?.etaSeconds) ?? (vehicle.nextOffset ?? 0))
      element.textContent = formatArrivalTime(getRealtimeOffset(terminalEta))
    })

    document.querySelectorAll('[data-train-timeline-entry]').forEach((element) => {
      const baseEtaSeconds = Number(element.dataset.baseEtaSeconds)
      const renderedAt = Number(element.dataset.renderedAt)
      if (!Number.isFinite(baseEtaSeconds) || !Number.isFinite(renderedAt)) return

      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - renderedAt) / 1000))
      const liveEtaSeconds = Math.max(0, baseEtaSeconds - elapsedSeconds)
      const countdownElement = element.querySelector('[data-train-timeline-countdown]')
      const clockElement = element.querySelector('[data-train-timeline-clock]')

      if (countdownElement) countdownElement.textContent = formatArrivalTime(liveEtaSeconds)
      if (clockElement) clockElement.textContent = formatEtaClockFromNow(liveEtaSeconds)
    })
  }

  function refreshArrivalCountdowns() {
    if (document.hidden) return
    const arrivalElements = document.querySelectorAll('.arrival-item[data-arrival-time]')
    if (!arrivalElements.length) return
    const now = Date.now()
    arrivalElements.forEach((element) => {
      const arrivalTime = Number(element.dataset.arrivalTime)
      if (!Number.isFinite(arrivalTime)) return

      const countdownElement = element.querySelector('.arrival-countdown')
      const statusElement = element.querySelector('.arrival-status')
      if (!countdownElement || !statusElement) return

      const diffSeconds = Math.floor((arrivalTime - now) / 1000)
      const scheduleDeviation = Number(element.dataset.scheduleDeviation ?? 0)
      const serviceStatus = getArrivalServiceStatus(arrivalTime, scheduleDeviation)
      const serviceTone = getStatusTone(serviceStatus)

      countdownElement.textContent = formatArrivalTime(diffSeconds)
      const statusLabel = formatArrivalStatusLabel(serviceStatus, copyValue)
      statusElement.textContent = statusLabel
      statusElement.className = `arrival-status arrival-status-${serviceTone}`
    })
  }

  return {
    formatServiceStatus,
    getRealtimeOffset,
    getVehicleStatusClass,
    getVehicleStatusPills,
    renderStatusPills,
    formatVehicleArrivalMessage,
    formatVehicleStatus,
    renderLineStatusMarquee,
    refreshVehicleStatusMessages,
    refreshVehicleCountdownDisplays,
    refreshArrivalCountdowns,
  }
}
