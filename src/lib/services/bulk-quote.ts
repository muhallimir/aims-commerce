export interface BulkQuoteResult {
  discountPct: number
  total: number
  tier: string
}

export function bulkQuote(unitPrice: number, qty: number): BulkQuoteResult {
  let discountPct = 0
  let tier = "none"
  if (qty >= 100) {
    discountPct = 20
    tier = "100+"
  } else if (qty >= 50) {
    discountPct = 15
    tier = "50+"
  } else if (qty >= 20) {
    discountPct = 10
    tier = "20+"
  } else if (qty >= 10) {
    discountPct = 5
    tier = "10+"
  }
  const total = Math.round(unitPrice * qty * (1 - discountPct / 100) * 100) / 100
  return { discountPct, total, tier }
}
