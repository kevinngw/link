/**
 * Error Boundary and Monitoring System
 * Provides graceful error handling and reporting
 */

// Error severity levels
export const ErrorSeverity = {
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical'
}

// Create error boundary
export function createErrorBoundary(options = {}) {
  const {
    onError = null,
    fallback = null,
    reportUrl = null,
    maxErrors = 100
  } = options

  const errorLog = []
  const errorHandlers = new Set()

  function wrap(fn, context = 'unknown') {
    return (...args) => {
      try {
        return fn(...args)
      } catch (error) {
        handleError(error, context)
        if (fallback) {
          return fallback(error, context)
        }
        throw error
      }
    }
  }

  function wrapAsync(fn, context = 'unknown') {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        handleError(error, context)
        if (fallback) {
          return fallback(error, context)
        }
        throw error
      }
    }
  }

  function handleError(error, context = 'unknown', severity = ErrorSeverity.ERROR) {
    const errorInfo = {
      error,
      context,
      severity,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // Log to console
    console.error(`[${context}]`, error)

    // Store in log
    errorLog.push(errorInfo)
    if (errorLog.length > maxErrors) {
      errorLog.shift()
    }

    // Notify handlers
    errorHandlers.forEach((handler) => {
      try {
        handler(errorInfo)
      } catch (e) {
        console.error('Error handler failed:', e)
      }
    })

    // Call custom error handler
    if (onError) {
      onError(errorInfo)
    }

    // Report to server if configured
    if (reportUrl) {
      reportError(errorInfo)
    }

    return errorInfo
  }

  async function reportError(errorInfo) {
    try {
      await fetch(reportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: errorInfo.error.message,
          stack: errorInfo.error.stack,
          context: errorInfo.context,
          severity: errorInfo.severity,
          timestamp: errorInfo.timestamp,
          url: errorInfo.url
        })
      })
    } catch (e) {
      // Silent fail - don't create infinite loop
      console.warn('Failed to report error:', e)
    }
  }

  function on(handler) {
    errorHandlers.add(handler)
    return () => errorHandlers.delete(handler)
  }

  function getErrorLog() {
    return [...errorLog]
  }

  function clearErrorLog() {
    errorLog.length = 0
  }

  // Global error handlers
  function setupGlobalHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      handleError(
        event.reason || new Error('Unhandled promise rejection'),
        'unhandledrejection',
        ErrorSeverity.ERROR
      )
    })

    // Global errors
    window.addEventListener('error', (event) => {
      handleError(
        event.error || new Error(event.message),
        `global:${event.filename}:${event.lineno}`,
        ErrorSeverity.CRITICAL
      )
    })

    // Console error override (for catching React-style errors)
    const originalError = console.error
    console.error = (...args) => {
      // Check if it's a React error
      const errorString = args.join(' ')
      if (errorString.includes('Error:') || errorString.includes('exception')) {
        handleError(
          new Error(errorString),
          'console.error',
          ErrorSeverity.WARNING
        )
      }
      originalError.apply(console, args)
    }
  }

  return {
    wrap,
    wrapAsync,
    handleError,
    on,
    getErrorLog,
    clearErrorLog,
    setupGlobalHandlers
  }
}

// Performance monitoring
export function createPerformanceMonitor() {
  const metrics = new Map()
  const observers = new Set()

  function mark(name) {
    performance.mark(`${name}-start`)
  }

  function measure(name, startMark = null) {
    if (startMark) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${startMark}-start`, `${name}-end`)
    } else {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }

    const entries = performance.getEntriesByName(name)
    const lastEntry = entries[entries.length - 1]
    
    if (lastEntry) {
      metrics.set(name, {
        duration: lastEntry.duration,
        timestamp: Date.now()
      })
      
      notifyObservers(name, lastEntry.duration)
    }

    return lastEntry?.duration
  }

  function observe(callback) {
    observers.add(callback)
    return () => observers.delete(callback)
  }

  function notifyObservers(name, duration) {
    observers.forEach((cb) => {
      try {
        cb({ name, duration, timestamp: Date.now() })
      } catch (e) {
        console.error('Performance observer failed:', e)
      }
    })
  }

  function getMetrics() {
    return Object.fromEntries(metrics)
  }

  function clearMetrics() {
    metrics.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }

  // Web Vitals
  function observeWebVitals() {
    // LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          metrics.set('LCP', { duration: lastEntry.startTime, timestamp: Date.now() })
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }

      // CLS
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          metrics.set('CLS', { duration: clsValue, timestamp: Date.now() })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }

      // FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const firstEntry = list.getEntries()[0]
          metrics.set('FID', { duration: firstEntry.processingStart - firstEntry.startTime, timestamp: Date.now() })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported
      }
    }
  }

  return {
    mark,
    measure,
    observe,
    getMetrics,
    clearMetrics,
    observeWebVitals
  }
}

// Create singleton instances
export const errorBoundary = createErrorBoundary({
  fallback: (error, context) => {
    console.warn(`[${context}] Using fallback due to error:`, error.message)
    return null
  }
})

export const perfMonitor = createPerformanceMonitor()
