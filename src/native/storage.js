import { IS_NATIVE_BUILD, isNativePlatform } from './platform'

const persistentCache = new Map()
const sessionCache = new Map()
let isInitialized = false
let preferencesPlugin = null

const loadPreferencesPlugin = IS_NATIVE_BUILD
  ? async function loadPreferencesPluginNative() {
      if (!preferencesPlugin) {
        const mod = await import('@capacitor/preferences')
        preferencesPlugin = mod.Preferences
      }
      return preferencesPlugin
    }
  : async function loadPreferencesPluginWeb() {
      return null
    }

function getScopeCache(scope) {
  return scope === 'session' ? sessionCache : persistentCache
}

function getScopedKey(key, scope) {
  return scope === 'session' ? `session:${key}` : key
}

async function readNativePreference(key, scope) {
  const Preferences = await loadPreferencesPlugin()
  if (!Preferences) return null
  const { value } = await Preferences.get({ key: getScopedKey(key, scope) })
  return value ?? null
}

function readWebStorage(key, scope) {
  const storage = scope === 'session' ? window.sessionStorage : window.localStorage
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

async function writeNativePreference(key, value, scope) {
  const Preferences = await loadPreferencesPlugin()
  if (!Preferences) return
  await Preferences.set({ key: getScopedKey(key, scope), value })
}

function writeWebStorage(key, value, scope) {
  const storage = scope === 'session' ? window.sessionStorage : window.localStorage
  try {
    storage.setItem(key, value)
  } catch {}
}

async function removeNativePreference(key, scope) {
  const Preferences = await loadPreferencesPlugin()
  if (!Preferences) return
  await Preferences.remove({ key: getScopedKey(key, scope) })
}

function removeWebStorage(key, scope) {
  const storage = scope === 'session' ? window.sessionStorage : window.localStorage
  try {
    storage.removeItem(key)
  } catch {}
}

async function loadValue(key, scope) {
  if (isNativePlatform()) {
    return readNativePreference(key, scope)
  }
  return readWebStorage(key, scope)
}

export async function initializeAppStorage({ persistentKeys = [], sessionKeys = [] } = {}) {
  const nextPersistentKeys = [...new Set(persistentKeys)]
  const nextSessionKeys = [...new Set(sessionKeys)]

  await Promise.all([
    ...nextPersistentKeys.map(async (key) => {
      persistentCache.set(key, await loadValue(key, 'persistent'))
    }),
    ...nextSessionKeys.map(async (key) => {
      sessionCache.set(key, await loadValue(key, 'session'))
    }),
  ])

  isInitialized = true
}

export function getStoredString(key, { scope = 'persistent' } = {}) {
  if (!isInitialized && !isNativePlatform()) {
    return readWebStorage(key, scope)
  }
  return getScopeCache(scope).get(key) ?? null
}

export function getStoredJSON(key, { scope = 'persistent', fallback = [] } = {}) {
  const raw = getStoredString(key, { scope })
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export async function setStoredString(key, value, { scope = 'persistent' } = {}) {
  const normalizedValue = value == null ? null : String(value)
  const cache = getScopeCache(scope)

  if (normalizedValue == null) {
    cache.set(key, null)
    if (isNativePlatform()) {
      await removeNativePreference(key, scope)
    } else {
      removeWebStorage(key, scope)
    }
    return
  }

  cache.set(key, normalizedValue)
  if (isNativePlatform()) {
    await writeNativePreference(key, normalizedValue, scope)
  } else {
    writeWebStorage(key, normalizedValue, scope)
  }
}

export async function setStoredJSON(key, value, { scope = 'persistent' } = {}) {
  await setStoredString(key, JSON.stringify(value), { scope })
}

export async function removeStoredItem(key, { scope = 'persistent' } = {}) {
  await setStoredString(key, null, { scope })
}
