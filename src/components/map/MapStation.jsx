export function MapStation({ station, layout, lineColor, hasAlert, onStationClick }) {
  return (
    <g
      transform={`translate(0, ${station.y})`}
      className={`station-group${hasAlert ? ' has-alert' : ''}`}
      data-stop-id={station.id}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onClick={() => onStationClick(station)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onStationClick(station)
        }
      }}
    >
      <circle
        cx={layout.trackX}
        cy="0"
        r={station.isTerminal ? 11 : 5}
        className={station.isTerminal ? 'terminal-stop' : 'station-stop'}
        style={{ '--line-color': lineColor }}
      />
      {station.isTerminal && (
        <text x={layout.trackX} y="4" textAnchor="middle" className="terminal-mark">
          {layout.lineToken}
        </text>
      )}
      {hasAlert && (
        <circle
          cx={layout.trackX + (station.isTerminal ? 15 : 10)}
          cy="-8"
          r="4"
          className="station-alert-dot"
        />
      )}
      <rect x="0" y="-30" width="420" height="60" fill="transparent" className="station-hitbox" />
    </g>
  )
}
