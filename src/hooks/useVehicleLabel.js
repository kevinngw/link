/**
 * useVehicleLabel.js
 * Returns the singular and plural vehicle label for the active transit system,
 * localised to the current language.
 *
 * Usage:
 *   const { vehicleLabel, vehicleLabelPlural } = useVehicleLabel()
 *   // link/en  => { vehicleLabel: 'Train', vehicleLabelPlural: 'Trains' }
 *   // link/zh  => { vehicleLabel: '列车', vehicleLabelPlural: '列车' }
 *   // rapidride/en => { vehicleLabel: 'Bus', vehicleLabelPlural: 'Buses' }
 */

import { useAppStore } from '../store/useAppStore'
import { SYSTEM_META, DEFAULT_SYSTEM_ID } from '../config'
import { pluralizeVehicleLabel } from '../utils'

export function useVehicleLabel() {
  const activeSystemId = useAppStore((s) => s.activeSystemId)
  const language = useAppStore((s) => s.language)

  const systemMeta = SYSTEM_META[activeSystemId] ?? SYSTEM_META[DEFAULT_SYSTEM_ID]

  let vehicleLabel
  let vehicleLabelPlural

  if (language === 'zh-CN') {
    vehicleLabel = systemMeta.vehicleLabel === 'Train' ? '列车' : '公交'
    vehicleLabelPlural = vehicleLabel // Chinese doesn't pluralise
  } else {
    vehicleLabel = systemMeta.vehicleLabel ?? 'Vehicle'
    vehicleLabelPlural =
      systemMeta.vehicleLabelPlural ?? pluralizeVehicleLabel(vehicleLabel)
  }

  return { vehicleLabel, vehicleLabelPlural }
}
