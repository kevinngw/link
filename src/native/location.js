import { Geolocation } from '@capacitor/geolocation'

import { isNativePlatform } from './platform'

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

  const permissions = await Geolocation.checkPermissions()
  if (permissions.location !== 'granted') {
    await Geolocation.requestPermissions()
  }

  return Geolocation.getCurrentPosition(options)
}

export function supportsDeviceLocation() {
  return isNativePlatform() || Boolean(navigator.geolocation)
}
