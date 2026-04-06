import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFavoriteTrainsManager } from './favorite-trains'

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

describe('favorite-trains', () => {
  beforeEach(() => {
    storage.reset()
    storage.getStoredJSON.mockClear()
    storage.setStoredJSON.mockClear()
  })

  it('adds a live vehicle as a favorite train', () => {
    const manager = createFavoriteTrainsManager({
      state: { systemsById: new Map([['link', { name: 'Link' }]]) },
    })

    manager.toggleFavoriteTrain({
      id: '1_100',
      label: '100',
      lineId: '1-line',
      lineName: '1 Line',
      lineColor: '#0a0',
      directionSymbol: '▲',
    }, 'link')

    expect(storage.setStoredJSON).toHaveBeenCalledTimes(1)
    expect(storage.setStoredJSON.mock.calls[0][1][0]).toMatchObject({
      vehicleId: '1_100',
      vehicleLabel: '100',
      lineId: '1-line',
      systemId: 'link',
    })
  })

  it('reports favorite state by vehicle and system', async () => {
    const manager = createFavoriteTrainsManager({
      state: { systemsById: new Map() },
    })

    manager.toggleFavoriteTrain({
      id: '1_100',
      label: '100',
      lineId: '1-line',
      lineName: '1 Line',
      lineColor: '#0a0',
      directionSymbol: '▲',
    }, 'link')

    await Promise.resolve()
    expect(manager.isFavoriteTrain('1_100', 'link')).toBe(true)
    expect(manager.isFavoriteTrain('1_100', 'swift')).toBe(false)
  })

  it('removes a favorite train when toggled again', async () => {
    const manager = createFavoriteTrainsManager({
      state: { systemsById: new Map() },
    })
    const vehicle = {
      id: '1_100',
      label: '100',
      lineId: '1-line',
      lineName: '1 Line',
      lineColor: '#0a0',
      directionSymbol: '▲',
    }

    manager.toggleFavoriteTrain(vehicle, 'link')
    await Promise.resolve()
    manager.toggleFavoriteTrain(vehicle, 'link')
    await Promise.resolve()

    expect(manager.isFavoriteTrain('1_100', 'link')).toBe(false)
  })
})
