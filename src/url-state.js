import { DEFAULT_SYSTEM_ID } from './config'
import { slugifyStation } from './utils'

export function updateUrlParams(mutator) {
  const url = new URL(window.location.href)
  const before = url.search
  mutator(url.searchParams, url)
  if (url.search === before) return
  window.history.pushState({}, '', url)
}

export function setPageParam(page) {
  const nextPage = ['map', 'trains', 'insights'].includes(page) ? page : 'map'
  updateUrlParams((params) => {
    if (nextPage === 'map') params.delete('page')
    else params.set('page', nextPage)
  })
}

export function getPageFromUrl() {
  const url = new URL(window.location.href)
  const requestedPage = (url.searchParams.get('page') ?? '').trim().toLowerCase()
  return ['map', 'trains', 'insights'].includes(requestedPage) ? requestedPage : 'map'
}

export function setSystemParam(systemId) {
  updateUrlParams((params) => {
    if (systemId === DEFAULT_SYSTEM_ID) {
      params.delete('system')
    } else {
      params.set('system', systemId)
    }
  })
}

export function setStationParam(station) {
  updateUrlParams((params) => {
    params.set('dialog', 'station')
    params.set('station', slugifyStation(station.name))
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
  })
}

export function setTrainDialogParams(trainId) {
  updateUrlParams((params) => {
    params.set('dialog', 'train')
    params.set('train', trainId)
    params.delete('station')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
  })
}

export function setAlertDialogParams(lineId) {
  updateUrlParams((params) => {
    params.set('dialog', 'alerts')
    params.set('line', lineId)
    params.delete('station')
    params.delete('train')
    params.delete('detail')
    params.delete('q')
  })
}

export function setStationSearchParams(prefill = '') {
  updateUrlParams((params) => {
    params.set('dialog', 'search')
    params.delete('station')
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    if (prefill) params.set('q', prefill)
    else params.delete('q')
  })
}

export function setInsightsDialogParams(type, lineId = '') {
  updateUrlParams((params) => {
    params.set('dialog', 'insights')
    params.set('detail', type)
    params.delete('station')
    params.delete('train')
    params.delete('q')
    if (lineId) params.set('line', lineId)
    else params.delete('line')
  })
}

export function clearDialogParams({ keepPage = true, keepSystem = true, keepStation = false } = {}) {
  updateUrlParams((params) => {
    params.delete('dialog')
    params.delete('train')
    params.delete('line')
    params.delete('detail')
    params.delete('q')
    if (!keepStation) params.delete('station')
    if (!keepPage) params.delete('page')
    if (!keepSystem) params.delete('system')
  })
}

export function clearStationParam() {
  clearDialogParams({ keepPage: true, keepSystem: true })
}

export function isOptionalNavigationEnabled() {
  const url = new URL(window.location.href)
  const value = (url.searchParams.get('navigate') ?? '').trim().toLowerCase()
  return value === '1' || value === 'true' || value === 'yes'
}
