export function hasStationCoordinates(station) {
  if (station?.lat === '' || station?.lon === '' || station?.lat == null || station?.lon == null) return false
  const lat = Number(station.lat)
  const lon = Number(station.lon)
  return Number.isFinite(lat) && Number.isFinite(lon)
}

export function buildWalkingDirectionsUrl(station) {
  if (!hasStationCoordinates(station)) return ''

  const lat = Number(station.lat)
  const lon = Number(station.lon)
  const destination = `${lat},${lon}`
  const params = new URLSearchParams({
    api: '1',
    destination,
    travelmode: 'walking',
  })

  return `https://www.google.com/maps/dir/?${params.toString()}`
}
