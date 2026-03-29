import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import { useLiveMeta } from '../hooks/useLiveMeta'
import { useVehicleRefresh } from '../hooks/useVehicleRefresh'
import { formatRelativeTime as formatRelativeTimeValue } from '../formatters'
import { SYSTEM_META } from '../config'

export default function Header() {
  const { t } = useTranslation()
  const { currentTimeChars } = useLiveMeta()
  const { refreshNow } = useVehicleRefresh()

  const theme = useAppStore((s) => s.theme)
  const language = useAppStore((s) => s.language)
  const fetchedAt = useAppStore((s) => s.fetchedAt)
  const error = useAppStore((s) => s.error)
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const setTheme = useAppStore((s) => s.setTheme)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const showToast = useAppStore((s) => s.showToast)

  const systemMeta = SYSTEM_META[activeSystemId] ?? SYSTEM_META['link']
  const updatedText = error
    ? t('usingLastSnapshot')
    : formatRelativeTimeValue(fetchedAt, t)
  const statusText = error ? t('statusHold') : t('statusSync')
  const isError = Boolean(error)

  function handleThemeToggle() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(nextTheme))
    } else {
      setTheme(nextTheme)
    }
  }

  function handleLanguageToggle() {
    setLanguage(language === 'en' ? 'zh-CN' : 'en')
  }

  async function handleRefresh() {
    showToast({ message: t('refreshingData'), tone: 'info' })
    await refreshNow()
    showToast({ message: t('dataRefreshed'), tone: 'info' })
  }

  function handleSearchOpen() {
    useAppStore.setState({ activeDialogType: 'search', stationSearchQuery: '' })
  }

  return (
    <header className="screen-header">
      <div>
        <p className="screen-kicker">{systemMeta.kicker}</p>
        <h1>{systemMeta.title}</h1>
      </div>
      <div className="screen-pills">
        <button
          className="theme-toggle station-search-toggle"
          type="button"
          aria-label={t('openStationSearch')}
          onClick={handleSearchOpen}
        >
          {t('openStationSearch')}
        </button>
        <button
          className="theme-toggle"
          type="button"
          aria-label={t('languageToggleAria')}
          onClick={handleLanguageToggle}
        >
          {t('languageToggle')}
        </button>
        <button
          className="theme-toggle"
          type="button"
          aria-label={t('themeToggleAria')}
          onClick={handleThemeToggle}
        >
          {theme === 'dark' ? t('themeLight') : t('themeDark')}
        </button>
        <button
          className={`status-pill${isError ? ' status-pill-error' : ''}`}
          type="button"
          aria-label={t('manualRefresh')}
          onClick={handleRefresh}
        >
          {statusText}
        </button>
        <span className="dot-matrix-clock" aria-label={t('currentTimeAria')}>
          {currentTimeChars.map((ch, i) =>
            ch === ':'
              ? <span key={i} className="dot-matrix-colon">:</span>
              : <span key={i} className="dot-matrix-digit">{ch}</span>
          )}
        </span>
        <p className="status-pill updated-at-pill">{updatedText}</p>
      </div>
    </header>
  )
}
