import { ArrivalItem } from './ArrivalItem'

export function ArrivalDirectionSection({
  direction,
  arrivals,
  loading,
  t,
  language,
  allVehicles,
  onVehicleClick,
  displayMode,
  directionTitle,
}) {
  const vehicleLabelPlural = t('noUpcomingVehicles', '') ? '' : ''

  function renderBucket() {
    if (loading) {
      return (
        <>
          <div id={`arrivals-${direction}-pinned`} className="arrivals-pinned" />
          <div className="arrivals-viewport">
            <div id={`arrivals-${direction}`} className="arrivals-list">
              <div className="arrivals-loading">{t('loadingArrivals')}</div>
            </div>
          </div>
        </>
      )
    }

    if (!arrivals || arrivals.length === 0) {
      return (
        <>
          <div className="arrivals-pinned" />
          <div className="arrivals-viewport">
            <div className="arrivals-list">
              <div className="arrivals-empty">{t('noUpcomingVehicles', '')}</div>
            </div>
          </div>
        </>
      )
    }

    if (displayMode) {
      const pinned = arrivals.slice(0, 1)
      const scrolling = arrivals.slice(1)
      return (
        <>
          <div className="arrivals-pinned">
            {pinned.map((arrival, i) => (
              <ArrivalItem key={i} arrival={arrival} t={t} language={language} allVehicles={allVehicles} onVehicleClick={onVehicleClick} />
            ))}
          </div>
          <div className="arrivals-viewport">
            <div className="arrivals-list">
              {scrolling.length > 0
                ? scrolling.map((arrival, i) => (
                    <ArrivalItem key={i} arrival={arrival} t={t} language={language} allVehicles={allVehicles} onVehicleClick={onVehicleClick} />
                  ))
                : <div className="arrivals-empty">{t('noAdditionalVehicles', '')}</div>
              }
            </div>
          </div>
        </>
      )
    }

    if (arrivals.length >= 2) {
      const nextUp = arrivals.slice(0, 1)
      const following = arrivals.slice(1)
      return (
        <>
          <div className="arrivals-pinned">
            <p className="arrivals-pinned-kicker">{t('nextUpKicker')}</p>
            {nextUp.map((arrival, i) => (
              <ArrivalItem key={i} arrival={arrival} t={t} language={language} allVehicles={allVehicles} onVehicleClick={onVehicleClick} />
            ))}
          </div>
          <div className="arrivals-viewport">
            <div className="arrivals-list">
              <p className="arrivals-following-heading">{t('followingVehiclesHeading')}</p>
              {following.map((arrival, i) => (
                <ArrivalItem key={i} arrival={arrival} t={t} language={language} allVehicles={allVehicles} onVehicleClick={onVehicleClick} />
              ))}
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <div className="arrivals-pinned">
          <p className="arrivals-pinned-kicker">{t('nextUpKicker')}</p>
          {arrivals.map((arrival, i) => (
            <ArrivalItem key={i} arrival={arrival} t={t} language={language} allVehicles={allVehicles} onVehicleClick={onVehicleClick} />
          ))}
        </div>
        <div className="arrivals-viewport"><div className="arrivals-list" /></div>
      </>
    )
  }

  return (
    <div className="arrivals-section" data-direction-section={direction}>
      <h4 className="arrivals-title">
        <span className="arrivals-title-track">
          <span className="arrivals-title-text">{directionTitle}</span>
          <span className="arrivals-title-text arrivals-title-clone" aria-hidden="true">{directionTitle}</span>
        </span>
      </h4>
      {renderBucket()}
    </div>
  )
}
