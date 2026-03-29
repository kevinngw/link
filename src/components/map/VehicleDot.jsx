const VEHICLE_Y_STAGGER = 1.5

export function VehicleDot({ vehicle, index, lineColor, ghostTrail, onVehicleClick }) {
  return (
    <g
      transform={`translate(0, 0)`}
      className="train"
      data-train-id={vehicle.id}
      onClick={(e) => { e.stopPropagation(); onVehicleClick?.(vehicle) }}
    >
      {ghostTrail.map((ghost, ghostIndex) => (
        <circle
          key={ghostIndex}
          cy={ghost.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER}
          r={Math.max(3, 7 - ghostIndex)}
          className="train-ghost-dot"
          style={{
            '--line-color': lineColor,
            '--ghost-opacity': Math.max(0.18, 0.56 - ghostIndex * 0.1),
          }}
        />
      ))}
      <g transform={`translate(0, ${vehicle.y + ((index % 3) - 1) * VEHICLE_Y_STAGGER})`}>
        <circle
          r="13"
          className="train-wave"
          style={{ '--line-color': lineColor, animationDelay: `${index * 0.18}s` }}
        />
        <path
          d="M 0 -8 L 7 6 L -7 6 Z"
          transform={vehicle.directionSymbol === '▼' ? 'rotate(180)' : ''}
          className="train-arrow"
          style={{ '--line-color': lineColor }}
        />
      </g>
    </g>
  )
}
