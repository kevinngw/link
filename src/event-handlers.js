export function registerAppEventHandlers({
  state,
  appElements,
  dialogElements,
  copyValue,
  toggleDialogDisplayMode,
  shareArrivals,
  closeTrainDialog,
  closeAlertDialog,
  closeInsightsDetailDialog,
  openAboutDialog,
  closeAboutDialog,
  setLanguage,
  setTheme,
  render,
  renderDialogDirectionView,
  closeStationDialog,
  clearDialogParams,
  stopDialogAutoRefresh,
  stopDialogDisplayScroll,
  setDialogDisplayMode,
  clearStationDialogContent,
  clearObaQueue,
  setDialogTitle,
  openStationSearch,
  findNearbyStations,
  closeStationSearch,
  setStationSearchParams,
  renderStationSearchResults,
  getActiveStationSearchResults,
  handleStationSearchSelection,
  refreshVisibleRealtime,
  showToast,
  setPageParam,
  findStationAndLineByStopId,
  getAllVehiclesById,
  renderTrainDialog,
  renderAlertListDialog,
  buildInsightsDetailContent,
  showInsightsDetail,
  showStationDialog,
  switchSystem,
  getFavorites,
  handleFavoriteClick,
  moveFavorite,
  removeFavorite,
  getDialogStations,
  toggleFavorite,
  getFavoriteKey,
  refreshFavoriteArrivals,
  updateFavoriteButton,
  getActiveSystemMeta,
  notificationSuccess,
  lightImpact,
}) {
  const {
    boardElement,
    systemBarElement,
    tabButtons,
    stationSearchToggleButton,
    languageToggleButton,
    themeToggleButton,
    statusPillElement,
    aboutToggleButton,
    stationSearchDialog,
    stationSearchInput,
    stationSearchCloseButton,
    stationLocationButton,
    aboutDialog,
    aboutDialogCloseButton,
    stationDialogCloseButton,
    dialogFavoriteButton,
  } = appElements

  const {
    dialog,
    dialogStatusPillElement,
    dialogShare,
    dialogDisplay,
    dialogDirectionTabs,
    trainDialog,
    trainDialogClose,
    alertDialog,
    alertDialogClose,
    insightsDetailDialog,
    insightsDetailClose,
  } = dialogElements

  dialogDisplay.addEventListener('click', () => toggleDialogDisplayMode())

  if (dialogShare) {
    dialogShare.addEventListener('click', () => {
      if (!state.currentDialogStation) return
      shareArrivals()
    })
  }

  trainDialogClose.addEventListener('click', () => closeTrainDialog())
  alertDialogClose.addEventListener('click', () => closeAlertDialog())
  insightsDetailClose.addEventListener('click', () => closeInsightsDetailDialog())
  insightsDetailDialog.addEventListener('click', (event) => {
    if (event.target === insightsDetailDialog) closeInsightsDetailDialog()
  })

  aboutToggleButton.addEventListener('click', () => openAboutDialog())
  aboutDialogCloseButton.addEventListener('click', () => closeAboutDialog())
  aboutDialog.addEventListener('click', (event) => {
    if (event.target === aboutDialog) closeAboutDialog()
  })
  aboutDialog.addEventListener('close', () => {
    if (state.activeDialogType === 'about') state.activeDialogType = ''
  })

  languageToggleButton.addEventListener('click', () => {
    setLanguage(state.language === 'en' ? 'zh-CN' : 'en')
    render()
  })

  dialogDirectionTabs.forEach((button) => {
    button.addEventListener('click', () => {
      state.dialogDisplayDirection = button.dataset.dialogDirection
      renderDialogDirectionView()
    })
  })

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStationDialog()
  })
  stationDialogCloseButton?.addEventListener('click', () => closeStationDialog())

  trainDialog.addEventListener('click', (event) => {
    if (event.target === trainDialog) closeTrainDialog()
  })
  alertDialog.addEventListener('click', (event) => {
    if (event.target === alertDialog) closeAlertDialog()
  })

  trainDialog.addEventListener('close', () => {
    state.currentTrainId = ''
    if (!state.isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
    }
  })
  alertDialog.addEventListener('close', () => {
    if (!state.isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
    }
  })
  stationSearchDialog.addEventListener('close', () => {
    if (!state.isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
    }
  })
  insightsDetailDialog.addEventListener('close', () => {
    if (!state.isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true, keepStation: true })
    }
  })
  dialog.addEventListener('close', () => {
    state.activeDialogRequest += 1
    state.currentDialogStationId = ''
    state.currentDialogStation = null
    state.activeDialogType = ''
    if (state.dialogAbortController) {
      state.dialogAbortController.abort()
      state.dialogAbortController = null
    }
    stopDialogAutoRefresh()
    stopDialogDisplayScroll()
    setDialogDisplayMode(false)
    clearStationDialogContent()
    state.arrivalsCache.clear()
    clearObaQueue()
    setDialogTitle(copyValue('station'))
    if (!state.isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true })
    }
    state.dialogOpenerElement?.focus()
    state.dialogOpenerElement = null
  })

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.tab === state.activeTab) return
      boardElement.style.opacity = '0'
      setTimeout(() => {
        state.activeTab = button.dataset.tab
        setPageParam(state.activeTab)
        render()
        boardElement.style.opacity = '1'
      }, 150)
    })
  })

  themeToggleButton.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(nextTheme)
        render()
      })
    } else {
      setTheme(nextTheme)
      render()
    }
  })

  stationSearchToggleButton.addEventListener('click', () => openStationSearch())
  stationLocationButton?.addEventListener('click', async () => {
    await findNearbyStations()
  })
  stationSearchCloseButton.addEventListener('click', () => closeStationSearch())
  stationSearchDialog.addEventListener('click', (event) => {
    if (event.target === stationSearchDialog) closeStationSearch()
  })
  let searchDebounceTimer = 0
  stationSearchInput.addEventListener('input', () => {
    state.stationSearchQuery = stationSearchInput.value
    state.highlightedStationSearchIndex = 0
    state.highlightedNearbyStationIndex = 0
    if (state.stationSearchQuery.trim()) {
      state.nearbyStations = []
      state.geolocationStatus = ''
      state.geolocationError = ''
    }
    if (stationSearchDialog.open && !state.isSyncingFromUrl) {
      setStationSearchParams(state.stationSearchQuery)
    }
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = setTimeout(renderStationSearchResults, 150)
  })
  stationSearchInput.addEventListener('keydown', async (event) => {
    const results = getActiveStationSearchResults()
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (state.stationSearchQuery.trim()) {
        state.highlightedStationSearchIndex = Math.min(Math.max(0, results.length - 1), state.highlightedStationSearchIndex + 1)
      } else {
        state.highlightedNearbyStationIndex = Math.min(Math.max(0, results.length - 1), state.highlightedNearbyStationIndex + 1)
      }
      renderStationSearchResults()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (state.stationSearchQuery.trim()) {
        state.highlightedStationSearchIndex = Math.max(0, state.highlightedStationSearchIndex - 1)
      } else {
        state.highlightedNearbyStationIndex = Math.max(0, state.highlightedNearbyStationIndex - 1)
      }
      renderStationSearchResults()
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const selected = state.stationSearchQuery.trim()
        ? (results[state.highlightedStationSearchIndex] ?? results[0])
        : (results[state.highlightedNearbyStationIndex] ?? results[0])
      if (selected) await handleStationSearchSelection(selected)
    }
  })

  document.addEventListener('keydown', (event) => {
    const target = event.target
    const isTypingTarget = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    if (event.key === '/' && !isTypingTarget && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      openStationSearch()
      return
    }
    if (event.key === 'Escape' && stationSearchDialog.open) {
      closeStationSearch()
    }
  })

  document.addEventListener('visibilitychange', () => {
    refreshVisibleRealtime().catch(console.error)
  })
  window.addEventListener('focus', () => {
    refreshVisibleRealtime().catch(console.error)
  })

  statusPillElement.addEventListener('click', async () => {
    statusPillElement.textContent = '...'
    showToast(copyValue('refreshingData'))
    await refreshVisibleRealtime()
    showToast(copyValue('dataRefreshed'))
  })
  dialogStatusPillElement.addEventListener('click', async () => {
    dialogStatusPillElement.textContent = '...'
    showToast(copyValue('refreshingData'))
    await refreshVisibleRealtime()
    showToast(copyValue('dataRefreshed'))
  })

  boardElement.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const activatable = event.target.closest('[role="button"]')
    if (!activatable) return
    event.preventDefault()
    activatable.click()
  })

  boardElement.addEventListener('click', (event) => {
    const lineSwitchBtn = event.target.closest('[data-line-switch]')
    if (lineSwitchBtn) {
      state.activeLineId = lineSwitchBtn.dataset.lineSwitch
      render()
      return
    }

    const dirFilterBtn = event.target.closest('[data-direction-filter]')
    if (dirFilterBtn) {
      const lineId = dirFilterBtn.dataset.directionLine
      const direction = dirFilterBtn.dataset.directionFilter
      state.directionFilterByLine.set(lineId, direction)
      render()
      return
    }

    const trainItem = event.target.closest('[data-train-id]')
    if (trainItem) {
      const vehicle = getAllVehiclesById().get(trainItem.dataset.trainId)
      if (vehicle) {
        state.currentTrainId = trainItem.dataset.trainId
        renderTrainDialog(vehicle)
      }
      return
    }

    const alertBtn = event.target.closest('[data-alert-line-id]')
    if (alertBtn) {
      const line = state.lines.find((candidate) => candidate.id === alertBtn.dataset.alertLineId)
      if (line) renderAlertListDialog(line)
      return
    }

    const stationGroup = event.target.closest('.station-group')
    if (stationGroup) {
      const result = findStationAndLineByStopId(stationGroup.dataset.stopId)
      if (result) showStationDialog(result.station)
      return
    }

    const insightsEl = event.target.closest('[data-insights-type]')
    if (insightsEl) {
      const lineId = insightsEl.dataset.insightsLineId ?? null
      const type = insightsEl.dataset.insightsType
      const stopId = insightsEl.dataset.hotspotStopId ?? null
      const content = buildInsightsDetailContent(lineId, type, { stopId })
      if (content) showInsightsDetail(content.title, content.subtitle, content.body, { type, lineId: lineId ?? '' })
      return
    }

    const terminalEl = event.target.closest('[data-terminal-line-id]')
    if (terminalEl) {
      const layout = state.layouts.get(terminalEl.dataset.terminalLineId)
      if (!layout) return
      const station = terminalEl.dataset.terminalDirection === 'nb' ? layout.stations[0] : layout.stations.at(-1)
      if (station) showStationDialog(station)
    }
  })

  systemBarElement.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-system-switch]')
    if (!button) return
    await switchSystem(button.dataset.systemSwitch, { updateUrl: true, preserveDialog: false })
  })

  dialog.addEventListener('click', (event) => {
    const item = event.target.closest('[data-arrival-vehicle-id]')
    if (!item) return
    const vehicle = getAllVehiclesById().get(item.dataset.arrivalVehicleId)
    if (!vehicle) return
    state.currentTrainId = item.dataset.arrivalVehicleId
    renderTrainDialog(vehicle)
  })

  boardElement.addEventListener('click', (event) => {
    const moveBtn = event.target.closest('[data-fav-move]')
    if (moveBtn) {
      event.stopPropagation()
      moveFavorite(moveBtn.dataset.favStation, moveBtn.dataset.favLine, moveBtn.dataset.favSystem, moveBtn.dataset.favMove)
      render()
      return
    }

    const removeBtn = event.target.closest('[data-fav-remove]')
    if (removeBtn) {
      event.stopPropagation()
      removeFavorite(removeBtn.dataset.favStation, removeBtn.dataset.favLine, removeBtn.dataset.favSystem)
      showToast(copyValue('favoriteRemoved'))
      render()
      return
    }

    const favItem = event.target.closest('[data-favorite-key]')
    if (!favItem) return
    const favorite = getFavorites().find((item) => `${item.systemId}:${item.lineId}:${item.stationId}` === favItem.dataset.favoriteKey)
    if (favorite) handleFavoriteClick(favorite)
  })

  if (dialogFavoriteButton) {
    dialogFavoriteButton.addEventListener('click', () => {
      if (!state.currentDialogStation) return

      const dialogStations = getDialogStations(state.currentDialogStation)
      const firstMatch = dialogStations[0]
      if (!firstMatch) return

      const favoriteKey = getFavoriteKey({
        systemId: state.activeSystemId,
        lineId: firstMatch.line.id,
        stationId: firstMatch.station.id,
      })

      const result = toggleFavorite(firstMatch.station, firstMatch.line, state.activeSystemId)
      if (!result.isFavorite) {
        state.favoriteArrivals.delete(favoriteKey)
      }
      updateFavoriteButton()
      if (state.activeTab === 'favorites') {
        render()
        if (result.isFavorite) {
          refreshFavoriteArrivals({ force: true }).catch(console.error)
        }
      }
      showToast(copyValue(result.isFavorite ? 'favoriteAdded' : 'favoriteRemoved'))
      void (result.isFavorite ? notificationSuccess() : lightImpact())
    })
  }
}
