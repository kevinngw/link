function getLosAngelesDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
  const hours = Number(parts.hour ?? '0')
  const minutes = Number(parts.minute ?? '0')
  const seconds = Number(parts.second ?? '0')

  return {
    hourValue: hours + minutes / 60 + seconds / 3600,
  }
}

export function createServiceTimelineHelpers({
  clamp,
  copyValue,
  formatDurationFromMs,
  formatServiceClock,
  getDateKeyWithOffset,
  getServiceDateTime,
  getTodayDateKey,
}) {
  function getTodayServiceSpan(line) {
    const todayKey = getTodayDateKey()
    const span = line.serviceSpansByDate?.[todayKey]
    if (!span) return copyValue('todayServiceUnavailable')
    return copyValue('todayServiceSpan', formatServiceClock(span.start), formatServiceClock(span.end))
  }

  function getServiceReminder(line) {
    const now = new Date()
    const yesterdayKey = getDateKeyWithOffset(-1)
    const todayKey = getDateKeyWithOffset(0)
    const tomorrowKey = getDateKeyWithOffset(1)

    const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
    const todaySpan = line.serviceSpansByDate?.[todayKey]
    const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

    const windows = [
      yesterdaySpan && {
        start: getServiceDateTime(yesterdayKey, yesterdaySpan.start),
        end: getServiceDateTime(yesterdayKey, yesterdaySpan.end),
        span: yesterdaySpan,
      },
      todaySpan && {
        start: getServiceDateTime(todayKey, todaySpan.start),
        end: getServiceDateTime(todayKey, todaySpan.end),
        span: todaySpan,
      },
    ].filter(Boolean)

    const activeWindow = windows.find((windowData) => now >= windowData.start && now <= windowData.end)
    if (activeWindow) {
      const duration = formatDurationFromMs(activeWindow.end.getTime() - now.getTime())
      return {
        tone: 'active',
        headline: copyValue('lastTrip', formatServiceClock(activeWindow.span.end)),
        detail: copyValue('endsIn', duration),
        compact: copyValue('endsIn', duration),
      }
    }

    if (todaySpan) {
      const todayStart = getServiceDateTime(todayKey, todaySpan.start)
      const todayEnd = getServiceDateTime(todayKey, todaySpan.end)

      if (now < todayStart) {
        const duration = formatDurationFromMs(todayStart.getTime() - now.getTime())
        return {
          tone: 'upcoming',
          headline: copyValue('firstTrip', formatServiceClock(todaySpan.start)),
          detail: copyValue('startsIn', duration),
          compact: copyValue('startsIn', duration),
        }
      }

      if (now > todayEnd) {
        return {
          tone: 'ended',
          headline: copyValue('serviceEnded', formatServiceClock(todaySpan.end)),
          detail: tomorrowSpan ? copyValue('nextStart', formatServiceClock(tomorrowSpan.start)) : copyValue('noNextServiceLoaded'),
          compact: tomorrowSpan ? copyValue('nextStart', formatServiceClock(tomorrowSpan.start)) : copyValue('ended'),
        }
      }
    }

    if (tomorrowSpan) {
      return {
        tone: 'upcoming',
        headline: copyValue('nextFirstTrip', formatServiceClock(tomorrowSpan.start)),
        detail: copyValue('noServiceRemainingToday'),
        compact: copyValue('nextStart', formatServiceClock(tomorrowSpan.start)),
      }
    }

    return {
      tone: 'muted',
      headline: copyValue('serviceHoursUnavailable'),
      detail: copyValue('staticScheduleMissing'),
      compact: copyValue('unavailable'),
    }
  }

  function getTimelineBoundaryLabel(boundary) {
    return boundary === 'start'
      ? copyValue('midnightStartLabel')
      : copyValue('midnightEndLabel')
  }

  function getServiceTimelineData(line) {
    const now = new Date()
    const yesterdayKey = getDateKeyWithOffset(-1)
    const todayKey = getDateKeyWithOffset(0)
    const tomorrowKey = getDateKeyWithOffset(1)
    const yesterdaySpan = line.serviceSpansByDate?.[yesterdayKey]
    const todaySpan = line.serviceSpansByDate?.[todayKey]
    const tomorrowSpan = line.serviceSpansByDate?.[tomorrowKey]

    const windows = [
      yesterdaySpan && {
        kind: 'yesterday',
        span: yesterdaySpan,
        start: getServiceDateTime(yesterdayKey, yesterdaySpan.start),
        end: getServiceDateTime(yesterdayKey, yesterdaySpan.end),
      },
      todaySpan && {
        kind: 'today',
        span: todaySpan,
        start: getServiceDateTime(todayKey, todaySpan.start),
        end: getServiceDateTime(todayKey, todaySpan.end),
      },
      tomorrowSpan && {
        kind: 'tomorrow',
        span: tomorrowSpan,
        start: getServiceDateTime(tomorrowKey, tomorrowSpan.start),
        end: getServiceDateTime(tomorrowKey, tomorrowSpan.end),
      },
    ].filter(Boolean)

    if (!windows.length) return null

    const activeWindow = windows.find((windowData) => now >= windowData.start && now <= windowData.end)
    const selectedWindow = activeWindow
      ?? windows.find((windowData) => windowData.kind === 'today')
      ?? windows.find((windowData) => windowData.start > now)
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
      startLabel: startedBeforeToday ? getTimelineBoundaryLabel('start') : formatServiceClock(selectedWindow.span.start),
      endLabel: continuesPastMidnight ? getTimelineBoundaryLabel('end') : formatServiceClock(selectedWindow.span.end),
      overflowLabel: continuesPastMidnight ? formatServiceClock(selectedWindow.span.end) : '',
    }
  }

  function renderServiceReminderChip(line) {
    const reminder = getServiceReminder(line)
    return `
      <div class="service-reminder service-reminder-${reminder.tone}">
        <p class="service-reminder-headline">${reminder.headline}</p>
        <p class="service-reminder-detail">${reminder.detail}</p>
      </div>
    `
  }

  function renderServiceTimeline(line) {
    const timeline = getServiceTimelineData(line)
    if (!timeline) return ''

    const startPercent = clamp((timeline.startHours / timeline.axisMax) * 100, 0, 100)
    const endPercent = clamp((timeline.endHours / timeline.axisMax) * 100, startPercent, 100)
    const nowPercent = clamp((timeline.nowHours / timeline.axisMax) * 100, 0, 100)

    return `
      <section class="service-timeline-card">
        <div class="service-timeline-header">
          <div>
            <p class="headway-chart-title">${copyValue('todayServiceWindowTitle')}</p>
            <p class="headway-chart-copy">${timeline.overflowLabel
              ? copyValue('serviceOverflowNote', timeline.overflowLabel)
              : copyValue('serviceFirstLastNote')}</p>
          </div>
          <span class="service-timeline-badge ${timeline.isLive ? 'is-live' : 'is-off'}">${timeline.isLive ? copyValue('inServiceBadge') : copyValue('offHoursBadge')}</span>
        </div>
        <div class="service-timeline-track">
          <div class="service-timeline-band" style="left:${startPercent}%; width:${Math.max(2, endPercent - startPercent)}%;"></div>
          <div class="service-timeline-now" style="left:${nowPercent}%;" aria-label="${copyValue('currentTimeAria')}">
            <span class="service-timeline-now-line"></span>
            <span class="service-timeline-now-dot"></span>
          </div>
        </div>
        <div class="service-timeline-labels">
          <span>${timeline.startLabel}</span>
          <span>${timeline.endLabel}</span>
        </div>
      </section>
    `
  }

  return {
    getTodayServiceSpan,
    getServiceReminder,
    renderServiceReminderChip,
    renderServiceTimeline,
  }
}
