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
    if (trainDialog.open) trainDialog.close()
  }

  function closeAlertDialog() {
    if (alertDialog.open) alertDialog.close()
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
            (alert) => `
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${formatAlertSeverity(alert.severity)} • ${formatAlertEffect(alert.effect)}</p>
                <p class="alert-dialog-item-title">${alert.title || copyValue('serviceAlert')}</p>
                <p class="alert-dialog-item-copy">${alert.description || copyValue('noAdditionalAlertDetails')}</p>
                ${
                  alert.url
                    ? `<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${alert.url}" target="_blank" rel="noreferrer">${copyValue('readOfficialAlert')}</a></p>`
                    : ''
                }
              </article>
            `,
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
    trainDialogSubtitle.textContent = state.language === 'zh-CN' ? `${directionLabel} · ${copyValue('toDestination', destinationLabel)}` : `${directionLabel} to ${destinationLabel}`
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
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${copyValue('previous')}</p>
          <p class="train-detail-name">${previousName}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${currentLabel === 'Between' ? (state.language === 'zh-CN' ? '区间' : 'Between') : copyValue('now')}</p>
          <p class="train-detail-name">${currentName}</p>
        </div>
      </div>
      <div class="train-detail-stop">
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
              <p class="metric-chip-value">${formatArrivalTime(terminalEtaSeconds)}</p>
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
                    <article class="train-eta-stop${entry.isNext ? ' is-next' : ''}${entry.isTerminal ? ' is-terminal' : ''}">
                      <div>
                        <p class="train-eta-stop-label">${entry.isNext ? copyValue('nextStop') : entry.isTerminal ? copyValue('terminal') : copyValue('upcoming')}</p>
                        <p class="train-eta-stop-name">${entry.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${formatArrivalTime(entry.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${entry.clockTime}</p>
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

  return {
    closeTrainDialog,
    closeAlertDialog,
    renderAlertListDialog,
    renderTrainDialog,
  }
}
