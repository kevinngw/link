import {
  OBA_COOLDOWN_BASE_MS,
  OBA_COOLDOWN_MAX_MS,
  OBA_MAX_RETRIES,
  OBA_RETRY_BASE_DELAY_MS,
} from './config'
import { sleep } from './utils'

export function createObaClient(state) {
  const inFlight = new Map()

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

  async function _fetchJsonWithRetry(url, label) {
    for (let attempt = 0; attempt <= OBA_MAX_RETRIES; attempt += 1) {
      await waitForObaCooldown()

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
        return payload
      }

      const isTransientError = networkError != null ||
        (response != null && (response.status === 429 || (response.status >= 500 && response.status < 600)))

      if (attempt === OBA_MAX_RETRIES || !isTransientError) {
        if (networkError) throw networkError
        if (payload?.text) throw new Error(payload.text)
        throw new Error(`${label} request failed with ${response?.status ?? 'network error'}`)
      }

      if (isRateLimitedResponse) {
        state.obaRateLimitStreak += 1
        const retryDelayMs = OBA_RETRY_BASE_DELAY_MS * 2 ** attempt
        const cooldownMs = Math.max(retryDelayMs, getGlobalCooldownMs())
        state.obaCooldownUntil = Date.now() + cooldownMs
        await sleep(cooldownMs)
      } else {
        const retryDelayMs = OBA_RETRY_BASE_DELAY_MS * 2 ** attempt
        await sleep(retryDelayMs)
      }
    }

    throw new Error(`${label} request failed`)
  }

  async function fetchJsonWithRetry(url, label) {
    if (inFlight.has(url)) return inFlight.get(url)
    const promise = _fetchJsonWithRetry(url, label).finally(() => inFlight.delete(url))
    inFlight.set(url, promise)
    return promise
  }

  return {
    fetchJsonWithRetry,
    isRateLimitedPayload,
    waitForObaCooldown,
  }
}
