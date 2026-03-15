import {
  OBA_CACHE_TTL_MS,
  OBA_MAX_RETRIES,
} from './config'

/**
 * Create OBA API client with request deduplication, caching, and cancellation
 */
export function createObaClient(state) {
  const cache = new Map()
  const queue = []
  let processing = false
  let currentController = null

  function isRateLimitedPayload(payload) {
    return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
  }

  /**
   * Fetch with abort controller support
   */
  async function fetchWithAbort(url, signal) {
    try {
      const response = await fetch(url, { 
        cache: 'no-store',
        signal 
      })
      return { response, error: null }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { response: null, error: 'ABORTED' }
      }
      return { response: null, error }
    }
  }

  async function processQueue() {
    if (processing) return
    processing = true

    while (queue.length > 0) {
      const item = queue.shift()
      const { url, label, attempt, resolve, reject, signal } = item

      // Check if already aborted
      if (signal?.aborted) {
        reject(new Error('Request cancelled'))
        continue
      }

      currentController = new AbortController()
      const fetchSignal = currentController.signal

      // Combine external signal with internal controller
      const onAbort = () => currentController.abort()
      signal?.addEventListener('abort', onAbort)

      let response = null
      let payload = null
      let networkError = null

      try {
        const result = await fetchWithAbort(url, fetchSignal)
        response = result.response
        
        if (result.error === 'ABORTED') {
          reject(new Error('Request cancelled'))
          signal?.removeEventListener('abort', onAbort)
          continue
        }
        if (result.error) {
          networkError = result.error
        }
      } catch (error) {
        networkError = error
      }

      signal?.removeEventListener('abort', onAbort)
      currentController = null

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
        if (item.waiting) {
          item.waiting.forEach(({ reject: r }) => r(error))
        }
        continue
      }

      // Retry: preserve waiting list and signal
      queue.push({ 
        url, 
        label, 
        attempt: attempt + 1, 
        resolve, 
        reject, 
        waiting: item.waiting,
        signal 
      })
    }

    processing = false
  }

  /**
   * Stale-while-revalidate fetch
   * 1. Fresh cache (< TTL): return immediately
   * 2. Stale cache (TTL ~ 2x TTL): return stale, revalidate in background
   * 3. Expired (> 2x TTL): wait for revalidation
   * @param {string} url - Request URL
   * @param {string} label - Request label for error messages
   * @param {AbortSignal} [signal] - Optional abort signal
   * @param {boolean} [forceFresh=false] - Force fresh fetch
   */
  async function fetchJsonWithRetry(url, label, signal, forceFresh = false) {
    const now = Date.now()
    const cached = cache.get(url)
    
    // Fresh cache - return immediately
    if (!forceFresh && cached && now < cached.expiresAt) {
      return cached.payload
    }
    
    // Stale cache - return stale data, revalidate in background
    if (!forceFresh && cached && now < cached.expiresAt + OBA_CACHE_TTL_MS) {
      // Background revalidation
      const existingItem = queue.find((item) => item.url === url)
      if (!existingItem) {
        queue.push({ 
          url, 
          label, 
          attempt: 0, 
          resolve: () => {}, // No-op, we already returned
          reject: () => {}, 
          signal,
          background: true // Mark as background request
        })
        processQueue()
      }
      return cached.payload
    }

    // Check if there's already a pending request for this URL
    const existingItem = queue.find((item) => item.url === url)
    if (existingItem) {
      return new Promise((resolve, reject) => {
        if (!existingItem.waiting) existingItem.waiting = []
        existingItem.waiting.push({ resolve, reject })
        
        if (signal) {
          signal.addEventListener('abort', () => {
            reject(new Error('Request cancelled'))
          })
        }
      })
    }

    return new Promise((resolve, reject) => {
      queue.push({ url, label, attempt: 0, resolve, reject, signal })
      processQueue()
    })
  }

  /**
   * Clear queue and cancel pending requests
   */
  function clearQueue() {
    // Abort current request if any
    if (currentController) {
      currentController.abort()
      currentController = null
    }
    
    // Reject and clear all pending queue items
    while (queue.length > 0) {
      const item = queue.shift()
      const error = new Error('Request cancelled: dialog closed')
      item.reject(error)
      if (item.waiting) {
        item.waiting.forEach(({ reject }) => reject(error))
      }
    }
  }

  /**
   * Clear expired cache entries
   */
  function clearExpiredCache() {
    const now = Date.now()
    for (const [url, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(url)
      }
    }
  }

  /**
   * Prefetch URL (low priority, for hover states)
   * Only fetches if not already in cache
   */
  function prefetch(url, label = 'Prefetch') {
    const cached = cache.get(url)
    if (cached && Date.now() < cached.expiresAt + OBA_CACHE_TTL_MS) {
      return // Already have fresh or stale data
    }
    
    // Check if already in queue
    if (queue.find((item) => item.url === url)) {
      return
    }
    
    // Low priority: add to end of queue
    queue.push({ 
      url, 
      label, 
      attempt: 0, 
      resolve: () => {}, 
      reject: () => {},
      background: true 
    })
    
    // Start processing if not already
    processQueue()
  }

  return {
    fetchJsonWithRetry,
    isRateLimitedPayload,
    clearQueue,
    clearExpiredCache,
    prefetch,
  }
}
