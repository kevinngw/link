export function createStationDialogRenderers({
  state,
  elements,
  copyValue,
  formatArrivalTime,
  formatDirectionLabel,
  getDialogDirectionSummary,
  getVehicleLabel,
  getVehicleLabelPlural,
  getStatusTone,
  getArrivalServiceStatus,
  getAllVehicles,
  syncDialogDisplayScroll,
  attachDialogArrivalClickHandlers,
}) {
  const {
    arrivalsNbPinned,
    arrivalsNb,
    arrivalsSbPinned,
    arrivalsSb,
    arrivalsTitleNb,
    arrivalsTitleSb,
  } = elements

  function renderArrivalLists(arrivals, loading = false) {
    const now = Date.now()

    const renderArrival = (arrival) => {
      const arrivalMs = arrival.arrivalTime
      const diffSec = Math.floor((arrivalMs - now) / 1000)
      const timeStr = formatArrivalTime(diffSec)
      const serviceStatus = getArrivalServiceStatus(arrival.arrivalTime, arrival.scheduleDeviation ?? 0)
      const serviceTone = getStatusTone(serviceStatus)

      let precisionInfo = ''
      if (arrival.distanceFromStop > 0) {
        const distanceStr = arrival.distanceFromStop >= 1000
          ? `${(arrival.distanceFromStop / 1000).toFixed(1)}km`
          : `${Math.round(arrival.distanceFromStop)}m`
        const stopsStr = copyValue('stopAway', arrival.numberOfStopsAway)
        precisionInfo = ` • ${distanceStr} • ${stopsStr}`
      }

      const liveVehicle = arrival.rawVehicleId
        ? getAllVehicles().find((vehicle) => vehicle.id === arrival.rawVehicleId)
        : null
      const wrapperTag = liveVehicle ? 'button' : 'div'
      const interactiveAttrs = liveVehicle
        ? ` type="button" data-arrival-vehicle-id="${liveVehicle.id}" aria-label="${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}"`
        : ''

      return `
        <${wrapperTag} class="arrival-item${liveVehicle ? ' arrival-item-clickable' : ''}" data-arrival-time="${arrival.arrivalTime}" data-schedule-deviation="${arrival.scheduleDeviation ?? 0}"${interactiveAttrs}>
          <span class="arrival-meta">
            <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
            <span class="arrival-copy">
              <span class="arrival-vehicle">${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}</span>
              <span class="arrival-destination">${copyValue('toDestination', arrival.destination)}</span>
            </span>
          </span>
          <span class="arrival-side">
            <span class="arrival-status arrival-status-${serviceTone}">${serviceStatus}</span>
            <span class="arrival-time">
              <span class="arrival-countdown">${timeStr}</span>
              <span class="arrival-precision">${precisionInfo}</span>
            </span>
          </span>
        </${wrapperTag}>
      `
    }

    const nbSummary = getDialogDirectionSummary('▲', arrivals.nb)
    const sbSummary = getDialogDirectionSummary('▼', arrivals.sb)

    if (loading) {
      arrivalsNbPinned.innerHTML = ''
      arrivalsSbPinned.innerHTML = ''
      arrivalsNb.innerHTML = `<div class="arrivals-loading">${copyValue('loadingArrivals')}</div>`
      arrivalsSb.innerHTML = `<div class="arrivals-loading">${copyValue('loadingArrivals')}</div>`
      syncDialogDisplayScroll()
      return
    }

    const renderBucket = (bucket, pinnedElement, listElement) => {
      if (!bucket.length) {
        pinnedElement.innerHTML = ''
        listElement.innerHTML = `<div class="arrivals-empty">${copyValue('noUpcomingVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
        return
      }

      const pinnedItems = state.dialogDisplayMode ? bucket.slice(0, 2) : []
      const scrollingItems = state.dialogDisplayMode ? bucket.slice(2) : bucket

      pinnedElement.innerHTML = pinnedItems.map(renderArrival).join('')
      listElement.innerHTML = scrollingItems.length
        ? scrollingItems.map(renderArrival).join('')
        : state.dialogDisplayMode
          ? `<div class="arrivals-empty">${copyValue('noAdditionalVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
          : ''
    }

    renderBucket(arrivals.nb, arrivalsNbPinned, arrivalsNb)
    renderBucket(arrivals.sb, arrivalsSbPinned, arrivalsSb)
    arrivalsTitleNb.textContent = formatDirectionLabel('▲', nbSummary, { includeSymbol: true })
    arrivalsTitleSb.textContent = formatDirectionLabel('▼', sbSummary, { includeSymbol: true })

    attachDialogArrivalClickHandlers()
    syncDialogDisplayScroll()
  }

  return { renderArrivalLists }
}
