import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import { useStationArrivals } from '../../hooks/useStationArrivals'
import { ArrivalDirectionSection } from '../arrivals/ArrivalDirectionSection'
import { formatRelativeTime as formatRelativeTimeValue } from '../../formatters'
import { setStationParam, clearStationParam, clearDialogParams } from '../../url-state'
import { normalizeName } from '../../utils'
import { SYSTEM_META } from '../../config'
import { appState } from '../../lib/appState'

const FAVORITES_STORAGE_KEY = 'link-pulse-favorites'

function getFavorites() {
  try { return JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]') } catch { return [] }
}

function saveFavorites(favs) {
  try { window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs.slice(0, 20))) } catch {}
}

function getDialogStationTitle(station, lines) {
  const stripDir = (s) => s.replace(/\s+(NB|SB|EB|WB)\b/gi, '')
  const stripBay = (s) => s.replace(/\s*[-–]\s*Bay\s+\S+$/i, '')
  const mainName = normalizeName(station.name)
  for (const line of lines) {
    const oppName = line.oppositeStopNames?.[station.id]
    if (!oppName) continue
    const oppNormalized = normalizeName(oppName)
    const mainClean = stripDir(mainName)
    const oppClean = stripDir(oppNormalized)
    if (mainClean === oppClean) return mainClean
    if (stripBay(mainClean) === stripBay(oppClean)) return stripBay(mainClean)
    return `${mainClean} / ${oppClean}`
  }
  return mainName
}

function getDialogStations(station, lines) {
  const exactMatches = lines
    .map((line) => {
      const matchedStation = line.stops?.find((s) => s.id === station.id)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)
  if (exactMatches.length > 0) return exactMatches
  return lines
    .map((line) => {
      const matchedStation = line.stops?.find((s) => s.name === station.name)
      return matchedStation ? { line, station: matchedStation } : null
    })
    .filter(Boolean)
}

function getServiceReminder(line, t, language) {
  const { getDateKeyWithOffset, getServiceDateTime, formatServiceClock: formatServiceClockValue, formatDurationFromMs: formatDurationFromMsValue } = require('../../formatters')
  const now = new Date()
  const todayKey = getDateKeyWithOffset(0)
  const tomorrowKey = getDateKeyWithOffset(1)
  const todaySpan = line.serviceSpansByDate?.[todayKey]
  const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]
  const formatClock = (v) => formatServiceClockValue(v, language, t)
  const formatDuration = (ms) => formatDurationFromMsValue(ms, t)

  if (todaySpan) {
    const todayStart = getServiceDateTime(todayKey, todaySpan.start)
    const todayEnd = getServiceDateTime(todayKey, todaySpan.end)
    if (now >= todayStart && now <= todayEnd) {
      return `${line.name}: ${t('endsIn', formatDuration(todayEnd.getTime() - now.getTime()))}`
    }
    if (now < todayStart) return `${line.name}: ${t('startsIn', formatDuration(todayStart.getTime() - now.getTime()))}`
    if (now > todayEnd) return `${line.name}: ${tomorrowSpan ? t('nextStart', formatClock(tomorrowSpan.start)) : t('ended')}`
  }
  if (tomorrowSpan) return `${line.name}: ${t('nextStart', formatClock(tomorrowSpan.start))}`
  return `${line.name}: ${t('unavailable')}`
}

export default function StationDialog() {
  const dialogRef = useRef(null)
  const { t, language } = useTranslation()
  const station = useAppStore((s) => s.currentDialogStation)
  const activeDialogType = useAppStore((s) => s.activeDialogType)
  const closeStationDialog = useAppStore((s) => s.closeStationDialog)
  const lines = useAppStore((s) => s.lines)
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const isSyncingFromUrl = useAppStore((s) => s.isSyncingFromUrl)
  const openTrainDialog = useAppStore((s) => s.openTrainDialog)
  const showToast = useAppStore((s) => s.showToast)
  const vehiclesByLine = useAppStore((s) => s.vehiclesByLine)
  const fetchedAt = useAppStore((s) => s.fetchedAt)
  const error = useAppStore((s) => s.error)
  const alerts = useAppStore((s) => s.alerts)

  const [displayMode, setDisplayMode] = useState(false)
  const [displayDirection, setDisplayDirection] = useState('both')
  const [displayAutoPhase, setDisplayAutoPhase] = useState('nb')
  const autoPhaseTimerRef = useRef(0)

  const { arrivals, loading, fetchedAt: arrivalsFetchedAt } = useStationArrivals(
    activeDialogType === 'station' ? station : null
  )

  const systemMeta = SYSTEM_META[activeSystemId] ?? SYSTEM_META['link']
  const vehicleLabel = language === 'zh-CN'
    ? (systemMeta.vehicleLabel === 'Train' ? '列车' : '公交')
    : (systemMeta.vehicleLabel ?? 'Vehicle')

  // Open/close dialog
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeDialogType === 'station' && station) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else {
      if (dialog.open) {
        closeAnimated(dialog)
      }
    }
  }, [activeDialogType, station])

  // Auto-rotation in display mode
  useEffect(() => {
    window.clearInterval(autoPhaseTimerRef.current)
    if (displayMode && displayDirection === 'auto') {
      autoPhaseTimerRef.current = window.setInterval(() => {
        setDisplayAutoPhase((prev) => prev === 'nb' ? 'sb' : 'nb')
      }, 15000)
    }
    return () => window.clearInterval(autoPhaseTimerRef.current)
  }, [displayMode, displayDirection])

  function closeAnimated(dialog) {
    if (!dialog?.open) return
    dialog.classList.add('is-closing')
    dialog.addEventListener('animationend', () => {
      dialog.classList.remove('is-closing')
      dialog.close()
    }, { once: true })
  }

  function handleClose() {
    closeStationDialog()
    setDisplayMode(false)
    setDisplayDirection('both')
    setDisplayAutoPhase('nb')
    if (!isSyncingFromUrl) {
      clearDialogParams({ keepPage: true, keepSystem: true })
    }
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) handleClose()
  }

  function isFavorite() {
    if (!station) return false
    const dialogStations = getDialogStations(station, lines)
    const firstMatch = dialogStations[0]
    if (!firstMatch) return false
    return getFavorites().some((f) =>
      f.stationId === firstMatch.station.id && f.lineId === firstMatch.line.id && f.systemId === activeSystemId
    )
  }

  function toggleFavorite() {
    if (!station) return
    const dialogStations = getDialogStations(station, lines)
    const firstMatch = dialogStations[0]
    if (!firstMatch) return

    const favorites = getFavorites()
    const existingIdx = favorites.findIndex(
      (f) => f.stationId === firstMatch.station.id && f.lineId === firstMatch.line.id && f.systemId === activeSystemId
    )
    let newFavs
    let added
    if (existingIdx >= 0) {
      newFavs = favorites.filter((_, i) => i !== existingIdx)
      added = false
    } else {
      newFavs = [{
        stationId: firstMatch.station.id,
        stationName: firstMatch.station.name,
        lineId: firstMatch.line.id,
        lineName: firstMatch.line.name,
        lineColor: firstMatch.line.color,
        systemId: activeSystemId,
        systemName: appState.systemsById.get(activeSystemId)?.name || activeSystemId,
        addedAt: Date.now(),
      }, ...favorites]
      added = true
    }
    saveFavorites(newFavs)
    showToast({ message: t(added ? 'favoriteAdded' : 'favoriteRemoved'), tone: 'info' })
  }

  async function shareArrivals() {
    if (!station) return
    const stationTitle = getDialogStationTitle(station, lines)
    const nbArr = arrivals.nb.slice(0, 3)
    const sbArr = arrivals.sb.slice(0, 3)
    let text = `${stationTitle}\n`
    if (nbArr.length) {
      text += `\n${t('northboundLabel')}:\n`
      nbArr.forEach((a) => {
        const diff = Math.floor((a.arrivalTime - Date.now()) / 1000)
        const timeStr = diff <= 0 ? t('arriving') : `${Math.floor(diff / 60)}m ${diff % 60}s`
        text += `• ${a.lineName} ${vehicleLabel} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
      })
    }
    if (sbArr.length) {
      text += `\n${t('southboundLabel')}:\n`
      sbArr.forEach((a) => {
        const diff = Math.floor((a.arrivalTime - Date.now()) / 1000)
        const timeStr = diff <= 0 ? t('arriving') : `${Math.floor(diff / 60)}m ${diff % 60}s`
        text += `• ${a.lineName} ${vehicleLabel} ${a.vehicleId}: ${timeStr}${a.destination ? ' to ' + a.destination : ''}\n`
      })
    }
    const baseUrl = window.location.origin + window.location.pathname
    const slug = encodeURIComponent(stationTitle.toLowerCase().replace(/\s+/g, '-'))
    text += `\n${baseUrl}?system=${activeSystemId}&station=${slug}`

    try {
      if (navigator.share) {
        await navigator.share({ title: `${stationTitle} - ${systemMeta.title}`, text })
        showToast({ message: t('shareSuccess'), tone: 'info' })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        showToast({ message: t('shareCopied'), tone: 'info' })
      } else {
        showToast({ message: t('shareFailed'), tone: 'warn' })
      }
    } catch (err) {
      if (err.name !== 'AbortError') showToast({ message: t('shareFailed'), tone: 'warn' })
    }
  }

  function getStationAlerts() {
    if (!station) return []
    const seen = new Set()
    const result = []
    for (const line of lines) {
      const matchedStation = line.stops?.find((s) => s.id === station.id)
      if (!matchedStation) continue
      const lineAlerts = alerts.filter((a) => a.lineIds.includes(line.id))
      for (const alert of lineAlerts) {
        if (!alert.stopIds.length) continue
        const stopIds = new Set([matchedStation.id, ...(line.stationAliases?.[matchedStation.id] ?? [])])
        if (alert.stopIds.some((id) => stopIds.has(id)) && !seen.has(alert.id)) {
          seen.add(alert.id)
          result.push(alert)
        }
      }
    }
    return result
  }

  const title = station ? getDialogStationTitle(station, lines) : t('station')
  const stationAlerts = getStationAlerts()
  const statusText = error ? t('statusHold') : t('statusSync')
  const isError = Boolean(error)
  const updatedText = isError ? t('usingLastSnapshot') : formatRelativeTimeValue(fetchedAt, t)

  const allVehicles = lines.flatMap((line) =>
    (vehiclesByLine.get(line.id) ?? []).map((v) => ({
      ...v,
      lineColor: line.color,
      lineId: line.id,
      lineName: line.name,
      lineToken: line.name[0],
    }))
  )

  // Direction summaries
  function getDirectionSummary(symbol) {
    const bucket = symbol === '▲' ? arrivals.nb : arrivals.sb
    const dests = bucket.map((a) => a.destination).filter(Boolean)
    const unique = [...new Set(dests.map((d) => d.trim()).filter(Boolean))].slice(0, 2)
    if (unique.length) return unique.join(' / ')
    if (!station) return ''
    const dialogStations = getDialogStations(station, lines)
    const layoutDests = dialogStations.map(({ line }) => {
      const layout = appState.layouts.get(line.id)
      if (!layout?.stations?.length) return ''
      const termIdx = symbol === '▲' ? 0 : layout.stations.length - 1
      return layout.stations[termIdx]?.label ?? ''
    }).filter(Boolean)
    return [...new Set(layoutDests)].slice(0, 2).join(' / ')
  }

  const nbDest = getDirectionSummary('▲')
  const sbDest = getDirectionSummary('▼')
  const nbLabel = `▲ ${nbDest ? t('directionTo', t('northboundLabel'), nbDest) : t('northboundLabel')}`
  const sbLabel = `▼ ${sbDest ? t('directionTo', t('southboundLabel'), sbDest) : t('southboundLabel')}`

  // Show/hide sections based on direction
  const effectiveDirection = displayDirection === 'auto' ? displayAutoPhase : displayDirection
  const showNb = effectiveDirection === 'both' || effectiveDirection === 'nb'
  const showSb = effectiveDirection === 'both' || effectiveDirection === 'sb'

  const serviceSummary = station
    ? getDialogStations(station, lines).slice(0, 3).map(({ line }) => getServiceReminder(line, t, language)).join('  ·  ')
    : t('serviceSummary')

  const favActive = isFavorite()

  const dialogEl = (
    <dialog
      ref={dialogRef}
      className={`station-dialog${displayMode ? ' is-display-mode' : ''}${!showNb ? ' show-sb-only' : ''}${!showSb ? ' show-nb-only' : ''}`}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className="dialog-content">
        <header className="dialog-header">
          <div className="dialog-header-main">
            <div className="dialog-title-wrap">
              <h3 className="dialog-title">
                <span className="dialog-title-track">
                  <span className="dialog-title-text">{title}</span>
                  <span className="dialog-title-text dialog-title-text-clone" aria-hidden="true">{title}</span>
                </span>
              </h3>
              <div className="dialog-meta">
                <button
                  className={`status-pill${isError ? ' status-pill-error' : ''}`}
                  type="button"
                  aria-label={t('manualRefresh')}
                >
                  {statusText}
                </button>
                <p className="updated-at">{updatedText}</p>
              </div>
            </div>
            <p className="dialog-service-summary">{serviceSummary}</p>
          </div>
          <div className="dialog-actions">
            <button
              className={`dialog-close dialog-favorite-button${favActive ? ' is-favorite' : ''}`}
              type="button"
              aria-label={favActive ? t('removeFavorite') : t('addFavorite')}
              onClick={toggleFavorite}
            >
              {favActive ? '★' : '☆'}
            </button>
            <button
              className="dialog-close dialog-share-button"
              type="button"
              aria-label={t('shareArrivalsAria')}
              onClick={shareArrivals}
            >
              {t('shareArrivals')}
            </button>
            <button
              className="dialog-close dialog-mode-button"
              type="button"
              aria-label={displayMode ? t('exit') : t('board')}
              onClick={() => setDisplayMode(!displayMode)}
            >
              {displayMode ? t('exit') : t('board')}
            </button>
            <button
              className="dialog-close"
              type="button"
              aria-label={`Close station dialog`}
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
        </header>
        <div className="dialog-direction-bar">
          <div className="dialog-direction-tabs" aria-label={t('boardDirectionView')}>
            {['both', 'nb', 'sb', 'auto'].map((dir) => (
              <button
                key={dir}
                className={`dialog-direction-tab${displayDirection === dir ? ' is-active' : ''}`}
                data-dialog-direction={dir}
                type="button"
                onClick={() => {
                  setDisplayDirection(dir)
                  if (dir === 'auto') setDisplayAutoPhase('nb')
                }}
              >
                {dir === 'both' ? t('both') : dir === 'auto' ? t('auto') : dir.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {stationAlerts.length > 0 && (
          <div id="station-alerts-container">
            {stationAlerts.map((alert, i) => (
              <article key={i} className="insight-exception insight-exception-warn">
                <p>{alert.title || t('serviceAlert')}</p>
              </article>
            ))}
          </div>
        )}
        <div className="dialog-body">
          <ArrivalDirectionSection
            direction="nb"
            arrivals={arrivals.nb}
            loading={loading}
            t={t}
            language={language}
            allVehicles={allVehicles}
            onVehicleClick={(v) => openTrainDialog(v.id)}
            displayMode={displayMode}
            directionTitle={nbLabel}
          />
          <ArrivalDirectionSection
            direction="sb"
            arrivals={arrivals.sb}
            loading={loading}
            t={t}
            language={language}
            allVehicles={allVehicles}
            onVehicleClick={(v) => openTrainDialog(v.id)}
            displayMode={displayMode}
            directionTitle={sbLabel}
          />
        </div>
      </div>
    </dialog>
  )

  return createPortal(dialogEl, document.body)
}
