export interface FraudSignals {
  emailAgeDays: number
  accountAgeDays: number
  /** 0 = same as billing, 1 = different region/country, 0.5 = same country. */
  addressMismatch: 0 | 0.5 | 1
  orderTotal: number
  /** Orders in the last 24h. */
  recentOrderCount: number
  /** Has the buyer completed at least one order before. */
  hasPriorCompletedOrder: boolean
}

export interface FraudScore {
  score: number // 0..100; higher = riskier
  level: 'low' | 'medium' | 'high'
  flags: string[]
}

export function scoreFraud(s: FraudSignals): FraudScore {
  let score = 0
  const flags: string[] = []
  if (s.emailAgeDays < 7) {
    score += 25
    flags.push('new email')
  } else if (s.emailAgeDays < 30) {
    score += 10
  }
  if (s.accountAgeDays < 7) {
    score += 20
    flags.push('new account')
  } else if (s.accountAgeDays < 30) {
    score += 8
  }
  if (s.addressMismatch === 1) {
    score += 25
    flags.push('address mismatch (different country)')
  } else if (s.addressMismatch === 0.5) {
    score += 10
    flags.push('address mismatch (same country)')
  }
  if (s.orderTotal > 1000) {
    score += 15
    flags.push('high order value')
  } else if (s.orderTotal > 500) {
    score += 5
  }
  if (s.recentOrderCount >= 5) {
    score += 20
    flags.push('order velocity')
  } else if (s.recentOrderCount >= 3) {
    score += 10
  }
  if (!s.hasPriorCompletedOrder) {
    score += 5
  }
  const capped = Math.max(0, Math.min(100, score))
  const level: FraudScore['level'] = capped >= 60 ? 'high' : capped >= 30 ? 'medium' : 'low'
  return { score: capped, level, flags }
}
