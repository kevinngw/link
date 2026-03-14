export function pluralizeVehicleLabel(label) {
  if (/bus$/i.test(label)) {
    return `${label}es`
  }

  return `${label}s`
}

export function normalizeName(name) {
  return name
    .replace('Station', '')
    .replace('Univ of Washington', 'UW')
    .replace("Int'l", 'Intl')
    .trim()
}

export function slugifyStation(value) {
  return value
    .toLowerCase()
    .replace(/['.]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

export function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function parseClockToSeconds(value) {
  const [hours = '0', minutes = '0', seconds = '0'] = String(value).split(':')
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}


export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180
  const earthRadiusMeters = 6371000
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const startLat = toRadians(lat1)
  const endLat = toRadians(lat2)

  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistanceMeters(distanceMeters) {
  if (!Number.isFinite(distanceMeters)) return ''
  const miles = distanceMeters * 0.000621371
  if (miles < 0.1) {
    const feet = Math.round(distanceMeters * 3.28084)
    return `${feet} ft`
  }
  return `${miles.toFixed(miles >= 10 ? 0 : 1)} mi`
}
