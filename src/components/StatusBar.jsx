import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import { useLiveMeta } from '../hooks/useLiveMeta'
import { useVehicleRefresh } from '../hooks/useVehicleRefresh'
import { formatRelativeTime as formatRelativeTimeValue } from '../formatters'

export default function StatusBar() {
  const { t } = useTranslation()
  const { currentTimeChars } = useLiveMeta()
  const { refreshNow } = useVehicleRefresh()

  const fetchedAt = useAppStore((s) => s.fetchedAt)
  const error = useAppStore((s) => s.error)
  const showToast = useAppStore((s) => s.showToast)

  const isError = Boolean(error)
  const statusText = isError ? t('statusHold') : t('statusSync')
  const updatedText = isError
    ? t('usingLastSnapshot')
    : formatRelativeTimeValue(fetchedAt, t)

  async function handleRefresh() {
    showToast({ message: t('refreshingData'), tone: 'info' })
    await refreshNow()
    showToast({ message: t('dataRefreshed'), tone: 'info' })
  }

  return (
    <div className="screen-pills">
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
  )
}
