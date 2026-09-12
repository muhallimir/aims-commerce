export interface InsuranceQuote {
  fee: number
  covers: string
}

export function insuranceQuote(
  declaredValue: number,
  fragile: boolean,
  international: boolean,
): InsuranceQuote {
  const raw = declaredValue * 0.012 + (fragile ? 2 : 0) + (international ? 3 : 0)
  const fee = Math.round(Math.max(1.99, raw) * 100) / 100
  const parts = [`Up to $${declaredValue.toFixed(2)}`]
  if (fragile) parts.push("fragile handling")
  if (international) parts.push("international transit")
  return { fee, covers: parts.join(" + ") }
}
