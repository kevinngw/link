import './style.css'
import { registerSW } from 'virtual:pwa-register'

const DATA_URL = './link-data.json'
const VEHICLE_URL = 'https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST'
const OBA_BASE_URL = 'https://api.pugetsound.onebusaway.org/api/where'
const OBA_KEY = 'TEST'
const ARRIVALS_CACHE_TTL_MS = 20_000
const OBA_MAX_RETRIES = 3
const OBA_RETRY_BASE_DELAY_MS = 800
const COMPACT_LAYOUT_BREAKPOINT = 1100
const THEME_STORAGE_KEY = 'link-pulse-theme'
const LINE_MATCHERS = {
  '100479': /100479/,
  '2LINE': /2LINE/,
}

const state = {
  fetchedAt: '',
  error: '',
  activeTab: 'map',
  activeLineId: '100479',
  compactLayout: false,
  theme: 'dark',
  currentDialogStationId: '',
  lines: [],
  layouts: new Map(),
  vehiclesByLine: new Map(),
  rawVehicles: [],
  arrivalsCache: new Map(),
  activeDialogRequest: 0,
  isSyncingFromUrl: false,
}

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
})

document.querySelector('#app').innerHTML = `
  <main class="screen">
    <header class="screen-header">
      <div>
        <p class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1>LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <section class="tab-bar" aria-label="Board views">
      <button class="tab-button is-active" data-tab="map" type="button">Map</button>
      <button class="tab-button" data-tab="trains" type="button">Trains</button>
    </section>
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
const tabButtons = [...document.querySelectorAll('.tab-button')]
const themeToggleButton = document.querySelector('#theme-toggle')
const statusPillElement = document.querySelector('#status-pill')
const updatedAtElement = document.querySelector('#updated-at')
const dialog = document.querySelector('#station-dialog')
const dialogTitle = document.querySelector('#dialog-title')
const dialogClose = document.querySelector('#dialog-close')
const arrivalsNb = document.querySelector('#arrivals-nb')
const arrivalsSb = document.querySelector('#arrivals-sb')

dialogClose.addEventListener('click', () => closeStationDialog())
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) closeStationDialog()
})
dialog.addEventListener('close', () => {
  if (!state.isSyncingFromUrl) {
    clearStationParam()
  }
})
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.activeTab = button.dataset.tab
    render()
  })
})
themeToggleButton.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
  render()
})

function normalizeName(name) {
  return name
    .replace('Station', '')
    .replace('Univ of Washington', 'UW')
    .replace("Int'l", 'Intl')
    .trim()
}

function getPreferredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return 'dark'
}

function setTheme(theme) {
  state.theme = theme
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

function updateViewportState() {
  const visualViewportWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY
  const innerWidth = window.innerWidth || Number.POSITIVE_INFINITY
  const documentWidth = document.documentElement?.clientWidth || Number.POSITIVE_INFINITY
  const viewportWidth = Math.min(innerWidth, visualViewportWidth, documentWidth)
  state.compactLayout = viewportWidth <= COMPACT_LAYOUT_BREAKPOINT
}

function syncCompactLayoutFromBoard() {
  const gridTemplateColumns = window.getComputedStyle(boardElement).gridTemplateColumns
  const columnCount = gridTemplateColumns
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean).length
  const shouldCompact = columnCount <= 1

  if (shouldCompact !== state.compactLayout) {
    state.compactLayout = shouldCompact
    render()
  }
}

function slugifyStation(value) {
  return value
    .toLowerCase()
    .replace(/['.]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isRateLimitedPayload(payload) {
  return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
}

async function fetchJsonWithRetry(url, label) {
  for (let attempt = 0; attempt <= OBA_MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, { cache: 'no-store' })
    let payload = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    const isRateLimitedResponse = response.status === 429 || isRateLimitedPayload(payload)
    if (response.ok && !isRateLimitedResponse) {
      return payload
    }

    if (attempt === OBA_MAX_RETRIES || !isRateLimitedResponse) {
      if (payload?.text) throw new Error(payload.text)
      throw new Error(`${label} request failed with ${response.status}`)
    }

    const delayMs = OBA_RETRY_BASE_DELAY_MS * 2 ** attempt
    await sleep(delayMs)
  }

  throw new Error(`${label} request failed`)
}

function buildLayout(line) {
  const orderedStops = [...line.stops].sort((left, right) => right.sequence - left.sequence)
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

function classifyVehicleStatus(rawVehicle) {
  const tripStatus = rawVehicle.tripStatus ?? {}
  const status = String(tripStatus.status ?? '').toLowerCase()
  const closestOffset = tripStatus.closestStopTimeOffset ?? 0
  const nextOffset = tripStatus.nextStopTimeOffset ?? 0
  const scheduleDeviation = tripStatus.scheduleDeviation ?? 0
  const isAtPlatform = tripStatus.closestStop && tripStatus.nextStop && tripStatus.closestStop === tripStatus.nextStop
  const isApproaching = status === 'approaching' || (isAtPlatform && Math.abs(nextOffset) <= 90)

  if (isApproaching) return 'ARR'
  if (scheduleDeviation >= 120) return 'DELAY'
  return 'OK'
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
    serviceStatus: classifyVehicleStatus(rawVehicle),
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

function getAllVehicles() {
  return state.lines.flatMap((line) =>
    (state.vehiclesByLine.get(line.id) ?? []).map((vehicle) => ({
      ...vehicle,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    })),
  )
}

function renderLineSwitcher() {
  if (!state.compactLayout || state.lines.length < 2) return ''

  const buttons = state.lines
    .map(
      (line) => `
        <button
          class="line-switcher-button ${line.id === state.activeLineId ? 'is-active' : ''}"
          data-line-switch="${line.id}"
          type="button"
          style="--line-color:${line.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${line.color};">${line.name[0]}</span>
          <span>${line.name}</span>
        </button>
      `,
    )
    .join('')

  return `<section class="line-switcher">${buttons}</section>`
}

function renderArrivalLists(arrivals, loading = false) {
  const now = Date.now()

  const renderArrival = (arrival) => {
    const arrivalMs = arrival.arrivalTime
    const diffSec = Math.floor((arrivalMs - now) / 1000)
    const timeStr = formatArrivalTime(diffSec)
    return `
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
          <span class="arrival-vehicle">${arrival.lineName} Train ${arrival.vehicleId}</span>
        </span>
        <span class="arrival-time">${timeStr}</span>
      </div>
    `
  }

  if (loading) {
    arrivalsNb.innerHTML = '<div class="arrival-item muted">Loading arrivals...</div>'
    arrivalsSb.innerHTML = '<div class="arrival-item muted">Loading arrivals...</div>'
    return
  }

  arrivalsNb.innerHTML = arrivals.nb.length
    ? arrivals.nb.map(renderArrival).join('')
    : '<div class="arrival-item muted">No upcoming trains</div>'

  arrivalsSb.innerHTML = arrivals.sb.length
    ? arrivals.sb.map(renderArrival).join('')
    : '<div class="arrival-item muted">No upcoming trains</div>'
}

function getStationStopIds(station, line) {
  const aliases = new Set(line.stationAliases?.[station.id] ?? [])
  aliases.add(station.id)

  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith('40_') ? alias : `40_${alias}`
    candidates.add(normalized)
  }

  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith('40_') ? baseId : `40_${baseId}`)

  return [...candidates]
}

function getDialogStations(station) {
  const exactMatches = state.lines
    .map((line) => {
      const matchedStation = line.stops.find((stop) => stop.id === station.id)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)

  if (exactMatches.length > 0) return exactMatches

  return state.lines
    .map((line) => {
      const matchedStation = line.stops.find((stop) => stop.name === station.name)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)
}

function findStationByParam(stationParam) {
  if (!stationParam) return null

  const normalizedParam = stationParam.trim().toLowerCase()

  for (const line of state.lines) {
    for (const station of line.stops) {
      const candidates = new Set([
        station.id,
        `40_${station.id}`,
        station.name,
        normalizeName(station.name),
        slugifyStation(station.name),
        slugifyStation(normalizeName(station.name)),
      ])

      for (const alias of line.stationAliases?.[station.id] ?? []) {
        candidates.add(alias)
        candidates.add(`40_${alias}`)
        candidates.add(slugifyStation(alias))
      }

      if ([...candidates].some((candidate) => String(candidate).toLowerCase() === normalizedParam)) {
        return station
      }
    }
  }

  return null
}

function setStationParam(station) {
  const url = new URL(window.location.href)
  url.searchParams.set('station', slugifyStation(station.name))
  window.history.pushState({}, '', url)
}

function clearStationParam() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('station')) return
  url.searchParams.delete('station')
  window.history.pushState({}, '', url)
}

function closeStationDialog() {
  state.currentDialogStationId = ''
  if (dialog.open) {
    dialog.close()
  } else {
    clearStationParam()
  }
}

async function syncDialogFromUrl() {
  const stationParam = new URL(window.location.href).searchParams.get('station')
  const station = findStationByParam(stationParam)

  state.isSyncingFromUrl = true
  try {
    if (!station) {
      state.currentDialogStationId = ''
      if (dialog.open) dialog.close()
      return
    }

    state.activeTab = 'map'
    render()

    if (state.currentDialogStationId === station.id && dialog.open) {
      return
    }

    await showStationDialog(station, false)
  } finally {
    state.isSyncingFromUrl = false
  }
}

function classifyArrivalDirection(arrival, line) {
  const tripKey = extractTripKey(line.id, arrival.tripId ?? '')
  const lookedUpDirection = line.directionLookup?.[tripKey]
  if (lookedUpDirection === '1') return 'nb'
  if (lookedUpDirection === '0') return 'sb'

  const headsign = arrival.tripHeadsign ?? ''
  if (/Lynnwood|Downtown Redmond/i.test(headsign)) return 'nb'
  if (/Federal Way|South Bellevue/i.test(headsign)) return 'sb'
  return ''
}

function getLineRouteId(line) {
  return `40_${line.id}`
}

async function fetchArrivalsForStop(stopId) {
  const url = `${OBA_BASE_URL}/arrivals-and-departures-for-stop/${stopId}.json?key=${OBA_KEY}&minutesAfter=120`
  const payload = await fetchJsonWithRetry(url, 'Arrivals')
  if (payload.code !== 200) {
    throw new Error(payload.text || `Arrivals request failed for ${stopId}`)
  }
  return payload.data?.entry?.arrivalsAndDepartures ?? []
}

async function fetchArrivalsForStopIds(stopIds) {
  const dedupedStopIds = [...new Set(stopIds)]
  const results = await Promise.allSettled(dedupedStopIds.map((stopId) => fetchArrivalsForStop(stopId)))
  const arrivals = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    arrivals.push(...result.value)
  }

  return arrivals
}

function buildArrivalsForLine(arrivalFeed, line) {
  const now = Date.now()
  const seen = new Set()
  const arrivals = { nb: [], sb: [] }

  for (const arrival of arrivalFeed) {
    if (arrival.routeId !== getLineRouteId(line)) continue
    const arrivalTime = arrival.predictedArrivalTime || arrival.scheduledArrivalTime
    if (!arrivalTime || arrivalTime <= now) continue

    const bucket = classifyArrivalDirection(arrival, line)
    if (!bucket) continue

    const dedupeKey = `${arrival.tripId}:${arrival.stopId}:${arrivalTime}`
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)

    arrivals[bucket].push({
      vehicleId: (arrival.vehicleId || '').replace(/^40_/, '') || '--',
      arrivalTime,
      tripId: arrival.tripId,
      lineColor: line.color,
      lineName: line.name,
      lineToken: line.name[0],
    })
  }

  arrivals.nb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  arrivals.sb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  arrivals.nb = arrivals.nb.slice(0, 4)
  arrivals.sb = arrivals.sb.slice(0, 4)
  return arrivals
}

async function getArrivalsForStation(station, line, prefetchedFeed = null) {
  const cacheKey = `${line.id}:${station.id}`
  const cached = state.arrivalsCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < ARRIVALS_CACHE_TTL_MS) {
    return cached.value
  }

  const stopIds = getStationStopIds(station, line)
  const arrivalFeed = prefetchedFeed ?? (await fetchArrivalsForStopIds(stopIds))
  const arrivals = buildArrivalsForLine(arrivalFeed, line)
  state.arrivalsCache.set(cacheKey, { fetchedAt: Date.now(), value: arrivals })
  return arrivals
}

function mergeArrivalBuckets(collections) {
  const merged = { nb: [], sb: [] }

  for (const arrivals of collections) {
    merged.nb.push(...arrivals.nb)
    merged.sb.push(...arrivals.sb)
  }

  merged.nb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  merged.sb.sort((left, right) => left.arrivalTime - right.arrivalTime)
  return merged
}

async function showStationDialog(station, updateUrl = true) {
  dialogTitle.textContent = station.name
  state.currentDialogStationId = station.id

  const requestId = state.activeDialogRequest + 1
  state.activeDialogRequest = requestId
  renderArrivalLists({ nb: [], sb: [] }, true)
  if (updateUrl) {
    setStationParam(station)
  }
  dialog.showModal()

  try {
    const dialogStations = getDialogStations(station)
    const sharedStopIds = dialogStations.flatMap(({ station: matchedStation, line }) => getStationStopIds(matchedStation, line))
    const arrivalFeed = await fetchArrivalsForStopIds(sharedStopIds)
    const arrivalsByLine = await Promise.all(
      dialogStations.map(({ station: matchedStation, line }) => getArrivalsForStation(matchedStation, line, arrivalFeed)),
    )
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))
  } catch (error) {
    if (state.activeDialogRequest !== requestId || !dialog.open) return
    arrivalsNb.innerHTML = `<div class="arrival-item muted">${error.message}</div>`
    arrivalsSb.innerHTML = '<div class="arrival-item muted">Retry in a moment</div>'
  }
}

function renderLine(line) {
  const layout = state.layouts.get(line.id)
  const vehicles = state.vehiclesByLine.get(line.id) ?? []
  const northboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
  const southboundVehicles = vehicles.filter((vehicle) => vehicle.directionSymbol === '▼')

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
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}" class="train-arrow" style="--line-color:${line.color};"></path>
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

function renderTrainList() {
  const vehicles = getAllVehicles().sort((left, right) => left.minutePosition - right.minutePosition)

  if (!vehicles.length) {
    return `
      <section class="line-card">
        <header class="panel-header">
          <h2>Active Trains</h2>
          <p>No live trains</p>
        </header>
      </section>
    `
  }

  const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
  const groupedRows = visibleLines
    .map((line) => {
      const lineVehicles = vehicles.filter((vehicle) => vehicle.lineId === line.id)
      const northboundVehicles = lineVehicles.filter((vehicle) => vehicle.directionSymbol === '▲')
      const southboundVehicles = lineVehicles.filter((vehicle) => vehicle.directionSymbol === '▼')
      const renderTrainColumn = (label, directionVehicles) => `
        <div class="train-direction-column">
          <p class="direction-column-title">${label}</p>
          ${
            directionVehicles.length
              ? directionVehicles
                  .map(
                    (vehicle) => `
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${vehicle.lineColor};">${vehicle.lineToken}</span>
                          <div>
                            <p class="train-list-title">${vehicle.lineName} Train ${vehicle.label}</p>
                            <p class="train-list-subtitle">${formatVehicleSegment(vehicle)}</p>
                            <p class="train-list-status train-list-status-${vehicle.serviceStatus.toLowerCase()}">${vehicle.serviceStatus}</p>
                          </div>
                        </div>
                      </article>
                    `,
                  )
                  .join('')
              : '<p class="train-readout muted">No trains</p>'
          }
        </div>
      `

      return `
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${line.color};">${line.name[0]}</span>
              <div>
                <h2>${line.name}</h2>
                <p>${lineVehicles.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${renderTrainColumn('NB', northboundVehicles)}
            ${renderTrainColumn('SB', southboundVehicles)}
          </div>
        </article>
      `
    })
    .join('')

  return groupedRows
}

function attachLineSwitcherHandlers() {
  const buttons = document.querySelectorAll('[data-line-switch]')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      state.activeLineId = button.dataset.lineSwitch
      render()
    })
  })
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
          showStationDialog(station)
        }
      })
    })
  })
}

function render() {
  themeToggleButton.textContent = state.theme === 'dark' ? 'Light' : 'Dark'
  statusPillElement.textContent = state.error ? 'HOLD' : 'SYNC'
  statusPillElement.classList.toggle('status-pill-error', Boolean(state.error))
  updatedAtElement.textContent = state.error
    ? 'Using last successful snapshot'
    : formatRelativeTime(state.fetchedAt)
  tabButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.tab === state.activeTab))

  if (state.activeTab === 'map') {
    boardElement.className = 'board'
    const visibleLines = state.compactLayout ? state.lines.filter((line) => line.id === state.activeLineId) : state.lines
    boardElement.innerHTML = `${renderLineSwitcher()}${visibleLines.map(renderLine).join('')}`
    attachLineSwitcherHandlers()
    attachStationClickHandlers()
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }

  if (state.activeTab === 'trains') {
    boardElement.className = 'board'
    boardElement.innerHTML = `${renderLineSwitcher()}${renderTrainList()}`
    attachLineSwitcherHandlers()
    queueMicrotask(syncCompactLayoutFromBoard)
    return
  }
}

async function loadStaticData() {
  const response = await fetch(DATA_URL)
  const payload = await response.json()
  state.lines = payload.lines
  state.layouts = new Map(payload.lines.map((line) => [line.id, buildLayout(line)]))
}

async function refreshVehicles() {
  try {
    const payload = await fetchJsonWithRetry(VEHICLE_URL, 'Realtime')
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
  setTheme(getPreferredTheme())
  updateViewportState()
  await loadStaticData()
  render()
  await refreshVehicles()
  await syncDialogFromUrl()
  window.addEventListener('popstate', () => {
    syncDialogFromUrl().catch(console.error)
  })

  const handleViewportResize = () => {
    const previousCompactLayout = state.compactLayout
    updateViewportState()
    if (previousCompactLayout !== state.compactLayout) {
      render()
      return
    }

    syncCompactLayoutFromBoard()
  }

  window.addEventListener('resize', handleViewportResize)
  window.visualViewport?.addEventListener('resize', handleViewportResize)

  const boardResizeObserver = new ResizeObserver(() => {
    syncCompactLayoutFromBoard()
  })
  boardResizeObserver.observe(boardElement)

  window.setInterval(refreshVehicles, 15000)
  window.setInterval(render, 1000)
}

init().catch((error) => {
  statusPillElement.textContent = 'FAIL'
  updatedAtElement.textContent = error.message
  console.error(error)
})
