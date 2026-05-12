import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { createRecentStationsManager } from './recent-stations'

const STORAGE_KEY = 'link-pulse-recent-stations'

function createStorageMock() {
  let store = {}
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
    },
    setItem(key, value) {
      store[key] = String(value)
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    },
  }
}

function station(id, name = `Station ${id}`) {
  return { id, name }
}

function line(id, name = `Line ${id}`, color = '#22c55e') {
  return { id, name, color }
}

describe('createRecentStationsManager', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
    Object.defineProperty(window, 'sessionStorage', {
      value: createStorageMock(),
      configurable: true,
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-12T03:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('persists recently viewed stations in localStorage', () => {
    const manager = createRecentStationsManager()

    manager.addRecentStation(station('st1', 'Capitol Hill'), line('1-line', '1 Line'), 'link', 'Link')

    const freshManager = createRecentStationsManager()
    expect(freshManager.getRecentStations()).toEqual([
      {
        stationId: 'st1',
        stationName: 'Capitol Hill',
        lineId: '1-line',
        lineName: '1 Line',
        lineColor: '#22c55e',
        systemId: 'link',
        systemName: 'Link',
        viewedAt: Date.parse('2026-05-12T03:00:00Z'),
      },
    ])
  })

  it('moves an existing station to the front instead of duplicating it', () => {
    const manager = createRecentStationsManager()

    manager.addRecentStation(station('st1', 'Capitol Hill'), line('1-line', '1 Line'), 'link', 'Link')
    manager.addRecentStation(station('st2', 'U District'), line('1-line', '1 Line'), 'link', 'Link')
    manager.addRecentStation(station('st1', 'Capitol Hill'), line('1-line', '1 Line'), 'link', 'Link')

    const recents = manager.getRecentStations()
    expect(recents).toHaveLength(2)
    expect(recents.map((recent) => recent.stationId)).toEqual(['st1', 'st2'])
  })

  it('limits recent stations to the most recent ten', () => {
    const manager = createRecentStationsManager()

    for (let index = 0; index < 12; index += 1) {
      manager.addRecentStation(station(`st${index}`), line('1-line'), 'link', 'Link')
    }

    const recents = manager.getRecentStations()
    expect(recents).toHaveLength(10)
    expect(recents[0].stationId).toBe('st11')
    expect(recents.at(-1).stationId).toBe('st2')
  })

  it('migrates legacy sessionStorage recents into localStorage', () => {
    const legacy = [{ stationId: 'legacy', stationName: 'Westlake', lineId: '1-line', lineName: '1 Line', lineColor: '#22c55e', systemId: 'link', systemName: 'Link', viewedAt: 1 }]
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(legacy))

    const manager = createRecentStationsManager()

    expect(manager.getRecentStations()).toEqual(legacy)
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(legacy)
  })

  it('clears both persistent and legacy recent station storage', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ stationId: 'local' }]))
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([{ stationId: 'session' }]))

    createRecentStationsManager().clearRecentStations()

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
