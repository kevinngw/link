/**
 * useLanguage.js
 * Reads and sets the app display language (en / zh-CN).
 *
 * On first mount the hook reads localStorage / navigator.language and applies
 * the resolved value so it is in sync with the document immediately.
 *
 * Usage:
 *   const { language, setLanguage } = useLanguage()
 */

import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { LANGUAGE_STORAGE_KEY } from '../config'

function getPreferredLanguage() {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh-CN') return stored
  const browser = (navigator.language ?? '').toLowerCase()
  return browser.startsWith('zh') ? 'zh-CN' : 'en'
}

export function useLanguage() {
  const language = useAppStore((s) => s.language)
  const setLanguageAction = useAppStore((s) => s.setLanguage)

  // Apply preferred language on mount
  useEffect(() => {
    const preferred = getPreferredLanguage()
    if (preferred !== language) {
      setLanguageAction(preferred)
    } else {
      document.documentElement.lang = preferred
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setLanguage(lang) {
    setLanguageAction(lang)
  }

  function toggleLanguage() {
    setLanguageAction(language === 'en' ? 'zh-CN' : 'en')
  }

  return { language, setLanguage, toggleLanguage }
}
