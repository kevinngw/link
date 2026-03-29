/**
 * useTheme.js
 * Reads and sets the app color theme (dark / light).
 *
 * On first mount the hook reads localStorage and applies the stored value to
 * document.documentElement.dataset.theme so the DOM is in sync immediately.
 *
 * Usage:
 *   const { theme, setTheme } = useTheme()
 */

import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { THEME_STORAGE_KEY } from '../config'

function getPreferredTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  const setThemeAction = useAppStore((s) => s.setTheme)

  // Apply preferred theme on mount (before first paint where possible)
  useEffect(() => {
    const preferred = getPreferredTheme()
    if (preferred !== theme) {
      setThemeAction(preferred)
    } else {
      // Ensure DOM attribute is set even if store value already matches
      document.documentElement.dataset.theme = preferred
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setTheme(nextTheme) {
    setThemeAction(nextTheme)
  }

  return { theme, setTheme }
}
