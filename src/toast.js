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

  function showToast(message, { tone = 'error', dedupeMs = 15_000, action = null } = {}) {
    if (!message) return

    const now = Date.now()
    if (message === lastToastMessage && now - lastToastAt < dedupeMs) return

    lastToastMessage = message
    lastToastAt = now
    syncToastHost()

    const actionHtml = action
      ? ` <button class="toast-action" type="button">${action.label}</button>`
      : ''
    toastRegionElement.innerHTML = `<div class="toast toast-${tone}">${message}${actionHtml}</div>`

    if (action) {
      const actionBtn = toastRegionElement.querySelector('.toast-action')
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          action.onClick()
          hideToast()
        }, { once: true })
      }
    }

    window.clearTimeout(toastHideTimer)
    toastHideTimer = window.setTimeout(() => {
      hideToast()
    }, action ? 6000 : 4500)
  }

  return { showToast, hideToast }
}
