import { describe, expect, it } from 'vitest'
import { buildWalkingDirectionsUrl, hasStationCoordinates } from './station-directions'

describe('station directions helpers', () => {
  it('detects finite station coordinates', () => {
    expect(hasStationCoordinates({ lat: '47.6115', lon: '-122.3357' })).toBe(true)
    expect(hasStationCoordinates({ lat: 47.6115, lon: -122.3357 })).toBe(true)
    expect(hasStationCoordinates({ lat: '', lon: -122.3357 })).toBe(false)
    expect(hasStationCoordinates({ lat: 47.6115 })).toBe(false)
  })

  it('builds a Google Maps walking directions URL', () => {
    const url = buildWalkingDirectionsUrl({
      name: 'Westlake Station',
      lat: 47.6115,
      lon: -122.3357,
    })

    expect(url).toContain('https://www.google.com/maps/dir/?')
    expect(url).toContain('api=1')
    expect(url).toContain('travelmode=walking')
    expect(url).toContain('destination=47.6115%2C-122.3357')
  })

  it('returns an empty URL when coordinates are unavailable', () => {
    expect(buildWalkingDirectionsUrl({ name: 'Mystery Station' })).toBe('')
  })
})
