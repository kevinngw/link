/**
 * useTranslation.js
 * Returns a `t` function that resolves keys from UI_COPY for the current language.
 *
 * Usage:
 *   const { t } = useTranslation()
 *   t('lateMinutes', 5)  // => "+5 min late"
 *   t('noFavorites')     // => "No favorite stations yet."
 */

import { useAppStore } from '../store/useAppStore'
import { UI_COPY } from '../config'

export function useTranslation() {
  const language = useAppStore((s) => s.language)

  function t(key, ...args) {
    const copy = UI_COPY[language] ?? UI_COPY.en
    const value = copy[key]
    if (value === undefined) return key
    return typeof value === 'function' ? value(...args) : value
  }

  return { t, language }
}
