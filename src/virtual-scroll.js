/**
 * Virtual Scrolling for large lists
 * Renders only visible items + buffer
 */

export function createVirtualScroller(container, options = {}) {
  const {
    itemHeight = 60,
    bufferSize = 5,
    renderItem,
    onVisibleRangeChange = null
  } = options

  let items = []
  let visibleItems = new Map()
  let scrollTop = 0
  let containerHeight = 0
  let observer = null
  let resizeObserver = null

  function init() {
    // Setup container
    container.style.overflow = 'auto'
    container.style.position = 'relative'
    
    // Create content spacer
    const spacer = document.createElement('div')
    spacer.className = 'virtual-scroll-spacer'
    spacer.style.height = '0px'
    container.appendChild(spacer)

    // Setup intersection observer for visibility
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index)
          if (entry.isIntersecting) {
            renderItemAt(index)
          } else {
            recycleItem(index)
          }
        })
      },
      {
        root: container,
        rootMargin: `${bufferSize * itemHeight}px`,
        threshold: 0
      }
    )

    // Resize observer for container
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerHeight = entry.contentRect.height
        updateVisibleRange()
      }
    })
    resizeObserver.observe(container)

    // Scroll handler
    container.addEventListener('scroll', onScroll, { passive: true })

    // Initial measurement
    containerHeight = container.clientHeight
  }

  function onScroll() {
    scrollTop = container.scrollTop
    updateVisibleRange()
  }

  function updateVisibleRange() {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount + bufferSize, items.length)
    const actualStart = Math.max(0, startIndex - bufferSize)

    // Notify if range changed
    if (onVisibleRangeChange) {
      onVisibleRangeChange({ start: actualStart, end: endIndex })
    }

    // Update spacer height
    const spacer = container.querySelector('.virtual-scroll-spacer')
    if (spacer) {
      spacer.style.height = `${items.length * itemHeight}px`
    }

    // Render visible items
    for (let i = actualStart; i < endIndex; i++) {
      if (!visibleItems.has(i)) {
        renderItemAt(i)
      }
    }

    // Recycle off-screen items
    for (const [index, element] of visibleItems) {
      if (index < actualStart || index >= endIndex) {
        recycleItem(index)
      }
    }
  }

  function renderItemAt(index) {
    if (visibleItems.has(index) || index >= items.length) return

    const item = items[index]
    const element = renderItem(item, index)
    
    if (element) {
      element.style.position = 'absolute'
      element.style.top = `${index * itemHeight}px`
      element.style.height = `${itemHeight}px`
      element.style.left = '0'
      element.style.right = '0'
      element.dataset.index = index
      
      container.appendChild(element)
      visibleItems.set(index, element)
    }
  }

  function recycleItem(index) {
    const element = visibleItems.get(index)
    if (element) {
      element.remove()
      visibleItems.delete(index)
    }
  }

  function setItems(newItems) {
    // Clear existing
    visibleItems.forEach((element) => element.remove())
    visibleItems.clear()
    
    items = newItems
    
    // Update spacer
    const spacer = container.querySelector('.virtual-scroll-spacer')
    if (spacer) {
      spacer.style.height = `${items.length * itemHeight}px`
    }
    
    // Re-render
    updateVisibleRange()
  }

  function scrollToIndex(index, behavior = 'smooth') {
    container.scrollTo({
      top: index * itemHeight,
      behavior
    })
  }

  function scrollToItem(item, behavior = 'smooth') {
    const index = items.indexOf(item)
    if (index !== -1) {
      scrollToIndex(index, behavior)
    }
  }

  function updateItem(index, newItem) {
    if (index >= 0 && index < items.length) {
      items[index] = newItem
      const element = visibleItems.get(index)
      if (element) {
        // Re-render this item
        recycleItem(index)
        renderItemAt(index)
      }
    }
  }

  function destroy() {
    container.removeEventListener('scroll', onScroll)
    observer?.disconnect()
    resizeObserver?.disconnect()
    
    visibleItems.forEach((element) => element.remove())
    visibleItems.clear()
    
    const spacer = container.querySelector('.virtual-scroll-spacer')
    spacer?.remove()
  }

  return {
    init,
    setItems,
    scrollToIndex,
    scrollToItem,
    updateItem,
    destroy,
    get items() { return items },
    get visibleCount() { return visibleItems.size }
  }
}

