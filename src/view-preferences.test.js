import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_SYSTEM_ID } from './config'
import { getPreferredLineId, getPreferredPage, getPreferredSystemId, LAST_VIEW_STORAGE_KEY, saveLastView } from './view-preferences'

function setLocation(path) {
  window.history.replaceState({}, '', path)
}

function createLocalStorageMock() {
  let store = {}
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
    },
    setItem(key, value) {
      store[key] = String(value)
    },
    clear() {
      store = {}
    },
  }
}

describe('view preferences', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
    })
    setLocation('/link/')
  })

  it('persists the last selected system, page, and line', () => {
    saveLastView({ systemId: 'rapidride', page: 'trains', lineId: 'rapidride-e-line' })

    expect(JSON.parse(window.localStorage.getItem(LAST_VIEW_STORAGE_KEY))).toMatchObject({
      systemId: 'rapidride',
      page: 'trains',
      lineId: 'rapidride-e-line',
    })
  })

  it('restores saved page and system when the URL is clean', () => {
    saveLastView({ systemId: 'swift', page: 'favorites', lineId: 'swift-blue-line' })
    const systemsById = new Map([['link', {}], ['swift', {}]])

    expect(getPreferredPage()).toBe('favorites')
    expect(getPreferredSystemId({ systemsById })).toBe('swift')
  })

  it('keeps explicit URL params ahead of stored preferences', () => {
    saveLastView({ systemId: 'swift', page: 'favorites', lineId: 'swift-blue-line' })
    setLocation('/link/?system=rapidride&page=insights&route=e-line')
    const systemsById = new Map([['link', {}], ['rapidride', {}], ['swift', {}]])

    expect(getPreferredPage()).toBe('insights')
    expect(getPreferredSystemId({ systemsById })).toBe('rapidride')
    expect(getPreferredLineId({ activeSystemId: 'rapidride', lines: [{ id: 'rapidride-e-line' }] })).toBe('')
  })

  it('ignores stale saved systems and pages', () => {
    window.localStorage.setItem(LAST_VIEW_STORAGE_KEY, JSON.stringify({
      systemId: 'retired',
      page: 'settings',
      lineId: 'missing',
    }))

    expect(getPreferredPage()).toBe('map')
    expect(getPreferredSystemId({ systemsById: new Map([['link', {}]]) })).toBe(DEFAULT_SYSTEM_ID)
  })

  it('restores a saved line only for the same system when it still exists', () => {
    saveLastView({ systemId: 'rapidride', page: 'trains', lineId: 'rapidride-e-line' })

    expect(getPreferredLineId({
      activeSystemId: 'rapidride',
      lines: [{ id: 'rapidride-a-line' }, { id: 'rapidride-e-line' }],
    })).toBe('rapidride-e-line')
    expect(getPreferredLineId({
      activeSystemId: 'swift',
      lines: [{ id: 'swift-blue-line' }],
    })).toBe('')
  })
})
