import { clamp } from '../../utils'
import { getDateKeyWithOffset, getServiceDateTime, formatServiceClock as formatServiceClockValue } from '../../formatters'

function getLosAngelesDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]))
  const hours = Number(parts.hour ?? '0')
  const minutes = Number(parts.minute ?? '0')
  const seconds = Number(parts.second ?? '0')
  return { hours, minutes, seconds, hourValue: hours + minutes / 60 + seconds / 3600 }
}

function getServiceTimelineData(line, t, language) {
  const now = new Date()
  const yesterdayKey = getDateKeyWithOffset(-1)
  const todayKey = getDateKeyWithOffset(0)
  const tomorrowKey = getDateKeyWithOffset(1)
  const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
  const todaySpan = line.serviceSpansByDate?.[todayKey]
  const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

  const windows = [
    yesterdaySpan && { kind: 'yesterday', dateKey: yesterdayKey, span: yesterdaySpan, start: getServiceDateTime(yesterdayKey, yesterdaySpan.start), end: getServiceDateTime(yesterdayKey, yesterdaySpan.end) },
    todaySpan && { kind: 'today', dateKey: todayKey, span: todaySpan, start: getServiceDateTime(todayKey, todaySpan.start), end: getServiceDateTime(todayKey, todaySpan.end) },
    tomorrowSpan && { kind: 'tomorrow', dateKey: tomorrowKey, span: tomorrowSpan, start: getServiceDateTime(tomorrowKey, tomorrowSpan.start), end: getServiceDateTime(tomorrowKey, tomorrowSpan.end) },
  ].filter(Boolean)

  if (!windows.length) return null

  const activeWindow = windows.find((w) => now >= w.start && now <= w.end)
  const selectedWindow = activeWindow
    ?? windows.find((w) => w.kind === 'today')
    ?? windows.find((w) => w.start > now)
    ?? windows.at(-1)

  if (!selectedWindow?.span) return null

  const todayStart = getServiceDateTime(todayKey, '00:00:00')
  const todayEnd = getServiceDateTime(tomorrowKey, '00:00:00')
  const visibleStart = new Date(Math.max(selectedWindow.start.getTime(), todayStart.getTime()))
  const visibleEnd = new Date(Math.min(selectedWindow.end.getTime(), todayEnd.getTime()))
  const visibleStartHours = Math.max(0, (visibleStart.getTime() - todayStart.getTime()) / 3_600_000)
  const visibleEndHours = Math.max(0, (visibleEnd.getTime() - todayStart.getTime()) / 3_600_000)
  const { hourValue: nowHourValue } = getLosAngelesDateParts(now)
  const isLive = now >= selectedWindow.start && now <= selectedWindow.end
  const continuesPastMidnight = selectedWindow.end.getTime() > todayEnd.getTime()
  const startedBeforeToday = selectedWindow.start.getTime() < todayStart.getTime()

  return {
    startHours: visibleStartHours,
    endHours: visibleEndHours,
    nowHours: nowHourValue,
    axisMax: 24,
    isLive,
    startLabel: startedBeforeToday ? t('midnightStartLabel') : formatServiceClockValue(selectedWindow.span.start, language, t),
    endLabel: continuesPastMidnight ? t('midnightEndLabel') : formatServiceClockValue(selectedWindow.span.end, language, t),
    overflowLabel: continuesPastMidnight ? formatServiceClockValue(selectedWindow.span.end, language, t) : '',
  }
}

export default function ServiceTimeline({ line, t, language }) {
  const timeline = getServiceTimelineData(line, t, language)
  if (!timeline) return null

  const startPercent = clamp((timeline.startHours / timeline.axisMax) * 100, 0, 100)
  const endPercent = clamp((timeline.endHours / timeline.axisMax) * 100, startPercent, 100)
  const nowPercent = clamp((timeline.nowHours / timeline.axisMax) * 100, 0, 100)
  const bandWidth = Math.max(2, endPercent - startPercent)

  return (
    <section className="service-timeline-card">
      <div className="service-timeline-header">
        <div>
          <p className="headway-chart-title">{t('todayServiceWindowTitle')}</p>
          <p className="headway-chart-copy">
            {timeline.overflowLabel
              ? t('serviceOverflowNote', timeline.overflowLabel)
              : t('serviceFirstLastNote')}
          </p>
        </div>
        <span className={`service-timeline-badge${timeline.isLive ? ' is-live' : ' is-off'}`}>
          {timeline.isLive ? t('inServiceBadge') : t('offHoursBadge')}
        </span>
      </div>
      <div className="service-timeline-track">
        <div
          className="service-timeline-band"
          style={{ left: `${startPercent}%`, width: `${bandWidth}%` }}
        />
        <div
          className="service-timeline-now"
          style={{ left: `${nowPercent}%` }}
          aria-label={t('currentTimeAria')}
        >
          <span className="service-timeline-now-line"></span>
          <span className="service-timeline-now-dot"></span>
        </div>
      </div>
      <div className="service-timeline-labels">
        <span>{timeline.startLabel}</span>
        <span>{timeline.endLabel}</span>
      </div>
    </section>
  )
}
