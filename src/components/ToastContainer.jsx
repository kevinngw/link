import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ToastContainer() {
  const toastMessage = useAppStore((s) => s.toastMessage)
  const toastTone = useAppStore((s) => s.toastTone)
  const toastKey = useAppStore((s) => s.toastKey)
  const dismissToast = useAppStore((s) => s.dismissToast)

  const timerRef = useRef(0)

  useEffect(() => {
    if (!toastMessage) return
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      dismissToast()
    }, 3500)
    return () => window.clearTimeout(timerRef.current)
  }, [toastKey, toastMessage, dismissToast])

  if (!toastMessage) return (
    <div id="toast-region" className="toast-region" aria-live="polite" aria-atomic="true" />
  )

  return (
    <div id="toast-region" className="toast-region" aria-live="polite" aria-atomic="true">
      <div className={`toast toast-${toastTone}`} key={toastKey}>
        {toastMessage}
      </div>
    </div>
  )
}
