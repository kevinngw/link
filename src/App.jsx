import { useEffect, useRef } from 'react'
import { useAppStore } from './store/useAppStore'
import { useVehicleRefresh } from './hooks/useVehicleRefresh'
import { useCompactLayout } from './hooks/useCompactLayout'
import Header from './components/Header'
import TabNav from './components/TabNav'
import SystemBar from './components/SystemBar'
import Board from './components/Board'
import StationDialog from './components/dialogs/StationDialog'
import TrainDialog from './components/dialogs/TrainDialog'
import AlertDialog from './components/dialogs/AlertDialog'
import SearchDialog from './components/dialogs/SearchDialog'
import InsightsDetailDialog from './components/dialogs/InsightsDetailDialog'
import ToastContainer from './components/ToastContainer'
import { bootstrapApp, loadStaticData } from './static-data'
import { appState } from './lib/appState'
import { THEME_STORAGE_KEY, LANGUAGE_STORAGE_KEY } from './config'
import { getPageFromUrl } from './url-state'

function getPreferredTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function getPreferredLanguage() {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh-CN') return stored
  const browser = navigator.language?.toLowerCase() ?? ''
  return browser.startsWith('zh') ? 'zh-CN' : 'en'
}

function getSystemIdFromUrl() {
  const url = new URL(window.location.href)
  const requested = url.searchParams.get('system')
  if (requested && appState.systemsById.has(requested)) return requested
  return appState.activeSystemId
}

export default function App() {
  const boardRef = useRef(null)
  const setTheme = useAppStore((s) => s.setTheme)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const setCompactLayout = useAppStore((s) => s.setCompactLayout)
  const syncFromAppState = useAppStore((s) => s.syncFromAppState)
  const showToast = useAppStore((s) => s.showToast)
  const initDone = useRef(false)

  useCompactLayout(boardRef)
  useVehicleRefresh()

  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    const theme = getPreferredTheme()
    const language = getPreferredLanguage()

    setTheme(theme)
    setLanguage(language)
    appState.activeTab = getPageFromUrl()

    const handleViewportResize = () => {
      const visualViewportWidth = window.visualViewport?.width ?? Number.POSITIVE_INFINITY
      const innerWidth = window.innerWidth || Number.POSITIVE_INFINITY
      const documentWidth = document.documentElement?.clientWidth || Number.POSITIVE_INFINITY
      const viewportWidth = Math.min(innerWidth, visualViewportWidth, documentWidth)
      setCompactLayout(viewportWidth <= 1100)
    }

    const init = bootstrapApp({
      state: appState,
      getPreferredLanguage,
      getPreferredTheme,
      handleViewportResize,
      loadStaticData: () => loadStaticData({ state: appState, getSystemIdFromUrl }),
      refreshVehicles: async () => {
        const { refreshVehicles } = await import('./lib/refreshVehicles')
        await refreshVehicles()
      },
      render: () => syncFromAppState(),
      refreshLiveMeta: () => {},
      refreshArrivalCountdowns: () => {},
      refreshVehicleStatusMessages: () => {},
      refreshVehicleCountdownDisplays: () => {},
      startInsightsTickerRotation: () => {},
      startLiveRefreshLoop: () => {},
      syncCompactLayoutFromBoard: () => {},
      syncDialogFromUrl: async () => {},
      updateViewportState: handleViewportResize,
      setLanguage: (lang) => setLanguage(lang),
      setTheme: (t) => setTheme(t),
      boardElement: boardRef.current ?? document.createElement('div'),
    })

    init()
      .then(() => syncFromAppState())
      .catch((error) => {
        showToast({ message: 'Initial data request failed.', tone: 'warn' })
        console.error('[App bootstrap]', error)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="screen">
      <Header />
      <div className="switcher-stack">
        <SystemBar />
        <TabNav boardRef={boardRef} />
      </div>
      <Board ref={boardRef} />
      <StationDialog />
      <TrainDialog />
      <AlertDialog />
      <SearchDialog />
      <InsightsDetailDialog />
      <ToastContainer />
    </main>
  )
}
