import { ArrivalItem } from './ArrivalItem'

export function ArrivalList({ arrivals, t, language, allVehicles, onVehicleClick, loading, displayMode }) {
  if (loading) {
    return (
      <div className="arrivals-loading">{t('loadingArrivals')}</div>
    )
  }

  if (!arrivals || arrivals.length === 0) {
    return (
      <div className="arrivals-empty">{t('noUpcomingVehicles', '')}</div>
    )
  }

  return (
    <>
      {arrivals.map((arrival, i) => (
        <ArrivalItem
          key={`${arrival.vehicleId}-${arrival.arrivalTime}-${i}`}
          arrival={arrival}
          t={t}
          language={language}
          allVehicles={allVehicles}
          onVehicleClick={onVehicleClick}
        />
      ))}
    </>
  )
}
