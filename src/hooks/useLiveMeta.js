/**
 * useLiveMeta.js
 * 1-second interval that keeps the displayed clock in sync.
 *
 * Returns:
 *   currentTime  — formatted time string (e.g. "3:42 PM" or "15:42")
 *   currentTimeChars — array of characters for dot-matrix rendering
 *                      (colons get their own entries so the caller can style them)
 *
 * Usage:
 *   const { currentTime, currentTimeChars } = useLiveMeta()
 */

import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatCurrentTime as formatCurrentTimeValue } from '../formatters'

export function useLiveMeta() {
  const language = useAppStore((s) => s.language)

  const [currentTime, setCurrentTime] = useState(() => formatCurrentTimeValue(language))

  useEffect(() => {
    // Update immediately when language changes
    setCurrentTime(formatCurrentTimeValue(language))

    const id = window.setInterval(() => {
      setCurrentTime(formatCurrentTimeValue(language))
    }, 1000)

    return () => window.clearInterval(id)
  }, [language])

  // Split into individual characters for the dot-matrix display
  const currentTimeChars = currentTime.split('')

  return { currentTime, currentTimeChars }
}
