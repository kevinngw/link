const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'
const FAVORITES_MAX_COUNT = 20

function getFavoriteKey(favorite) {
  return `${favorite.systemId}:${favorite.lineId}:${favorite.stationId}`
}

function sanitizeFavorite(favorite) {
  if (!favorite || typeof favorite !== 'object') return null

  const stationId = String(favorite.stationId ?? '').trim()
  const stationName = String(favorite.stationName ?? '').trim()
  const lineId = String(favorite.lineId ?? '').trim()
  const lineName = String(favorite.lineName ?? '').trim()
  const systemId = String(favorite.systemId ?? '').trim()
  const systemName = String(favorite.systemName ?? systemId).trim() || systemId
  const lineColor = String(favorite.lineColor ?? '#888888').trim() || '#888888'

  if (!stationId || !stationName || !lineId || !lineName || !systemId) return null

  return {
    stationId,
    stationName,
    lineId,
    lineName,
    lineColor,
    systemId,
    systemName,
    addedAt: Number.isFinite(Number(favorite.addedAt)) ? Number(favorite.addedAt) : Date.now(),
  }
}

function normalizeFavoritesPayload(payload) {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
  const rawFavorites = Array.isArray(parsed) ? parsed : parsed?.favorites
  if (!Array.isArray(rawFavorites)) {
    throw new Error('invalid-favorites-payload')
  }

  const seen = new Set()
  const favorites = []
  let skippedCount = 0

  for (const rawFavorite of rawFavorites) {
    const favorite = sanitizeFavorite(rawFavorite)
    if (!favorite) {
      skippedCount += 1
      continue
    }

    const key = getFavoriteKey(favorite)
    if (seen.has(key)) {
      skippedCount += 1
      continue
    }

    seen.add(key)
    favorites.push(favorite)
  }

  return { favorites: favorites.slice(0, FAVORITES_MAX_COUNT), skippedCount }
}

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
      const normalized = normalizeFavoritesPayload(favorites).favorites
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalized))
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

  function exportFavoritesData() {
    return {
      app: 'Link Pulse',
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites: getFavorites(),
    }
  }

  function importFavoritesData(payload, { merge = true } = {}) {
    const { favorites: importedFavorites, skippedCount } = normalizeFavoritesPayload(payload)
    const existingFavorites = merge ? getFavorites() : []
    const seen = new Set(importedFavorites.map(getFavoriteKey))
    const mergedFavorites = [
      ...importedFavorites,
      ...existingFavorites.filter((favorite) => {
        const key = getFavoriteKey(favorite)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    ].slice(0, FAVORITES_MAX_COUNT)

    saveFavorites(mergedFavorites)

    return {
      favorites: mergedFavorites,
      importedCount: importedFavorites.length,
      skippedCount,
    }
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
    exportFavoritesData,
    importFavoritesData,
    handleFavoriteClick,
  }
}
