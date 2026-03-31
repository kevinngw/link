import { isNative } from './platform'

let HapticsPlugin = null

async function getPlugin() {
  if (!HapticsPlugin) {
    const mod = await import('@capacitor/haptics')
    HapticsPlugin = mod.Haptics
  }
  return HapticsPlugin
}

export async function lightImpact() {
  if (!isNative()) return
  const plugin = await getPlugin()
  const { ImpactStyle } = await import('@capacitor/haptics')
  await plugin.impact({ style: ImpactStyle.Light })
}

export async function notificationSuccess() {
  if (!isNative()) return
  const plugin = await getPlugin()
  const { NotificationType } = await import('@capacitor/haptics')
  await plugin.notification({ type: NotificationType.Success })
}
