// Vertical stagger for overlapping vehicles on the same line segment
const VEHICLE_Y_STAGGER = 1.5

export function createMapRenderer(deps) {
  const {
    state,
    getAlertsForLine,
    getAlertsForStation,
    getTodayServiceSpan,
    getVehicleGhostTrail,
    getVehicleLabel,
    getVehicleLabelPlural,
    copyValue,
    renderInlineAlerts,
    renderLineStatusMarquee,
    renderServiceReminderChip,
  } = deps

  function truncateLabelLine(line, maxChars) {
    if (line.length <= maxChars) return line
    return `${line.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`
  }

  function splitStationLabel(label) {
    const normalizedLabel = String(label).trim().replace(/\s*\/\s*/g, ' / ')
    const maxCharsPerLine = state.compactLayout ? 21 : 28
    const maxLines = 2
    const words = normalizedLabel.split(/\s+/).filter(Boolean)
    if (words.length <= 1 || normalizedLabel.length <= maxCharsPerLine) return [normalizedLabel]

    const lines = []
    let currentLine = ''

    for (let index = 0; index < words.length; index += 1) {
      const word = words[index]
      const candidate = currentLine ? `${currentLine} ${word}` : word

      if (candidate.length <= maxCharsPerLine) {
        currentLine = candidate
        continue
      }

      if (!currentLine) {
        lines.push(truncateLabelLine(word, maxCharsPerLine))
      } else {
        lines.push(currentLine)
        currentLine = word
      }

      if (lines.length === maxLines - 1) {
        const remainder = [currentLine, ...words.slice(index + 1)].filter(Boolean).join(' ')
        lines.push(truncateLabelLine(remainder, maxCharsPerLine))
        return lines
      }
    }

    if (currentLine) lines.push(currentLine)
    return lines.slice(0, maxLines)
  }

  function renderStationLabel(station, layout) {
    const labelLines = splitStationLabel(station.label)
    const baseY = labelLines.length > 1 ? -5 : 5
    const labelClass = `station-label${labelLines.length > 1 ? ' station-label-multiline' : ''}`

    return `
      <text x="${layout.labelX}" y="${baseY}" class="${labelClass}">
        ${labelLines
          .map((line, index) => `<tspan x="${layout.labelX}" dy="${index === 0 ? 0 : 15}">${line}</tspan>`)
          .join('')}
      </text>
    `
  }

  function renderLine(line) {
    const layout = state.layouts.get(line.id)
    const vehicles = state.vehiclesByLine.get(line.id) ?? []
    const lineAlerts = getAlertsForLine(line.id)

    const rows = layout.stations
      .map((station, index) => {
        const prevStation = layout.stations[index - 1]
        const minute = index > 0 ? prevStation.segmentMinutes : ''
        const stationAlerts = getAlertsForStation(station, line)
        const hasAlert = stationAlerts.length > 0
        const alertDotOffset = station.isTerminal ? 15 : 10

        return `
          <g transform="translate(0, ${station.y})" class="station-group${hasAlert ? ' has-alert' : ''}" data-stop-id="${station.id}" style="cursor: pointer;">
            ${
              index > 0
                ? `<text x="0" y="-14" class="segment-time">${minute}</text>
                   <line x1="18" x2="${layout.trackX - 16}" y1="-18" y2="-18" class="segment-line"></line>`
                : ''
            }
            <circle cx="${layout.trackX}" cy="0" r="${station.isTerminal ? 11 : 5}" class="${station.isTerminal ? 'terminal-stop' : 'station-stop'}" style="--line-color:${line.color};"></circle>
            ${
              station.isTerminal
                ? `<text x="${layout.trackX}" y="4" text-anchor="middle" class="terminal-mark">${line.name[0]}</text>`
                : ''
            }
            ${hasAlert ? `<circle cx="${layout.trackX + alertDotOffset}" cy="-8" r="4" class="station-alert-dot"></circle>` : ''}
            ${renderStationLabel(station, layout)}
            <rect x="0" y="-30" width="420" height="60" fill="transparent" class="station-hitbox"></rect>
          </g>
        `
      })
      .join('')

    const trainDots = vehicles
      .map((vehicle, index) => {
        const ghostTrail = getVehicleGhostTrail(line.id, vehicle.id)
        return `
          <g transform="translate(${layout.trackX}, 0)" class="train" data-train-id="${vehicle.id}">
            ${ghostTrail
              .map(
                (ghost, ghostIndex) => `
                  <circle
                    cy="${ghost.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER}"
                    r="${Math.max(3, 7 - ghostIndex)}"
                    class="train-ghost-dot"
                    style="--line-color:${line.color}; --ghost-opacity:${Math.max(0.18, 0.56 - ghostIndex * 0.1)};"
                  ></circle>
                `,
              )
              .join('')}
            <g transform="translate(0, ${vehicle.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER})">
              <circle r="13" class="train-wave" style="--line-color:${line.color}; animation-delay:${index * 0.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}" class="train-arrow" style="--line-color:${line.color};"></path>
            </g>
          </g>
        `
      })
      .join('')

    const vehicleLabel = getVehicleLabel()
    return `
      <article class="line-card" data-line-id="${line.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${line.name}</h2>
                ${renderInlineAlerts(lineAlerts, line.id)}
              </div>
              <p>${copyValue('liveCount', vehicles.length, vehicles.length === 1 ? vehicleLabel.toLowerCase() : getVehicleLabelPlural().toLowerCase())}</p>
              <p>${getTodayServiceSpan(line)}</p>
            </div>
          </div>
          ${renderServiceReminderChip(line)}
        </header>
        ${renderLineStatusMarquee(line.color, vehicles.map((vehicle) => ({ ...vehicle, lineToken: line.name[0] })))}
        <svg viewBox="0 0 ${state.compactLayout ? 320 : 460} ${layout.height}" class="line-diagram" role="img" aria-label="${copyValue('lineDiagramAria', line.name)}">
          <line x1="${layout.trackX}" x2="${layout.trackX}" y1="${layout.stations[0].y}" y2="${layout.stations.at(-1).y}" class="spine" style="--line-color:${line.color};"></line>
          ${rows}
          ${trainDots}
        </svg>
      </article>
    `
  }

  return { renderLine }
}
