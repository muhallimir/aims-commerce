export interface PricePoint {
  productId: string
  price: number
  at: string
}

export interface PriceAlert {
  productId: string
  userId: string
  threshold: number
  triggered: boolean
  lastTriggeredAt?: string
  lastPrice?: number
}

export function isDropSignificant(prev: number, current: number, minDropPct = 0.05): boolean {
  if (prev <= 0) return false
  const drop = (prev - current) / prev
  return drop >= minDropPct
}

export function evaluateAlerts(history: PricePoint[], alerts: PriceAlert[], now: Date = new Date()): PriceAlert[] {
  const latest = new Map<string, PricePoint>()
  for (const p of history) {
    const cur = latest.get(p.productId)
    if (!cur || cur.at < p.at) latest.set(p.productId, p)
  }
  return alerts.map((a) => {
    const last = latest.get(a.productId)
    if (!last) return a
    if (a.threshold > 0 && last.price <= a.threshold) {
      const prev = a.lastPrice ?? Number.POSITIVE_INFINITY
      const isNewTrigger = !a.triggered || prev > a.threshold
      return {
        ...a,
        triggered: true,
        lastTriggeredAt: isNewTrigger ? now.toISOString() : a.lastTriggeredAt,
        lastPrice: last.price,
      }
    }
    return { ...a, lastPrice: last.price }
  })
}

export function savings(prev: number, current: number): number {
  return Math.max(0, Math.round((prev - current) * 100) / 100)
}
