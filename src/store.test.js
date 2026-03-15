import { describe, it, expect, vi } from 'vitest'
import { createStore, computed } from './store.js'

describe('createStore', () => {
  it('creates store with initial state', () => {
    const store = createStore({ count: 0, name: 'test' })
    expect(store.state.count).toBe(0)
    expect(store.state.name).toBe('test')
  })

  it('notifies subscribers on change', () => {
    const store = createStore({ count: 0 })
    const callback = vi.fn()
    
    store.subscribe('count', callback)
    store.state.count = 5
    
    expect(callback).toHaveBeenCalledWith(5, 'count')
  })

  it('allows unsubscribing', () => {
    const store = createStore({ count: 0 })
    const callback = vi.fn()
    
    const unsubscribe = store.subscribe('count', callback)
    unsubscribe()
    store.state.count = 5
    
    expect(callback).not.toHaveBeenCalled()
  })

  it('batches multiple changes', () => {
    const store = createStore({ a: 0, b: 0 })
    const callbackA = vi.fn()
    const callbackB = vi.fn()
    
    store.subscribe('a', callbackA)
    store.subscribe('b', callbackB)
    
    store.batch(() => {
      store.state.a = 1
      store.state.b = 2
    })
    
    expect(callbackA).toHaveBeenCalledTimes(1)
    expect(callbackB).toHaveBeenCalledTimes(1)
  })

  it('tracks changed properties', () => {
    const store = createStore({ a: 0, b: 0 })
    
    store.clearChanged()
    store.state.a = 1
    
    expect(store.hasChanged('a')).toBe(true)
    expect(store.hasChanged('b')).toBe(false)
  })

  it('supports wildcard subscription', () => {
    const store = createStore({ count: 0 })
    const callback = vi.fn()
    
    store.subscribe('*', callback)
    store.state.count = 5
    
    expect(callback).toHaveBeenCalled()
  })
})

describe('computed', () => {
  it('creates computed property', () => {
    const store = createStore({ a: 2, b: 3 })
    
    computed(store, 'sum', () => store.state.a + store.state.b, ['a', 'b'])
    
    expect(store.state.sum).toBe(5)
  })

  it('updates when dependency changes', () => {
    const store = createStore({ a: 2, b: 3 })
    
    computed(store, 'sum', () => store.state.a + store.state.b, ['a', 'b'])
    store.state.a = 5
    
    expect(store.state.sum).toBe(8)
  })
})
