const RECENT_STATIONS_KEY = 'link-pulse-recent-stations'
const RECENT_STATIONS_MAX_COUNT = 10

function parseStoredRecentStations(raw) {
  if (!raw) return []
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : []
}

/**
 * Create recent stations manager
 */
export function createRecentStationsManager() {
  function getRecentStations() {
    try {
      const raw = window.localStorage.getItem(RECENT_STATIONS_KEY)
      if (raw) return parseStoredRecentStations(raw)
    } catch {
      // Fall through to the legacy sessionStorage read below.
    }

    try {
      const legacyRaw = window.sessionStorage.getItem(RECENT_STATIONS_KEY)
      const legacyStations = parseStoredRecentStations(legacyRaw)
      if (legacyStations.length) saveRecentStations(legacyStations)
      return legacyStations
    } catch {
      return []
    }
  }

  function saveRecentStations(stations) {
    try {
      window.localStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(stations.slice(0, RECENT_STATIONS_MAX_COUNT)))
    } catch {}
  }

  function addRecentStation(station, line, systemId, systemName) {
    const recent = getRecentStations()

    // Remove existing entry if present (to move to front)
    const filtered = recent.filter(
      (r) => !(r.stationId === station.id && r.lineId === line.id && r.systemId === systemId)
    )

    // Add new entry at front
    filtered.unshift({
      stationId: station.id,
      stationName: station.name,
      lineId: line.id,
      lineName: line.name,
      lineColor: line.color,
      systemId,
      systemName,
      viewedAt: Date.now(),
    })

    saveRecentStations(filtered)
    return filtered
  }

  function clearRecentStations() {
    try {
      window.localStorage.removeItem(RECENT_STATIONS_KEY)
      window.sessionStorage.removeItem(RECENT_STATIONS_KEY)
    } catch {}
  }

  return {
    getRecentStations,
    addRecentStation,
    clearRecentStations,
  }
}
