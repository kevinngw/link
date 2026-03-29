import { useAppStore } from '../store/useAppStore'

function getLineSwitcherLabel(line) {
  const name = line.name?.trim() ?? ''
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return name
  const compactPrefixes = ['rapidride', 'swift']
  if (compactPrefixes.includes(parts[0].toLowerCase())) {
    return parts.slice(1).join(' ')
  }
  return name
}

export default function LineSwitcher() {
  const compactLayout = useAppStore((s) => s.compactLayout)
  const lines = useAppStore((s) => s.lines)
  const activeLineId = useAppStore((s) => s.activeLineId)
  const setLine = useAppStore((s) => s.setLine)

  if (!compactLayout || lines.length < 2) return null

  return (
    <section className="line-switcher" aria-label="Lines">
      {lines.map((line) => {
        const compactLabel = getLineSwitcherLabel(line)
        return (
          <button
            key={line.id}
            className={`line-switcher-button${line.id === activeLineId ? ' is-active' : ''}`}
            data-line-switch={line.id}
            type="button"
            aria-pressed={line.id === activeLineId ? 'true' : 'false'}
            aria-label={line.name}
            style={{ '--line-color': line.color }}
            onClick={() => setLine(line.id)}
          >
            <span className="line-token line-switcher-token" style={{ '--line-color': line.color }}>
              {line.name[0]}
            </span>
            <span className="line-switcher-label-group">
              <span className="line-switcher-label-compact">{compactLabel}</span>
              <span className="line-switcher-label-full">{line.name}</span>
            </span>
          </button>
        )
      })}
    </section>
  )
}
