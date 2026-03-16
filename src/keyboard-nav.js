/**
 * Keyboard Navigation and Accessibility Support
 * Vim-inspired shortcuts + standard a11y
 */

export function createKeyboardNavigation(state, actions) {
  const handlers = new Map()
  let focusTrapElement = null
  let focusedStationIndex = 0
  let focusedLineIndex = 0

  // Key mappings
  const keyMap = {
    // Navigation
    'j': 'next',
    'k': 'previous',
    'h': 'prevTab',
    'l': 'nextTab',
    'ArrowDown': 'next',
    'ArrowUp': 'previous',
    'ArrowLeft': 'prevTab',
    'ArrowRight': 'nextTab',
    
    // Actions
    'Enter': 'select',
    'Escape': 'close',
    ' ': 'toggleDisplay', // Space
    'r': 'refresh',
    '/': 'search',
    '?': 'help',
    
    // Tabs
    '1': 'tabMap',
    '2': 'tabTrains',
    '3': 'tabInsights',
    
    // Direction
    'b': 'directionBoth',
    'n': 'directionNorth',
    's': 'directionSouth',
  }

  function handleKeydown(event) {
    // Don't intercept if typing in input
    const target = event.target
    const isTyping = target instanceof HTMLElement && 
      (target.isContentEditable || 
       ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    
    if (isTyping && event.key !== 'Escape') {
      return
    }

    const action = keyMap[event.key]
    if (!action) return

    // Prevent default for mapped keys
    if (action && !event.metaKey && !event.ctrlKey) {
      event.preventDefault()
    }

    const handler = handlers.get(action)
    if (handler) {
      handler(event)
    }
  }

  function setup() {
    document.addEventListener('keydown', handleKeydown)
    setupFocusTrap()
    setupSkipLink()
  }

  function teardown() {
    document.removeEventListener('keydown', handleKeydown)
  }

  function on(action, handler) {
    handlers.set(action, handler)
    return () => handlers.delete(action)
  }

  // Focus trap for dialogs
  function setupFocusTrap() {
    // This would trap focus within open dialogs
    // Implemented via mutation observer watching for dialog open
  }

  function trapFocus(element) {
    focusTrapElement = element
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement.focus()

    function handleTabKey(e) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    
    return () => {
      element.removeEventListener('keydown', handleTabKey)
      focusTrapElement = null
    }
  }

  // Skip to main content link
  function setupSkipLink() {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.className = 'skip-link'
    skipLink.textContent = 'Skip to main content'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--surface-strong);
      color: var(--text-primary);
      padding: 8px;
      text-decoration: none;
      z-index: 100;
      transition: top 0.3s;
    `
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0'
    })
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    
    document.body.prepend(skipLink)
  }

  // Live region for announcements
  function announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('aria-live') || createLiveRegion()
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.textContent = message
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = ''
    }, 1000)
  }

  function createLiveRegion() {
    const region = document.createElement('div')
    region.id = 'aria-live'
    region.className = 'sr-only'
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    document.body.appendChild(region)
    return region
  }

  // Focus management for stations
  function focusStation(index) {
    const stations = document.querySelectorAll('.station-group')
    if (stations[index]) {
      focusedStationIndex = index
      stations[index].focus()
      stations[index].setAttribute('tabindex', '0')
      announce(`Station ${index + 1} of ${stations.length}`)
    }
  }

  function focusNextStation() {
    const stations = document.querySelectorAll('.station-group')
    const next = (focusedStationIndex + 1) % stations.length
    focusStation(next)
  }

  function focusPrevStation() {
    const stations = document.querySelectorAll('.station-group')
    const prev = (focusedStationIndex - 1 + stations.length) % stations.length
    focusStation(prev)
  }

  return {
    setup,
    teardown,
    on,
    trapFocus,
    announce,
    focusStation,
    focusNextStation,
    focusPrevStation
  }
}

// Export keyboard shortcut help text
export const keyboardShortcuts = {
  en: {
    navigation: [
      { key: 'j / ↓', desc: 'Next item' },
      { key: 'k / ↑', desc: 'Previous item' },
      { key: 'h / ←', desc: 'Previous tab' },
      { key: 'l / →', desc: 'Next tab' },
    ],
    actions: [
      { key: 'Enter', desc: 'Select/Open' },
      { key: 'Escape', desc: 'Close dialog' },
      { key: 'Space', desc: 'Toggle display mode' },
      { key: 'r', desc: 'Refresh data' },
      { key: '/', desc: 'Search stations' },
    ],
    tabs: [
      { key: '1', desc: 'Map view' },
      { key: '2', desc: 'Trains view' },
      { key: '3', desc: 'Insights view' },
    ]
  },
  'zh-CN': {
    navigation: [
      { key: 'j / ↓', desc: '下一项' },
      { key: 'k / ↑', desc: '上一项' },
      { key: 'h / ←', desc: '上一个标签' },
      { key: 'l / →', desc: '下一个标签' },
    ],
    actions: [
      { key: 'Enter', desc: '选择/打开' },
      { key: 'Escape', desc: '关闭对话框' },
      { key: 'Space', desc: '切换显示模式' },
      { key: 'r', desc: '刷新数据' },
      { key: '/', desc: '搜索站点' },
    ],
    tabs: [
      { key: '1', desc: '地图视图' },
      { key: '2', desc: '列车视图' },
      { key: '3', desc: '洞察视图' },
    ]
  }
}
