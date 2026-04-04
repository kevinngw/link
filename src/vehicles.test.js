import { describe, expect, it } from 'vitest'
import { parseVehicle } from './vehicles.js'

function makeLayout() {
  return {
    stationIndexByStopId: new Map([
      ['stop-a', 0],
      ['stop-b', 1],
    ]),
    stations: [
      { id: 'stop-a', label: 'Stop A', y: 0, segmentMinutes: 3, cumulativeMinutes: 0 },
      { id: 'stop-b', label: 'Stop B', y: 30, segmentMinutes: 0, cumulativeMinutes: 3 },
    ],
  }
}

describe('parseVehicle', () => {
  const line = { routeKey: '40_100479' }
  const tripsById = new Map([
    ['trip-1', { id: 'trip-1', routeId: '40_100479', directionId: '1' }],
  ])
  const copyValue = (key) => key

  it('returns null for scheduled-only vehicles', () => {
    const vehicle = parseVehicle({
      vehicleId: '1_123',
      tripStatus: {
        activeTripId: 'trip-1',
        closestStop: 'stop-a',
        nextStop: 'stop-b',
        closestStopTimeOffset: -30,
        nextStopTimeOffset: 120,
        predicted: false,
        scheduleDeviation: 0,
      },
    }, line, makeLayout(), tripsById, { language: 'en', copyValue })

    expect(vehicle).toBeNull()
  })

  it('keeps realtime vehicles', () => {
    const vehicle = parseVehicle({
      vehicleId: '1_123',
      tripStatus: {
        activeTripId: 'trip-1',
        closestStop: 'stop-a',
        nextStop: 'stop-b',
        closestStopTimeOffset: -30,
        nextStopTimeOffset: 120,
        predicted: true,
        scheduleDeviation: 0,
      },
    }, line, makeLayout(), tripsById, { language: 'en', copyValue })

    expect(vehicle).not.toBeNull()
    expect(vehicle?.isPredicted).toBe(true)
  })
})
