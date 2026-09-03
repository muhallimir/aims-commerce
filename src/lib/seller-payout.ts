export interface PayoutLine {
  orderId: string
  gross: number
}

export interface PayoutResult {
  gross: number
  fees: number
  refunds: number
  net: number
  feeRate: number
}

export interface PayoutInput {
  lines: PayoutLine[]
  refunds?: { orderId: string; amount: number }[]
  feeRate?: number
}

export function computePayout(input: PayoutInput): PayoutResult {
  const feeRate = input.feeRate ?? 0.1
  const gross = input.lines.reduce((n, l) => n + l.gross, 0)
  const fees = Math.round(gross * feeRate * 100) / 100
  const refunds = (input.refunds ?? []).reduce((n, r) => n + r.amount, 0)
  const net = Math.round((gross - fees - refunds) * 100) / 100
  return { gross: Math.round(gross * 100) / 100, fees, refunds, net, feeRate }
}

export function projectedMonthly(payouts: PayoutResult[]): PayoutResult {
  return payouts.reduce(
    (acc, p) => ({
      gross: acc.gross + p.gross,
      fees: acc.fees + p.fees,
      refunds: acc.refunds + p.refunds,
      net: acc.net + p.net,
      feeRate: p.feeRate,
    }),
    { gross: 0, fees: 0, refunds: 0, net: 0, feeRate: payouts[0]?.feeRate ?? 0.1 },
  )
}
