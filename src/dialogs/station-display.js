import {
  DIALOG_DISPLAY_DIRECTION_ANIMATION_MS,
  DIALOG_DISPLAY_DIRECTION_ROTATE_MS,
  DIALOG_DISPLAY_SCROLL_INTERVAL_MS,
  DIALOG_REFRESH_INTERVAL_MS,
} from '../config'

export function createStationDialogDisplayController({
  state,
  elements,
  copyValue,
  refreshStationDialog,
  clearStationParam,
}) {
  const {
    dialog,
    dialogTitle,
    dialogTitleTrack,
    dialogTitleText,
    dialogTitleTextClone,
    dialogDisplay,
    dialogDirectionTabs,
    arrivalsSectionNb,
    arrivalsNb,
    arrivalsSectionSb,
    arrivalsSb,
  } = elements

  function setDialogDisplayMode(isDisplayMode) {
    state.dialogDisplayMode = isDisplayMode
    dialog.classList.toggle('is-display-mode', isDisplayMode)
    dialogDisplay.textContent = isDisplayMode ? copyValue('exit') : copyValue('board')
    dialogDisplay.setAttribute('aria-label', isDisplayMode ? copyValue('exit') : copyValue('board'))
    state.dialogDisplayDirection = 'both'
    state.dialogDisplayAutoPhase = 'nb'
    renderDialogDirectionView()

    if (dialog.open && state.currentDialogStation) {
      refreshStationDialog(state.currentDialogStation).catch(console.error)
    }

    syncDialogTitleMarquee()
    syncDialogDisplayScroll()
  }

  function toggleDialogDisplayMode() {
    setDialogDisplayMode(!state.dialogDisplayMode)
  }

  function stopDialogDirectionRotation() {
    if (state.dialogDisplayDirectionTimer) {
      window.clearInterval(state.dialogDisplayDirectionTimer)
      state.dialogDisplayDirectionTimer = 0
    }
  }

  function stopDialogDirectionAnimation() {
    if (state.dialogDisplayDirectionAnimationTimer) {
      window.clearTimeout(state.dialogDisplayDirectionAnimationTimer)
      state.dialogDisplayDirectionAnimationTimer = 0
    }

    state.dialogDisplayAnimatingDirection = ''
    arrivalsSectionNb?.classList.remove('is-direction-animating')
    arrivalsSectionSb?.classList.remove('is-direction-animating')
  }

  function startDialogDirectionAnimation(direction) {
    if (!state.dialogDisplayMode || !direction || direction === 'both') return

    stopDialogDirectionAnimation()
    state.dialogDisplayAnimatingDirection = direction
    const targetSection = direction === 'nb' ? arrivalsSectionNb : arrivalsSectionSb
    if (!targetSection) return

    void targetSection.offsetWidth
    targetSection.classList.add('is-direction-animating')
    state.dialogDisplayDirectionAnimationTimer = window.setTimeout(() => {
      targetSection.classList.remove('is-direction-animating')
      state.dialogDisplayDirectionAnimationTimer = 0
      if (state.dialogDisplayAnimatingDirection === direction) {
        state.dialogDisplayAnimatingDirection = ''
      }
    }, DIALOG_DISPLAY_DIRECTION_ANIMATION_MS)
  }

  function renderDialogDirectionView({ animate = false } = {}) {
    stopDialogDirectionRotation()
    stopDialogDirectionAnimation()
    const requestedDirection = state.dialogDisplayDirection
    const direction = requestedDirection === 'auto' ? state.dialogDisplayAutoPhase : requestedDirection
    dialogDirectionTabs.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.dialogDirection === requestedDirection)
    })

    dialog.classList.toggle('show-nb-only', state.dialogDisplayMode && direction === 'nb')
    dialog.classList.toggle('show-sb-only', state.dialogDisplayMode && direction === 'sb')

    if (animate) {
      startDialogDirectionAnimation(direction)
    }

    if (state.dialogDisplayMode && requestedDirection === 'auto') {
      state.dialogDisplayDirectionTimer = window.setInterval(() => {
        state.dialogDisplayAutoPhase = state.dialogDisplayAutoPhase === 'nb' ? 'sb' : 'nb'
        renderDialogDirectionView({ animate: true })
      }, DIALOG_DISPLAY_DIRECTION_ROTATE_MS)
    }
  }

  function stopDialogAutoRefresh() {
    if (state.dialogRefreshTimer) {
      window.clearTimeout(state.dialogRefreshTimer)
      state.dialogRefreshTimer = 0
    }
  }

  function stopDialogDisplayScroll() {
    if (state.dialogDisplayTimer) {
      window.clearInterval(state.dialogDisplayTimer)
      state.dialogDisplayTimer = 0
    }
  }

  function applyDialogDisplayOffset(listElement, key) {
    const items = [...listElement.querySelectorAll('.arrival-item:not(.muted)')]
    listElement.style.transform = 'translateY(0)'

    if (!state.dialogDisplayMode || items.length <= 3) return

    const rowGap = Number.parseFloat(window.getComputedStyle(listElement).rowGap || '0') || 0
    const itemHeight = items[0].getBoundingClientRect().height + rowGap
    const maxIndex = Math.max(0, items.length - 3)
    const safeIndex = Math.min(state.dialogDisplayIndexes[key], maxIndex)
    listElement.style.transform = `translateY(-${safeIndex * itemHeight}px)`
  }

  function syncDialogDisplayScroll() {
    stopDialogDisplayScroll()
    state.dialogDisplayIndexes = { nb: 0, sb: 0 }
    applyDialogDisplayOffset(arrivalsNb, 'nb')
    applyDialogDisplayOffset(arrivalsSb, 'sb')

    if (!state.dialogDisplayMode) return

    state.dialogDisplayTimer = window.setInterval(() => {
      for (const [key, listElement] of [['nb', arrivalsNb], ['sb', arrivalsSb]]) {
        const items = [...listElement.querySelectorAll('.arrival-item:not(.muted)')]
        if (items.length <= 3) continue

        const maxIndex = Math.max(0, items.length - 3)
        state.dialogDisplayIndexes[key] = state.dialogDisplayIndexes[key] >= maxIndex ? 0 : state.dialogDisplayIndexes[key] + 1
        applyDialogDisplayOffset(listElement, key)
      }
    }, DIALOG_DISPLAY_SCROLL_INTERVAL_MS)
  }

  function startDialogAutoRefresh() {
    stopDialogAutoRefresh()
    if (!state.currentDialogStation) return

    const scheduleNextRefresh = () => {
      state.dialogRefreshTimer = window.setTimeout(async () => {
        if (!dialog.open || !state.currentDialogStation) return
        await refreshStationDialog(state.currentDialogStation).catch(console.error)
        scheduleNextRefresh()
      }, DIALOG_REFRESH_INTERVAL_MS)
    }

    scheduleNextRefresh()
  }

  function closeStationDialog() {
    state.activeDialogRequest += 1
    state.currentDialogStationId = ''
    state.currentDialogStation = null
    if (dialog.open) {
      dialog.close()
    } else {
      stopDialogAutoRefresh()
      stopDialogDisplayScroll()
      stopDialogDirectionRotation()
      setDialogDisplayMode(false)
      clearStationParam()
    }
  }

  function setDialogTitle(title) {
    dialogTitleText.textContent = title
    dialogTitleTextClone.textContent = title
    syncDialogTitleMarquee()
  }

  function syncDialogTitleMarquee() {
    const title = dialogTitle
    const track = dialogTitleTrack
    if (!title || !track) return

    const shouldMarquee =
      state.dialogDisplayMode &&
      dialog.open &&
      dialogTitleText.scrollWidth > title.clientWidth

    title.classList.toggle('is-marquee', shouldMarquee)

    // Sync arrivals title marquees
    syncArrivalsTitleMarquee(arrivalsTitleNb)
    syncArrivalsTitleMarquee(arrivalsTitleSb)
  }

  function syncArrivalsTitleMarquee(titleElement) {
    if (!titleElement) return
    const textElement = titleElement.querySelector('.arrivals-title-text')
    if (!textElement) return

    const shouldMarquee =
      state.dialogDisplayMode &&
      dialog.open &&
      textElement.scrollWidth > titleElement.clientWidth

    titleElement.classList.toggle('is-marquee', shouldMarquee)
  }

  return {
    setDialogDisplayMode,
    toggleDialogDisplayMode,
    stopDialogDirectionRotation,
    stopDialogDirectionAnimation,
    renderDialogDirectionView,
    stopDialogAutoRefresh,
    stopDialogDisplayScroll,
    applyDialogDisplayOffset,
    syncDialogDisplayScroll,
    startDialogAutoRefresh,
    closeStationDialog,
    setDialogTitle,
    syncDialogTitleMarquee,
  }
}
