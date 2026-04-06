import { RIDE_MODE_HEADSUP_STOPS, RIDE_MODE_HEADSUP_STOPS_SHORT_TRIP, RIDE_MODE_SHORT_TRIP_THRESHOLD, RIDE_MODE_MAX_MISSED_TICKS } from './config'

/**
 * Ride Mode — notify the user when their vehicle approaches a destination stop.
 *
 * Uses existing vehicle position data (no GPS) to track stops-away count.
 * Two notification thresholds: heads-up (3 stops) and arrival (1 stop / next stop).
 */
export function createRideMode({ state, copyValue, getAllVehiclesById, getTrainTimelineEntries, showToast, lightImpact, notificationSuccess }) {
  function getNotificationPermissionState() {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  }

  /**
   * Activate ride mode for a specific vehicle + destination.
   *
   * @param {object} params
   * @param {string} params.vehicleId
   * @param {string} params.lineId
   * @param {string} params.destinationStationId
   * @param {string} params.destinationLabel
   * @param {number} params.destinationIndex - index in layout.stations
   * @param {string} params.directionSymbol - '▲' or '▼'
   * @param {number} params.currentIndex - vehicle's currentIndex at activation
   */
  function activateRideMode({ vehicleId, lineId, destinationStationId, destinationLabel, destinationIndex, directionSymbol, currentIndex }) {
    state.rideMode = {
      vehicleId,
      lineId,
      destinationStationId,
      destinationLabel,
      destinationIndex,
      directionSymbol,
      activationIndex: currentIndex,
      headsUpFired: false,
      arrivalFired: false,
      missedTicks: 0,
      activatedAt: Date.now(),
    }

    showToast(copyValue('rideModeActivated', destinationLabel))
    void lightImpact()
    requestNotificationPermission()
  }

  function deactivateRideMode(reason) {
    if (!state.rideMode) return
    state.rideMode = null
    if (reason) showToast(reason)
  }

  function isRideModeActive() {
    return state.rideMode !== null
  }

  /**
   * Compute how many stops away the vehicle is from the destination.
   * Returns null if vehicle or layout data is unavailable.
   */
  function getRideModeStatus() {
    if (!state.rideMode) return null

    const vehicle = getAllVehiclesById().get(state.rideMode.vehicleId)
    if (!vehicle) return null

    const layout = state.layouts.get(state.rideMode.lineId)
    if (!layout?.stations?.length) return null

    const timeline = getTrainTimelineEntries(vehicle, layout)
    const destinationEntry = timeline.find((entry) => entry.stationId === state.rideMode.destinationStationId)

    // Count stops away = number of timeline entries before (and including) the destination
    const destinationTimelineIndex = timeline.findIndex((entry) => entry.stationId === state.rideMode.destinationStationId)
    const stopsAway = destinationTimelineIndex >= 0 ? destinationTimelineIndex : null
    const etaSeconds = destinationEntry?.etaSeconds ?? null

    return {
      stopsAway,
      etaSeconds,
      destinationLabel: state.rideMode.destinationLabel,
      vehicleId: state.rideMode.vehicleId,
      lineId: state.rideMode.lineId,
    }
  }

  /**
   * Called after every vehicle data refresh (~15s).
   * Checks progress and fires notifications at thresholds.
   */
  function checkRideModeProgress() {
    if (!state.rideMode) return

    const vehicle = getAllVehiclesById().get(state.rideMode.vehicleId)

    // Vehicle disappeared from API
    if (!vehicle) {
      state.rideMode.missedTicks += 1
      if (state.rideMode.missedTicks >= RIDE_MODE_MAX_MISSED_TICKS) {
        deactivateRideMode(copyValue('rideModeLost'))
      }
      return
    }

    // Reset missed ticks when vehicle found
    state.rideMode.missedTicks = 0

    // Direction changed — deactivate
    if (vehicle.directionSymbol !== state.rideMode.directionSymbol) {
      deactivateRideMode(copyValue('rideModeDirectionChanged'))
      return
    }

    const status = getRideModeStatus()
    if (!status || status.stopsAway === null) return

    const { stopsAway } = status
    const totalStops = Math.abs(state.rideMode.destinationIndex - state.rideMode.activationIndex)
    const headsUpThreshold = totalStops < RIDE_MODE_SHORT_TRIP_THRESHOLD
      ? RIDE_MODE_HEADSUP_STOPS_SHORT_TRIP
      : RIDE_MODE_HEADSUP_STOPS

    // Already past destination — fire arrival immediately
    if (stopsAway <= 0) {
      if (!state.rideMode.arrivalFired) {
        fireArrivalNotification()
      }
      deactivateRideMode(copyValue('rideModeDeactivated'))
      return
    }

    // Arrival threshold: next stop is the destination
    if (stopsAway <= 1 && !state.rideMode.arrivalFired) {
      fireArrivalNotification()
      deactivateRideMode(copyValue('rideModeDeactivated'))
      return
    }

    // Heads-up threshold
    if (stopsAway <= headsUpThreshold && !state.rideMode.headsUpFired) {
      state.rideMode.headsUpFired = true
      showToast(copyValue('rideModeHeadsUp', state.rideMode.destinationLabel, stopsAway))
      void lightImpact()
    }
  }

  function fireArrivalNotification() {
    if (!state.rideMode) return
    state.rideMode.arrivalFired = true
    const label = state.rideMode.destinationLabel
    showToast(copyValue('rideModeArrival', label))
    void notificationSuccess()
    sendWebNotification(
      copyValue('rideModeArrival', label),
      copyValue('rideModeDeactivated'),
    )
  }

  // --- Web Notification API ---

  async function requestNotificationPermission() {
    const permissionState = getNotificationPermissionState()
    if (permissionState === 'unsupported' || permissionState === 'granted' || permissionState === 'denied') {
      return permissionState
    }

    try {
      return await Notification.requestPermission()
    } catch {
      return getNotificationPermissionState()
    }
  }

  function sendWebNotification(title, body) {
    if (getNotificationPermissionState() !== 'granted') return
    try {
      new Notification(title, { body, icon: '/link/icon-192.png', tag: 'ride-mode' })
    } catch {
      // Notification constructor can throw on some platforms
    }
  }

  return {
    activateRideMode,
    deactivateRideMode,
    isRideModeActive,
    getRideModeStatus,
    checkRideModeProgress,
    getNotificationPermissionState,
    requestNotificationPermission,
  }
}
