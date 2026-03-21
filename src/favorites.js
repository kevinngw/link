const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'
const FAVORITES_MAX_COUNT = 20

/**
 * Create favorites manager
 */
export function createFavoritesManager({ state, showStationDialog, switchSystem, showToast }) {
  function getFavorites() {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function saveFavorites(favorites) {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.slice(0, FAVORITES_MAX_COUNT)))
    } catch {}
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

  function getFavoriteDisplayData() {
    const favorites = getFavorites()
    return favorites.map((fav) => {
      const system = state.systemsById.get(fav.systemId)
      const line = system?.lines?.find((l) => l.id === fav.lineId)
      const station = line?.stops?.find((s) => s.id === fav.stationId)
      return {
        ...fav,
        exists: Boolean(station),
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
    getFavoriteDisplayData,
    handleFavoriteClick,
  }
}
