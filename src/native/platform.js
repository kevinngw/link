import { Capacitor } from '@capacitor/core'

export function getPlatform() {
  return Capacitor.getPlatform()
}

export function isNativePlatform() {
  return Capacitor.isNativePlatform()
}

export function isIOSPlatform() {
  return getPlatform() === 'ios'
}

export function shouldRegisterServiceWorker() {
  return !isNativePlatform()
}
