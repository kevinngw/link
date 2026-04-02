import { getStoredJSON, removeStoredItem, setStoredJSON } from './native/storage'

const RECENT_STATIONS_KEY = 'link-pulse-recent-stations'
const RECENT_STATIONS_MAX_COUNT = 10

export { RECENT_STATIONS_KEY }

/**
 * Create recent stations manager
 */
export function createRecentStationsManager() {
  function getRecentStations() {
    return getStoredJSON(RECENT_STATIONS_KEY, { scope: 'session', fallback: [] })
  }

  function saveRecentStations(stations) {
    void setStoredJSON(RECENT_STATIONS_KEY, stations.slice(0, RECENT_STATIONS_MAX_COUNT), { scope: 'session' }).catch(() => {})
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
    void removeStoredItem(RECENT_STATIONS_KEY, { scope: 'session' }).catch(() => {})
  }

  return {
    getRecentStations,
    addRecentStation,
    clearRecentStations,
  }
}
