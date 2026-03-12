import { getBearingDegrees } from '../utils'
import { TRANSFER_MAX_WALK_KM } from '../config'

export function createStationDialogRenderers({
  state,
  elements,
  copyValue,
  formatArrivalTime,
  formatDirectionLabel,
  formatWalkDistance,
  getDialogDirectionSummary,
  getVehicleLabel,
  getVehicleLabelPlural,
  getStatusTone,
  getArrivalServiceStatus,
  isOptionalNavigationEnabled,
  getAllVehicles,
  syncDialogDisplayScroll,
  attachDialogArrivalClickHandlers,
  attachTransferClickHandlers,
}) {
  const {
    arrivalsNbPinned,
    arrivalsNb,
    arrivalsSbPinned,
    arrivalsSb,
    arrivalsTitleNb,
    arrivalsTitleSb,
    transferSection,
  } = elements

  function renderTransferRadar(station, recommendations) {
    if (!station || !recommendations.length) return ''

    const maxDistance = Math.max(...recommendations.map((item) => item.distanceKm), TRANSFER_MAX_WALK_KM / 2)
    const center = 82

    return `
      <div class="transfer-radar">
        <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
          <circle cx="${center}" cy="${center}" r="64" class="transfer-radar-ring"></circle>
          <circle cx="${center}" cy="${center}" r="44" class="transfer-radar-ring"></circle>
          <circle cx="${center}" cy="${center}" r="24" class="transfer-radar-ring"></circle>
          <circle cx="${center}" cy="${center}" r="8" class="transfer-radar-core"></circle>
          ${recommendations
            .map((item) => {
              const bearing = getBearingDegrees(station, item.stop)
              const radius = 22 + (item.distanceKm / maxDistance) * 44
              const x = center + Math.sin((bearing * Math.PI) / 180) * radius
              const y = center - Math.cos((bearing * Math.PI) / 180) * radius
              return `
                <g>
                  <line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="transfer-radar-spoke"></line>
                  <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${item.line.color};"></circle>
                </g>
              `
            })
            .join('')}
        </svg>
        <div class="transfer-radar-copy">
          <p class="headway-chart-title">${state.language === 'zh-CN' ? '换乘雷达' : 'Transfer Radar'}</p>
          <p class="headway-chart-copy">${state.language === 'zh-CN' ? '中心为当前站，越远表示步行越久' : 'Center is this station; farther dots mean longer walks'}</p>
        </div>
      </div>
    `
  }

  function renderArrivalLists(arrivals, loading = false) {
    const now = Date.now()
    const navigationEnabled = isOptionalNavigationEnabled()

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

      const liveVehicle = navigationEnabled && arrival.rawVehicleId
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
      arrivalsNb.innerHTML = `<div class="arrival-item muted">${copyValue('loadingArrivals')}</div>`
      arrivalsSb.innerHTML = `<div class="arrival-item muted">${copyValue('loadingArrivals')}</div>`
      syncDialogDisplayScroll()
      return
    }

    const renderBucket = (bucket, pinnedElement, listElement) => {
      if (!bucket.length) {
        pinnedElement.innerHTML = ''
        listElement.innerHTML = `<div class="arrival-item muted">${copyValue('noUpcomingVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
        return
      }

      const pinnedItems = state.dialogDisplayMode ? bucket.slice(0, 2) : []
      const scrollingItems = state.dialogDisplayMode ? bucket.slice(2) : bucket

      pinnedElement.innerHTML = pinnedItems.map(renderArrival).join('')
      listElement.innerHTML = scrollingItems.length
        ? scrollingItems.map(renderArrival).join('')
        : state.dialogDisplayMode
          ? `<div class="arrival-item muted">${copyValue('noAdditionalVehicles', getVehicleLabelPlural().toLowerCase())}</div>`
          : ''
    }

    renderBucket(arrivals.nb, arrivalsNbPinned, arrivalsNb)
    renderBucket(arrivals.sb, arrivalsSbPinned, arrivalsSb)
    arrivalsTitleNb.textContent = formatDirectionLabel('▲', nbSummary, { includeSymbol: true })
    arrivalsTitleSb.textContent = formatDirectionLabel('▼', sbSummary, { includeSymbol: true })

    if (navigationEnabled) {
      attachDialogArrivalClickHandlers()
    }
    syncDialogDisplayScroll()
  }

  function renderTransferRecommendations(recommendations, loading = false, station = state.currentDialogStation) {
    const navigationEnabled = isOptionalNavigationEnabled()

    if (loading) {
      transferSection.hidden = false
      transferSection.innerHTML = `
        <div class="transfer-panel">
          <div class="transfer-panel-header">
            <h4 class="arrivals-title">${copyValue('transfers')}</h4>
            <p class="transfer-panel-copy">${copyValue('checkingNearbyConnections')}</p>
          </div>
          <div class="transfer-list">
            <div class="transfer-card transfer-card-loading">${copyValue('loadingTransferRecommendations')}</div>
          </div>
        </div>
      `
      return
    }

    if (!recommendations.length) {
      transferSection.hidden = true
      transferSection.innerHTML = ''
      return
    }

    transferSection.hidden = false
    transferSection.innerHTML = `
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${copyValue('transfers')}</h4>
          <p class="transfer-panel-copy">${copyValue('closestBoardableConnections')}</p>
        </div>
        ${renderTransferRadar(station, recommendations)}
        <div class="transfer-list">
          ${recommendations
            .map(
              (recommendation) => {
                const wrapperTag = navigationEnabled ? 'button' : 'article'
                const interactiveAttrs = navigationEnabled
                  ? `type="button" data-transfer-system-id="${recommendation.systemId}" data-transfer-line-id="${recommendation.line.id}" data-transfer-stop-id="${recommendation.stop.id}" aria-label="${recommendation.line.name} ${copyValue('walkToStop', recommendation.walkMinutes, recommendation.stop.name)}"`
                  : ''

                return `
                <${wrapperTag}
                  class="transfer-card"
                  ${interactiveAttrs}
                >
                  <div class="transfer-card-main">
                    <span class="arrival-line-token" style="--line-color:${recommendation.line.color};">${recommendation.line.name[0]}</span>
                    <div class="transfer-card-copy">
                      <p class="transfer-card-title">${recommendation.line.name} <span class="transfer-system-chip">${recommendation.systemName}</span></p>
                      <p class="transfer-card-stop">${copyValue('walkToStop', recommendation.walkMinutes, recommendation.stop.name)}</p>
                      <p class="transfer-card-meta">${formatWalkDistance(recommendation.distanceKm)}${recommendation.arrival ? ` • ${copyValue('toDestination', recommendation.arrival.destination)}` : ''}</p>
                    </div>
                  </div>
                  <div class="transfer-card-side">
                    <span class="transfer-card-badge transfer-card-badge-${recommendation.tone}">${recommendation.badge}</span>
                    <span class="transfer-card-time">${recommendation.timeText}</span>
                  </div>
                </${wrapperTag}>
              `
              },
            )
            .join('')}
        </div>
      </div>
    `
    if (navigationEnabled) {
      attachTransferClickHandlers()
    }
  }

  return { renderArrivalLists, renderTransferRecommendations }
}
