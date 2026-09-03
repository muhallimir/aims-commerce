export interface AbandonedCart {
  id: string
  userId: string
  email?: string
  items: { productId: string; name: string; price: number; qty: number }[]
  totalValue: number
  lastActivityAt: string
  reminderCount: number
  recovered: boolean
}

export interface RecoveryStats {
  total: number
  recovered: number
  pending: number
  recoveryRate: number
  recoveredRevenue: number
  pendingRevenue: number
}

export function abandonedCarts(carts: AbandonedCart[], cutoffIso: string): AbandonedCart[] {
  return carts.filter((c) => !c.recovered && c.lastActivityAt < cutoffIso)
}

export function recoveryStats(carts: AbandonedCart[]): RecoveryStats {
  const total = carts.length
  const recovered = carts.filter((c) => c.recovered).length
  const pending = total - recovered
  const recoveryRate = total === 0 ? 0 : Math.round((recovered / total) * 100)
  const recoveredRevenue = carts.filter((c) => c.recovered).reduce((n, c) => n + c.totalValue, 0)
  const pendingRevenue = carts.filter((c) => !c.recovered).reduce((n, c) => n + c.totalValue, 0)
  return { total, recovered, pending, recoveryRate, recoveredRevenue, pendingRevenue }
}

export function nextReminderDelayHours(reminderCount: number): number {
  // 1h, 24h, 72h, 168h (1 week)
  return [1, 24, 72, 168][Math.min(reminderCount, 3)]
}
