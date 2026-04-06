import { describe, it, expect, vi } from 'vitest'
import { resolveVehicleForArrival } from './arrival-vehicle'

describe('resolveVehicleForArrival', () => {
  it('returns an exact raw vehicle id match when present', () => {
    const vehicle = { id: '1_100', label: '100', lineId: 'line-1' }
    const getAllVehiclesById = vi.fn(() => new Map([[vehicle.id, vehicle]]))
    const getAllVehicles = vi.fn(() => [vehicle])

    const resolved = resolveVehicleForArrival(
      { rawVehicleId: '1_100', vehicleId: '100', lineId: 'line-1' },
      { getAllVehiclesById, getAllVehicles },
    )

    expect(resolved).toBe(vehicle)
  })

  it('falls back to same-line label matching when raw id does not resolve', () => {
    const targetVehicle = { id: '40_100', label: '100', lineId: 'line-1' }
    const otherLineVehicle = { id: '50_100', label: '100', lineId: 'line-2' }
    const getAllVehiclesById = vi.fn(() => new Map())
    const getAllVehicles = vi.fn(() => [targetVehicle, otherLineVehicle])

    const resolved = resolveVehicleForArrival(
      { rawVehicleId: '1_100', vehicleId: '100', lineId: 'line-1' },
      { getAllVehiclesById, getAllVehicles },
    )

    expect(resolved).toBe(targetVehicle)
  })

  it('returns null when no candidate vehicle matches', () => {
    const getAllVehiclesById = vi.fn(() => new Map())
    const getAllVehicles = vi.fn(() => [])

    const resolved = resolveVehicleForArrival(
      { rawVehicleId: '1_404', vehicleId: '404', lineId: 'line-1' },
      { getAllVehiclesById, getAllVehicles },
    )

    expect(resolved).toBeNull()
  })
})
