import {
  OBA_CACHE_TTL_MS,
  OBA_COOLDOWN_BASE_MS,
  OBA_COOLDOWN_MAX_MS,
  OBA_MAX_RETRIES,
} from './config'
import { sleep } from './utils'

export function createObaClient(state) {
  const cache = new Map()
  const queue = []
  let processing = false

  function getGlobalCooldownMs() {
    const exponent = Math.max(0, state.obaRateLimitStreak - 1)
    const baseDelayMs = Math.min(OBA_COOLDOWN_MAX_MS, OBA_COOLDOWN_BASE_MS * 2 ** exponent)
    const jitterMs = Math.round(baseDelayMs * (0.15 + Math.random() * 0.2))
    return Math.min(OBA_COOLDOWN_MAX_MS, baseDelayMs + jitterMs)
  }

  async function waitForObaCooldown() {
    const remainingMs = state.obaCooldownUntil - Date.now()
    if (remainingMs > 0) {
      await sleep(remainingMs)
    }
  }

  function isRateLimitedPayload(payload) {
    return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
  }

  async function processQueue() {
    if (processing) return
    processing = true

    while (queue.length > 0) {
      await waitForObaCooldown()
      
      // Random jitter (0-100ms) to spread out concurrent requests
      await sleep(Math.random() * 100)

      const item = queue.shift()
      const { url, label, attempt, resolve, reject } = item

      let response = null
      let payload = null
      let networkError = null

      try {
        response = await fetch(url, { cache: 'no-store' })
      } catch (error) {
        networkError = error
      }

      if (response !== null) {
        try {
          payload = await response.json()
        } catch {
          payload = null
        }
      }

      const isRateLimitedResponse = response?.status === 429 || isRateLimitedPayload(payload)
      if (response?.ok && !isRateLimitedResponse) {
        state.obaRateLimitStreak = 0
        state.obaCooldownUntil = 0
        cache.set(url, { payload, expiresAt: Date.now() + OBA_CACHE_TTL_MS })
        resolve(payload)
        continue
      }

      const isTransientError = networkError != null ||
        (response != null && (response.status === 429 || (response.status >= 500 && response.status < 600)))

      if (attempt >= OBA_MAX_RETRIES || !isTransientError) {
        if (networkError) reject(networkError)
        else if (payload?.text) reject(new Error(payload.text))
        else reject(new Error(`${label} request failed with ${response?.status ?? 'network error'}`))
        continue
      }

      if (isRateLimitedResponse) {
        state.obaRateLimitStreak += 1
        state.obaCooldownUntil = Date.now() + getGlobalCooldownMs()
      }

      queue.push({ url, label, attempt: attempt + 1, resolve, reject })
    }

    processing = false
  }

  async function fetchJsonWithRetry(url, label) {
    const cached = cache.get(url)
    if (cached && Date.now() < cached.expiresAt) return cached.payload

    return new Promise((resolve, reject) => {
      queue.push({ url, label, attempt: 0, resolve, reject })
      processQueue()
    })
  }

  return {
    fetchJsonWithRetry,
    isRateLimitedPayload,
    waitForObaCooldown,
  }
}
