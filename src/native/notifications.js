import { isNative } from './platform'

let notificationsPlugin = null

async function getPlugin() {
  if (!notificationsPlugin) {
    const mod = await import('@capacitor/local-notifications')
    notificationsPlugin = mod.LocalNotifications
  }
  return notificationsPlugin
}

function createNotificationId(seed) {
  let hash = 0
  const normalized = String(seed)
  for (let index = 0; index < normalized.length; index += 1) {
    hash = Math.imul(31, hash) + normalized.charCodeAt(index) | 0
  }
  return Math.max(1, Math.abs(hash))
}

export function canScheduleLocalNotifications() {
  return isNative()
}

export async function scheduleArrivalAlert({
  stationName = '',
  lineName = '',
  destination = '',
  vehicleId = '',
  arrivalTimeMs,
  leadSeconds = 60,
  title = '',
  body = '',
} = {}) {
  if (!canScheduleLocalNotifications()) {
    return { status: 'unavailable' }
  }

  if (!Number.isFinite(arrivalTimeMs)) {
    return { status: 'invalid' }
  }

  try {
    const plugin = await getPlugin()

    let permissions = await plugin.checkPermissions()
    if (permissions.display !== 'granted') {
      permissions = await plugin.requestPermissions()
    }

    if (permissions.display !== 'granted') {
      return { status: 'denied' }
    }

    const now = Date.now()
    const triggerAtMs = Math.max(arrivalTimeMs - (leadSeconds * 1000), now + 5000)
    const notificationTitle = title || `${lineName || 'Transit'} arriving soon`
    const notificationBody = body || (
      destination
        ? `${destination} is due at ${stationName || 'your stop'} in about one minute.`
        : `${lineName || 'Transit'} is due at ${stationName || 'your stop'} in about one minute.`
    )

    await plugin.schedule({
      notifications: [
        {
          id: createNotificationId(`${stationName}|${lineName}|${vehicleId}|${arrivalTimeMs}`),
          title: notificationTitle,
          body: notificationBody,
          schedule: { at: new Date(triggerAtMs) },
          sound: 'default',
          extra: {
            stationName,
            lineName,
            destination,
            vehicleId,
            arrivalTimeMs,
          },
        },
      ],
    })

    return {
      status: 'scheduled',
      triggerAtMs,
    }
  } catch (error) {
    return {
      status: 'failed',
      error,
    }
  }
}
