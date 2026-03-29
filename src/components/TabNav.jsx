import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import { setPageParam } from '../url-state'

export default function TabNav({ boardRef }) {
  const { t } = useTranslation()
  const activeTab = useAppStore((s) => s.activeTab)
  const setTab = useAppStore((s) => s.setTab)
  const vehicleLabelPlural = useAppStore((s) => {
    const { SYSTEM_META } = require('../config')
    const meta = SYSTEM_META[s.activeSystemId] ?? SYSTEM_META['link']
    if (s.language === 'zh-CN') {
      return meta.vehicleLabel === 'Train' ? '列车' : '公交'
    }
    return meta.vehicleLabelPlural ?? `${meta.vehicleLabel}s`
  })

  const tabs = [
    { key: 'map', label: t('tabMap') },
    { key: 'trains', label: vehicleLabelPlural },
    { key: 'favorites', label: t('tabFavorites') },
    { key: 'insights', label: t('tabInsights') },
  ]

  function handleTabClick(tab) {
    if (tab === activeTab) return
    if (boardRef?.current) {
      boardRef.current.style.opacity = '0'
    }
    setTimeout(() => {
      setTab(tab)
      setPageParam(tab)
      if (boardRef?.current) {
        boardRef.current.style.opacity = '1'
      }
    }, 150)
  }

  return (
    <section className="tab-bar" aria-label={t('boardViews')}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          className={`tab-button${activeTab === key ? ' is-active' : ''}`}
          data-tab={key}
          type="button"
          onClick={() => handleTabClick(key)}
        >
          {label}
        </button>
      ))}
    </section>
  )
}
