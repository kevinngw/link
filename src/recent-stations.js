const RECENT_STATIONS_KEY = 'link-pulse-recent-stations'
const RECENT_STATIONS_MAX_COUNT = 10

/**
 * Create recent stations manager
 */
export function createRecentStationsManager() {
  function getRecentStations() {
    try {
      const raw = window.sessionStorage.getItem(RECENT_STATIONS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function saveRecentStations(stations) {
    try {
      window.sessionStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(stations.slice(0, RECENT_STATIONS_MAX_COUNT)))
    } catch {}
  }

  function addRecentStation(station, line, systemId) {
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
      viewedAt: Date.now(),
    })
    
    saveRecentStations(filtered)
    return filtered
  }

  function clearRecentStations() {
    try {
      window.sessionStorage.removeItem(RECENT_STATIONS_KEY)
    } catch {}
  }

  return {
    getRecentStations,
    addRecentStation,
    clearRecentStations,
  }
}
