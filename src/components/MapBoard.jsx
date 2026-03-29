import { useAppStore } from '../store/useAppStore'
import LineSwitcher from './LineSwitcher'
import { MapLine } from './map/MapLine'

export default function MapBoard() {
  const compactLayout = useAppStore((s) => s.compactLayout)
  const lines = useAppStore((s) => s.lines)
  const activeLineId = useAppStore((s) => s.activeLineId)

  const visibleLines = compactLayout
    ? lines.filter((line) => line.id === activeLineId)
    : lines

  return (
    <>
      <LineSwitcher />
      {visibleLines.map((line) => (
        <MapLine key={line.id} line={line} />
      ))}
    </>
  )
}
