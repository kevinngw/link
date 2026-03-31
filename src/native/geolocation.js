import { isNative } from './platform'

let GeolocationPlugin = null

async function getPlugin() {
  if (!GeolocationPlugin) {
    const mod = await import('@capacitor/geolocation')
    GeolocationPlugin = mod.Geolocation
  }
  return GeolocationPlugin
}

export async function getCurrentPosition(options = {}) {
  if (isNative()) {
    const plugin = await getPlugin()
    const { location } = await plugin.checkPermissions()
    if (location === 'denied') {
      const result = await plugin.requestPermissions()
      if (result.location === 'denied') {
        throw { code: 1, message: 'Permission denied' }
      }
    }
    const position = await plugin.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 120000,
      ...options,
    })
    return position
  }

  // Web fallback
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 120000,
      ...options,
    })
  })
}
