/**
 * useCompactLayout.js
 * Sets up a ResizeObserver on a board element ref and a visualViewport resize
 * listener to determine whether the layout should be compact (single-column).
 *
 * This mirrors the syncCompactLayoutFromBoard() + updateViewportState() logic
 * from main.js.
 *
 * Usage:
 *   const boardRef = useRef(null)
 *   const compactLayout = useCompactLayout(boardRef)
 */

import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { COMPACT_LAYOUT_BREAKPOINT } from '../config'

function getViewportWidth() {
  const visualViewportWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY
  const innerWidth = window.innerWidth || Number.POSITIVE_INFINITY
  const documentWidth = document.documentElement?.clientWidth || Number.POSITIVE_INFINITY
  return Math.min(innerWidth, visualViewportWidth, documentWidth)
}

function getBoardColumnCount(boardEl) {
  if (!boardEl) return 2
  const gridTemplateColumns = window.getComputedStyle(boardEl).gridTemplateColumns
  return gridTemplateColumns
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean).length
}

export function useCompactLayout(boardRef) {
  const compactLayout = useAppStore((s) => s.compactLayout)
  const setCompactLayout = useAppStore((s) => s.setCompactLayout)

  useEffect(() => {
    // Initial measurement from viewport width
    const viewportWidth = getViewportWidth()
    setCompactLayout(viewportWidth <= COMPACT_LAYOUT_BREAKPOINT)

    // ResizeObserver on board element (catches CSS grid column changes)
    let resizeObserver = null
    if (boardRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        const colCount = getBoardColumnCount(boardRef.current)
        setCompactLayout(colCount <= 1)
      })
      resizeObserver.observe(boardRef.current)
    }

    // Viewport / window resize handler
    function handleResize() {
      const width = getViewportWidth()
      setCompactLayout(width <= COMPACT_LAYOUT_BREAKPOINT)
    }

    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [boardRef, setCompactLayout])

  return compactLayout
}
