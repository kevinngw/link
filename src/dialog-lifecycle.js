export function createDialogLifecycle({
  state,
  obaClient,
  appElements,
  dialogElements,
  copyValue,
  isPageRequestContextActive,
  getPageFromUrl,
  switchSystem,
  render,
  closeStationDialog,
  closeTrainDialog,
  closeAlertDialog,
  closeStationSearch,
  closeInsightsDetailDialog,
  openStationSearch,
  showInsightsDetail,
  buildInsightsDetailContent,
  renderTrainDialog,
  renderAlertListDialog,
  getAllVehiclesById,
  findStationByParam,
  getDialogStations,
  getDialogStationTitle,
  getCachedArrivalsForStation,
  mergeArrivalBuckets,
  renderArrivalLists,
  renderDialogDirectionView,
  syncDialogTitleMarquee,
  fetchArrivalsForStopIds,
  buildArrivalsForLine,
  getStationStopIds,
  getStationDialogAlerts,
  addRecentStation,
  getActiveSystemMeta,
  clearStationDialogContent,
  renderStationServiceSummary,
  lightImpact,
  setStationParam,
  startDialogAutoRefresh,
  setDialogTitle,
  showToast,
}) {
  const { stationSearchDialog, stationDialogCloseButton } = appElements
  const {
    dialog,
    trainDialog,
    alertDialog,
    insightsDetailDialog,
    stationAlertsContainer,
  } = dialogElements

  function isActiveStationDialogRequest(station, requestId) {
    return Boolean(
      dialog.open &&
      station &&
      state.currentDialogStationId === station.id &&
      state.activeDialogRequest === requestId,
    )
  }

  function canRefreshStationDialog(station, requestId = state.activeDialogRequest) {
    return isPageRequestContextActive() && isActiveStationDialogRequest(station, requestId)
  }

  async function refreshStationDialog(station, { requestId = state.activeDialogRequest, skipCache = false } = {}) {
    if (!station) return

    if (!skipCache && state.dialogFreshFetchActive) return

    const dialogStations = getDialogStations(station)

    if (!skipCache) {
      const cachedArrivals = dialogStations.map(({ station: matchedStation, line }) => (
        getCachedArrivalsForStation(matchedStation, line) ?? { nb: [], sb: [] }
      ))
      const hasAnyCache = cachedArrivals.some((arrivals) => arrivals.nb.length > 0 || arrivals.sb.length > 0)
      if (hasAnyCache) {
        renderArrivalLists(mergeArrivalBuckets(cachedArrivals))
        renderDialogDirectionView()
        syncDialogTitleMarquee()
      }
    }

    const stationAlerts = getStationDialogAlerts(station)
    stationAlertsContainer.innerHTML = stationAlerts.length
      ? stationAlerts.map((alert) => `
          <article class="insight-exception insight-exception-warn">
            <p>${alert.title || copyValue('serviceAlert')}</p>
          </article>
        `).join('')
      : ''

    if (!canRefreshStationDialog(station, requestId)) return

    if (state.dialogAbortController) {
      state.dialogAbortController.abort()
    }

    state.dialogAbortController = new AbortController()
    const { signal } = state.dialogAbortController

    const lineStopIdMap = new Map()
    const allStopIds = new Set()
    for (const { station: matchedStation, line } of dialogStations) {
      const stopIds = getStationStopIds(matchedStation, line)
      lineStopIdMap.set(line, stopIds)
      for (const stopId of stopIds) {
        allStopIds.add(stopId)
      }
    }

    if (skipCache) state.dialogFreshFetchActive = true
    let arrivalFeed = []
    let fetchError = null
    try {
      arrivalFeed = await fetchArrivalsForStopIds([...allStopIds], signal, skipCache)
    } catch (error) {
      if (error.message?.includes('cancelled') || error.name === 'AbortError') {
        return
      }
      fetchError = error
      arrivalFeed = error.partialArrivals ?? arrivalFeed
      console.warn(`Failed to fetch arrivals for station ${station.name}:`, error)
    } finally {
      if (skipCache) state.dialogFreshFetchActive = false
    }

    if (state.currentDialogStationId !== station.id) return
    if (!isActiveStationDialogRequest(station, requestId)) return

    const arrivalsByLine = dialogStations.map(({ line }) => {
      const stopIds = lineStopIdMap.get(line)
      return buildArrivalsForLine(arrivalFeed, line, stopIds)
    })

    renderArrivalLists(mergeArrivalBuckets(arrivalsByLine))
    renderDialogDirectionView()
    syncDialogTitleMarquee()

    if (fetchError) {
      throw fetchError
    }
  }

  async function showStationDialog(station, { updateUrl = true } = {}) {
    if (!station) return

    const requestId = state.activeDialogRequest + 1
    state.activeDialogRequest = requestId
    if (updateUrl) void lightImpact()
    state.currentDialogStation = station
    state.currentDialogStationId = station.id
    setDialogTitle(getDialogStationTitle(station))
    renderStationServiceSummary(station)
    clearStationDialogContent()
    renderArrivalLists({ nb: [], sb: [] }, true)

    if (!dialog.open) {
      state.dialogOpenerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      stationDialogCloseButton?.focus()
    }

    if (updateUrl) setStationParam(station)
    startDialogAutoRefresh()

    const dialogStations = getDialogStations(station)
    const firstMatch = dialogStations[0]
    if (firstMatch) {
      addRecentStation(firstMatch.station, firstMatch.line, state.activeSystemId, getActiveSystemMeta().label)
    }

    try {
      await refreshStationDialog(station, { requestId, skipCache: true })
    } catch (error) {
      if (state.activeDialogRequest !== requestId) return

      if (error.errorType === 'rate-limit') {
        showToast(copyValue('stationRateLimited'))
      } else {
        showToast(copyValue('stationRequestFailed'))
      }

      console.warn('Station refresh failed:', error)
      if (error.errorType !== 'rate-limit') {
        setTimeout(async () => {
          if (state.activeDialogRequest !== requestId || !dialog.open) return
          try {
            await refreshStationDialog(station, { requestId, skipCache: true })
          } catch {}
        }, 3000)
      }
    }
  }

  async function syncDialogFromUrl() {
    const url = new URL(window.location.href)
    state.isSyncingFromUrl = true

    try {
      state.activeTab = getPageFromUrl()

      const requestedSystemId = url.searchParams.get('system')
      if (requestedSystemId && state.systemsById.has(requestedSystemId) && requestedSystemId !== state.activeSystemId) {
        await switchSystem(requestedSystemId, { updateUrl: false, preserveDialog: false })
      }

      render()

      const requestedDialog = (url.searchParams.get('dialog') ?? '').trim().toLowerCase()
      const requestedStation = url.searchParams.get('station')
      const requestedTrainId = url.searchParams.get('train')
      const requestedLineId = url.searchParams.get('line')
      const requestedDetailType = url.searchParams.get('detail')
      const requestedSearchQuery = url.searchParams.get('q') ?? ''
      const effectiveDialog = requestedDialog || (requestedStation ? 'station' : '')

      if (effectiveDialog !== 'station' && dialog.open) closeStationDialog()
      if (effectiveDialog !== 'train' && trainDialog.open) closeTrainDialog()
      if (effectiveDialog !== 'alerts' && alertDialog.open) closeAlertDialog()
      if (effectiveDialog !== 'search' && stationSearchDialog.open) closeStationSearch()
      if (effectiveDialog !== 'insights' && insightsDetailDialog.open) closeInsightsDetailDialog()

      if (!effectiveDialog) return

      if (effectiveDialog === 'station') {
        if (!requestedStation) {
          closeStationDialog()
          return
        }

        const station = findStationByParam(requestedStation)
        if (!station) {
          closeStationDialog()
          return
        }

        if (state.currentDialogStationId === station.id && dialog.open) return
        await showStationDialog(station, { updateUrl: false })
        return
      }

      if (effectiveDialog === 'train') {
        if (!requestedTrainId) {
          closeTrainDialog()
          return
        }

        const vehicle = getAllVehiclesById().get(requestedTrainId)
        if (!vehicle) {
          closeTrainDialog()
          return
        }

        state.currentTrainId = requestedTrainId
        state.activeDialogType = 'train'
        renderTrainDialog(vehicle, { updateUrl: false })
        return
      }

      if (effectiveDialog === 'alerts') {
        if (!requestedLineId) {
          closeAlertDialog()
          return
        }

        const line = state.lines.find((candidate) => candidate.id === requestedLineId)
        if (!line) {
          closeAlertDialog()
          return
        }

        state.activeDialogType = 'alerts'
        renderAlertListDialog(line, { updateUrl: false })
        return
      }

      if (effectiveDialog === 'search') {
        state.activeDialogType = 'search'
        await openStationSearch(requestedSearchQuery, { updateUrl: false })
        return
      }

      if (effectiveDialog === 'insights') {
        if (state.activeTab !== 'insights') {
          state.activeTab = 'insights'
          render()
        }
        if (!requestedDetailType) {
          closeInsightsDetailDialog()
          return
        }

        const content = buildInsightsDetailContent(requestedLineId || null, requestedDetailType)
        if (!content) {
          closeInsightsDetailDialog()
          return
        }

        state.activeDialogType = 'insights'
        showInsightsDetail(content.title, content.subtitle, content.body, {
          updateUrl: false,
          lineId: requestedLineId || '',
          type: requestedDetailType,
        })
      }
    } finally {
      state.isSyncingFromUrl = false
    }
  }

  function registerBackgroundDialogRefresh() {
    let backgroundUpdateTimer = null

    obaClient.setOnBackgroundUpdate(() => {
      if (dialog.open && state.currentDialogStation) {
        clearTimeout(backgroundUpdateTimer)
        backgroundUpdateTimer = setTimeout(() => {
          refreshStationDialog(state.currentDialogStation).catch(console.error)
        }, 500)
      }
    })
  }

  return {
    refreshStationDialog,
    showStationDialog,
    syncDialogFromUrl,
    registerBackgroundDialogRefresh,
  }
}
