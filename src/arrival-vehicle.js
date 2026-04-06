function normalizeVehicleLabel(vehicleId = '') {
  return String(vehicleId).replace(/^\d+_/, '')
}

export function resolveVehicleForArrival(arrival, { getAllVehiclesById, getAllVehicles }) {
  const byId = getAllVehiclesById()
  const allVehicles = getAllVehicles()
  const rawVehicleId = arrival.rawVehicleId || ''
  const vehicleLabel = normalizeVehicleLabel(arrival.vehicleId || rawVehicleId)
  const lineId = arrival.lineId || ''

  if (rawVehicleId && byId.has(rawVehicleId)) {
    return byId.get(rawVehicleId) ?? null
  }

  if (vehicleLabel && byId.has(vehicleLabel)) {
    return byId.get(vehicleLabel) ?? null
  }

  const candidateVehicles = lineId
    ? allVehicles.filter((vehicle) => vehicle.lineId === lineId)
    : allVehicles

  if (rawVehicleId) {
    const rawIdMatch = candidateVehicles.find((vehicle) => vehicle.id === rawVehicleId)
    if (rawIdMatch) return rawIdMatch
  }

  if (!vehicleLabel) return null

  const labelMatch = candidateVehicles.find((vehicle) => vehicle.label === vehicleLabel || normalizeVehicleLabel(vehicle.id) === vehicleLabel)
  return labelMatch ?? null
}
