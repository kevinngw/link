/**
 * SearchDialog.jsx
 * Native <dialog> portal for station search.
 * Wraps useStationSearch hook with keyboard navigation, geolocation, recent stations.
 */

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../store/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'
import { useStationSearch } from '../../hooks/useStationSearch'
import { normalizeName, formatDistanceMeters } from '../../utils'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function highlightMatch(text, query) {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    new RegExp(`^${escaped}$`, 'i').test(part)
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  )
}

// ---------------------------------------------------------------------------
// SearchResultItem
// ---------------------------------------------------------------------------
function SearchResultItem({ result, isActive, isNearby, hasQuery, query, onClick }) {
  const displayName = normalizeName(result.stationName)
  const meta = isNearby
    ? `${formatDistanceMeters(result.distanceMeters)} · ${result.lineName} · ${result.systemName}`
    : `${result.lineName} · ${result.systemName}`

  return (
    <div
      className={`station-search-result${isActive ? ' is-active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
      }}
    >
      <span className="station-search-result-main">
        <span
          className="arrival-line-token station-search-result-token"
          style={{ '--line-color': result.lineColor }}
        >
          {result.lineName[0]}
        </span>
        <span className="station-search-result-copy">
          <span className="station-search-result-title">
            {hasQuery ? highlightMatch(displayName, query.trim().toLowerCase()) : displayName}
          </span>
          <span className="station-search-result-meta">{meta}</span>
        </span>
      </span>
      <span className="station-search-result-actions">
        {isNearby && (
          <span className="station-search-nearby-badge">Nearby</span>
        )}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SearchDialog() {
  const { t } = useTranslation()
  const activeDialogType = useAppStore((s) => s.activeDialogType)
  const { openStationDialog } = useAppStore.getState()

  const {
    query,
    results,
    nearbyStations,
    highlightedIndex,
    highlightedNearbyIndex,
    isLocating,
    geolocationStatus,
    geolocationError,
    openSearch,
    closeSearch,
    updateQuery,
    findNearby,
    handleSelection,
    setHighlightedIndex,
    setHighlightedNearbyIndex,
  } = useStationSearch()

  const dialogRef = useRef(null)
  const inputRef = useRef(null)

  const hasQuery = Boolean(query.trim())
  const isShowingNearby = !hasQuery && nearbyStations.length > 0
  const displayResults = hasQuery ? results : (isShowingNearby ? nearbyStations : [])

  // Open/close based on activeDialogType
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (activeDialogType === 'search') {
      if (!el.open) el.showModal()
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    } else {
      if (el.open) {
        el.classList.add('is-closing')
        el.addEventListener('animationend', () => {
          el.classList.remove('is-closing')
          el.close()
        }, { once: true })
      }
    }
  }, [activeDialogType])

  // '/' shortcut to open search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && activeDialogType !== 'search') {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        useAppStore.setState({ activeDialogType: 'search' })
        openSearch()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeDialogType, openSearch])

  const handleClose = useCallback(() => {
    const el = dialogRef.current
    if (!el || !el.open) return
    el.classList.add('is-closing')
    el.addEventListener('animationend', () => {
      el.classList.remove('is-closing')
      el.close()
      closeSearch()
      useAppStore.setState({ activeDialogType: '' })
    }, { once: true })
  }, [closeSearch])

  const handleSelect = useCallback(async (result) => {
    await handleSelection(result, {
      openStationDialog: (station) => openStationDialog({ station, stationId: station.id }),
      switchSystem: null,
    })
    useAppStore.setState({ activeDialogType: '' })
  }, [handleSelection, openStationDialog])

  const handleKeyDown = useCallback((e) => {
    const total = displayResults.length
    if (!total) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hasQuery) {
        setHighlightedIndex(Math.min(highlightedIndex + 1, total - 1))
      } else {
        setHighlightedNearbyIndex(Math.min(highlightedNearbyIndex + 1, total - 1))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hasQuery) {
        setHighlightedIndex(Math.max(highlightedIndex - 1, 0))
      } else {
        setHighlightedNearbyIndex(Math.max(highlightedNearbyIndex - 1, 0))
      }
    } else if (e.key === 'Enter') {
      const idx = hasQuery ? highlightedIndex : highlightedNearbyIndex
      const selected = displayResults[idx]
      if (selected) {
        e.preventDefault()
        handleSelect(selected)
      }
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }, [
    displayResults, hasQuery, highlightedIndex, highlightedNearbyIndex,
    setHighlightedIndex, setHighlightedNearbyIndex, handleSelect, handleClose,
  ])

  // Build meta label
  let metaLabel = ''
  if (displayResults.length > 0) {
    if (hasQuery) {
      metaLabel = `${t('stationSearchResults', displayResults.length)} · ${t('searchKeyboardHint')}`
    } else if (isShowingNearby) {
      metaLabel = t('nearbyStationsFound', displayResults.length)
    }
  } else {
    if (hasQuery) {
      metaLabel = t('noStationSearchResults')
    } else {
      metaLabel = geolocationError || geolocationStatus || t('nearbyStationsHint')
    }
  }

  const dialogContent = (
    <dialog
      ref={dialogRef}
      className="station-search-dialog dialog"
      onClose={() => {
        closeSearch()
        useAppStore.setState({ activeDialogType: '' })
      }}
    >
      <div className="dialog-inner">
        <div className="station-search-header">
          <div className="station-search-input-wrap">
            <input
              ref={inputRef}
              className="station-search-input"
              type="search"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              aria-label={t('searchPlaceholder')}
            />
          </div>
          <button
            className="dialog-close"
            onClick={handleClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        <div className="station-search-location-row">
          <button
            className="station-search-location-button"
            onClick={findNearby}
            disabled={isLocating}
          >
            {isLocating ? t('locationFindingButton') : t('useMyLocation')}
          </button>
          {(geolocationError || geolocationStatus) && (
            <span
              className={`station-search-location-status${geolocationError ? ' is-error' : ''}`}
            >
              {geolocationError || geolocationStatus}
            </span>
          )}
        </div>

        <p className="station-search-meta">{metaLabel}</p>

        <div className="station-search-results">
          {displayResults.length > 0
            ? displayResults.map((result, index) => {
                const isActive = hasQuery
                  ? index === highlightedIndex
                  : index === highlightedNearbyIndex
                return (
                  <SearchResultItem
                    key={result.key ?? `${result.systemId}:${result.lineId}:${result.stationId}`}
                    result={result}
                    isActive={isActive}
                    isNearby={isShowingNearby}
                    hasQuery={hasQuery}
                    query={query}
                    onClick={() => handleSelect(result)}
                  />
                )
              })
            : (
                <div className="arrival-item muted">
                  {hasQuery
                    ? t('noStationSearchResults')
                    : (geolocationError || geolocationStatus || t('nearbyStationsHint'))
                  }
                </div>
              )
          }
        </div>
      </div>
    </dialog>
  )

  return createPortal(dialogContent, document.body)
}
