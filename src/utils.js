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
