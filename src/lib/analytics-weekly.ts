export interface SalesRecord {
  date: string // YYYY-MM-DD
  orderId: string
  productId: string
  qty: number
  revenue: number
}

export interface WeeklyAnalytics {
  weekStart: string
  weekEnd: string
  orderCount: number
  revenue: number
  unitsSold: number
  averageOrderValue: number
  topProducts: { productId: string; revenue: number; qty: number }[]
}

function startOfWeek(d: Date): Date {
  const out = new Date(d)
  const day = out.getUTCDay()
  out.setUTCDate(out.getUTCDate() - day)
  out.setUTCHours(0, 0, 0, 0)
  return out
}

function endOfWeek(d: Date): Date {
  const out = startOfWeek(d)
  out.setUTCDate(out.getUTCDate() + 6)
  out.setUTCHours(23, 59, 59, 999)
  return out
}

export function computeWeeklyAnalytics(records: SalesRecord[], today: Date = new Date()): WeeklyAnalytics {
  const start = startOfWeek(today)
  const end = endOfWeek(today)
  const inWeek = records.filter((r) => {
    const t = new Date(`${r.date}T00:00:00Z`)
    return t >= start && t <= end
  })
  const orderIds = new Set(inWeek.map((r) => r.orderId))
  const revenue = Math.round(inWeek.reduce((n, r) => n + r.revenue, 0) * 100) / 100
  const unitsSold = inWeek.reduce((n, r) => n + r.qty, 0)
  const orderCount = orderIds.size
  const aov = orderCount === 0 ? 0 : Math.round((revenue / orderCount) * 100) / 100

  const byProduct = new Map<string, { revenue: number; qty: number }>()
  for (const r of inWeek) {
    const cur = byProduct.get(r.productId) ?? { revenue: 0, qty: 0 }
    cur.revenue = Math.round((cur.revenue + r.revenue) * 100) / 100
    cur.qty += r.qty
    byProduct.set(r.productId, cur)
  }
  const topProducts = [...byProduct.entries()]
    .map(([productId, v]) => ({ productId, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10),
    orderCount,
    revenue,
    unitsSold,
    averageOrderValue: aov,
    topProducts,
  }
}
