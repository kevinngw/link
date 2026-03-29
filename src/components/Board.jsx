import { forwardRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import MapBoard from './MapBoard'
import TrainsBoard from './TrainsBoard'
import FavoritesBoard from './FavoritesBoard'
import InsightsBoard from './InsightsBoard'

const Board = forwardRef(function Board(props, ref) {
  const activeTab = useAppStore((s) => s.activeTab)
  const fetchedAt = useAppStore((s) => s.fetchedAt)
  const error = useAppStore((s) => s.error)
  const lines = useAppStore((s) => s.lines)

  const isLoading = !fetchedAt && !error && !lines.length

  if (isLoading) {
    return (
      <section className="board" ref={ref}>
        <div className="skeleton-board">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line skeleton-line-wide"></div>
              <div className="skeleton-line skeleton-line-narrow"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="board" ref={ref}>
      {activeTab === 'map' && <MapBoard />}
      {activeTab === 'trains' && <TrainsBoard />}
      {activeTab === 'favorites' && <FavoritesBoard />}
      {activeTab === 'insights' && <InsightsBoard />}
    </section>
  )
})

export default Board
