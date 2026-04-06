import { formatArrivalStatusLabel } from '../arrivals'

export function createStationDialogRenderers({
  state,
  elements,
  copyValue,
  formatArrivalTime,
  formatClockTime,
  formatDirectionLabel,
  getDialogDirectionSummary,
  getVehicleLabel,
  getVehicleLabelPlural,
  getStatusTone,
  getArrivalServiceStatus,
  resolveVehicleForArrival,
  syncDialogDisplayScroll,
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
        const distanceMiles = arrival.distanceFromStop * 0.000621371
        const distanceStr = distanceMiles >= 0.1
          ? `${distanceMiles.toFixed(1)} mi`
          : `${Math.round(arrival.distanceFromStop * 3.28084)} ft`
        const stopsStr = copyValue('stopAway', arrival.numberOfStopsAway)
        precisionInfo = ` • ${distanceStr} • ${stopsStr}`
      }

      const clockTime = diffSec > 0 ? formatClockTime(arrivalMs) : ''

      const resolvedVehicle = resolveVehicleForArrival(arrival)
      const hasVehicleLink = Boolean(resolvedVehicle || arrival.rawVehicleId || arrival.vehicleId !== '--')
      const wrapperTag = hasVehicleLink ? 'button' : 'div'
      const interactiveAttrs = hasVehicleLink
        ? ` type="button" data-arrival-vehicle-id="${arrival.rawVehicleId || ''}" data-arrival-vehicle-label="${arrival.vehicleId || ''}" data-arrival-line-id="${arrival.lineId || ''}" aria-label="${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}"`
        : ''

      const statusLabel = formatArrivalStatusLabel(serviceStatus, copyValue)
      const sourceBadge = arrival.isRealtime ? copyValue('realtimeBadge') : copyValue('scheduleBadge')
      const sourceClass = arrival.isRealtime ? 'live' : 'sched'

      return `
        <div class="arrival-card">
          <${wrapperTag} class="arrival-item${hasVehicleLink ? ' arrival-item-clickable' : ''}" data-arrival-time="${arrival.arrivalTime}" data-schedule-deviation="${arrival.scheduleDeviation ?? 0}"${interactiveAttrs}>
            <span class="arrival-row arrival-row-top">
              <span class="arrival-meta">
                <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
                <span class="arrival-destination">${arrival.destination}</span>
              </span>
              <span class="arrival-source arrival-source-${sourceClass}">${sourceBadge}</span>
            </span>
            <span class="arrival-row arrival-row-mid">
              ${statusLabel ? `<span class="arrival-status arrival-status-${serviceTone}">${statusLabel}</span>` : ''}
              ${clockTime ? `<span class="arrival-clock">${clockTime}</span>` : ''}
              <span class="arrival-countdown">${timeStr}</span>
            </span>
            <span class="arrival-row arrival-row-bottom">
              <span class="arrival-vehicle">${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}</span>
              ${precisionInfo ? `<span class="arrival-precision">${precisionInfo}</span>` : ''}
            </span>
          </${wrapperTag}>
        </div>
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

      if (state.dialogDisplayMode) {
        const pinnedItems = bucket.slice(0, 1)
        const scrollingItems = bucket.slice(1)
        pinnedElement.innerHTML = pinnedItems.map(renderArrival).join('')
        listElement.innerHTML = scrollingItems.length
          ? scrollingItems.map(renderArrival).join('')
          : `<div class="arrivals-empty">${copyValue('noAdditionalVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
      } else if (bucket.length >= 2) {
        const nextUp = bucket.slice(0, 1)
        const following = bucket.slice(1)
        pinnedElement.innerHTML =
          `<p class="arrivals-pinned-kicker">${copyValue('nextUpKicker')}</p>` +
          nextUp.map(renderArrival).join('')
        listElement.innerHTML =
          `<p class="arrivals-following-heading">${copyValue('followingVehiclesHeading')}</p>` +
          following.map(renderArrival).join('')
      } else {
        pinnedElement.innerHTML =
          `<p class="arrivals-pinned-kicker">${copyValue('nextUpKicker')}</p>` +
          bucket.map(renderArrival).join('')
        listElement.innerHTML = ''
      }
    }

    renderBucket(arrivals.nb, arrivalsNbPinned, arrivalsNb)
    renderBucket(arrivals.sb, arrivalsSbPinned, arrivalsSb)
    
    // Update arrivals titles with marquee support
    const nbTitle = formatDirectionLabel('▲', nbSummary, { includeSymbol: true })
    const sbTitle = formatDirectionLabel('▼', sbSummary, { includeSymbol: true })
    
    arrivalsTitleNb.innerHTML = `
      <span class="arrivals-title-track">
        <span class="arrivals-title-text">${nbTitle}</span>
        <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">${nbTitle}</span>
      </span>
    `
    arrivalsTitleSb.innerHTML = `
      <span class="arrivals-title-track">
        <span class="arrivals-title-text">${sbTitle}</span>
        <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">${sbTitle}</span>
      </span>
    `

    syncDialogDisplayScroll()
  }

  return { renderArrivalLists }
}
