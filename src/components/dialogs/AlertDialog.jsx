/**
 * AlertDialog.jsx
 * Native <dialog> portal for service alerts on a specific line.
 */

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import { formatAlertSeverity, formatAlertEffect } from '../../formatters'

export default function AlertDialog() {
  const { t } = useTranslation()
  const activeDialogType = useAppStore((s) => s.activeDialogType)
  const currentAlertLineId = useAppStore((s) => s.currentAlertLineId)
  const alerts = useAppStore((s) => s.alerts)
  const lines = useAppStore((s) => s.lines)
  const { closeAlertDialog } = useAppStore.getState()

  const dialogRef = useRef(null)

  const line = lines.find((l) => l.id === currentAlertLineId) ?? null
  const lineAlerts = alerts.filter((a) => a.lineIds?.includes(currentAlertLineId))

  // Open/close based on activeDialogType
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (activeDialogType === 'alerts' && currentAlertLineId) {
      if (!el.open) el.showModal()
    } else {
      if (el.open) {
        el.classList.add('is-closing')
        el.addEventListener('animationend', () => {
          el.classList.remove('is-closing')
          el.close()
        }, { once: true })
      }
    }
  }, [activeDialogType, currentAlertLineId])

  const handleClose = useCallback(() => {
    const el = dialogRef.current
    if (!el || !el.open) return
    el.classList.add('is-closing')
    el.addEventListener('animationend', () => {
      el.classList.remove('is-closing')
      el.close()
      closeAlertDialog()
    }, { once: true })
  }, [closeAlertDialog])

  const dialogContent = (
    <dialog
      ref={dialogRef}
      className="alert-dialog dialog"
      onClose={closeAlertDialog}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div className="dialog-header-meta">
            <p className="dialog-title" id="alert-dialog-title">
              {line ? t('affectedLineAlerts', line.name, lineAlerts.length) : ''}
            </p>
            <p className="dialog-subtitle">
              {line ? t('activeAlerts', lineAlerts.length) : ''}
            </p>
          </div>
          <button
            className="dialog-close"
            onClick={handleClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </header>

        <div className="dialog-body" id="alert-dialog-body">
          {lineAlerts.length > 0
            ? lineAlerts.map((alert) => (
                <article key={alert.id} className="alert-dialog-item">
                  <p className="alert-dialog-item-meta">
                    {formatAlertSeverity(alert.severity)} • {formatAlertEffect(alert.effect)}
                  </p>
                  <p className="alert-dialog-item-title">
                    {alert.title || t('serviceAlert')}
                  </p>
                  <p className="alert-dialog-item-copy">
                    {alert.description || t('noAdditionalAlertDetails')}
                  </p>
                  {alert.url && (
                    <p className="alert-dialog-item-link-wrap">
                      <a
                        className="alert-dialog-link"
                        href={alert.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('readOfficialAlert')}
                      </a>
                    </p>
                  )}
                </article>
              ))
            : (
                <p className="alert-dialog-item-copy">{t('noActiveAlerts')}</p>
              )
          }
        </div>
      </div>
    </dialog>
  )

  return createPortal(dialogContent, document.body)
}
