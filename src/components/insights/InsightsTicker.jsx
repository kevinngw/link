export function InsightsTicker({ items, tickerIndex, pageSize, t }) {
  const entries = items.flatMap((item) =>
    item.lineAlerts?.length
      ? [{ tone: 'info', copy: `${item.line.name}: ${t('alertsAffecting', item.line.name, item.lineAlerts.length)}`, lineColor: item.line.color }]
      : (item.exceptions ?? []).map((ex) => ({
          tone: ex.tone,
          copy: `${item.line.name}: ${ex.copy}`,
          lineColor: item.line.color,
        }))
  )

  if (!entries.length) {
    return (
      <section className="insights-ticker insights-ticker-empty" aria-label={t('insightsSummaryAria')}>
        <div className="insights-ticker-viewport">
          <span className="insights-ticker-item insights-ticker-item-healthy">
            {t('noActiveIssues')}
          </span>
        </div>
      </section>
    )
  }

  const totalPages = Math.ceil(entries.length / pageSize)
  const activePage = tickerIndex % totalPages
  const visibleEntries = entries.slice(activePage * pageSize, activePage * pageSize + pageSize)

  return (
    <section className="insights-ticker" aria-label={t('insightsSummaryAria')}>
      <div className="insights-ticker-viewport">
        {visibleEntries.map((entry, i) => (
          <span
            key={i}
            className={`insights-ticker-item insights-ticker-item-${entry.tone} insights-ticker-item-animated`}
          >
            <span className="insights-ticker-dot" style={{ '--line-color': entry.lineColor }}></span>
            <span className="insights-ticker-copy">{entry.copy}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
