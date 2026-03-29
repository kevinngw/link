import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import LineSwitcher from './LineSwitcher'
import ServiceReminderChip from './shared/ServiceReminderChip'
import ServiceTimeline from './shared/ServiceTimeline'
import { InsightsLineCard } from './insights/InsightsLineCard'
import { InsightsTicker } from './insights/InsightsTicker'
import { InsightsSystemSummary } from './insights/InsightsSystemSummary'
import {
  classifyHeadwayHealth,
  computeLineHeadways,
  formatPercent,
  getDelayBuckets,
  getLineAttentionReasons,
} from '../insights'
import { SYSTEM_META } from '../config'

function buildInsightsItems(lines, vehiclesByLine, alerts) {
  return lines.map((line) => {
    const vehicles = vehiclesByLine.get(line.id) ?? []
    const nb = vehicles.filter((v) => v.directionSymbol === '▲')
    const sb = vehicles.filter((v) => v.directionSymbol === '▼')
    const lineAlerts = alerts.filter((alert) => alert.lineIds.includes(line.id))
    return { line, vehicles, nb, sb, lineAlerts }
  })
}

export default function InsightsBoard() {
  const { t, language } = useTranslation()
  const compactLayout = useAppStore((s) => s.compactLayout)
  const lines = useAppStore((s) => s.lines)
  const activeLineId = useAppStore((s) => s.activeLineId)
  const vehiclesByLine = useAppStore((s) => s.vehiclesByLine)
  const alerts = useAppStore((s) => s.alerts)
  const layouts = useAppStore((s) => s.layouts)
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const systemSnapshots = useAppStore((s) => s.systemSnapshots)
  const error = useAppStore((s) => s.error)
  const fetchedAt = useAppStore((s) => s.fetchedAt)
  const insightsTickerIndex = useAppStore((s) => s.insightsTickerIndex)
  const openInsightsDetail = useAppStore((s) => s.openInsightsDetail)
  const openAlertDialog = useAppStore((s) => s.openAlertDialog)
  const openTrainDialog = useAppStore((s) => s.openTrainDialog)
  const openStationDialog = useAppStore((s) => s.openStationDialog)

  const systemMeta = SYSTEM_META[activeSystemId] ?? SYSTEM_META['link']
  const vehicleLabel = language === 'zh-CN'
    ? (systemMeta.vehicleLabel === 'Train' ? '列车' : '公交')
    : (systemMeta.vehicleLabel ?? 'Vehicle')
  const vehicleLabelPlural = language === 'zh-CN'
    ? vehicleLabel
    : (systemMeta.vehicleLabelPlural ?? `${vehicleLabel}s`)

  const visibleLines = compactLayout
    ? lines.filter((line) => line.id === activeLineId)
    : lines

  const allInsightsItems = buildInsightsItems(lines, vehiclesByLine, alerts)
  const visibleInsightsItems = buildInsightsItems(visibleLines, vehiclesByLine, alerts)
  const pageSize = compactLayout ? 1 : 3

  function handleInsightsClick(type, lineId, stopId) {
    // Build content inline
    openInsightsDetail({ type, lineId: lineId ?? '', title: '', subtitle: '', body: '' })
    // The InsightsDetailDialog will display the content based on type+lineId
  }

  return (
    <>
      <LineSwitcher />
      <InsightsTicker
        items={visibleInsightsItems}
        tickerIndex={insightsTickerIndex}
        pageSize={pageSize}
        t={t}
      />
      <InsightsSystemSummary
        items={allInsightsItems}
        systemMeta={systemMeta}
        systemSnapshots={systemSnapshots}
        error={error}
        fetchedAt={fetchedAt}
        vehicleLabel={vehicleLabel}
        vehicleLabelPlural={vehicleLabelPlural}
        t={t}
        language={language}
        onInsightsClick={handleInsightsClick}
        onTrainClick={(vehicleId) => openTrainDialog(vehicleId)}
      />
      {visibleInsightsItems.map(({ line, vehicles, nb, sb, lineAlerts }) => (
        <InsightsLineCard
          key={line.id}
          line={line}
          layout={layouts.get(line.id)}
          vehicles={vehicles}
          nb={nb}
          sb={sb}
          lineAlerts={lineAlerts}
          vehicleLabel={vehicleLabel}
          vehicleLabelPlural={vehicleLabelPlural}
          t={t}
          language={language}
          onInsightsClick={handleInsightsClick}
          onAlertClick={(lineId) => openAlertDialog(lineId)}
          onTrainClick={(vehicleId) => openTrainDialog(vehicleId)}
          onStationClick={(station) => openStationDialog({ station, stationId: station.id })}
        />
      ))}
    </>
  )
}
