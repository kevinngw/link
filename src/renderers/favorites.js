export function createFavoritesRenderer(deps) {
  const {
    state,
    copyValue,
    getVehicleLabel,
    getVehicleLabelPlural,
    formatArrivalTime,
    getStatusTone,
    getArrivalServiceStatus,
    getAllVehicles,
    getArrivalsForStation,
    formatDirectionLabel,
    getVehicleDestinationLabel
  } = deps

  function getFavoriteStations() {
    const favorites = []
    if (!state.favoriteStations.size) return favorites

    // Map to store unique stations found across all lines
    const stationMap = new Map()

    for (const line of state.lines) {
      for (const station of line.stops || []) {
        if (state.favoriteStations.has(station.id)) {
          const key = station.id
          if (!stationMap.has(key)) {
            stationMap.set(key, {
              id: station.id,
              name: station.name,
              lines: []
            })
          }
          stationMap.get(key).lines.push({ line, station })
        }
      }
    }

    return Array.from(stationMap.values())
  }

  async function renderFavorites() {
    const favorites = getFavoriteStations()
    const vehicleLabelPlural = getVehicleLabelPlural()

    if (!favorites.length) {
      return `
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${copyValue('favorites')}</h2>
            <p>${copyValue('noFavorites', vehicleLabelPlural.toLowerCase())}</p>
          </article>
        </section>
      `
    }

    // Fetch arrivals for all favorites
    // We need to fetch for each line serving the station
    const arrivalPromises = favorites.flatMap(fav => 
      fav.lines.map(({ line, station }) => 
        getArrivalsForStation(station, line).then(arrivals => ({
          stationId: fav.id,
          lineId: line.id,
          arrivals
        }))
      )
    )

    const results = await Promise.all(arrivalPromises)
    
    // Group results by station
    const arrivalsByStation = new Map()
    for (const result of results) {
      if (!arrivalsByStation.has(result.stationId)) {
        arrivalsByStation.set(result.stationId, [])
      }
      arrivalsByStation.get(result.stationId).push(result)
    }

    const cards = favorites.map(fav => {
      const stationArrivals = arrivalsByStation.get(fav.id) || []
      
      // Merge all arrivals for this station
      const allNb = []
      const allSb = []
      
      for (const item of stationArrivals) {
        allNb.push(...item.arrivals.nb)
        allSb.push(...item.arrivals.sb)
      }

      // Sort by arrival time
      allNb.sort((a, b) => a.arrivalTime - b.arrivalTime)
      allSb.sort((a, b) => a.arrivalTime - b.arrivalTime)

      // Take top 3 for each direction
      const topNb = allNb.slice(0, 3)
      const topSb = allSb.slice(0, 3)

      const renderArrivalItem = (arrival) => {
        const now = Date.now()
        const diffSec = Math.floor((arrival.arrivalTime - now) / 1000)
        const timeStr = formatArrivalTime(diffSec)
        const serviceStatus = getArrivalServiceStatus(arrival.arrivalTime, arrival.scheduleDeviation ?? 0)
        const serviceTone = getStatusTone(serviceStatus)
        
        const liveVehicle = arrival.rawVehicleId
          ? getAllVehicles().find((vehicle) => vehicle.id === arrival.rawVehicleId)
          : null
        const wrapperTag = liveVehicle ? 'button' : 'div'
        const interactiveAttrs = liveVehicle
          ? ` type="button" data-arrival-vehicle-id="${liveVehicle.id}" aria-label="${arrival.lineName} ${getVehicleLabel()} ${arrival.vehicleId}"`
          : ''

        return `
          <${wrapperTag} class="arrival-item${liveVehicle ? ' arrival-item-clickable' : ''} favorite-arrival-item" data-arrival-time="${arrival.arrivalTime}" data-schedule-deviation="${arrival.scheduleDeviation ?? 0}"${interactiveAttrs}>
             <span class="arrival-meta">
              <span class="arrival-line-token" style="--line-color:${arrival.lineColor};">${arrival.lineToken}</span>
              <span class="arrival-copy">
                <span class="arrival-vehicle">${arrival.lineName} to ${arrival.destination}</span>
              </span>
            </span>
            <span class="arrival-side">
              <span class="arrival-status arrival-status-${serviceTone}">${serviceStatus}</span>
              <span class="arrival-time">${timeStr}</span>
            </span>
          </${wrapperTag}>
        `
      }

      const renderDirectionGroup = (directionSymbol, items) => {
        if (!items.length) return ''
        const title = formatDirectionLabel(directionSymbol, '', { includeSymbol: true })
        return `
          <div class="favorite-direction-group">
            <h4 class="favorite-direction-title">${title}</h4>
            <div class="favorite-arrival-list">
              ${items.map(renderArrivalItem).join('')}
            </div>
          </div>
        `
      }

      // If no arrivals at all
      if (!topNb.length && !topSb.length) {
         return `
          <article class="panel-card favorite-card">
            <header class="favorite-card-header">
               <h2>${fav.name}</h2>
            </header>
            <div class="favorite-empty-state">
              ${copyValue('noUpcomingVehicles', vehicleLabelPlural.toLowerCase())}
            </div>
          </article>
        `
      }

      return `
        <article class="panel-card favorite-card">
          <header class="favorite-card-header">
             <h2>${fav.name}</h2>
          </header>
          <div class="favorite-card-body">
            ${renderDirectionGroup('▲', topNb)}
            ${renderDirectionGroup('▼', topSb)}
          </div>
        </article>
      `
    }).join('')

    return `
      <section class="favorites-grid">
        ${cards}
      </section>
    `
  }

  return { renderFavorites }
}
