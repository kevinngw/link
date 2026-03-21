import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFavoritesManager } from './favorites.js'

function makeState(systemsById = new Map()) {
  return {
    activeSystemId: 'system-a',
    lines: [],
    systemsById,
  }
}

function makeSystem() {
  return {
    id: 'system-a',
    name: 'System A',
    lines: [
      {
        id: 'line-1',
        name: 'Line 1',
        color: '#ff0000',
        stops: [{ id: 'stop-1', name: 'Station One' }],
      },
    ],
  }
}

describe('createFavoritesManager', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('addFavorite / isFavorite', () => {
    it('adds a favorite and reports it as favorite', () => {
      const state = makeState(new Map([['system-a', makeSystem()]]))
      const { addFavorite, isFavorite } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      const line = makeSystem().lines[0]
      const station = line.stops[0]
      addFavorite(station, line, 'system-a')

      expect(isFavorite('stop-1', 'line-1', 'system-a')).toBe(true)
    })

    it('moves existing favorite to front on re-add', () => {
      const state = makeState(new Map([['system-a', makeSystem()]]))
      const { addFavorite, getFavorites } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      const line = makeSystem().lines[0]
      const station = line.stops[0]

      // Add two entries
      addFavorite({ id: 'stop-2', name: 'Station Two' }, { id: 'line-2', name: 'Line 2', color: '#00ff00' }, 'system-a')
      addFavorite(station, line, 'system-a')
      // Re-add first
      addFavorite(station, line, 'system-a')

      const favs = getFavorites()
      expect(favs[0].stationId).toBe('stop-1')
    })
  })

  describe('removeFavorite', () => {
    it('removes a favorite', () => {
      const state = makeState(new Map([['system-a', makeSystem()]]))
      const { addFavorite, removeFavorite, isFavorite } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      const line = makeSystem().lines[0]
      const station = line.stops[0]
      addFavorite(station, line, 'system-a')
      removeFavorite('stop-1', 'line-1', 'system-a')

      expect(isFavorite('stop-1', 'line-1', 'system-a')).toBe(false)
    })
  })

  describe('getFavoriteDisplayData', () => {
    it('marks existing stations as exists=true', () => {
      const system = makeSystem()
      const state = makeState(new Map([['system-a', system]]))
      state.lines = system.lines

      const { addFavorite, getFavoriteDisplayData } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      addFavorite(system.lines[0].stops[0], system.lines[0], 'system-a')
      const data = getFavoriteDisplayData()

      expect(data[0].exists).toBe(true)
      expect(data[0].station.id).toBe('stop-1')
    })

    it('marks removed stations as exists=false', () => {
      const system = makeSystem()
      const state = makeState(new Map([['system-a', system]]))
      state.lines = system.lines

      const { addFavorite, getFavoriteDisplayData } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      // Add favorite for a station not in the system
      addFavorite({ id: 'stop-deleted', name: 'Deleted Station' }, system.lines[0], 'system-a')
      const data = getFavoriteDisplayData()

      expect(data[0].exists).toBe(false)
    })
  })

  describe('handleFavoriteClick', () => {
    it('calls showStationDialog for existing station', async () => {
      const system = makeSystem()
      const state = makeState(new Map([['system-a', system]]))
      state.lines = system.lines
      const showStationDialog = vi.fn().mockResolvedValue(undefined)

      const { handleFavoriteClick } = createFavoritesManager({
        state,
        showStationDialog,
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      await handleFavoriteClick({
        systemId: 'system-a',
        lineId: 'line-1',
        stationId: 'stop-1',
        stationName: 'Station One',
      })

      expect(showStationDialog).toHaveBeenCalledWith(system.lines[0].stops[0])
    })

    it('shows toast for missing station', async () => {
      const system = makeSystem()
      const state = makeState(new Map([['system-a', system]]))
      state.lines = system.lines
      const showToast = vi.fn()

      const { handleFavoriteClick } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast,
      })

      await handleFavoriteClick({
        systemId: 'system-a',
        lineId: 'line-1',
        stationId: 'stop-deleted',
        stationName: 'Old Station',
      })

      expect(showToast).toHaveBeenCalledWith(
        expect.stringContaining('Old Station'),
        expect.objectContaining({ tone: 'warn' }),
      )
    })
  })

  describe('localStorage error handling', () => {
    it('returns empty array when localStorage read fails', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const { getFavorites } = createFavoritesManager({
        state: makeState(),
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      expect(getFavorites()).toEqual([])
    })

    it('does not throw when localStorage write fails', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const state = makeState(new Map([['system-a', makeSystem()]]))
      const { addFavorite } = createFavoritesManager({
        state,
        showStationDialog: vi.fn(),
        switchSystem: vi.fn(),
        showToast: vi.fn(),
      })

      expect(() =>
        addFavorite(makeSystem().lines[0].stops[0], makeSystem().lines[0], 'system-a'),
      ).not.toThrow()
    })
  })
})
