import {
  OBA_CACHE_TTL_MS,
  OBA_MAX_RETRIES,
} from './config'


export function createObaClient(state) {
  const cache = new Map()
  const queue = []
  let processing = false

  function isRateLimitedPayload(payload) {
    return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
  }

  async function processQueue() {
    if (processing) return
    processing = true

    while (queue.length > 0) {
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
        cache.set(url, { payload, expiresAt: Date.now() + OBA_CACHE_TTL_MS })
        resolve(payload)
        // Notify all waiting callers
        if (item.waiting) {
          item.waiting.forEach(({ resolve: r }) => r(payload))
        }
        continue
      }

      const isTransientError = networkError != null ||
        (response != null && (response.status === 429 || (response.status >= 500 && response.status < 600)))

      if (attempt >= OBA_MAX_RETRIES || !isTransientError) {
        const error = networkError || new Error(payload?.text || `${label} request failed with ${response?.status ?? 'network error'}`)
        reject(error)
        // Notify all waiting callers
        if (item.waiting) {
          item.waiting.forEach(({ reject: r }) => r(error))
        }
        continue
      }

      // Retry: preserve waiting list
      queue.push({ url, label, attempt: attempt + 1, resolve, reject, waiting: item.waiting })
    }

    processing = false
  }

  async function fetchJsonWithRetry(url, label) {
    const cached = cache.get(url)
    if (cached && Date.now() < cached.expiresAt) return cached.payload

    // Check if there's already a pending request for this URL in the queue
    const existingItem = queue.find((item) => item.url === url)
    if (existingItem) {
      // Add this caller's resolve/reject to the existing item's waiting list
      return new Promise((resolve, reject) => {
        if (!existingItem.waiting) existingItem.waiting = []
        existingItem.waiting.push({ resolve, reject })
      })
    }

    return new Promise((resolve, reject) => {
      queue.push({ url, label, attempt: 0, resolve, reject })
      processQueue()
    })
  }

  function clearQueue() {
    // Reject and clear all pending queue items
    while (queue.length > 0) {
      const item = queue.shift()
      const error = new Error('Request cancelled: dialog closed')
      item.reject(error)
      // Notify all waiting callers
      if (item.waiting) {
        item.waiting.forEach(({ reject }) => reject(error))
      }
    }
  }

  return {
    fetchJsonWithRetry,
    isRateLimitedPayload,
    clearQueue,
  }
}
