import { getStoredJSON, setStoredJSON } from './native/storage'

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites-v2'
const FAVORITES_MAX_COUNT = 40

export { FAVORITES_STORAGE_KEY }

function getStationFavoriteItemKey({ stationId, lineId, systemId }) {
  return `station:${systemId}:${lineId}:${stationId}`
}

function getTrainFavoriteItemKey({ vehicleId, systemId }) {
  return `train:${systemId}:${vehicleId}`
}

function normalizeFavoriteRecord(favorite) {
  if (!favorite || typeof favorite !== 'object') return null

  if (favorite.type === 'station' && favorite.stationId && favorite.lineId && favorite.systemId) {
    return {
      ...favorite,
      itemKey: getStationFavoriteItemKey(favorite),
    }
  }

  if (favorite.type === 'train' && favorite.vehicleId && favorite.systemId) {
    return {
      ...favorite,
      itemKey: getTrainFavoriteItemKey(favorite),
    }
  }

  return null
}

/**
 * Create favorites manager
 */
export function createFavoritesManager({ state, showStationDialog, switchSystem, showToast, copyValue }) {
  function getFavorites() {
    const favorites = getStoredJSON(FAVORITES_STORAGE_KEY, { fallback: [] })
    if (!Array.isArray(favorites)) return []
    return favorites.map(normalizeFavoriteRecord).filter(Boolean)
  }

  function getStationFavorites() {
    return getFavorites().filter((favorite) => favorite.type === 'station')
  }

  function saveFavorites(favorites) {
    const normalizedFavorites = favorites
      .map(normalizeFavoriteRecord)
      .filter(Boolean)
      .slice(0, FAVORITES_MAX_COUNT)

    void setStoredJSON(FAVORITES_STORAGE_KEY, normalizedFavorites).catch(() => {})
  }

  function getFavoriteItem(itemKey) {
    return getFavorites().find((favorite) => favorite.itemKey === itemKey) ?? null
  }

  function isFavorite(stationId, lineId, systemId) {
    const itemKey = getStationFavoriteItemKey({ stationId, lineId, systemId })
    return getFavorites().some((favorite) => favorite.itemKey === itemKey)
  }

  function isFavoriteTrain(vehicleId, systemId) {
    const itemKey = getTrainFavoriteItemKey({ vehicleId, systemId })
    return getFavorites().some((favorite) => favorite.itemKey === itemKey)
  }

  function addFavorite(station, line, systemId) {
    const itemKey = getStationFavoriteItemKey({
      stationId: station.id,
      lineId: line.id,
      systemId,
    })
    const willOverflow = getFavorites().length >= FAVORITES_MAX_COUNT
    const favorites = getFavorites().filter((favorite) => favorite.itemKey !== itemKey)

    favorites.unshift({
      type: 'station',
      itemKey,
      stationId: station.id,
      stationName: station.name,
      lineId: line.id,
      lineName: line.name,
      lineColor: line.color,
      systemId,
      systemName: state.systemsById.get(systemId)?.name || systemId,
      addedAt: Date.now(),
    })

    if (willOverflow) {
      showToast?.(copyValue?.('favoritesFull'), { tone: 'warn' })
    }

    saveFavorites(favorites)
    return favorites
  }

  function addFavoriteTrain(vehicle, systemId) {
    const itemKey = getTrainFavoriteItemKey({
      vehicleId: vehicle.id,
      systemId,
    })
    const willOverflow = getFavorites().length >= FAVORITES_MAX_COUNT
    const favorites = getFavorites().filter((favorite) => favorite.itemKey !== itemKey)

    favorites.unshift({
      type: 'train',
      itemKey,
      vehicleId: vehicle.id,
      vehicleLabel: vehicle.label,
      lineId: vehicle.lineId,
      lineName: vehicle.lineName,
      lineColor: vehicle.lineColor,
      directionSymbol: vehicle.directionSymbol,
      systemId,
      systemName: state.systemsById.get(systemId)?.name || systemId,
      addedAt: Date.now(),
    })

    if (willOverflow) {
      showToast?.(copyValue?.('favoritesFull'), { tone: 'warn' })
    }

    saveFavorites(favorites)
    return favorites
  }

  function removeFavorite(stationId, lineId, systemId) {
    const itemKey = getStationFavoriteItemKey({ stationId, lineId, systemId })
    const filtered = getFavorites().filter((favorite) => favorite.itemKey !== itemKey)
    saveFavorites(filtered)
    return filtered
  }

  function removeFavoriteTrain(vehicleId, systemId) {
    const itemKey = getTrainFavoriteItemKey({ vehicleId, systemId })
    const filtered = getFavorites().filter((favorite) => favorite.itemKey !== itemKey)
    saveFavorites(filtered)
    return filtered
  }

  function toggleFavorite(station, line, systemId) {
    if (isFavorite(station.id, line.id, systemId)) {
      return { favorites: removeFavorite(station.id, line.id, systemId), isFavorite: false }
    }

    return { favorites: addFavorite(station, line, systemId), isFavorite: true }
  }

  function toggleFavoriteTrain(vehicle, systemId) {
    if (isFavoriteTrain(vehicle.id, systemId)) {
      return { favorites: removeFavoriteTrain(vehicle.id, systemId), isFavorite: false }
    }

    return { favorites: addFavoriteTrain(vehicle, systemId), isFavorite: true }
  }

  function moveFavorite(itemKey, direction) {
    const favorites = getFavorites()
    const index = favorites.findIndex((favorite) => favorite.itemKey === itemKey)
    if (index < 0) return favorites

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= favorites.length) return favorites

    const nextFavorites = [...favorites]
    const [favorite] = nextFavorites.splice(index, 1)
    nextFavorites.splice(targetIndex, 0, favorite)
    saveFavorites(nextFavorites)
    return nextFavorites
  }

  function getFavoriteDisplayData() {
    return getFavorites().map((favorite) => {
      if (favorite.type !== 'station') return favorite

      const system = state.systemsById.get(favorite.systemId)
      const hasLoadedSystemData = Boolean(system?.lines)
      const line = system?.lines?.find((candidate) => candidate.id === favorite.lineId)
      const station = line?.stops?.find((candidate) => candidate.id === favorite.stationId)

      return {
        ...favorite,
        exists: hasLoadedSystemData ? Boolean(station) : true,
        hasLoadedSystemData,
        station,
        line,
        system,
      }
    })
  }

  async function handleFavoriteClick(favorite) {
    if (favorite.systemId !== state.activeSystemId) {
      await switchSystem(favorite.systemId, { updateUrl: true, preserveDialog: false })
    }

    const line = state.lines.find((candidate) => candidate.id === favorite.lineId)
    const station = line?.stops?.find((candidate) => candidate.id === favorite.stationId)
    if (station) {
      await showStationDialog(station)
    } else {
      showToast?.(copyValue?.('favoritesStationUnavailable', favorite.stationName) || `"${favorite.stationName}" is no longer available`, { tone: 'warn' })
    }
  }

  return {
    getFavorites,
    getStationFavorites,
    getFavoriteItem,
    saveFavorites,
    isFavorite,
    isFavoriteTrain,
    addFavorite,
    addFavoriteTrain,
    removeFavorite,
    removeFavoriteTrain,
    toggleFavorite,
    toggleFavoriteTrain,
    moveFavorite,
    getFavoriteDisplayData,
    handleFavoriteClick,
    getStationFavoriteItemKey,
    getTrainFavoriteItemKey,
  }
}
