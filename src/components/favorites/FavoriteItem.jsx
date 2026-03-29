import FavoriteArrivalPreview from './FavoriteArrivalPreview'

export default function FavoriteItem({ fav, snapshot, isCurrentSystem, t, onClick, onMove, onRemove }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={`favorite-item${fav.exists ? '' : ' favorite-item-missing'}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <span
        className="arrival-line-token"
        style={{ '--line-color': fav.lineColor }}
      >
        {fav.lineName?.[0] ?? '?'}
      </span>
      <div className="favorite-item-content">
        <div className="favorite-item-header">
          <div>
            <p className="favorite-item-title">{fav.stationName}</p>
            <p className="favorite-item-meta">
              {fav.lineName}{isCurrentSystem ? '' : ` · ${fav.systemName}`}
            </p>
          </div>
        </div>
        <FavoriteArrivalPreview fav={fav} snapshot={snapshot} t={t} />
        <div className="favorite-item-actions">
          <button
            type="button"
            className="favorite-action-btn"
            aria-label={t('moveUp')}
            onClick={(e) => { e.stopPropagation(); onMove('up') }}
          >
            ▲ {t('moveUp')}
          </button>
          <button
            type="button"
            className="favorite-action-btn"
            aria-label={t('moveDown')}
            onClick={(e) => { e.stopPropagation(); onMove('down') }}
          >
            ▼ {t('moveDown')}
          </button>
          <button
            type="button"
            className="favorite-action-btn favorite-action-remove"
            aria-label={t('removeFavorite')}
            onClick={(e) => { e.stopPropagation(); onRemove() }}
          >
            × {t('removeFavorite')}
          </button>
        </div>
      </div>
    </div>
  )
}
