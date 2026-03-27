import { normalizeName, formatDistanceMeters, getDistanceMeters } from './utils'

const RECENT_SEARCHES_KEY = 'link-pulse-recent-searches'
const RECENT_SEARCHES_MAX = 5

/**
 * Create station search module
 */
export function createStationSearch({
  state,
  elements,
  copyValue,
  closeDialogAnimated,
  showStationDialog,
  switchSystem,
  setStationSearchParams,
  getRecentStations,
  loadSystemDataById,
}) {
  const {
    stationSearchDialog,
    stationSearchInput,
    stationSearchMetaElement,
    stationSearchResultsElement,
    stationLocationButton,
    stationLocationStatusElement,
  } = elements

  let _stationSearchEntriesCache = null
  let _stationSearchEntriesSystemKey = ''
  let _allSystemsLoaded = false

  async function ensureAllSystemsLoaded() {
    if (_allSystemsLoaded) return
    const loadPromises = []
    for (const [systemId, system] of state.systemsById) {
      if (!system.lines) {
        loadPromises.push(loadSystemDataById(state, systemId).catch(() => {}))
      }
    }
    if (loadPromises.length) {
      await Promise.all(loadPromises)
      _stationSearchEntriesCache = null
    }
    _allSystemsLoaded = true
  }

  function getRecentSearches() {
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }

  function addRecentSearch(result) {
    const recents = getRecentSearches()
    const key = `${result.systemId}:${result.lineId}:${result.stationId}`
    const updated = [
      { key, systemId: result.systemId, lineId: result.lineId, stationId: result.stationId, stationName: result.stationName, lineName: result.lineName, lineColor: result.lineColor, systemName: result.systemName },
      ...recents.filter((item) => item.key !== key),
    ].slice(0, RECENT_SEARCHES_MAX)
    try { window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)) } catch {}
  }

  function highlightMatch(text, query) {
    if (!query) return text
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>')
  }

  function getStationSearchEntries() {
    const systemKey = [...state.systemsById.keys()].join(',')
    if (_stationSearchEntriesCache && systemKey === _stationSearchEntriesSystemKey) {
      return _stationSearchEntriesCache
    }

    const entries = []
    for (const system of state.systemsById.values()) {
      for (const line of system.lines ?? []) {
        for (const station of line.stops ?? []) {
          entries.push({
            key: `${system.id}:${line.id}:${station.id}`,
            systemId: system.id,
            systemName: system.name,
            lineId: line.id,
            lineName: line.name,
            lineColor: line.color,
            stationId: station.id,
            stationName: station.name,
            normalizedStationName: normalizeName(station.name),
            aliases: line.stationAliases?.[station.id] ?? [],
            lat: station.lat,
            lon: station.lon,
          })
        }
      }
    }

    _stationSearchEntriesCache = entries
    _stationSearchEntriesSystemKey = systemKey
    return entries
  }

  function getActiveStationSearchResults() {
    return state.stationSearchQuery.trim() ? getStationSearchResults() : getNearbyStationResults()
  }

  function getNearbyStationResults() {
    return state.nearbyStations.slice(0, 8)
  }

  function getNearbyStationSearchEntries(latitude, longitude) {
    const deduped = new Map()

    for (const entry of getStationSearchEntries()) {
      const lat = Number(entry.lat)
      const lon = Number(entry.lon)
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
      const distanceMeters = getDistanceMeters(latitude, longitude, lat, lon)
      const dedupeKey = `${entry.systemId}:${entry.normalizedStationName}`
      const existing = deduped.get(dedupeKey)
      const candidate = { ...entry, distanceMeters }
      if (!existing || candidate.distanceMeters < existing.distanceMeters) {
        deduped.set(dedupeKey, candidate)
      }
    }

    return [...deduped.values()]
      .sort((left, right) => left.distanceMeters - right.distanceMeters || left.stationName.localeCompare(right.stationName))
      .slice(0, 8)
  }

  async function findNearbyStations() {
    if (!navigator.geolocation) {
      state.geolocationError = copyValue('locationUnsupported')
      state.geolocationStatus = ''
      state.nearbyStations = []
      renderStationSearchResults()
      return
    }

    state.isLocating = true
    state.geolocationError = ''
    state.geolocationStatus = copyValue('locationFinding')
    state.stationSearchQuery = ''
    state.highlightedNearbyStationIndex = 0
    renderStationSearchResults()

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 120000,
        })
      })

      const latitude = position.coords?.latitude
      const longitude = position.coords?.longitude
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('invalid-location')
      }

      state.userLocation = { latitude, longitude }
      state.nearbyStations = getNearbyStationSearchEntries(latitude, longitude)
      state.geolocationStatus = state.nearbyStations.length
        ? copyValue('locationFoundNearby', state.nearbyStations.length)
        : copyValue('locationNoNearby')
      state.geolocationError = ''
    } catch (error) {
      const code = error?.code
      state.nearbyStations = []
      state.geolocationStatus = ''
      state.geolocationError = code === 1
        ? copyValue('locationPermissionDenied')
        : code === 2
          ? copyValue('locationUnavailable')
          : code === 3
            ? copyValue('locationTimedOut')
            : copyValue('locationFailed')
    } finally {
      state.isLocating = false
      renderStationSearchResults()
    }
  }

  function getStationSearchResults() {
    const query = state.stationSearchQuery.trim().toLowerCase()
    const entries = getStationSearchEntries()

    const scored = entries.map((entry) => {
      const searchHaystack = [
        entry.stationName,
        entry.normalizedStationName,
        entry.lineName,
        entry.systemName,
        ...entry.aliases,
      ].join(' | ').toLowerCase()

      let score = query ? 0 : 1
      if (query) {
        const stationLower = entry.stationName.toLowerCase()
        const normalizedLower = entry.normalizedStationName.toLowerCase()
        const lineLower = entry.lineName.toLowerCase()
        const systemLower = entry.systemName.toLowerCase()
        const aliasHit = entry.aliases.some((alias) => alias.toLowerCase().includes(query))

        if (stationLower === query || normalizedLower === query) score += 120
        if (stationLower.startsWith(query) || normalizedLower.startsWith(query)) score += 90
        if (stationLower.includes(query) || normalizedLower.includes(query)) score += 70
        if (lineLower.includes(query)) score += 20
        if (systemLower.includes(query)) score += 12
        if (aliasHit) score += 18
        if (!searchHaystack.includes(query)) return null
      }

      return { ...entry, score }
    }).filter(Boolean)

    return scored
      .sort((left, right) => right.score - left.score || left.stationName.localeCompare(right.stationName) || left.lineName.localeCompare(right.lineName))
      .slice(0, 12)
  }

  function getRecentSearchResults() {
    const recents = getRecentSearches()
    if (!recents.length) return []
    return recents.map((recent) => ({
      ...recent,
      normalizedStationName: normalizeName(recent.stationName),
    }))
  }

  function getRecentStationResults() {
    if (!getRecentStations) return []
    const recents = getRecentStations()
    if (!recents.length) return []
    return recents.map((recent) => ({
      key: `${recent.systemId}:${recent.lineId}:${recent.stationId}`,
      systemId: recent.systemId,
      lineId: recent.lineId,
      stationId: recent.stationId,
      stationName: recent.stationName,
      normalizedStationName: normalizeName(recent.stationName),
      lineName: recent.lineName,
      lineColor: recent.lineColor,
    }))
  }

  function renderStationSearchResults() {
    const hasQuery = Boolean(state.stationSearchQuery.trim())
    const nearbyResults = getNearbyStationResults()
    const recentStationResults = !hasQuery && !nearbyResults.length ? getRecentStationResults() : []
    const recentResults = !hasQuery && !nearbyResults.length && !recentStationResults.length ? getRecentSearchResults() : []
    const results = hasQuery ? getStationSearchResults() : (nearbyResults.length ? nearbyResults : (recentStationResults.length ? recentStationResults : recentResults))
    const isShowingRecentStations = !hasQuery && !nearbyResults.length && recentStationResults.length > 0
    const isShowingRecents = !hasQuery && !nearbyResults.length && !recentStationResults.length && recentResults.length > 0

    state.stationSearchResults = hasQuery ? results : []
    state.highlightedStationSearchIndex = Math.min(state.highlightedStationSearchIndex, Math.max(0, (hasQuery ? results.length : 0) - 1))
    state.highlightedNearbyStationIndex = Math.min(state.highlightedNearbyStationIndex, Math.max(0, (hasQuery ? 0 : results.length) - 1))

    stationLocationButton.textContent = state.isLocating ? copyValue('locationFindingButton') : copyValue('useMyLocation')
    stationLocationButton.disabled = state.isLocating
    stationLocationStatusElement.textContent = state.geolocationError || state.geolocationStatus
    stationLocationStatusElement.classList.toggle('is-error', Boolean(state.geolocationError))

    const query = state.stationSearchQuery.trim().toLowerCase()

    stationSearchMetaElement.textContent = results.length
      ? (hasQuery
        ? `${copyValue('stationSearchResults', results.length)} · ${copyValue('searchKeyboardHint')}`
        : isShowingRecentStations
          ? copyValue('recentlyViewed')
          : isShowingRecents
            ? copyValue('recentSearches')
            : copyValue('nearbyStationsFound', results.length))
      : (hasQuery
        ? copyValue('noStationSearchResults')
        : (state.geolocationError || state.geolocationStatus || copyValue('nearbyStationsHint')))

    stationSearchResultsElement.innerHTML = results.length
      ? results.map((result, index) => {
          const isNearby = !hasQuery && !isShowingRecentStations && !isShowingRecents
          const isActive = hasQuery
            ? index === state.highlightedStationSearchIndex
            : index === state.highlightedNearbyStationIndex
          const displayName = normalizeName(result.stationName)
          const titleHtml = hasQuery ? highlightMatch(displayName, query) : displayName
          const meta = isNearby
            ? `${formatDistanceMeters(result.distanceMeters)} · ${result.lineName} · ${result.systemName}`
            : `${result.lineName} · ${result.systemName}`
          return `
            <div
              class="station-search-result${isActive ? ' is-active' : ''}"
              data-station-search-index="${index}"
              role="button"
              tabindex="0"
            >
              <span class="station-search-result-main">
                <span class="arrival-line-token station-search-result-token" style="--line-color:${result.lineColor};">${result.lineName[0]}</span>
                <span class="station-search-result-copy">
                  <span class="station-search-result-title">${titleHtml}</span>
                  <span class="station-search-result-meta">${meta}</span>
                </span>
              </span>
              <span class="station-search-result-actions">
                ${isNearby ? `<span class="station-search-nearby-badge">${copyValue('nearbyStationBadge')}</span>` : ''}
              </span>
            </div>
          `
        }).join('')
      : `<div class="arrival-item muted">${hasQuery ? copyValue('noStationSearchResults') : (state.geolocationError || state.geolocationStatus || copyValue('nearbyStationsHint'))}</div>`

    const buttons = stationSearchResultsElement.querySelectorAll('[data-station-search-index]')
    buttons.forEach((button) => {
      const selectResult = async () => {
        const source = hasQuery ? state.stationSearchResults : (nearbyResults.length ? state.nearbyStations : (recentStationResults.length ? recentStationResults : recentResults))
        const selected = source[Number(button.dataset.stationSearchIndex)]
        if (selected) await handleStationSearchSelection(selected)
      }
      button.addEventListener('click', selectResult)
      button.addEventListener('keydown', async (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        await selectResult()
      })
    })
  }

  async function openStationSearch(prefill = '', { updateUrl = true } = {}) {
    state.stationSearchQuery = prefill
    state.highlightedStationSearchIndex = 0
    state.highlightedNearbyStationIndex = 0
    if (prefill.trim()) {
      state.nearbyStations = []
      state.geolocationStatus = ''
      state.geolocationError = ''
    }
    state.activeDialogType = 'search'
    if (!stationSearchDialog.open) stationSearchDialog.showModal()
    stationSearchInput.value = prefill
    renderStationSearchResults()
    if (updateUrl) setStationSearchParams(prefill)
    requestAnimationFrame(() => {
      stationSearchInput.focus()
      stationSearchInput.select()
    })
    await ensureAllSystemsLoaded()
    renderStationSearchResults()
  }

  function closeStationSearch() {
    state.stationSearchQuery = ''
    state.stationSearchResults = []
    state.highlightedStationSearchIndex = 0
    state.highlightedNearbyStationIndex = 0
    state.nearbyStations = []
    state.geolocationStatus = ''
    state.geolocationError = ''
    state.isLocating = false
    if (state.activeDialogType === 'search') state.activeDialogType = ''
    closeDialogAnimated(stationSearchDialog)
  }

  async function handleStationSearchSelection(result) {
    addRecentSearch(result)
    closeStationSearch()
    if (result.systemId !== state.activeSystemId) {
      await switchSystem(result.systemId, { updateUrl: true, preserveDialog: false })
    }
    const line = state.lines.find((candidate) => candidate.id === result.lineId)
    const station = line?.stops?.find((candidate) => candidate.id === result.stationId)
    if (station) {
      await showStationDialog(station)
    }
  }

  return {
    getActiveStationSearchResults,
    getStationSearchEntries,
    findNearbyStations,
    renderStationSearchResults,
    openStationSearch,
    closeStationSearch,
    handleStationSearchSelection,
  }
}
