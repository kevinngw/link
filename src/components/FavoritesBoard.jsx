import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import FavoriteItem from './favorites/FavoriteItem'
import { appState } from '../lib/appState'
import { fetchArrivalsForStopIds, buildArrivalsForLine } from '../lib/apiClient'
import { ARRIVALS_CACHE_TTL_MS, SYSTEM_META } from '../config'
import { normalizeName, slugifyStation } from '../utils'
import { loadSystemDataById } from '../static-data'

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'

function getFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function getFavoriteKey(fav) {
  return `${fav.systemId}:${fav.lineId}:${fav.stationId}`
}

function getStationStopIds(station, line) {
  const aliases = new Set(line.stationAliases?.[station.id] ?? [])
  aliases.add(station.id)
  const platformMatch = station.id.match(/^(.+)-T(\d+)$/)
  if (platformMatch) {
    aliases.add(`${platformMatch[1]}-T${platformMatch[2] === '1' ? '2' : '1'}`)
  }
  const candidates = new Set()
  for (const alias of aliases) {
    const normalized = alias.startsWith(`${line.agencyId}_`) ? alias : `${line.agencyId}_${alias}`
    candidates.add(normalized)
  }
  const baseId = station.id.replace(/-T\d+$/, '')
  candidates.add(baseId.startsWith(`${line.agencyId}_`) ? baseId : `${line.agencyId}_${baseId}`)
  return [...candidates]
}

export default function FavoritesBoard() {
  const { t } = useTranslation()
  const systemsById = useAppStore((s) => s.systemsById)
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const favoriteArrivals = useAppStore((s) => s.favoriteArrivals)
  const updateFavoriteArrivals = useAppStore((s) => s.updateFavoriteArrivals)
  const syncFromAppState = useAppStore((s) => s.syncFromAppState)
  const openStationDialog = useAppStore((s) => s.openStationDialog)
  const showToast = useAppStore((s) => s.showToast)

  const favorites = getFavorites()

  const displayData = favorites.map((fav) => {
    const system = systemsById.get(fav.systemId)
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

  useEffect(() => {
    if (!favorites.length) return
    let cancelled = false
    ;(async () => {
      for (const fav of favorites) {
        if (cancelled) return
        const key = getFavoriteKey(fav)
        const cached = appState.favoriteArrivals.get(key)
        const now = Date.now()
        const isFresh = cached?.fetchedAt && (now - cached.fetchedAt) < ARRIVALS_CACHE_TTL_MS && !cached?.error
        if (isFresh || cached?.loading) continue

        updateFavoriteArrivals(key, { ...(cached ?? {}), loading: true, error: '' })

        try {
          let system = appState.systemsById.get(fav.systemId)
          if (!system?.lines) {
            system = await loadSystemDataById(appState, fav.systemId)
            syncFromAppState()
          }
          const line = system?.lines?.find((l) => l.id === fav.lineId)
          const station = line?.stops?.find((s) => s.id === fav.stationId)

          if (!line || !station) {
            updateFavoriteArrivals(key, { loading: false, error: 'missing', fetchedAt: Date.now(), arrivals: { nb: [], sb: [] } })
            continue
          }

          const stopIds = getStationStopIds(station, line)
          const feed = await fetchArrivalsForStopIds(stopIds)
          const arrivals = buildArrivalsForLine(feed, line, stopIds)
          updateFavoriteArrivals(key, { loading: false, error: '', fetchedAt: Date.now(), arrivals })
        } catch (error) {
          updateFavoriteArrivals(key, { loading: false, error: error?.message || 'request-failed', fetchedAt: Date.now(), arrivals: { nb: [], sb: [] } })
        }
      }
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function saveFavorites(updated) {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated.slice(0, 20)))
    } catch {}
  }

  function handleRemove(stationId, lineId, systemId) {
    const current = getFavorites()
    const updated = current.filter((f) => !(f.stationId === stationId && f.lineId === lineId && f.systemId === systemId))
    saveFavorites(updated)
    showToast({ message: t('favoriteRemoved'), tone: 'info' })
    syncFromAppState()
  }

  function handleMove(stationId, lineId, systemId, direction) {
    const current = getFavorites()
    const index = current.findIndex((f) => f.stationId === stationId && f.lineId === lineId && f.systemId === systemId)
    if (index < 0) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= current.length) return
    const temp = current[index]
    current[index] = current[targetIndex]
    current[targetIndex] = temp
    saveFavorites(current)
    syncFromAppState()
  }

  async function handleFavoriteClick(fav) {
    if (fav.systemId !== activeSystemId) {
      const { applySystemState, loadSystemDataById: loadSys } = await import('../static-data')
      if (!appState.systemsById.get(fav.systemId)?.lines) {
        await loadSys(appState, fav.systemId)
      }
      applySystemState(appState, fav.systemId)
      syncFromAppState()
    }
    const system = appState.systemsById.get(fav.systemId)
    const line = system?.lines?.find((l) => l.id === fav.lineId)
    const station = line?.stops?.find((s) => s.id === fav.stationId)
    if (station) {
      openStationDialog({ station, stationId: station.id })
    } else {
      showToast({ message: `"${fav.stationName}" is no longer available`, tone: 'warn' })
    }
  }

  if (!displayData.length) {
    return (
      <section className="board" style={{ gridTemplateColumns: '1fr' }}>
        <article className="panel-card">
          <h2>{t('favoritesTitle')}</h2>
          <p className="muted">{t('noFavorites')}</p>
          <p className="muted">{t('favoritesHint')}</p>
        </article>
      </section>
    )
  }

  return (
    <article className="panel-card panel-card-wide">
      <header className="panel-header">
        <div>
          <h2>{t('favoritesTitle')}</h2>
          <p className="updated-at">{t('favoritesLiveHint')}</p>
        </div>
      </header>
      <div className="favorites-list">
        {displayData.map((fav) => {
          const key = getFavoriteKey(fav)
          const snapshot = favoriteArrivals.get(key)
          return (
            <FavoriteItem
              key={key}
              fav={fav}
              snapshot={snapshot}
              isCurrentSystem={fav.systemId === activeSystemId}
              t={t}
              onClick={() => handleFavoriteClick(fav)}
              onMove={(dir) => handleMove(fav.stationId, fav.lineId, fav.systemId, dir)}
              onRemove={() => handleRemove(fav.stationId, fav.lineId, fav.systemId)}
            />
          )
        })}
      </div>
    </article>
  )
}
