import {
  DIALOG_DISPLAY_DIRECTION_ANIMATION_MS,
  DIALOG_DISPLAY_SCROLL_INTERVAL_MS,
  DIALOG_REFRESH_INTERVAL_MS,
  OBA_RATE_LIMIT_DELAY_MS,
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
    arrivalsTitleNb,
    arrivalsTitleSb,
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
    stopDialogDirectionAnimation()
    const direction = state.dialogDisplayDirection
    dialogDirectionTabs.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.dialogDirection === direction)
    })

    dialog.classList.toggle('show-nb-only', direction === 'nb')
    dialog.classList.toggle('show-sb-only', direction === 'sb')

    if (animate) {
      startDialogDirectionAnimation(direction)
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

  function measureListLayout(listElement) {
    const items = listElement.querySelectorAll('.arrival-item:not(.muted)')
    if (!items.length) return { itemCount: 0, visibleCount: 0, itemHeight: 0 }
    const viewport = listElement.closest('.arrivals-viewport')
    if (!viewport) return { itemCount: items.length, visibleCount: items.length, itemHeight: 0 }
    const vpHeight = viewport.getBoundingClientRect().height
    const rowGap = Number.parseFloat(window.getComputedStyle(listElement).rowGap || '0') || 0
    const itemHeight = items[0].getBoundingClientRect().height + rowGap
    const visibleCount = itemHeight > 0 ? Math.max(1, Math.floor(vpHeight / itemHeight)) : items.length
    return { itemCount: items.length, visibleCount, itemHeight }
  }

  function applyDialogDisplayOffsetFromLayout(listElement, key, layout) {
    listElement.style.transform = 'translateY(0)'
    if (!state.dialogDisplayMode || layout.itemCount <= layout.visibleCount) return
    const maxIndex = Math.max(0, layout.itemCount - layout.visibleCount)
    const safeIndex = Math.min(state.dialogDisplayIndexes[key], maxIndex)
    listElement.style.transform = `translateY(-${safeIndex * layout.itemHeight}px)`
  }

  function syncDialogDisplayScroll() {
    stopDialogDisplayScroll()
    state.dialogDisplayIndexes = { nb: 0, sb: 0 }

    // Batch all layout reads before any writes
    const nbLayout = measureListLayout(arrivalsNb)
    const sbLayout = measureListLayout(arrivalsSb)

    // Now write
    applyDialogDisplayOffsetFromLayout(arrivalsNb, 'nb', nbLayout)
    applyDialogDisplayOffsetFromLayout(arrivalsSb, 'sb', sbLayout)

    if (!state.dialogDisplayMode) return

    const listElements = { nb: arrivalsNb, sb: arrivalsSb }
    const layouts = { nb: nbLayout, sb: sbLayout }

    state.dialogDisplayTimer = window.setInterval(() => {
      for (const key of ['nb', 'sb']) {
        if (layouts[key].itemCount <= layouts[key].visibleCount) continue

        const maxIndex = Math.max(0, layouts[key].itemCount - layouts[key].visibleCount)
        state.dialogDisplayIndexes[key] = state.dialogDisplayIndexes[key] >= maxIndex ? 0 : state.dialogDisplayIndexes[key] + 1
        applyDialogDisplayOffsetFromLayout(listElements[key], key, layouts[key])
      }
    }, DIALOG_DISPLAY_SCROLL_INTERVAL_MS)
  }

  function startDialogAutoRefresh() {
    stopDialogAutoRefresh()
    if (!state.currentDialogStation) return

    const scheduleNextRefresh = (delay = DIALOG_REFRESH_INTERVAL_MS) => {
      state.dialogRefreshTimer = window.setTimeout(async () => {
        if (!dialog.open || !state.currentDialogStation) return

        try {
          await refreshStationDialog(state.currentDialogStation)
          scheduleNextRefresh()
        } catch (error) {
          console.error(error)
          const nextDelay = error?.errorType === 'rate-limit'
            ? OBA_RATE_LIMIT_DELAY_MS
            : DIALOG_REFRESH_INTERVAL_MS
          scheduleNextRefresh(nextDelay)
        }
      }, delay)
    }

    scheduleNextRefresh()
  }

  function cleanupDialogState() {
    stopDialogAutoRefresh()
    stopDialogDisplayScroll()
    stopDialogDirectionAnimation()
    setDialogDisplayMode(false)
    clearStationParam()
  }

  function closeStationDialog() {
    state.activeDialogRequest += 1
    state.currentDialogStationId = ''
    state.currentDialogStation = null
    if (dialog.open) {
      dialog.classList.add('is-closing')
      dialog.addEventListener('animationend', () => {
        dialog.classList.remove('is-closing')
        dialog.close()
        cleanupDialogState()
      }, { once: true })
    } else {
      cleanupDialogState()
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
    stopDialogDirectionAnimation,
    renderDialogDirectionView,
    stopDialogAutoRefresh,
    stopDialogDisplayScroll,
    syncDialogDisplayScroll,
    startDialogAutoRefresh,
    cleanupDialogState,
    closeStationDialog,
    setDialogTitle,
    syncDialogTitleMarquee,
  }
}
