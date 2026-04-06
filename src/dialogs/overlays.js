import { closeDialogAnimated, escapeHtml, sanitizeUrl } from '../utils'

export function createOverlayDialogs({
  state,
  elements,
  copyValue,
  formatAlertSeverity,
  formatAlertEffect,
  getAlertsForLine,
  getDirectionBaseLabel,
  getVehicleLabel,
  getVehicleDestinationLabel,
  getTrainTimelineEntries,
  getStatusTone,
  getVehicleStatusPills,
  renderStatusPills,
  formatArrivalTime,
  formatEtaClockFromNow,
  onStationClick,
}) {
  const {
    trainDialog,
    trainDialogTitle,
    trainDialogSubtitle,
    trainDialogLine,
    trainDialogStatus,
    alertDialog,
    alertDialogTitle,
    alertDialogSubtitle,
    alertDialogLines,
    alertDialogBody,
    alertDialogLink,
  } = elements

  function closeTrainDialog() {
    state.currentTrainId = ''
    closeDialogAnimated(trainDialog)
  }

  function closeAlertDialog() {
    closeDialogAnimated(alertDialog)
  }

  function renderAlertListDialog(line) {
    const lineAlerts = getAlertsForLine(line.id)
    alertDialogTitle.textContent = copyValue('affectedLineAlerts', line.name, lineAlerts.length)
    alertDialogSubtitle.textContent = copyValue('activeAlerts', lineAlerts.length)
    alertDialogLines.textContent = line.name
    alertDialogBody.textContent = ''
    alertDialogBody.innerHTML = lineAlerts.length
      ? lineAlerts
          .map(
            (alert) => {
              const safeTitle = escapeHtml(alert.title) || copyValue('serviceAlert')
              const safeDescription = escapeHtml(alert.description) || copyValue('noAdditionalAlertDetails')
              const safeUrl = sanitizeUrl(alert.url)
              return `
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${formatAlertSeverity(alert.severity)} • ${formatAlertEffect(alert.effect)}</p>
                <p class="alert-dialog-item-title">${safeTitle}</p>
                <p class="alert-dialog-item-copy">${safeDescription}</p>
                ${
                  safeUrl
                    ? `<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${safeUrl}" target="_blank" rel="noreferrer">${copyValue('readOfficialAlert')}</a></p>`
                    : ''
                }
              </article>
            `},
          )
          .join('')
      : `<p class="alert-dialog-item-copy">${copyValue('noActiveAlerts')}</p>`
    alertDialogLink.hidden = true
    alertDialogLink.removeAttribute('href')

    if (!alertDialog.open) alertDialog.showModal()
  }

  function renderTrainDialog(vehicle) {
    const isBetweenStops = vehicle.fromLabel !== vehicle.toLabel && vehicle.progress > 0 && vehicle.progress < 1
    const previousName = isBetweenStops ? vehicle.fromLabel : vehicle.previousLabel
    const currentName = isBetweenStops ? `${vehicle.fromLabel} -> ${vehicle.toLabel}` : vehicle.currentStopLabel
    const currentLabel = isBetweenStops ? 'Between' : 'Now'
    const nextName = isBetweenStops ? vehicle.toLabel : vehicle.upcomingLabel
    const segmentProgress = isBetweenStops ? vehicle.progress : 0.5
    const layout = state.layouts.get(vehicle.lineId)
    const timelineEntries = getTrainTimelineEntries(vehicle, layout)
    const destinationLabel = layout ? getVehicleDestinationLabel(vehicle, layout) : vehicle.upcomingLabel
    const terminalEtaSeconds = timelineEntries.at(-1)?.etaSeconds ?? Math.max(0, vehicle.nextOffset ?? 0)
    const directionLabel = getDirectionBaseLabel(vehicle.directionSymbol)

    trainDialogTitle.textContent = `${vehicle.lineName} ${getVehicleLabel()} ${vehicle.label}`
    trainDialogSubtitle.textContent = copyValue('directionTo', directionLabel, destinationLabel)
    trainDialogStatus.className = `train-detail-status train-list-status-${getStatusTone(vehicle.serviceStatus)}`
    trainDialogStatus.innerHTML = renderStatusPills(getVehicleStatusPills(vehicle))
    trainDialog.querySelector('.train-eta-panel')?.remove()
    trainDialogLine.innerHTML = `
      <div class="train-detail-spine" style="--line-color:${vehicle.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${vehicle.lineColor}; --segment-progress:${segmentProgress}; --direction-offset:${vehicle.directionSymbol === '▼' ? '10px' : '-10px'};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop train-detail-stop-clickable" data-spine-station-id="${vehicle.previousStopId}" role="button" tabindex="0" aria-label="${escapeHtml(previousName)}">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${copyValue('previous')}</p>
          <p class="train-detail-name">${previousName}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current train-detail-stop-clickable" data-spine-station-id="${vehicle.currentStopId}" role="button" tabindex="0" aria-label="${escapeHtml(currentName)}">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${currentLabel === 'Between' ? copyValue('betweenLabel') : copyValue('now')}</p>
          <p class="train-detail-name">${currentName}</p>
        </div>
      </div>
      <div class="train-detail-stop train-detail-stop-clickable" data-spine-station-id="${vehicle.upcomingStopId}" role="button" tabindex="0" aria-label="${escapeHtml(nextName)}">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${copyValue('next')}</p>
          <p class="train-detail-name">${nextName}</p>
        </div>
      </div>
    `
    trainDialogLine.insertAdjacentHTML(
      'afterend',
      `
        <section class="train-eta-panel">
          <div class="train-eta-summary">
            <div class="metric-chip">
              <p class="metric-chip-label">${copyValue('direction')}</p>
              <p class="metric-chip-value">${directionLabel}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${copyValue('terminal')}</p>
              <p class="metric-chip-value">${destinationLabel}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${copyValue('etaToTerminal')}</p>
              <p class="metric-chip-value" data-vehicle-terminal-countdown="${vehicle.id}">${formatArrivalTime(terminalEtaSeconds)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${copyValue('upcomingStops')}</p>
              <p class="train-eta-header-copy">${copyValue('liveEtaNow')}</p>
            </div>
            ${timelineEntries.length
              ? timelineEntries
                .map(
                  (entry) => `
                    <article
                      class="train-eta-stop${entry.isNext ? ' is-next' : ''}${entry.isTerminal ? ' is-terminal' : ''}"
                      data-train-timeline-entry
                      data-base-eta-seconds="${entry.etaSeconds}"
                      data-rendered-at="${Date.now()}"
                      ${entry.stationId ? `data-timeline-station-id="${entry.stationId}" role="button" tabindex="0" aria-label="${escapeHtml(entry.label)}"` : ''}
                    >
                      <div>
                        <p class="train-eta-stop-label">${entry.isNext ? copyValue('nextStop') : entry.isTerminal ? copyValue('terminal') : copyValue('upcoming')}</p>
                        <p class="train-eta-stop-name">${entry.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown" data-train-timeline-countdown>${formatArrivalTime(entry.etaSeconds)}</p>
                        <p class="train-eta-stop-clock" data-train-timeline-clock>${formatEtaClockFromNow(entry.etaSeconds)}</p>
                      </div>
                    </article>
                  `,
                )
                .join('')
              : `<p class="train-readout muted">${copyValue('noDownstreamEta')}</p>`}
          </div>
        </section>
      `,
    )

    if (!trainDialog.open) trainDialog.showModal()
  }

  // Event delegation for spine/timeline station clicks (registered once)
  function handleTrainDialogInteraction(event) {
    const el = event.target.closest('[data-spine-station-id], [data-timeline-station-id]')
    if (!el) return
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return
    if (event.type === 'keydown') event.preventDefault()
    const stationId = el.dataset.spineStationId || el.dataset.timelineStationId
    const lineId = state.lines.find((line) => state.vehiclesByLine.get(line.id)?.some((v) => v.id === state.currentTrainId))?.id
    if (stationId && lineId) onStationClick(stationId, lineId)
  }
  trainDialog.addEventListener('click', handleTrainDialogInteraction)
  trainDialog.addEventListener('keydown', handleTrainDialogInteraction)

  return {
    closeTrainDialog,
    closeAlertDialog,
    renderAlertListDialog,
    renderTrainDialog,
  }
}
