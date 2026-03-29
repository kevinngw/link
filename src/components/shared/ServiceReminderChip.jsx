import { getDateKeyWithOffset, getServiceDateTime, formatServiceClock as formatServiceClockValue, formatDurationFromMs as formatDurationFromMsValue } from '../../formatters'

function getServiceReminder(line, t, language) {
  const now = new Date()
  const yesterdayKey = getDateKeyWithOffset(-1)
  const todayKey = getDateKeyWithOffset(0)
  const tomorrowKey = getDateKeyWithOffset(1)

  const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
  const todaySpan = line.serviceSpansByDate?.[todayKey]
  const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

  const formatDuration = (ms) => formatDurationFromMsValue(ms, t)
  const formatClock = (val) => formatServiceClockValue(val, language, t)

  const windows = [
    yesterdaySpan && { kind: 'yesterday', start: getServiceDateTime(yesterdayKey, yesterdaySpan.start), end: getServiceDateTime(yesterdayKey, yesterdaySpan.end), span: yesterdaySpan },
    todaySpan && { kind: 'today', start: getServiceDateTime(todayKey, todaySpan.start), end: getServiceDateTime(todayKey, todaySpan.end), span: todaySpan },
  ].filter(Boolean)

  const activeWindow = windows.find((w) => now >= w.start && now <= w.end)
  if (activeWindow) {
    return {
      tone: 'active',
      headline: t('lastTrip', formatClock(activeWindow.span.end)),
      detail: t('endsIn', formatDuration(activeWindow.end.getTime() - now.getTime())),
      compact: t('endsIn', formatDuration(activeWindow.end.getTime() - now.getTime())),
    }
  }

  if (todaySpan) {
    const todayStart = getServiceDateTime(todayKey, todaySpan.start)
    const todayEnd = getServiceDateTime(todayKey, todaySpan.end)
    if (now < todayStart) {
      return {
        tone: 'upcoming',
        headline: t('firstTrip', formatClock(todaySpan.start)),
        detail: t('startsIn', formatDuration(todayStart.getTime() - now.getTime())),
        compact: t('startsIn', formatDuration(todayStart.getTime() - now.getTime())),
      }
    }
    if (now > todayEnd) {
      return {
        tone: 'ended',
        headline: t('serviceEnded', formatClock(todaySpan.end)),
        detail: tomorrowSpan ? t('nextStart', formatClock(tomorrowSpan.start)) : t('noNextServiceLoaded'),
        compact: tomorrowSpan ? t('nextStart', formatClock(tomorrowSpan.start)) : t('ended'),
      }
    }
  }

  if (tomorrowSpan) {
    return {
      tone: 'upcoming',
      headline: t('nextFirstTrip', formatServiceClockValue(tomorrowSpan.start, language, t)),
      detail: t('noServiceRemainingToday'),
      compact: t('nextStart', formatServiceClockValue(tomorrowSpan.start, language, t)),
    }
  }

  return {
    tone: 'muted',
    headline: t('serviceHoursUnavailable'),
    detail: t('staticScheduleMissing'),
    compact: t('unavailable'),
  }
}

export default function ServiceReminderChip({ line, t, language }) {
  const reminder = getServiceReminder(line, t, language)
  return (
    <div className={`service-reminder service-reminder-${reminder.tone}`}>
      <p className="service-reminder-headline">{reminder.headline}</p>
      <p className="service-reminder-detail">{reminder.detail}</p>
    </div>
  )
}
