export interface StockItem {
  productId: string
  name: string
  available: number
  threshold: number
}

export type AlertSeverity = 'ok' | 'warning' | 'critical' | 'out'

export interface StockAlert extends StockItem {
  severity: AlertSeverity
  /** Units to reorder to reach 3x threshold. */
  reorderQty: number
}

export function classify(item: StockItem): AlertSeverity {
  if (item.available <= 0) return 'out'
  if (item.available < item.threshold * 0.25) return 'critical'
  if (item.available < item.threshold) return 'warning'
  return 'ok'
}

export function buildAlerts(items: StockItem[]): StockAlert[] {
  return items
    .map((i) => {
      const severity = classify(i)
      const reorderQty = Math.max(0, itemTarget(i) - i.available)
      return { ...i, severity, reorderQty }
    })
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
}

function itemTarget(i: StockItem): number {
  return i.threshold * 3
}

function severityRank(s: AlertSeverity): number {
  return { out: 0, critical: 1, warning: 2, ok: 3 }[s]
}

export function alertSummary(alerts: StockAlert[]): Record<AlertSeverity, number> {
  const out: Record<AlertSeverity, number> = { ok: 0, warning: 0, critical: 0, out: 0 }
  for (const a of alerts) out[a.severity] += 1
  return out
}
