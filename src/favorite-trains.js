import { getStoredJSON, setStoredJSON } from './native/storage'

const FAVORITE_TRAINS_STORAGE_KEY = 'link-pulse-favorite-trains'
const FAVORITE_TRAINS_MAX_COUNT = 20

export { FAVORITE_TRAINS_STORAGE_KEY }

export function createFavoriteTrainsManager({ state }) {
  function getFavoriteTrains() {
    return getStoredJSON(FAVORITE_TRAINS_STORAGE_KEY, { fallback: [] })
  }

  function saveFavoriteTrains(favorites) {
    void setStoredJSON(FAVORITE_TRAINS_STORAGE_KEY, favorites.slice(0, FAVORITE_TRAINS_MAX_COUNT)).catch(() => {})
  }

  function isFavoriteTrain(vehicleId, systemId) {
    return getFavoriteTrains().some((favorite) => favorite.vehicleId === vehicleId && favorite.systemId === systemId)
  }

  function addFavoriteTrain(vehicle, systemId) {
    const favorites = getFavoriteTrains()
    const existingIndex = favorites.findIndex((favorite) => favorite.vehicleId === vehicle.id && favorite.systemId === systemId)

    const favoriteRecord = {
      vehicleId: vehicle.id,
      vehicleLabel: vehicle.label,
      lineId: vehicle.lineId,
      lineName: vehicle.lineName,
      lineColor: vehicle.lineColor,
      directionSymbol: vehicle.directionSymbol,
      systemId,
      systemName: state.systemsById.get(systemId)?.name || systemId,
      addedAt: Date.now(),
    }

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1)
    }

    favorites.unshift(favoriteRecord)
    saveFavoriteTrains(favorites)
    return favorites
  }

  function removeFavoriteTrain(vehicleId, systemId) {
    const filtered = getFavoriteTrains().filter((favorite) => !(favorite.vehicleId === vehicleId && favorite.systemId === systemId))
    saveFavoriteTrains(filtered)
    return filtered
  }

  function toggleFavoriteTrain(vehicle, systemId) {
    if (isFavoriteTrain(vehicle.id, systemId)) {
      return { favorites: removeFavoriteTrain(vehicle.id, systemId), isFavorite: false }
    }

    return { favorites: addFavoriteTrain(vehicle, systemId), isFavorite: true }
  }

  return {
    getFavoriteTrains,
    isFavoriteTrain,
    addFavoriteTrain,
    removeFavoriteTrain,
    toggleFavoriteTrain,
  }
}
