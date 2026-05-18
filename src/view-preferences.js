import { DEFAULT_SYSTEM_ID } from './config'

const LAST_VIEW_STORAGE_KEY = 'link-pulse-last-view'
const PAGE_IDS = ['map', 'trains', 'favorites', 'insights']

function getBrowserLocation() {
  return typeof window !== 'undefined' ? window.location : undefined
}

function getBrowserStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

function normalizePage(page) {
  const value = (page ?? '').trim().toLowerCase()
  return PAGE_IDS.includes(value) ? value : 'map'
}

function parseLastView(storage = getBrowserStorage()) {
  try {
    const raw = storage?.getItem(LAST_VIEW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function getUrl(location = getBrowserLocation()) {
  try {
    return new URL(location?.href ?? 'http://localhost/')
  } catch {
    return new URL('http://localhost/')
  }
}

export function getPreferredPage({ location = getBrowserLocation(), storage = getBrowserStorage() } = {}) {
  const url = getUrl(location)
  if (url.searchParams.has('page')) return normalizePage(url.searchParams.get('page'))
  return normalizePage(parseLastView(storage)?.page)
}

export function getPreferredSystemId({ systemsById, location = getBrowserLocation(), storage = getBrowserStorage() } = {}) {
  const url = getUrl(location)
  const requested = url.searchParams.get('system')
  if (requested && systemsById?.has(requested)) return requested

  const stored = parseLastView(storage)?.systemId
  if (stored && systemsById?.has(stored)) return stored

  return DEFAULT_SYSTEM_ID
}

export function getPreferredLineId({ activeSystemId, lines = [], location = getBrowserLocation(), storage = getBrowserStorage() } = {}) {
  const url = getUrl(location)
  if (url.searchParams.has('route')) return ''

  const lastView = parseLastView(storage)
  if (!lastView || lastView.systemId !== activeSystemId) return ''

  const storedLineId = lastView.lineId
  return storedLineId && lines.some((line) => line.id === storedLineId) ? storedLineId : ''
}

export function saveLastView({ systemId, page = 'map', lineId = '' }, storage = getBrowserStorage()) {
  try {
    storage?.setItem(LAST_VIEW_STORAGE_KEY, JSON.stringify({
      systemId: systemId || DEFAULT_SYSTEM_ID,
      page: normalizePage(page),
      lineId: lineId || '',
      updatedAt: Date.now(),
    }))
  } catch {
    // Ignore storage failures; URL state still reflects the current view.
  }
}

export { LAST_VIEW_STORAGE_KEY }
