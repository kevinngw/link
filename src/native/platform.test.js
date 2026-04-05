import { afterEach, describe, expect, it, vi } from 'vitest'

const originalTarget = import.meta.env.VITE_TARGET
const originalUserAgent = navigator.userAgent

function restoreTarget() {
  if (originalTarget == null) {
    delete import.meta.env.VITE_TARGET
    return
  }
  import.meta.env.VITE_TARGET = originalTarget
}

function setUserAgent(value) {
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true,
    value,
  })
}

async function loadPlatformModule() {
  vi.resetModules()
  return import('./platform.js')
}

afterEach(() => {
  delete globalThis.Capacitor
  restoreTarget()
  setUserAgent(originalUserAgent)
})

describe('native platform helpers', () => {
  it('treats web builds as web without Capacitor runtime', async () => {
    import.meta.env.VITE_TARGET = 'web'
    const { getPlatform, isNativePlatform, shouldRegisterServiceWorker } = await loadPlatformModule()

    expect(getPlatform()).toBe('web')
    expect(isNativePlatform()).toBe(false)
    expect(shouldRegisterServiceWorker()).toBe(true)
  })

  it('uses the Capacitor global when available', async () => {
    import.meta.env.VITE_TARGET = 'web'
    globalThis.Capacitor = {
      getPlatform: () => 'ios',
      isNativePlatform: () => true,
    }

    const { getPlatform, isIOSPlatform, isNativePlatform } = await loadPlatformModule()

    expect(getPlatform()).toBe('ios')
    expect(isIOSPlatform()).toBe(true)
    expect(isNativePlatform()).toBe(true)
  })

  it('falls back to user agent on native builds when Capacitor is not ready yet', async () => {
    import.meta.env.VITE_TARGET = 'native'
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')

    const { getPlatform, isNativePlatform, shouldRegisterServiceWorker } = await loadPlatformModule()

    expect(getPlatform()).toBe('ios')
    expect(isNativePlatform()).toBe(true)
    expect(shouldRegisterServiceWorker()).toBe(false)
  })

  it('keeps desktop previews of native builds out of native mode', async () => {
    import.meta.env.VITE_TARGET = 'native'
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')

    const { getPlatform, isNativePlatform } = await loadPlatformModule()

    expect(getPlatform()).toBe('web')
    expect(isNativePlatform()).toBe(false)
  })
})
