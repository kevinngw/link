import { isNative } from './platform'

let LocalNotifications = null

async function getPlugin() {
  if (!LocalNotifications) {
    const mod = await import('@capacitor/local-notifications')
    LocalNotifications = mod.LocalNotifications
  }
  return LocalNotifications
}

export async function requestNotificationPermission() {
  if (!isNative()) return false
  const plugin = await getPlugin()
  const { display } = await plugin.requestPermissions()
  return display === 'granted'
}

export async function scheduleArrivalAlert(stationName, lineName, etaMinutes) {
  if (!isNative()) return
  const plugin = await getPlugin()

  const { display } = await plugin.checkPermissions()
  if (display !== 'granted') {
    const result = await plugin.requestPermissions()
    if (result.display !== 'granted') return
  }

  const triggerMs = Math.max((etaMinutes - 1) * 60 * 1000, 5000)

  await plugin.schedule({
    notifications: [
      {
        id: Date.now(),
        title: `${lineName} arriving soon`,
        body: `Train arriving at ${stationName} in ~1 minute`,
        schedule: { at: new Date(Date.now() + triggerMs) },
        sound: 'default',
      },
    ],
  })
}
