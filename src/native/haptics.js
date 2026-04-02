import { isNativePlatform } from './platform'

let hapticsPlugin = null
let hapticsEnums = null

async function loadHapticsModule() {
  if (!hapticsPlugin || !hapticsEnums) {
    const mod = await import('@capacitor/haptics')
    hapticsPlugin = mod.Haptics
    hapticsEnums = {
      ImpactStyle: mod.ImpactStyle,
      NotificationType: mod.NotificationType,
    }
  }

  return { plugin: hapticsPlugin, ...hapticsEnums }
}

export async function lightImpact() {
  if (!isNativePlatform()) return false

  try {
    const { plugin, ImpactStyle } = await loadHapticsModule()
    await plugin.impact({ style: ImpactStyle.Light })
    return true
  } catch {
    return false
  }
}

export async function notificationSuccess() {
  if (!isNativePlatform()) return false

  try {
    const { plugin, NotificationType } = await loadHapticsModule()
    await plugin.notification({ type: NotificationType.Success })
    return true
  } catch {
    return false
  }
}
