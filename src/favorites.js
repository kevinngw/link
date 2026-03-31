import { getStoredJSON, setStoredJSON } from './native/storage'

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'
const FAVORITES_MAX_COUNT = 20

export { FAVORITES_STORAGE_KEY }

/**
 * Create favorites manager
 */
export function createFavoritesManager({ state, showStationDialog, switchSystem, showToast }) {
  function getFavorites() {
    return getStoredJSON(FAVORITES_STORAGE_KEY, { fallback: [] })
  }

  function saveFavorites(favorites) {
    void setStoredJSON(FAVORITES_STORAGE_KEY, favorites.slice(0, FAVORITES_MAX_COUNT)).catch(() => {})
  }

  function isFavorite(stationId, lineId, systemId) {
    const favorites = getFavorites()
    return favorites.some((f) => f.stationId === stationId && f.lineId === lineId && f.systemId === systemId)
  }

  function addFavorite(station, line, systemId) {
    const favorites = getFavorites()
    const existingIndex = favorites.findIndex((f) => f.stationId === station.id && f.lineId === line.id && f.systemId === systemId)

    if (existingIndex >= 0) {
      // Move to front if already exists
      const [existing] = favorites.splice(existingIndex, 1)
      favorites.unshift(existing)
    } else {
      favorites.unshift({
        stationId: station.id,
        stationName: station.name,
        lineId: line.id,
        lineName: line.name,
        lineColor: line.color,
        systemId,
        systemName: state.systemsById.get(systemId)?.name || systemId,
        addedAt: Date.now(),
      })
    }

    saveFavorites(favorites)
    return favorites
  }

  function removeFavorite(stationId, lineId, systemId) {
    const favorites = getFavorites()
    const filtered = favorites.filter((f) => !(f.stationId === stationId && f.lineId === lineId && f.systemId === systemId))
    saveFavorites(filtered)
    return filtered
  }

  function toggleFavorite(station, line, systemId) {
    if (isFavorite(station.id, line.id, systemId)) {
      return { favorites: removeFavorite(station.id, line.id, systemId), isFavorite: false }
    } else {
      return { favorites: addFavorite(station, line, systemId), isFavorite: true }
    }
  }

  function moveFavorite(stationId, lineId, systemId, direction) {
    const favorites = getFavorites()
    const index = favorites.findIndex((f) => f.stationId === stationId && f.lineId === lineId && f.systemId === systemId)
    if (index < 0) return favorites
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= favorites.length) return favorites
    const temp = favorites[index]
    favorites[index] = favorites[targetIndex]
    favorites[targetIndex] = temp
    saveFavorites(favorites)
    return favorites
  }

  function getFavoriteDisplayData() {
    const favorites = getFavorites()
    return favorites.map((fav) => {
      const system = state.systemsById.get(fav.systemId)
      const hasLoadedSystemData = Boolean(system?.lines)
      const line = system?.lines?.find((l) => l.id === fav.lineId)
      const station = line?.stops?.find((s) => s.id === fav.stationId)
      return {
        ...fav,
        exists: hasLoadedSystemData ? Boolean(station) : true,
        hasLoadedSystemData,
        station,
        line,
        system,
      }
    })
  }

  async function handleFavoriteClick(fav) {
    if (fav.systemId !== state.activeSystemId) {
      await switchSystem(fav.systemId, { updateUrl: true, preserveDialog: false })
    }
    const line = state.lines.find((l) => l.id === fav.lineId)
    const station = line?.stops?.find((s) => s.id === fav.stationId)
    if (station) {
      await showStationDialog(station)
    } else {
      showToast?.(`"${fav.stationName}" is no longer available`, { tone: 'warn' })
    }
  }

  return {
    getFavorites,
    saveFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    moveFavorite,
    getFavoriteDisplayData,
    handleFavoriteClick,
  }
}
