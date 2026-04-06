export const DATA_URL = './pulse-data.json'
export const SYSTEM_DATA_URL = (systemId) => `./pulse-data-${systemId}.json`
export const OBA_BASE_URL = 'https://api.pugetsound.onebusaway.org/api/where'
export const OBA_KEY = (import.meta.env.VITE_OBA_KEY || 'TEST').trim() || 'TEST'
export const IS_PUBLIC_TEST_KEY = OBA_KEY === 'TEST'
export const OBA_MAX_RETRIES = 3
export const COMPACT_LAYOUT_BREAKPOINT = 1100
export const SHARE_BASE_URL = (import.meta.env.VITE_SHARE_BASE_URL || 'https://kevinngw.github.io/link/').trim()
const NORMALIZED_SHARE_BASE_URL = SHARE_BASE_URL.endsWith('/') ? SHARE_BASE_URL : `${SHARE_BASE_URL}/`
export const APP_DISPLAY_NAME = 'Link Pulse'
export const APP_BUNDLE_ID = 'com.linkpulse.app'
export const APP_MARKETING_VERSION = '1.0'
export const PRIVACY_POLICY_URL = new URL('privacy.html', NORMALIZED_SHARE_BASE_URL).toString()
export const SUPPORT_URL = new URL('support.html', NORMALIZED_SHARE_BASE_URL).toString()
export const SOURCE_URL = 'https://github.com/kevinngw/link'

const _TEST_PROFILE = {
  ARRIVALS_CACHE_TTL_MS: 120_000,
  OBA_CACHE_TTL_MS: 120_000,
  OBA_ARRIVALS_CONCURRENCY: 1,
  OBA_RETRY_BASE_MS: 2_000,
  OBA_RATE_LIMIT_DELAY_MS: 10_000,
  VEHICLE_REFRESH_INTERVAL_MS: 45_000,
  DIALOG_REFRESH_INTERVAL_MS: 90_000,
}

const _PROD_PROFILE = {
  ARRIVALS_CACHE_TTL_MS: 60_000,
  OBA_CACHE_TTL_MS: 60_000,
  OBA_ARRIVALS_CONCURRENCY: 3,
  OBA_RETRY_BASE_MS: 1_000,
  OBA_RATE_LIMIT_DELAY_MS: 5_000,
  VEHICLE_REFRESH_INTERVAL_MS: 15_000,
  DIALOG_REFRESH_INTERVAL_MS: 30_000,
}

const _PROFILE = IS_PUBLIC_TEST_KEY ? _TEST_PROFILE : _PROD_PROFILE

export const { ARRIVALS_CACHE_TTL_MS, OBA_CACHE_TTL_MS, OBA_ARRIVALS_CONCURRENCY, OBA_RETRY_BASE_MS, OBA_RATE_LIMIT_DELAY_MS, VEHICLE_REFRESH_INTERVAL_MS, DIALOG_REFRESH_INTERVAL_MS } = _PROFILE
export const DIALOG_DISPLAY_SCROLL_INTERVAL_MS = 4_000
export const DIALOG_DISPLAY_DIRECTION_ANIMATION_MS = 520
export const GHOST_HISTORY_LIMIT = 6
export const GHOST_MAX_AGE_MS = 4 * 60_000
export const THEME_STORAGE_KEY = 'link-pulse-theme'
export const LANGUAGE_STORAGE_KEY = 'link-pulse-language'

export const RIDE_MODE_HEADSUP_STOPS = 3
export const RIDE_MODE_HEADSUP_STOPS_SHORT_TRIP = 2
export const RIDE_MODE_SHORT_TRIP_THRESHOLD = 5
export const RIDE_MODE_MAX_MISSED_TICKS = 3

export const DEFAULT_SYSTEM_ID = 'link'

export const SYSTEM_META = {
  link: {
    id: 'link',
    agencyId: '40',
    label: 'Link',
    kicker: 'SEATTLE LIGHT RAIL',
    title: 'LINK PULSE',
    vehicleLabel: 'Train',
    vehicleLabelPlural: 'Trains',
  },
  rapidride: {
    id: 'rapidride',
    agencyId: '1',
    label: 'RapidRide',
    kicker: 'KING COUNTY METRO',
    title: 'RAPIDRIDE PULSE',
    vehicleLabel: 'Bus',
    vehicleLabelPlural: 'Buses',
  },
  swift: {
    id: 'swift',
    agencyId: '29',
    label: 'Swift',
    kicker: 'COMMUNITY TRANSIT',
    title: 'SWIFT PULSE',
    vehicleLabel: 'Bus',
    vehicleLabelPlural: 'Buses',
  },
}

export { UI_COPY } from './copy'
