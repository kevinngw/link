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

  function renderMiniProgressBar(vehicle) {
    const layout = state.layouts.get(vehicle.lineId)
    if (!layout || !layout.stations.length || !layout.totalMinutes) return ''
    const percent = Math.max(0, Math.min(100, (vehicle.minutePosition / layout.totalMinutes) * 100))
    return `
      <div class="train-focus-metric train-progress-metric" aria-label="${copyValue('lineProgress', Math.round(percent))}">
        <p class="train-focus-metric-label">${copyValue('progress')} · ${copyValue('lineProgress', Math.round(percent))}</p>
        <div class="train-progress-track">
          <div class="train-progress-dot" style="left: ${percent}%;"></div>
        </div>
      </div>
    `
  }

  function renderDirectionFilter(lineId) {
    const current = state.directionFilterByLine.get(lineId) || 'all'
    const options = [
      { value: 'all', label: copyValue('directionAll') },
      { value: '▲', label: '▲' },
      { value: '▼', label: '▼' },
    ]
    return `
      <div class="direction-filter" role="group" aria-label="${copyValue('filterByDirection')}">
        ${options.map((opt) => `
          <button
            type="button"
            class="direction-filter-btn${current === opt.value ? ' direction-filter-active' : ''}"
            data-direction-filter="${opt.value}"
            data-direction-line="${lineId}"
            aria-pressed="${current === opt.value}"
          >${opt.label}</button>
        `).join('')}
      </div>
    `
  }

  function renderGapIndicator(gapMinutes) {
    const rounded = Math.round(gapMinutes)
    const gapClass = gapMinutes >= 15 ? 'gap-large' : gapMinutes >= 10 ? 'gap-medium' : ''
    return `
      <div class="train-headway-gap ${gapClass}" aria-label="${copyValue('headwayGap', rounded)}">
        <span class="train-headway-line"></span>
        <span class="train-headway-label">${copyValue('headwayGapLabel', rounded)}</span>
        <span class="train-headway-line"></span>
      </div>
    `
  }

  function renderVehicleCard(vehicle, vehicleLabel) {
    const nextOffset = getRealtimeOffset(vehicle.nextOffset ?? 0)
    const isSignificantDelay = vehicle.isPredicted && vehicle.scheduleDeviation > 180
    const delayCardClass = isSignificantDelay ? `train-card-delayed ${vehicle.delayInfo.colorClass}` : ''
    return `
      <button class="train-focus-card train-list-item ${delayCardClass}" data-train-id="${vehicle.id}" type="button" aria-label="${vehicle.lineName} ${vehicleLabel} ${vehicle.label}">
        <div class="train-focus-header">
          <div>
            <p class="train-focus-title">${vehicle.lineName} ${vehicleLabel} ${vehicle.label}</p>
            ${renderDirectionBadge(vehicle)}
            ${isSignificantDelay ? `<span class="train-delay-badge ${vehicle.delayInfo.colorClass}">${vehicle.delayInfo.text}</span>` : ''}
          </div>
          <div class="train-focus-side">
            <p class="train-focus-time" data-vehicle-next-countdown="${vehicle.id}">${formatArrivalTime(nextOffset)}</p>
            <p class="train-focus-clock" data-vehicle-next-clock="${vehicle.id}">${formatEtaClockFromNow(nextOffset)}</p>
            ${vehicle.upcomingLabel ? `<p class="train-focus-next-stop">${copyValue('nextStop')}: ${vehicle.upcomingLabel}</p>` : ''}
          </div>
        </div>
        ${renderFocusMetrics(vehicle, renderMiniProgressBar(vehicle))}
        <p class="train-list-status ${getVehicleStatusClass(vehicle, nextOffset)}" data-vehicle-status="${vehicle.id}">${formatVehicleStatus(vehicle)}</p>
      </button>
    `
  }

  function renderVehicleCardsWithGaps(vehicles, vehicleLabel) {
    if (!vehicles.length) {
      return `<p class="train-readout muted">${copyValue('noLiveVehicles', getVehicleLabelPlural().toLowerCase())}</p>`
    }
    const cards = []
    for (let i = 0; i < vehicles.length; i++) {
      if (i > 0) {
        const prev = vehicles[i - 1]
        const curr = vehicles[i]
        if (prev.directionSymbol === curr.directionSymbol) {
          const gapMinutes = Math.abs(curr.minutePosition - prev.minutePosition)
          if (gapMinutes >= 2) {
            cards.push(renderGapIndicator(gapMinutes))
          }
        }
      }
      cards.push(renderVehicleCard(vehicles[i], vehicleLabel))
    }
    return cards.join('')
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
          (left, right) => left.minutePosition - right.minutePosition,
        )

        const directionFilter = state.directionFilterByLine.get(line.id) || 'all'
        const filteredVehicles = directionFilter === 'all'
          ? sortedLineVehicles
          : sortedLineVehicles.filter((v) => v.directionSymbol === directionFilter)

        return `
          <article class="line-card train-line-card" style="--line-color:${line.color};">
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
              ${renderDirectionFilter(line.id)}
              ${renderServiceReminderChip(line)}
            </header>
            ${renderLineStatusMarquee(line.color, lineVehicles)}
            <div class="line-readout train-columns train-stack-layout">
              ${renderVehicleCardsWithGaps(filteredVehicles, vehicleLabel)}
            </div>
          </article>
        `
      })
      .join('')

    return groupedRows
  }

  return { renderTrainList }
}
