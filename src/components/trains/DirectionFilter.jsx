export function DirectionFilter({ lineId, current, onChange, t }) {
  const options = [
    { value: 'all', label: t('directionAll') },
    { value: '▲', label: '▲' },
    { value: '▼', label: '▼' },
  ]

  return (
    <div className="direction-filter" role="group" aria-label={t('filterByDirection')}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`direction-filter-btn${current === opt.value ? ' direction-filter-active' : ''}`}
          data-direction-filter={opt.value}
          data-direction-line={lineId}
          aria-pressed={current === opt.value}
          onClick={() => onChange(lineId, opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
