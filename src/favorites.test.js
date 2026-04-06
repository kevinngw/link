import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFavoritesManager } from './favorites'

const storage = vi.hoisted(() => {
  let favorites = []
  return {
    getStoredJSON: vi.fn(() => favorites),
    setStoredJSON: vi.fn(async (_key, nextFavorites) => {
      favorites = nextFavorites
    }),
    reset() {
      favorites = []
    },
  }
})

vi.mock('./native/storage', () => ({
  getStoredJSON: storage.getStoredJSON,
  setStoredJSON: storage.setStoredJSON,
}))

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

function makeState(system = makeSystem()) {
  return {
    activeSystemId: system.id,
    lines: system.lines,
    systemsById: new Map([[system.id, system]]),
  }
}

function createManager(state = makeState()) {
  return createFavoritesManager({
    state,
    showStationDialog: vi.fn(),
    switchSystem: vi.fn(),
    showToast: vi.fn(),
  })
}

describe('createFavoritesManager', () => {
  beforeEach(() => {
    storage.reset()
    storage.getStoredJSON.mockClear()
    storage.setStoredJSON.mockClear()
  })

  it('adds a station favorite and reports favorite state', async () => {
    const system = makeSystem()
    const manager = createManager(makeState(system))

    manager.addFavorite(system.lines[0].stops[0], system.lines[0], system.id)
    await Promise.resolve()

    expect(manager.isFavorite('stop-1', 'line-1', system.id)).toBe(true)
    expect(manager.getFavorites()[0]).toMatchObject({
      type: 'station',
      itemKey: 'station:system-a:line-1:stop-1',
      stationName: 'Station One',
    })
  })

  it('adds a train favorite and reports train favorite state', async () => {
    const manager = createManager()

    manager.addFavoriteTrain({
      id: '1_100',
      label: '100',
      lineId: 'line-1',
      lineName: 'Line 1',
      lineColor: '#ff0000',
      directionSymbol: '▲',
    }, 'system-a')
    await Promise.resolve()

    expect(manager.isFavoriteTrain('1_100', 'system-a')).toBe(true)
    expect(manager.getFavorites()[0]).toMatchObject({
      type: 'train',
      itemKey: 'train:system-a:1_100',
      vehicleLabel: '100',
    })
  })

  it('moves mixed favorites in stored order', async () => {
    const system = makeSystem()
    const manager = createManager(makeState(system))

    manager.addFavorite(system.lines[0].stops[0], system.lines[0], system.id)
    await Promise.resolve()
    manager.addFavoriteTrain({
      id: '1_100',
      label: '100',
      lineId: 'line-1',
      lineName: 'Line 1',
      lineColor: '#ff0000',
      directionSymbol: '▲',
    }, system.id)
    await Promise.resolve()

    manager.moveFavorite('station:system-a:line-1:stop-1', 'up')
    await Promise.resolve()

    expect(manager.getFavorites().map((favorite) => favorite.itemKey)).toEqual([
      'station:system-a:line-1:stop-1',
      'train:system-a:1_100',
    ])
  })

  it('returns mixed display data with station resolution metadata', async () => {
    const system = makeSystem()
    const manager = createManager(makeState(system))

    manager.addFavoriteTrain({
      id: '1_100',
      label: '100',
      lineId: 'line-1',
      lineName: 'Line 1',
      lineColor: '#ff0000',
      directionSymbol: '▲',
    }, system.id)
    await Promise.resolve()
    manager.addFavorite(system.lines[0].stops[0], system.lines[0], system.id)
    await Promise.resolve()

    const displayData = manager.getFavoriteDisplayData()

    expect(displayData[0]).toMatchObject({
      type: 'station',
      exists: true,
      station: { id: 'stop-1' },
    })
    expect(displayData[1]).toMatchObject({
      type: 'train',
      vehicleId: '1_100',
    })
  })

  it('opens a station favorite when it still exists', async () => {
    const system = makeSystem()
    const showStationDialog = vi.fn().mockResolvedValue(undefined)
    const manager = createFavoritesManager({
      state: makeState(system),
      showStationDialog,
      switchSystem: vi.fn(),
      showToast: vi.fn(),
    })

    await manager.handleFavoriteClick({
      type: 'station',
      itemKey: 'station:system-a:line-1:stop-1',
      systemId: 'system-a',
      lineId: 'line-1',
      stationId: 'stop-1',
      stationName: 'Station One',
    })

    expect(showStationDialog).toHaveBeenCalledWith(system.lines[0].stops[0])
  })

  it('shows a warning toast when a station favorite is missing', async () => {
    const showToast = vi.fn()
    const manager = createFavoritesManager({
      state: makeState(),
      showStationDialog: vi.fn(),
      switchSystem: vi.fn(),
      showToast,
    })

    await manager.handleFavoriteClick({
      type: 'station',
      itemKey: 'station:system-a:line-1:stop-deleted',
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
