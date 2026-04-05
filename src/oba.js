import {
  OBA_CACHE_TTL_MS,
  OBA_MAX_RETRIES,
  OBA_RETRY_BASE_MS,
} from './config'

const REQUEST_TIMEOUT_MS = 10_000
const RATE_LIMIT_RETRY_BASE_MS = 750
const RATE_LIMIT_RETRY_JITTER_MS = 300
const MAX_TRANSIENT_RETRIES = 8

/**
 * Classify error type from response/network state
 */
function classifyError(response, networkError, payload) {
  if (networkError) return 'network'
  if (response?.status === 429 || (payload?.code === 429 || /rate limit/i.test(payload?.text ?? ''))) return 'rate-limit'
  if (response?.status >= 500 && response?.status < 600) return 'server'
  if (response && !response.ok) return 'client'
  return null
}

function getRetryDelay(errorType, attempt) {
  if (errorType === 'rate-limit') {
    return Math.min(
      RATE_LIMIT_RETRY_BASE_MS * 2 ** attempt + Math.floor(Math.random() * RATE_LIMIT_RETRY_JITTER_MS),
      30_000,
    )
  }

  return Math.min(OBA_RETRY_BASE_MS * 2 ** attempt, 30_000)
}

function createCancelledError(message = 'Request cancelled') {
  const error = new Error(message)
  error.errorType = 'cancelled'
  return error
}

function waitForDelay(ms, signal) {
  if (!ms || ms <= 0) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', onAbort)
      reject(createCancelledError())
    }

    if (signal?.aborted) {
      onAbort()
      return
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Create OBA API client with request deduplication, caching, and cancellation
 */
export function createObaClient(state) {
  const cache = new Map()
  const queue = []
  let processing = false
  let currentController = null
  let cancelled = false
  let onBackgroundUpdate = null

  function isRateLimitedPayload(payload) {
    return payload?.code === 429 || /rate limit/i.test(payload?.text ?? '')
  }

  function rejectQueueItem(item, error) {
    item.reject(error)
    if (item.waiting) {
      item.waiting.forEach(({ reject }) => reject(error))
    }
  }

  function resolveQueueItem(item, payload) {
    item.resolve(payload)
    if (item.waiting) {
      item.waiting.forEach(({ resolve }) => resolve(payload))
    }
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
        rejectQueueItem(item, createCancelledError())
        continue
      }

      currentController = new AbortController()
      const fetchSignal = currentController.signal

      // Combine external signal and timeout with internal controller
      const onAbort = () => currentController.abort()
      signal?.addEventListener('abort', onAbort)
      const timeoutId = setTimeout(() => currentController?.abort(), REQUEST_TIMEOUT_MS)

      let response = null
      let payload = null
      let networkError = null

      try {
        const result = await fetchWithAbort(url, fetchSignal)
        response = result.response

        if (result.error === 'ABORTED') {
          rejectQueueItem(item, createCancelledError())
          signal?.removeEventListener('abort', onAbort)
          clearTimeout(timeoutId)
          continue
        }
        if (result.error) {
          networkError = result.error
        }
      } catch (error) {
        networkError = error
      }

      signal?.removeEventListener('abort', onAbort)
      clearTimeout(timeoutId)
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
        resolveQueueItem(item, payload)
        continue
      }

      const errorType = classifyError(response, networkError, payload)
      const isTransientError = errorType === 'network' || errorType === 'rate-limit' || errorType === 'server'
      const maxRetries = errorType === 'rate-limit' ? OBA_MAX_RETRIES : MAX_TRANSIENT_RETRIES

      if (attempt >= maxRetries || !isTransientError) {
        const error = networkError || new Error(payload?.text || `${label} request failed with ${response?.status ?? 'network error'}`)
        error.errorType = errorType
        error.httpStatus = response?.status ?? null
        rejectQueueItem(item, error)
        continue
      }

      const retryDelay = getRetryDelay(errorType, attempt)
      try {
        await waitForDelay(retryDelay, signal)
      } catch (error) {
        rejectQueueItem(item, error)
        continue
      }

      // Re-check abort after delay
      if (signal?.aborted || cancelled) {
        rejectQueueItem(item, createCancelledError())
        continue
      }

      // Retry: preserve waiting list and signal
      queue.unshift({
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
          resolve: () => { onBackgroundUpdate?.() },
          reject: () => {},
          signal,
          background: true // Mark as background request
        })
        processQueue()
      }
      return cached.payload
    }

    // Check if there's already a pending request for this URL
    // Skip dedup when forceFresh — don't piggyback on background/stale requests
    if (!forceFresh) {
      const existingItem = queue.find((item) => item.url === url)
      if (existingItem) {
        return new Promise((resolve, reject) => {
          if (!existingItem.waiting) existingItem.waiting = []
          existingItem.waiting.push({ resolve, reject })

          if (signal) {
            signal.addEventListener('abort', () => {
              reject(new Error('Request cancelled'))
            }, { once: true })
          }
        })
      }
    }

    return new Promise((resolve, reject) => {
      cancelled = false
      queue.push({ url, label, attempt: 0, resolve, reject, signal })
      processQueue()
    })
  }

  /**
   * Clear queue and cancel pending requests
   */
  function clearQueue() {
    cancelled = true

    // Abort current request if any
    if (currentController) {
      currentController.abort()
      currentController = null
    }

    // Reject and clear all pending queue items
    while (queue.length > 0) {
      const item = queue.shift()
      const error = createCancelledError('Request cancelled: dialog closed')
      rejectQueueItem(item, error)
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
    setOnBackgroundUpdate(callback) { onBackgroundUpdate = callback },
  }
}
