/**
 * Create toast notification manager
 */
export function createToast(toastRegionElement) {
  toastRegionElement.setAttribute('aria-live', 'polite')
  toastRegionElement.setAttribute('aria-atomic', 'true')
  const defaultHost = toastRegionElement.parentElement ?? document.body
  let toastHideTimer = 0
  let lastToastMessage = ''
  let lastToastAt = 0

  function getActiveToastHost() {
    const openDialogs = [...document.querySelectorAll('dialog[open]')]
    return openDialogs.at(-1) ?? defaultHost
  }

  function syncToastHost() {
    const host = getActiveToastHost()
    if (toastRegionElement.parentElement !== host) {
      host.appendChild(toastRegionElement)
    }
    toastRegionElement.classList.toggle('toast-region-in-dialog', host.tagName === 'DIALOG')
  }

  function hideToast() {
    window.clearTimeout(toastHideTimer)
    toastHideTimer = 0
    syncToastHost()
    const toast = toastRegionElement.querySelector('.toast')
    if (toast) {
      toast.classList.add('toast-leaving')
      toast.addEventListener('animationend', () => {
        toastRegionElement.innerHTML = ''
      }, { once: true })
    } else {
      toastRegionElement.innerHTML = ''
    }
  }

  function showToast(message, { tone = 'error', dedupeMs = 15_000 } = {}) {
    if (!message) return

    const now = Date.now()
    if (message === lastToastMessage && now - lastToastAt < dedupeMs) return

    lastToastMessage = message
    lastToastAt = now
    syncToastHost()
    toastRegionElement.innerHTML = `<div class="toast toast-${tone}">${message}</div>`
    window.clearTimeout(toastHideTimer)
    toastHideTimer = window.setTimeout(() => {
      hideToast()
    }, 4500)
  }

  return { showToast, hideToast }
}
