export function createTrainRenderers(deps) {
  const {
    state,
    copyValue,
    formatArrivalTime,
    formatDirectionLabel,
    formatEtaClockFromNow,
    formatVehicleLocationSummary,
    getAlertsForLine,
    getAllVehicles,
    getRealtimeOffset,
    getTodayServiceSpan,
    getVehicleDestinationLabel,
    getVehicleLabel,
    getVehicleLabelPlural,
    getVehicleStatusClass,
    renderFocusMetrics,
    renderInlineAlerts,
    renderLineStatusMarquee,
    renderServiceReminderChip,
    formatVehicleStatus,
  } = deps

  function renderDirectionBadge(vehicle) {
    return `
      <span class="train-direction-badge">
        ${formatDirectionLabel(
          vehicle.directionSymbol,
          getVehicleDestinationLabel(vehicle, state.layouts.get(vehicle.lineId)),
          { includeSymbol: true },
        )}
      </span>
    `
  }

  function renderQueueItem(vehicle, vehicleLabel) {
    const nextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    return `
      <button class="train-list-item train-queue-item" data-train-id="${vehicle.id}" type="button" aria-label="${vehicle.lineName} ${vehicleLabel} ${vehicle.label}">
        <div class="train-list-main">
          <span class="line-token train-list-token" style="--line-color:${vehicle.lineColor};">${vehicle.lineToken}</span>
          <div>
            <p class="train-list-title">${vehicle.lineName} ${vehicleLabel} ${vehicle.label}</p>
            ${renderDirectionBadge(vehicle)}
            <p class="train-list-subtitle">${copyValue('toDestination', getVehicleDestinationLabel(vehicle, state.layouts.get(vehicle.lineId)))}</p>
            <p class="train-list-status ${getVehicleStatusClass(vehicle, nextOffset)}" data-vehicle-status="${vehicle.id}">${formatVehicleStatus(vehicle)}</p>
          </div>
        </div>
        <div class="train-queue-side">
          <p class="train-queue-time" data-vehicle-next-countdown="${vehicle.id}">${formatArrivalTime(nextOffset)}</p>
          <p class="train-queue-clock" data-vehicle-next-clock="${vehicle.id}">${formatEtaClockFromNow(nextOffset)}</p>
        </div>
      </button>
    `
  }

  function renderTrainList() {
    const vehicles = getAllVehicles().sort((left, right) => left.minutePosition - right.minutePosition)
    const vehicleLabel = getVehicleLabel()
    const vehicleLabelPlural = getVehicleLabelPlural()
    const vehicleLabelPluralLower = vehicleLabelPlural.toLowerCase()

    if (!vehicles.length) {
      return `
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${copyValue('activeVehicles', vehicleLabelPlural)}</h2>
            <p>${copyValue('noLiveVehicles', vehicleLabelPluralLower)}</p>
          </article>
        </section>
      `
    }

    const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
    const groupedRows = visibleLines
      .map((line) => {
        const lineVehicles = vehicles.filter((vehicle) => vehicle.lineId === line.id)
        const lineAlerts = getAlertsForLine(line.id)
        const sortedLineVehicles = [...lineVehicles].sort(
          (left, right) => getRealtimeOffset(left.nextOffset ?? 0) - getRealtimeOffset(right.nextOffset ?? 0),
        )
        const focusVehicle = sortedLineVehicles[0] ?? null
        const queueVehicles = sortedLineVehicles.slice(1)

        return `
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${line.name}</h2>
                    ${renderInlineAlerts(lineAlerts, line.id)}
                  </div>
                  <p>${copyValue('inServiceCount', lineVehicles.length, lineVehicles.length === 1 ? vehicleLabel.toLowerCase() : getVehicleLabelPlural().toLowerCase())} · ${getTodayServiceSpan(line)}</p>
                </div>
              </div>
              ${renderServiceReminderChip(line)}
            </header>
            ${renderLineStatusMarquee(line.color, lineVehicles)}
            <div class="line-readout train-columns train-stack-layout">
              ${
                focusVehicle
                  ? `
                    <button class="train-focus-card train-list-item" data-train-id="${focusVehicle.id}" type="button" aria-label="${focusVehicle.lineName} ${vehicleLabel} ${focusVehicle.label}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${state.language === 'zh-CN' ? '最近一班' : 'Next up'}</p>
                          <p class="train-focus-title">${focusVehicle.lineName} ${vehicleLabel} ${focusVehicle.label}</p>
                          ${renderDirectionBadge(focusVehicle)}
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time" data-vehicle-next-countdown="${focusVehicle.id}">${formatArrivalTime(getRealtimeOffset(focusVehicle.nextOffset ?? 0))}</p>
                          <p class="train-focus-clock" data-vehicle-next-clock="${focusVehicle.id}">${formatEtaClockFromNow(getRealtimeOffset(focusVehicle.nextOffset ?? 0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${copyValue('toDestination', getVehicleDestinationLabel(focusVehicle, state.layouts.get(focusVehicle.lineId)))}</p>
                      <p class="train-focus-segment">${formatVehicleLocationSummary(focusVehicle)}</p>
                      ${renderFocusMetrics(focusVehicle)}
                      <p class="train-list-status ${getVehicleStatusClass(focusVehicle, getRealtimeOffset(focusVehicle.nextOffset ?? 0))}" data-vehicle-status="${focusVehicle.id}">${formatVehicleStatus(focusVehicle)}</p>
                    </button>
                  `
                  : `<p class="train-readout muted">${copyValue('noLiveVehicles', getVehicleLabelPlural().toLowerCase())}</p>`
              }
              ${
                queueVehicles.length
                  ? `
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${state.language === 'zh-CN' ? '后续车次' : 'Following vehicles'}</p>
                      ${queueVehicles.map((v) => renderQueueItem(v, vehicleLabel)).join('')}
                    </div>
                  `
                  : ''
              }
            </div>
          </article>
        `
      })
      .join('')

    return groupedRows
  }

  return { renderTrainList }
}
