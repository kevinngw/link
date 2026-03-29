/**
 * InsightsDetailDialog.jsx
 * Native <dialog> portal for the insights detail panel.
 * Displays pre-rendered HTML body from the store.
 */

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'

export default function InsightsDetailDialog() {
  const { t } = useTranslation()
  const activeDialogType = useAppStore((s) => s.activeDialogType)
  const insightsDetailTitle = useAppStore((s) => s.insightsDetailTitle)
  const insightsDetailSubtitle = useAppStore((s) => s.insightsDetailSubtitle)
  const insightsDetailBody = useAppStore((s) => s.insightsDetailBody)
  const { closeInsightsDetail } = useAppStore.getState()

  const dialogRef = useRef(null)

  // Open/close based on activeDialogType
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (activeDialogType === 'insights') {
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
  }, [activeDialogType])

  const handleClose = useCallback(() => {
    const el = dialogRef.current
    if (!el || !el.open) return
    el.classList.add('is-closing')
    el.addEventListener('animationend', () => {
      el.classList.remove('is-closing')
      el.close()
      closeInsightsDetail()
    }, { once: true })
  }, [closeInsightsDetail])

  const dialogContent = (
    <dialog
      ref={dialogRef}
      className="insights-detail-dialog dialog"
      onClose={closeInsightsDetail}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div className="dialog-header-meta">
            <p className="dialog-title" id="insights-detail-title">
              {insightsDetailTitle}
            </p>
            {insightsDetailSubtitle && (
              <p className="dialog-subtitle">{insightsDetailSubtitle}</p>
            )}
          </div>
          <button
            className="dialog-close"
            onClick={handleClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </header>

        <div
          className="dialog-body insights-detail-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: insightsDetailBody }}
        />
      </div>
    </dialog>
  )

  return createPortal(dialogContent, document.body)
}
