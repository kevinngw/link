import { IS_NATIVE_BUILD, isNativePlatform } from './platform'

let geolocationPlugin = null

const loadGeolocationPlugin = IS_NATIVE_BUILD
  ? async function loadGeolocationPluginNative() {
      if (!geolocationPlugin) {
        const mod = await import('@capacitor/geolocation')
        geolocationPlugin = mod.Geolocation
      }
      return geolocationPlugin
    }
  : async function loadGeolocationPluginWeb() {
      return null
    }

function getBrowserLocation(options) {
  if (!navigator.geolocation) {
    const error = new Error('Geolocation unavailable')
    error.code = 0
    throw error
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export async function getCurrentDevicePosition(options) {
  if (!isNativePlatform()) {
    return getBrowserLocation(options)
  }

  const Geolocation = await loadGeolocationPlugin()
  if (!Geolocation) return getBrowserLocation(options)
  const permissions = await Geolocation.checkPermissions()
  if (permissions.location !== 'granted') {
    await Geolocation.requestPermissions()
  }

  return Geolocation.getCurrentPosition(options)
}

export function supportsDeviceLocation() {
  return isNativePlatform() || Boolean(navigator.geolocation)
}
