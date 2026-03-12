import { parseClockToSeconds } from './utils'

export function formatRelativeTime(dateString, copyValue) {
  if (!dateString) return copyValue('waitingSnapshot')

  const deltaSeconds = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 1000))
  if (deltaSeconds < 10) return copyValue('updatedNow')
  if (deltaSeconds < 60) return copyValue('updatedSecondsAgo', deltaSeconds)
  return copyValue('updatedMinutesAgo', Math.round(deltaSeconds / 60))
}

export function formatCurrentTime(language) {
  return new Intl.DateTimeFormat(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: language !== 'zh-CN',
  }).format(new Date())
}

export function formatArrivalTime(offsetSeconds, language, copyValue) {
  if (offsetSeconds <= 0) return copyValue('arriving')
  const minutes = Math.floor(offsetSeconds / 60)
  const seconds = offsetSeconds % 60
  if (language === 'zh-CN') {
    if (minutes > 0) return `${minutes}分 ${seconds}秒`
    return `${seconds}秒`
  }

  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function getTodayDateKey() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}

export function getDateKeyWithOffset(offsetDays) {
  const now = new Date()
  now.setDate(now.getDate() + offsetDays)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(now)
}

export function getServiceDateTime(dateKey, clockValue) {
  if (!dateKey || !clockValue) return null
  const [year, month, day] = dateKey.split('-').map(Number)
  const totalSeconds = parseClockToSeconds(clockValue)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return new Date(year, month - 1, day, hours, minutes, seconds)
}

export function formatDurationFromMs(ms, language) {
  const totalMinutes = Math.max(0, Math.round(ms / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (language === 'zh-CN') {
    if (hours && minutes) return `${hours}小时${minutes}分钟`
    if (hours) return `${hours}小时`
    return `${minutes}分钟`
  }

  if (hours && minutes) return `${hours}h ${minutes}m`
  if (hours) return `${hours}h`
  return `${minutes}m`
}

export function formatServiceClock(clockValue, language) {
  if (!clockValue) return ''
  const [rawHours = '0', rawMinutes = '0'] = String(clockValue).split(':')
  const hours24 = Number(rawHours)
  const minutes = Number(rawMinutes)
  const normalizedHours = ((hours24 % 24) + 24) % 24
  const dayOffset = hours24 >= 24 ? Math.floor(hours24 / 24) : 0

  const daySuffix = dayOffset > 0
    ? language === 'zh-CN'
      ? `（次日${dayOffset > 1 ? `+${dayOffset - 1}` : ''}）`
      : ` (+${dayOffset}d)`
    : ''

  if (language === 'zh-CN') {
    return `${String(normalizedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${daySuffix}`
  }
  const period = normalizedHours >= 12 ? 'PM' : 'AM'
  const hours12 = normalizedHours % 12 || 12
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}${daySuffix}`
}

export function formatClockTime(timestamp, language) {
  return new Date(timestamp).toLocaleTimeString(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: language !== 'zh-CN',
  })
}

export function formatEtaClockFromNow(offsetSeconds, language) {
  return formatClockTime(Date.now() + Math.max(0, offsetSeconds) * 1000, language)
}

export function formatWalkDistance(distanceKm, copyValue) {
  if (distanceKm >= 1) return copyValue('walkKm', distanceKm)
  return copyValue('walkMeters', Math.round(distanceKm * 1000))
}

export function formatAlertEffect(effect) {
  return String(effect || 'SERVICE ALERT')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

export function formatAlertSeverity(severity) {
  return String(severity || 'INFO')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}
