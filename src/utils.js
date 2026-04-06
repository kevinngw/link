export function pluralizeVehicleLabel(label) {
  if (/bus$/i.test(label)) {
    return `${label}es`
  }

  return `${label}s`
}

const NAME_REPLACEMENTS = [
  ['Station', ''],
  ['Univ of Washington', 'UW'],
  ["Int'l", 'Intl'],
]

export function normalizeName(name) {
  let result = name
  for (const [from, to] of NAME_REPLACEMENTS) result = result.replace(from, to)
  return result.trim()
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

const HTML_ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch])
}

export function sanitizeUrl(url) {
  if (typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return escapeHtml(trimmed)
  return ''
}

export function closeDialogAnimated(dialogEl) {
  if (!dialogEl.open) return
  dialogEl.classList.add('is-closing')
  dialogEl.addEventListener('animationend', () => {
    dialogEl.classList.remove('is-closing')
    dialogEl.close()
  }, { once: true })
}

export function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function parseClockToSeconds(value) {
  const [hours = '0', minutes = '0', seconds = '0'] = String(value).split(':')
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}


const EARTH_RADIUS_METERS = 6_371_000
const METERS_TO_MILES = 0.000_621_371
const METERS_TO_FEET = 3.280_84

export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const startLat = toRadians(lat1)
  const endLat = toRadians(lat2)

  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistanceMeters(distanceMeters) {
  if (!Number.isFinite(distanceMeters)) return ''
  const miles = distanceMeters * METERS_TO_MILES
  if (miles < 0.1) {
    const feet = Math.round(distanceMeters * METERS_TO_FEET)
    return `${feet} ft`
  }
  return `${miles.toFixed(miles >= 10 ? 0 : 1)} mi`
}
