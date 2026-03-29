import { useState, useEffect } from 'react'
import { formatArrivalTime as formatArrivalTimeValue } from '../../formatters'

function ArrivalChip({ arrival, t, language }) {
  const [countdown, setCountdown] = useState(() =>
    formatArrivalTimeValue(Math.floor((arrival.arrivalTime - Date.now()) / 1000), t)
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(formatArrivalTimeValue(Math.floor((arrival.arrivalTime - Date.now()) / 1000), t))
    }, 1000)
    return () => window.clearInterval(id)
  }, [arrival.arrivalTime, t])

  return (
    <span className={`favorite-arrival-chip${arrival.isRealtime ? ' is-live' : ''}`}>
      <span>{countdown}</span>
      {arrival.isRealtime && (
        <span className="favorite-arrival-chip-badge">{t('realtimeBadge')}</span>
      )}
    </span>
  )
}

function ArrivalLane({ directionLabel, arrivals, systemId, t, language }) {
  if (!arrivals || !arrivals.length) {
    return (
      <div className="favorite-arrival-lane">
        <span className="favorite-arrival-direction">{directionLabel}</span>
        <span className="favorite-arrival-empty">{t('favoritesNoUpcoming', '')}</span>
      </div>
    )
  }

  return (
    <div className="favorite-arrival-lane">
      <span className="favorite-arrival-direction">{directionLabel}</span>
      <div className="favorite-arrival-chips">
        {arrivals.slice(0, 2).map((arrival, i) => (
          <ArrivalChip key={i} arrival={arrival} t={t} language={language} />
        ))}
      </div>
    </div>
  )
}

export default function FavoriteArrivalPreview({ fav, snapshot, t, language }) {
  if (!fav.exists) {
    return <p className="favorite-arrival-status">{t('favoritesStationMissing')}</p>
  }

  if (!snapshot || snapshot.loading) {
    return <p className="favorite-arrival-status">{t('favoritesArrivalsLoading')}</p>
  }

  if (snapshot.error) {
    return <p className="favorite-arrival-status">{t('favoritesArrivalsUnavailable')}</p>
  }

  const nbArrivals = snapshot.arrivals?.nb ?? []
  const sbArrivals = snapshot.arrivals?.sb ?? []
  const updatedLabel = snapshot.fetchedAt
    ? (() => {
        const delta = Math.max(0, Math.round((Date.now() - snapshot.fetchedAt) / 1000))
        if (delta < 10) return t('updatedNow')
        if (delta < 60) return t('updatedSecondsAgo', delta)
        return t('updatedMinutesAgo', Math.round(delta / 60))
      })()
    : t('updatedNow')

  return (
    <div className="favorite-arrivals-preview">
      <div className="favorite-arrivals-grid">
        <ArrivalLane
          directionLabel={t('northboundShort')}
          arrivals={nbArrivals}
          systemId={fav.systemId}
          t={t}
          language={language}
        />
        <ArrivalLane
          directionLabel={t('southboundShort')}
          arrivals={sbArrivals}
          systemId={fav.systemId}
          t={t}
          language={language}
        />
      </div>
      <p className="favorite-arrival-status favorite-arrival-updated">{updatedLabel}</p>
    </div>
  )
}
