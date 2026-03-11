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

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function getBearingDegrees(origin, target) {
  const lat1 = (origin.lat * Math.PI) / 180
  const lat2 = (target.lat * Math.PI) / 180
  const deltaLon = ((target.lon - origin.lon) * Math.PI) / 180
  const y = Math.sin(deltaLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
