export const BUILD_TARGET = import.meta.env.VITE_TARGET ?? 'web'
export const IS_NATIVE_BUILD = BUILD_TARGET === 'native'

function getCapacitorGlobal() {
  return globalThis.Capacitor ?? null
}

function inferPlatformFromUserAgent() {
  if (typeof navigator === 'undefined') return 'web'
  const userAgent = navigator.userAgent ?? ''
  if (/\b(iPhone|iPad|iPod)\b/i.test(userAgent)) return 'ios'
  if (/\bAndroid\b/i.test(userAgent)) return 'android'
  return 'web'
}

export function getPlatform() {
  const capacitor = getCapacitorGlobal()
  if (typeof capacitor?.getPlatform === 'function') return capacitor.getPlatform()
  if (!IS_NATIVE_BUILD) return 'web'
  return inferPlatformFromUserAgent()
}

export function isNativePlatform() {
  const capacitor = getCapacitorGlobal()
  if (typeof capacitor?.isNativePlatform === 'function') return capacitor.isNativePlatform()
  return getPlatform() !== 'web'
}

export function isIOSPlatform() {
  return getPlatform() === 'ios'
}

export function shouldRegisterServiceWorker() {
  return !IS_NATIVE_BUILD && !isNativePlatform()
}
