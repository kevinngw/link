/**
 * TrainDialog.jsx
 * Native <dialog> portal for the train detail view.
 * Shows vehicle spine (previous/current/next stop), ETA timeline, and metrics.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import {
  formatArrivalTime as formatArrivalTimeValue,
  formatEtaClockFromNow as formatEtaClockFromNowValue,
} from '../../formatters'
import { getStatusTone } from '../../arrivals'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTrainTimelineEntries(vehicle, layout) {
  if (!layout?.stations?.length) return []

  const currentIndex = Math.max(0, Math.min(layout.stations.length - 1, vehicle.currentIndex ?? 0))
  const nextIndex = Math.max(0, Math.min(layout.stations.length - 1, vehicle.upcomingStopIndex ?? currentIndex))
  const directionStep = vehicle.directionSymbol === '▲' ? -1 : vehicle.directionSymbol === '▼' ? 1 : 0
  if (!directionStep) return []

  const entries = []
  let etaSeconds = Math.max(0, vehicle.nextOffset ?? 0)

  for (let index = nextIndex; index >= 0 && index < layout.stations.length; index += directionStep) {
    const station = layout.stations[index]
    if (!station) break

    entries.push({
      stationId: station.id,
      label: station.label,
      etaSeconds,
      isNext: index === nextIndex,
      isTerminal: index === 0 || index === layout.stations.length - 1,
    })

    const segmentMinutes = station.segmentMinutes ?? 0
    const previousStation = layout.stations[index - 1]
    const reverseSegmentMinutes = previousStation?.segmentMinutes ?? 0
    etaSeconds += Math.round((directionStep > 0 ? segmentMinutes : reverseSegmentMinutes) * 60)
  }

  return entries
}

function getVehicleDestinationLabel(vehicle, layout) {
  if (layout?.stations?.length) {
    const terminalIndex = vehicle.directionSymbol === '▲' ? 0 : vehicle.directionSymbol === '▼' ? layout.stations.length - 1 : -1
    if (terminalIndex >= 0) {
      const label = layout.stations[terminalIndex]?.label
      if (label) return label
    }
  }
  return vehicle?.upcomingLabel || vehicle?.toLabel || vehicle?.currentStopLabel || ''
}

function getDirectionBaseLabel(directionSymbol, t) {
  if (directionSymbol === '▲') return t('northboundLabel')
  if (directionSymbol === '▼') return t('southboundLabel')
  return t('active')
}

// ---------------------------------------------------------------------------
// EtaEntry with live countdown
// ---------------------------------------------------------------------------
function EtaEntry({ entry, baseRenderedAt, onStationClick, t, language }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - baseRenderedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [baseRenderedAt])

  const liveEta = Math.max(0, entry.etaSeconds - elapsed)

  const handleClick = () => {
    if (entry.stationId) onStationClick(entry.stationId)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      className={`train-eta-stop${entry.isNext ? ' is-next' : ''}${entry.isTerminal ? ' is-terminal' : ''}`}
      role={entry.stationId ? 'button' : undefined}
      tabIndex={entry.stationId ? 0 : undefined}
      onClick={entry.stationId ? handleClick : undefined}
      onKeyDown={entry.stationId ? handleKeyDown : undefined}
    >
      <div>
        <p className="train-eta-stop-label">
          {entry.isNext ? t('nextStop') : entry.isTerminal ? t('terminal') : t('upcoming')}
        </p>
        <p className="train-eta-stop-name">{entry.label}</p>
      </div>
      <div className="train-eta-stop-side">
        <p className="train-eta-stop-countdown">{formatArrivalTimeValue(liveEta, t)}</p>
        <p className="train-eta-stop-clock">{formatEtaClockFromNowValue(liveEta, language)}</p>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function TrainDialog() {
  const { t, language } = useTranslation()
  const activeDialogType = useAppStore((s) => s.activeDialogType)
  const currentTrainId = useAppStore((s) => s.currentTrainId)
  const vehiclesByLine = useAppStore((s) => s.vehiclesByLine)
  const layouts = useAppStore((s) => s.layouts)
  const lines = useAppStore((s) => s.lines)
  const { closeTrainDialog, openStationDialog } = useAppStore.getState()

  const dialogRef = useRef(null)
  const renderedAtRef = useRef(Date.now())

  // Find the current vehicle across all lines
  const vehicle = (() => {
    if (!currentTrainId) return null
    for (const [, vehicles] of vehiclesByLine) {
      const found = vehicles.find((v) => v.id === currentTrainId)
      if (found) return found
    }
    return null
  })()

  const layout = vehicle ? layouts.get(vehicle.lineId) : null

  // Open/close dialog
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (activeDialogType === 'train' && currentTrainId) {
      renderedAtRef.current = Date.now()
      if (!el.open) el.showModal()
    } else {
      if (el.open) {
        el.classList.add('is-closing')
        const onEnd = () => {
          el.classList.remove('is-closing')
          el.close()
        }
        el.addEventListener('animationend', onEnd, { once: true })
      }
    }
  }, [activeDialogType, currentTrainId])

  const handleClose = useCallback(() => {
    const el = dialogRef.current
    if (!el || !el.open) return
    el.classList.add('is-closing')
    el.addEventListener('animationend', () => {
      el.classList.remove('is-closing')
      el.close()
      closeTrainDialog()
    }, { once: true })
  }, [closeTrainDialog])

  const handleStationClick = useCallback((stationId) => {
    // Find the station across lines
    for (const line of lines) {
      const station = line.stops?.find((s) => s.id === stationId)
      if (station) {
        closeTrainDialog()
        openStationDialog({ station, stationId: station.id })
        return
      }
    }
  }, [lines, closeTrainDialog, openStationDialog])

  // Build derived data
  const timelineEntries = vehicle && layout ? getTrainTimelineEntries(vehicle, layout) : []
  const destinationLabel = vehicle ? getVehicleDestinationLabel(vehicle, layout) : ''
  const directionLabel = vehicle ? getDirectionBaseLabel(vehicle.directionSymbol, t) : ''
  const terminalEtaSeconds = timelineEntries.at(-1)?.etaSeconds ?? Math.max(0, vehicle?.nextOffset ?? 0)

  const isBetweenStops = vehicle
    ? vehicle.fromLabel !== vehicle.toLabel && vehicle.progress > 0 && vehicle.progress < 1
    : false

  const previousName = vehicle
    ? (isBetweenStops ? vehicle.fromLabel : vehicle.previousLabel)
    : ''
  const currentName = vehicle
    ? (isBetweenStops ? `${vehicle.fromLabel} -> ${vehicle.toLabel}` : vehicle.currentStopLabel)
    : ''
  const nextName = vehicle
    ? (isBetweenStops ? vehicle.toLabel : vehicle.upcomingLabel)
    : ''
  const segmentProgress = vehicle ? (isBetweenStops ? vehicle.progress : 0.5) : 0.5
  const currentLabel = isBetweenStops ? t('betweenLabel') : t('now')

  const statusTone = vehicle ? getStatusTone(vehicle.serviceStatus) : 'muted'

  const dialogContent = (
    <dialog
      ref={dialogRef}
      className="train-detail-dialog dialog"
      onClose={closeTrainDialog}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div className="dialog-header-meta">
            <p className="dialog-title" id="train-dialog-title">
              {vehicle ? `${vehicle.lineName} ${vehicle.vehicleLabel ?? ''} ${vehicle.label}`.trim() : ''}
            </p>
            <p className="dialog-subtitle">
              {vehicle ? t('directionTo', directionLabel, destinationLabel) : ''}
            </p>
          </div>
          <button
            className="dialog-close"
            onClick={handleClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </header>

        <div className="dialog-body">
          {vehicle && (
            <>
              <div
                className={`train-detail-status train-list-status-${statusTone}`}
              >
                {vehicle.statusPills?.map((pill, i) => (
                  <span key={i} className={`status-chip status-chip-${pill.tone ?? 'muted'}`}>
                    {pill.label}
                  </span>
                ))}
              </div>

              {/* Spine */}
              <div
                className="train-detail-line"
                style={{ '--line-color': vehicle.lineColor }}
              >
                <div
                  className="train-detail-spine"
                  style={{ '--line-color': vehicle.lineColor }}
                />
                <div
                  className="train-detail-marker-floating"
                  style={{
                    '--line-color': vehicle.lineColor,
                    '--segment-progress': segmentProgress,
                    '--direction-offset': vehicle.directionSymbol === '▼' ? '10px' : '-10px',
                  }}
                >
                  <span className="train-detail-vehicle-marker">
                    <svg viewBox="-10 -10 20 20" className="train-detail-arrow" aria-hidden="true">
                      <path
                        d="M 0 -8 L 7 6 L -7 6 Z"
                        transform={vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}
                      />
                    </svg>
                  </span>
                </div>

                {/* Previous stop */}
                <div
                  className="train-detail-stop train-detail-stop-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleStationClick(vehicle.previousStopId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStationClick(vehicle.previousStopId) }
                  }}
                >
                  <span className="train-detail-marker" />
                  <div>
                    <p className="train-detail-label">{t('previous')}</p>
                    <p className="train-detail-name">{previousName}</p>
                  </div>
                </div>

                {/* Current stop */}
                <div
                  className="train-detail-stop is-current train-detail-stop-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleStationClick(vehicle.currentStopId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStationClick(vehicle.currentStopId) }
                  }}
                >
                  <span className="train-detail-marker train-detail-marker-ghost" />
                  <div>
                    <p className="train-detail-label">{currentLabel}</p>
                    <p className="train-detail-name">{currentName}</p>
                  </div>
                </div>

                {/* Next stop */}
                <div
                  className="train-detail-stop train-detail-stop-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleStationClick(vehicle.upcomingStopId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStationClick(vehicle.upcomingStopId) }
                  }}
                >
                  <span className="train-detail-marker" />
                  <div>
                    <p className="train-detail-label">{t('next')}</p>
                    <p className="train-detail-name">{nextName}</p>
                  </div>
                </div>
              </div>

              {/* ETA panel */}
              <section className="train-eta-panel">
                <div className="train-eta-summary">
                  <div className="metric-chip">
                    <p className="metric-chip-label">{t('direction')}</p>
                    <p className="metric-chip-value">{directionLabel}</p>
                  </div>
                  <div className="metric-chip">
                    <p className="metric-chip-label">{t('terminal')}</p>
                    <p className="metric-chip-value">{destinationLabel}</p>
                  </div>
                  <div className="metric-chip">
                    <p className="metric-chip-label">{t('etaToTerminal')}</p>
                    <p className="metric-chip-value">{formatArrivalTimeValue(terminalEtaSeconds, t)}</p>
                  </div>
                </div>

                <div className="train-eta-timeline">
                  <div className="train-eta-header">
                    <p className="train-detail-label">{t('upcomingStops')}</p>
                    <p className="train-eta-header-copy">{t('liveEtaNow')}</p>
                  </div>

                  {timelineEntries.length > 0
                    ? timelineEntries.map((entry) => (
                        <EtaEntry
                          key={entry.stationId}
                          entry={entry}
                          baseRenderedAt={renderedAtRef.current}
                          onStationClick={handleStationClick}
                          t={t}
                          language={language}
                        />
                      ))
                    : (
                        <p className="train-readout muted">{t('noDownstreamEta')}</p>
                      )
                  }
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </dialog>
  )

  return createPortal(dialogContent, document.body)
}
