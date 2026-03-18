/**
 * Create toast notification manager
 */
export function createToast(toastRegionElement) {
  let toastHideTimer = 0
  let lastToastMessage = ''
  let lastToastAt = 0

  function hideToast() {
    window.clearTimeout(toastHideTimer)
    toastHideTimer = 0
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
    toastRegionElement.innerHTML = `<div class="toast toast-${tone}" role="status">${message}</div>`
    window.clearTimeout(toastHideTimer)
    toastHideTimer = window.setTimeout(() => {
      hideToast()
    }, 4500)
  }

  return { showToast, hideToast }
}
