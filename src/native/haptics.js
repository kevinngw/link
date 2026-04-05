import { IS_NATIVE_BUILD, isNativePlatform } from './platform'

let hapticsPlugin = null
let hapticsEnums = null

const loadHapticsModule = IS_NATIVE_BUILD
  ? async function loadHapticsModuleNative() {
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
  : async function loadHapticsModuleWeb() {
      return null
    }

export async function lightImpact() {
  if (!isNativePlatform()) return false

  try {
    const loaded = await loadHapticsModule()
    if (!loaded) return false
    const { plugin, ImpactStyle } = loaded
    await plugin.impact({ style: ImpactStyle.Light })
    return true
  } catch {
    return false
  }
}

export async function notificationSuccess() {
  if (!isNativePlatform()) return false

  try {
    const loaded = await loadHapticsModule()
    if (!loaded) return false
    const { plugin, NotificationType } = loaded
    await plugin.notification({ type: NotificationType.Success })
    return true
  } catch {
    return false
  }
}
