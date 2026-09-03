export const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.74,
  AUD: 0.66,
  JPY: 0.0067,
  INR: 0.012,
  NGN: 0.0007,
  BRL: 0.20,
  MXN: 0.058,
}

export function convert(amount: number, from: string, to: string): number {
  if (!Number.isFinite(amount)) throw new Error('convert: amount must be finite')
  const f = from.toUpperCase()
  const t = to.toUpperCase()
  if (!(f in RATES_TO_USD)) throw new Error(`convert: unknown source currency ${from}`)
  if (!(t in RATES_TO_USD)) throw new Error(`convert: unknown target currency ${to}`)
  const usd = amount * RATES_TO_USD[f]
  return Math.round((usd / RATES_TO_USD[t]) * 100) / 100
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' }
  const s = symbol[currency.toUpperCase()] ?? `${currency} `
  return `${s}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
