import { afterEach, describe, expect, it, vi } from 'vitest'

import { bootstrapApp } from './static-data.js'

const OriginalResizeObserver = globalThis.ResizeObserver
const originalVisualViewport = window.visualViewport

function mockResizeObserver() {
  const observe = vi.fn()
  globalThis.ResizeObserver = vi.fn(function ResizeObserver() {
    this.observe = observe
    this.disconnect = vi.fn()
  })
  return observe
}

function restoreVisualViewport() {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: originalVisualViewport,
  })
}

afterEach(() => {
  globalThis.ResizeObserver = OriginalResizeObserver
  restoreVisualViewport()
})

describe('bootstrapApp', () => {
  it('waits for the first vehicle refresh before the first full render', async () => {
    const observe = mockResizeObserver()
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { addEventListener: vi.fn() },
    })

    const boardElement = document.createElement('section')
    const callOrder = []
    const render = vi.fn(() => {
      callOrder.push('render')
    })
    const refreshVehicles = vi.fn(async (options) => {
      callOrder.push(`refresh:${JSON.stringify(options)}`)
    })
    const syncDialogFromUrl = vi.fn(async () => {
      callOrder.push('sync-dialog')
    })

    const init = bootstrapApp({
      state: {},
      initializeStorage: vi.fn(async () => {
        callOrder.push('storage')
      }),
      getPreferredLanguage: vi.fn(() => 'en'),
      getPreferredTheme: vi.fn(() => 'dark'),
      handleViewportResize: vi.fn(),
      loadStaticData: vi.fn(async () => {
        callOrder.push('static-data')
      }),
      refreshVehicles,
      render,
      refreshLiveMeta: vi.fn(),
      refreshArrivalCountdowns: vi.fn(),
      refreshVehicleStatusMessages: vi.fn(),
      refreshVehicleCountdownDisplays: vi.fn(),
      startInsightsTickerRotation: vi.fn(),
      startLiveRefreshLoop: vi.fn(),
      syncCompactLayoutFromBoard: vi.fn(),
      syncDialogFromUrl,
      updateViewportState: vi.fn(() => {
        callOrder.push('viewport')
      }),
      setLanguage: vi.fn((language) => {
        callOrder.push(`language:${language}`)
      }),
      setTheme: vi.fn((theme) => {
        callOrder.push(`theme:${theme}`)
      }),
      boardElement,
    })

    await init()

    expect(refreshVehicles).toHaveBeenCalledWith({ renderAfter: false })
    expect(render).toHaveBeenCalledTimes(1)
    expect(callOrder).toEqual([
      'storage',
      'language:en',
      'theme:dark',
      'viewport',
      'static-data',
      'refresh:{"renderAfter":false}',
      'render',
      'sync-dialog',
    ])
    expect(observe).toHaveBeenCalledWith(boardElement)
  })
})
