/**
 * Simple reactive store implementation
 * Inspired by Pinia but lightweight for vanilla JS
 */

export function createStore(initialState = {}) {
  const state = { ...initialState }
  const listeners = new Map()
  let batching = false
  const pendingChanges = new Set()

  // Track which properties have changed
  const changed = new Set()

  function subscribe(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set())
    }
    listeners.get(key).add(callback)

    // Return unsubscribe function
    return () => {
      listeners.get(key).delete(callback)
    }
  }

  function notify(key) {
    if (batching) {
      pendingChanges.add(key)
      return
    }
    
    const keyListeners = listeners.get(key)
    if (keyListeners) {
      keyListeners.forEach((cb) => cb(state[key], key))
    }
    
    // Also notify wildcard listeners
    const wildcards = listeners.get('*')
    if (wildcards) {
      wildcards.forEach((cb) => cb(state[key], key))
    }
  }

  function batch(fn) {
    batching = true
    try {
      fn()
    } finally {
      batching = false
      // Notify all pending changes
      pendingChanges.forEach((key) => notify(key))
      pendingChanges.clear()
    }
  }

  function setState(updates) {
    batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        if (state[key] !== value) {
          state[key] = value
          changed.add(key)
          pendingChanges.add(key)
        }
      })
    })
  }

  function hasChanged(key) {
    return changed.has(key)
  }

  function clearChanged() {
    changed.clear()
  }

  // Create reactive proxy for state
  const reactiveState = new Proxy(state, {
    set(target, key, value) {
      if (target[key] !== value) {
        target[key] = value
        changed.add(key)
        notify(key)
      }
      return true
    },
    get(target, key) {
      return target[key]
    }
  })

  return {
    state: reactiveState,
    subscribe,
    batch,
    setState,
    hasChanged,
    clearChanged,
    // Computed properties cache
    computed: new Map()
  }
}

/**
 * Create a computed property that auto-updates when dependencies change
 */
export function computed(store, key, fn, deps) {
  let value = fn()
  
  deps.forEach((dep) => {
    store.subscribe(dep, () => {
      const newValue = fn()
      if (value !== newValue) {
        value = newValue
        store.state[key] = value
      }
    })
  })
  
  store.state[key] = value
  return {
    get value() { return value }
  }
}

/**
 * Create action with automatic change tracking
 */
