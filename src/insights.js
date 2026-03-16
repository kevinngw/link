// Headway health thresholds (in minutes)
const HEADWAY = {
  BUNCHING_MAX: 12,
  BUNCHING_MIN: 4,
  BUNCHING_RATIO: 3,
  UNEVEN_MAX: 12,
  UNEVEN_SPREAD: 6,
  SPARSE_AVG: 18,
  LARGE_GAP: 12,
}

function gapsForDirection(vehicles) {
  const sorted = [...vehicles].sort((a, b) => a.minutePosition - b.minutePosition)
  return sorted.slice(1).map((v, i) => Math.round(v.minutePosition - sorted[i].minutePosition))
}

export function computeLineHeadways(nb, sb) {
  return { nbGaps: gapsForDirection(nb), sbGaps: gapsForDirection(sb) }
}

export function computeGapStats(gaps) {
  if (!gaps.length) {
    return { avg: null, max: null, min: null, spread: null, ratio: null }
  }

  const avg = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
  const max = Math.max(...gaps)
  const min = Math.min(...gaps)
  return {
    avg: Math.round(avg),
    max,
    min,
    spread: max - min,
    ratio: max / Math.max(min, 1),
  }
}

export function classifyHeadwayHealth(gaps, count) {
  const stats = computeGapStats(gaps)
  if (count < 2 || stats.avg == null) return { health: 'quiet', stats }

  let health = 'healthy'
  if ((stats.max >= HEADWAY.BUNCHING_MAX && stats.min <= HEADWAY.BUNCHING_MIN) || stats.ratio >= HEADWAY.BUNCHING_RATIO) health = 'bunched'
  else if (stats.max >= HEADWAY.UNEVEN_MAX || stats.spread >= HEADWAY.UNEVEN_SPREAD) health = 'uneven'
  else if (stats.avg >= HEADWAY.SPARSE_AVG) health = 'sparse'

  return { health, stats }
}

export function getDelayBuckets(vehicles) {
  return vehicles.reduce((acc, vehicle) => {
    const delay = Number(vehicle.scheduleDeviation ?? 0)
    if (delay <= 60) acc.onTime += 1
    else if (delay <= 300) acc.minorLate += 1
    else acc.severeLate += 1
    return acc
  }, { onTime: 0, minorLate: 0, severeLate: 0 })
}

export function formatPercent(value, total) {
  if (!total) return '—'
  return `${Math.round((value / total) * 100)}%`
}

export function getLineAttentionReasons({ worstGap, severeLateCount, alertCount, balanceDelta, language }) {
  const reasons = []

  if (worstGap >= HEADWAY.LARGE_GAP) {
    reasons.push({ key: 'gap', tone: 'alert', label: language === 'zh-CN' ? '大间隔' : 'Large gap' })
  }
  if (severeLateCount > 0) {
    reasons.push({ key: 'late', tone: 'warn', label: language === 'zh-CN' ? '严重晚点' : 'Severe late' })
  }
  if (alertCount > 0) {
    reasons.push({ key: 'alert', tone: 'info', label: language === 'zh-CN' ? '有告警' : 'Alerted' })
  }
  if (balanceDelta >= 2) {
    reasons.push({ key: 'balance', tone: 'warn', label: language === 'zh-CN' ? '方向失衡' : 'Imbalanced' })
  }
  if (!reasons.length) {
    reasons.push({ key: 'healthy', tone: 'healthy', label: language === 'zh-CN' ? '健康' : 'Healthy' })
  }

  return reasons
}
