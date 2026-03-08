import './style.css'
import { registerSW } from 'virtual:pwa-register'

const DATA_URL = './link-data.json'
const VEHICLE_URL = 'https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST'
const LINE_MATCHERS = {
  '100479': /100479/,
  '2LINE': /2LINE/,
}

const state = {
  fetchedAt: '',
  error: '',
  lines: [],
  layouts: new Map(),
  vehiclesByLine: new Map(),
  rawVehicles: [],
}

registerSW({ immediate: true })

document.querySelector('#app').innerHTML = `
  <main class="screen">
    <header class="screen-header">
      <div>
        <p class="screen-kicker">LINK LIVE BOARD</p>
        <h1>1 LINE / 2 LINE</h1>
      </div>
      <div class="screen-meta">
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <section id="board" class="board"></section>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <h3 id="dialog-title">Station</h3>
        <button id="dialog-close" class="dialog-close">&times;</button>
      </header>
      <div class="dialog-body">
        <div class="arrivals-section">
          <h4 class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb" class="arrivals-list"></div>
        </div>
        <div class="arrivals-section">
          <h4 class="arrivals-title">Southbound (▼)</h4>
          <div id="arrivals-sb" class="arrivals-list"></div>
        </div>
      </div>
    </div>
  </dialog>
`

const boardElement = document.querySelector('#board')
const statusPillElement = document.querySelector('#status-pill')
const updatedAtElement = document.querySelector('#updated-at')
const dialog = document.querySelector('#station-dialog')
const dialogTitle = document.querySelector('#dialog-title')
const dialogClose = document.querySelector('#dialog-close')
const arrivalsNb = document.querySelector('#arrivals-nb')
const arrivalsSb = document.querySelector('#arrivals-sb')

dialogClose.addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close()
})

function normalizeName(name) {
  return name
    .replace('Station', '')
    .replace('Univ of Washington', 'UW')
    .replace("Int'l", 'Intl')
    .trim()
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Waiting for snapshot'

  const deltaSeconds = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 1000))
  if (deltaSeconds < 10) return 'Updated now'
  if (deltaSeconds < 60) return `Updated ${deltaSeconds}s ago`
  return `Updated ${Math.round(deltaSeconds / 60)}m ago`
}

function formatArrivalTime(offsetSeconds) {
  if (offsetSeconds <= 0) return 'Arriving'
  const minutes = Math.floor(offsetSeconds / 60)
  const seconds = offsetSeconds % 60
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function buildLayout(line) {
  const orderedStops = [...line.stops].sort((left, right) => right.sequence - right.sequence)
  const stationGap = 48
  const topPadding = 44
  const bottomPadding = 28
  const trackX = 88
  const labelX = 122
  const height = topPadding + bottomPadding + (orderedStops.length - 1) * stationGap
  const stationIndexByStopId = new Map()

  const stations = orderedStops.map((stop, index) => {
    const station = {
      ...stop,
      label: normalizeName(stop.name),
      y: topPadding + index * stationGap,
      index,
      isTerminal: index === 0 || index === orderedStops.length - 1,
    }

    stationIndexByStopId.set(stop.id, index)
    for (const alias of line.stationAliases?.[stop.id] ?? []) {
      stationIndexByStopId.set(alias, index)
      stationIndexByStopId.set(`40_${alias}`, index)
    }

    stationIndexByStopId.set(`40_${stop.id}`, index)
    return station
  })

  let cumulativeMinutes = 0
  for (let index = 0; index < stations.length; index += 1) {
    stations[index].cumulativeMinutes = cumulativeMinutes
    cumulativeMinutes += index < stations.length - 1 ? stations[index].segmentMinutes : 0
  }

  return {
    totalMinutes: cumulativeMinutes,
    height,
    labelX,
    stationGap,
    stationIndexByStopId,
    stations,
    trackX,
  }
}

function inferDirectionSymbol(closestIndex, nextIndex, tripId) {
  if (closestIndex != null && nextIndex != null && closestIndex !== nextIndex) {
    return nextIndex < closestIndex ? '▲' : '▼'
  }

  if (/Lynnwood City Center|Downtown Redmond/.test(tripId)) return '▲'
  if (/Federal Way Downtown|South Bellevue/.test(tripId)) return '▼'
  return '•'
}

function extractTripKey(routeId, tripId) {
  const marker = `_${routeId}_`
  const markerIndex = tripId.lastIndexOf(marker)
  if (markerIndex === -1) return ''
  return tripId.slice(markerIndex + marker.length).replace(/\.\d+$/, '')
}

function parseVehicle(rawVehicle, line, layout) {
  const tripId = rawVehicle.tripStatus?.activeTripId ?? ''
  if (!LINE_MATCHERS[line.id].test(tripId)) return null

  const closestStop = rawVehicle.tripStatus?.closestStop
  const nextStop = rawVehicle.tripStatus?.nextStop
  const closestIndex = layout.stationIndexByStopId.get(closestStop)
  const nextIndex = layout.stationIndexByStopId.get(nextStop)

  if (closestIndex == null && nextIndex == null) return null

  let fromIndex = closestIndex ?? nextIndex
  let toIndex = nextIndex ?? closestIndex

  if (fromIndex > toIndex) {
    const swap = fromIndex
    fromIndex = toIndex
    toIndex = swap
  }

  const currentStation = layout.stations[fromIndex]
  const nextStation = layout.stations[toIndex]
  const closestOffset = rawVehicle.tripStatus?.closestStopTimeOffset ?? 0
  const nextOffset = rawVehicle.tripStatus?.nextStopTimeOffset ?? 0
  const tripKey = extractTripKey(line.id, tripId)
  const lookedUpDirection = line.directionLookup?.[tripKey]
  const directionSymbol =
    lookedUpDirection === '1'
      ? '▲'
      : lookedUpDirection === '0'
        ? '▼'
        : inferDirectionSymbol(closestIndex, nextIndex, tripId)

  let progress = 0
  if (fromIndex !== toIndex && closestOffset < 0 && nextOffset > 0) {
    progress = clamp(Math.abs(closestOffset) / (Math.abs(closestOffset) + nextOffset), 0, 1)
  }

  const y = currentStation.y + (nextStation.y - currentStation.y) * progress
  const segmentMinutes = fromIndex !== toIndex ? currentStation.segmentMinutes : 0
  const minutePosition = currentStation.cumulativeMinutes + segmentMinutes * progress

  return {
    id: rawVehicle.vehicleId,
    label: rawVehicle.vehicleId.replace(/^40_/, ''),
    directionSymbol,
    fromLabel: currentStation.label,
    minutePosition,
    progress,
    toLabel: nextStation.label,
    y,
    currentLabel: currentStation.label,
    nextLabel: nextStation.label,
    status: rawVehicle.tripStatus?.status ?? '',
    closestStop,
    nextStop,
    closestOffset,
    nextOffset,
    rawVehicle,
  }
}

function formatVehicleSegment(vehicle) {
  if (vehicle.fromLabel === vehicle.toLabel || vehicle.progress === 0) {
    return `At ${vehicle.fromLabel}`
  }

  return `${vehicle.fromLabel} -> ${vehicle.toLabel}`
}

function formatDirectionalHeadway(label, vehicles) {
  if (vehicles.length < 2) return `${label} --`

  const sorted = [...vehicles].sort((left, right) => left.minutePosition - right.minutePosition)
  const gaps = []

  for (let index = 1; index < sorted.length; index += 1) {
    gaps.push(Math.max(1, Math.round(sorted[index].minutePosition - sorted[index - 1].minutePosition)))
  }

  return `${label} ${gaps.slice(0, 4).map((gap) => `${gap}m`).join('  ')}`
}

function getArrivalsForStation(stationId, lineId, layout) {
  const vehicles = state.vehiclesByLine.get(lineId) || []
  const stationIndex = layout.stationIndexByStopId.get(stationId)
  if (stationIndex == null) return { nb: [], sb: [] }

  const nbArrivals = []
  const sbArrivals = []

  vehicles.forEach(vehicle => {
    const rv = vehicle.rawVehicle
    if (!rv || !rv.tripStatus) return
    
    const stopTimes = rv.tripStatus.stopTimes || []
    stopTimes.forEach(st => {
      if (st.stopId === stationId || st.stopId === `40_${stationId}`) {
        const arrival = {
          vehicleId: vehicle.label,
          arrivalTime: st.arrivalTime,
          departureTime: st.departureTime,
          distance: st.distanceFromVehicle,
        }
        if (vehicle.directionSymbol === '▲') {
          nbArrivals.push(arrival)
        } else if (vehicle.directionSymbol === '▼') {
          sbArrivals.push(arrival)
        }
      }
    })
  })

  const now = Date.now()
  const sortByArrival = (a, b) => a.arrivalTime - b.arrivalTime
  const filterFuture = a => a.arrivalTime * 1000 > now

  return {
    nb: nbArrivals.filter(filterFuture).sort(sortByArrival).slice(0, 4),
    sb: sbArrivals.filter(filterFuture).sort(sortByArrival).slice(0, 4),
  }
}

function showStationDialog(station, line, layout) {
  dialogTitle.textContent = station.name
  
  const arrivals = getArrivalsForStation(station.id, line.id, layout)
  
  const now = Date.now()
  
  const renderArrival = (a) => {
    const arrivalMs = a.arrivalTime * 1000
    const diffSec = Math.floor((arrivalMs - now) / 1000)
    const timeStr = formatArrivalTime(diffSec)
    return `
      <div class="arrival-item">
        <span class="arrival-vehicle">Train ${a.vehicleId}</span>
        <span class="arrival-time">${timeStr}</span>
      </div>
    `
  }
  
  arrivalsNb.innerHTML = arrivals.nb.length 
    ? arrivals.nb.map(renderArrival).join('')
    : '<div class="arrival-item muted">No upcoming trains</div>'
    
  arrivalsSb.innerHTML = arrivals.sb.length
    ? arrivals.sb.map(renderArrival).join('')
    : '<div class="arrival-item muted">No upcoming trains</div>'
  
  dialog.showModal()
}

function renderLine(line) {
  const layout = state.layouts.get(line.id)
  const vehicles = state.vehiclesByLine.get(line.id) ?? []
  const northboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
  const southboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▼')
  const northboundHeadway = formatDirectionalHeadway('NB HEADWAY', northboundVehicles)
  const southboundHeadway = formatDirectionalHeadway('SB HEADWAY', southboundVehicles)

  const rows = layout.stations
    .map((station, index) => {
      const prevStation = layout.stations[index - 1]
      const minute = index > 0 ? prevStation.segmentMinutes : ''

      return `
        <g transform="translate(0, ${station.y})" class="station-group" data-stop-id="${station.id}" style="cursor: pointer;">
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
          <text x="${layout.labelX}" y="5" class="station-label">${station.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `
    })
    .join('')

  const trainDots = vehicles
    .map(
      (vehicle, index) => `
        <g transform="translate(${layout.trackX}, ${vehicle.y + ((index % 3) - 1) * 1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${line.color}; animation-delay:${index * 0.18}s;"></circle>
          <circle r="5.5" class="train-dot" style="--line-color:${line.color};"></circle>
          <text x="14" y="4" class="train-direction">${vehicle.directionSymbol}</text>
        </g>
      `,
    )
    .join('')

  const renderDirectionColumn = (label, directionVehicles) => `
    <div class="direction-column">
      <p class="direction-column-title">${label}</p>
      ${
        directionVehicles.length
          ? directionVehicles
              .sort((left, right) => left.minutePosition - right.minutePosition)
              .map(
                (vehicle) =>
                  `<p class="train-readout"><span class="train-id">${vehicle.label}</span>${formatVehicleSegment(vehicle)}</p>`,
              )
              .join('')
          : '<p class="train-readout muted">No trains</p>'
      }
    </div>
  `

  return `
    <article class="line-card" data-line-id="${line.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <div>
            <h2>${line.name}</h2>
            <p>${vehicles.length} live trains</p>
          </div>
        </div>
        <div class="headways">
          <p class="headway">${northboundHeadway}</p>
          <p class="headway">${southboundHeadway}</p>
        </div>
      </header>
      <svg viewBox="0 0 360 ${layout.height}" class="line-diagram" role="img" aria-label="${line.name} live LED board">
        <line x1="${layout.trackX}" x2="${layout.trackX}" y1="${layout.stations[0].y}" y2="${layout.stations.at(-1).y}" class="spine" style="--line-color:${line.color};"></line>
        ${rows}
        ${trainDots}
      </svg>
      <div class="line-readout line-readout-grid">
        ${renderDirectionColumn('NB', northboundVehicles)}
        ${renderDirectionColumn('SB', southboundVehicles)}
      </div>
    </article>
  `
}

function attachStationClickHandlers() {
  state.lines.forEach(line => {
    const layout = state.layouts.get(line.id)
    const card = document.querySelector(`.line-card[data-line-id="${line.id}"]`)
    if (!card) return
    
    const stationGroups = card.querySelectorAll('.station-group')
    stationGroups.forEach(group => {
      group.addEventListener('click', () => {
        const stopId = group.dataset.stopId
        const station = layout.stations.find(s => s.id === stopId)
        if (station) {
          showStationDialog(station, line, layout)
        }
      })
    })
  })
}

function render() {
  statusPillElement.textContent = state.error ? 'HOLD' : 'SYNC'
  statusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  updatedAtElement.textContent = state.error
    ? 'Using last successful snapshot'
    : formatRelativeTime(state.fetchedAt)
  boardElement.innerHTML = state.lines.map(renderLine).join('')
  attachStationClickHandlers()
}

async function loadStaticData() {
  const response = await fetch(DATA_URL)
  const payload = await response.json()
  state.lines = payload.lines
  state.layouts = new Map(payload.lines.map((line) => [line.id, buildLayout(line)]))
}

async function refreshVehicles() {
  try {
    const response = await fetch(VEHICLE_URL, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Realtime request failed with ${response.status}`)

    const payload = await response.json()
    state.error = ''
    state.fetchedAt = new Date().toISOString()
    state.rawVehicles = payload.data.list

    for (const line of state.lines) {
      const layout = state.layouts.get(line.id)
      const vehicles = payload.data.list
        .map((vehicle) => parseVehicle(vehicle, line, layout))
        .filter(Boolean)
      state.vehiclesByLine.set(line.id, vehicles)
    }
  } catch (error) {
    state.error = 'Realtime offline'
    console.error(error)
  }

  render()
}

async function init() {
  await loadStaticData()
  render()
  await refreshVehicles()
  window.setInterval(refreshVehicles, 15000)
  window.setInterval(render, 1000)
}

init().catch((error) => {
  statusPillElement.textContent = 'FAIL'
  updatedAtElement.textContent = error.message
  console.error(error)
})
