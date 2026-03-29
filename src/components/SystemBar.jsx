import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import { SYSTEM_META } from '../config'
import { setSystemParam } from '../url-state'
import { appState } from '../lib/appState'
import { applySystemState, loadSystemDataById } from '../static-data'
import { refreshVehicles } from '../lib/refreshVehicles'

export default function SystemBar() {
  const { t } = useTranslation()
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const systemsById = useAppStore((s) => s.systemsById)
  const setActiveSystem = useAppStore((s) => s.setActiveSystem)
  const syncFromAppState = useAppStore((s) => s.syncFromAppState)
  const showToast = useAppStore((s) => s.showToast)
  const closeStationDialog = useAppStore((s) => s.closeStationDialog)
  const closeTrainDialog = useAppStore((s) => s.closeTrainDialog)
  const closeAlertDialog = useAppStore((s) => s.closeAlertDialog)

  const visibleSystems = Object.values(SYSTEM_META).filter((sys) => systemsById.has(sys.id))

  if (visibleSystems.length < 2) return null

  async function handleSystemSwitch(systemId) {
    if (systemId === activeSystemId) {
      setSystemParam(activeSystemId)
      return
    }

    if (!systemsById.get(systemId)?.lines) {
      try {
        await loadSystemDataById(appState, systemId)
      } catch (error) {
        console.error('Failed to load system data:', error)
        showToast({ message: t('startupRequestFailed'), tone: 'warn' })
        return
      }
    }

    applySystemState(appState, systemId)
    closeStationDialog()
    closeTrainDialog()
    closeAlertDialog()
    syncFromAppState()
    setSystemParam(systemId)
    await refreshVehicles()
  }

  return (
    <section
      className="tab-bar system-bar"
      aria-label={t('transitSystems')}
    >
      {visibleSystems.map((system) => (
        <button
          key={system.id}
          className={`tab-button${system.id === activeSystemId ? ' is-active' : ''}`}
          data-system-switch={system.id}
          type="button"
          onClick={() => handleSystemSwitch(system.id)}
        >
          {system.label}
        </button>
      ))}
    </section>
  )
}
