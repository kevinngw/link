import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createObaClient } from './oba.js'

function makeState() {
  return {}
}

describe('createObaClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('fetchJsonWithRetry — cache', () => {
    it('returns cached payload before TTL expires', async () => {
      const payload = { code: 200, data: 'fresh' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      })

      const client = createObaClient(makeState())
      const first = await client.fetchJsonWithRetry('https://example.com/api', 'Test')
      const second = await client.fetchJsonWithRetry('https://example.com/api', 'Test')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(first).toEqual(payload)
      expect(second).toEqual(payload)
    })

    it('re-fetches after TTL expires', async () => {
      const payload = { code: 200, data: 'fresh' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      })

      const client = createObaClient(makeState())
      await client.fetchJsonWithRetry('https://example.com/api2', 'Test')

      // Advance past 2x TTL (stale-while-revalidate window)
      vi.advanceTimersByTime(10 * 60 * 1000)

      await client.fetchJsonWithRetry('https://example.com/api2', 'Test')

      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('fetchJsonWithRetry — request deduplication', () => {
    it('deduplicates requests queued before processing starts', async () => {
      const payload = { code: 200, data: 'deduped' }
      // Block the first fetch so the second request arrives while first is still in queue
      let resolveFetch
      global.fetch = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = () => resolve({ ok: true, json: async () => payload })
        }),
      )

      const client = createObaClient(makeState())

      // First request starts processing immediately (queue.shift happens before fetch)
      const p1 = client.fetchJsonWithRetry('https://example.com/dedup', 'Test1')

      // Second request for same URL while first fetch is in-flight — OBA client
      // re-uses the same cache entry once resolved (stale-while-revalidate),
      // so both promises should settle to the same payload
      resolveFetch()
      const r1 = await p1

      // After resolution, the second request hits the fresh cache
      const r2 = await client.fetchJsonWithRetry('https://example.com/dedup', 'Test2')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(r1).toEqual(payload)
      expect(r2).toEqual(payload)
    })
  })

  describe('fetchJsonWithRetry — abort signal', () => {
    it('rejects when signal is already aborted', async () => {
      global.fetch = vi.fn()
      const client = createObaClient(makeState())

      const controller = new AbortController()
      controller.abort()

      await expect(
        client.fetchJsonWithRetry('https://example.com/abort', 'Test', controller.signal),
      ).rejects.toThrow('Request cancelled')

      expect(fetch).not.toHaveBeenCalled()
    })

    it('rejects in-flight request when signal is aborted', async () => {
      const controller = new AbortController()
      global.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () =>
              reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })),
            )
          }),
      )

      const client = createObaClient(makeState())
      const promise = client.fetchJsonWithRetry('https://example.com/inflight', 'Test', controller.signal)
      controller.abort()

      await expect(promise).rejects.toThrow()
    })
  })

  describe('clearQueue', () => {
    it('rejects all queued items', async () => {
      let resolveFetch
      global.fetch = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = resolve
        }),
      )

      const client = createObaClient(makeState())
      const p1 = client.fetchJsonWithRetry('https://example.com/q1', 'Test1')
      const p2 = client.fetchJsonWithRetry('https://example.com/q2', 'Test2')

      client.clearQueue()
      resolveFetch?.()

      await expect(p1).rejects.toThrow()
      await expect(p2).rejects.toThrow()
    })
  })

  describe('clearExpiredCache', () => {
    it('removes entries past TTL', async () => {
      const payload = { code: 200 }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      })

      const client = createObaClient(makeState())
      await client.fetchJsonWithRetry('https://example.com/exp', 'Test')

      // Advance past TTL
      vi.advanceTimersByTime(10 * 60 * 1000)
      client.clearExpiredCache()

      // Should fetch again
      await client.fetchJsonWithRetry('https://example.com/exp', 'Test')
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })
})
