export interface TaxRule {
  /** ISO 3166-1 alpha-2 (US state or country). */
  region: string
  rate: number
  label: string
}

const US_STATE_RATES: TaxRule[] = [
  { region: 'CA', rate: 0.0725, label: 'California' },
  { region: 'NY', rate: 0.04, label: 'New York' },
  { region: 'TX', rate: 0.0625, label: 'Texas' },
  { region: 'WA', rate: 0.065, label: 'Washington' },
  { region: 'FL', rate: 0.06, label: 'Florida' },
  { region: 'OR', rate: 0, label: 'Oregon (no sales tax)' },
  { region: 'DE', rate: 0, label: 'Delaware (no sales tax)' },
]

const EU_VAT = 0.21 // 21% standard rate used as a placeholder

export function taxRateFor(country: string, region?: string): TaxRule {
  const c = country.toUpperCase()
  if (c === 'US' && region) {
    const state = US_STATE_RATES.find((r) => r.region === region.toUpperCase())
    if (state) return state
  }
  if (['NL', 'DE', 'FR', 'ES', 'IT', 'BE', 'PL', 'SE'].includes(c)) {
    return { region: c, rate: EU_VAT, label: `${c} (VAT)` }
  }
  return { region: c, rate: 0, label: `${c} (no tax)` }
}

export function computeTax(subtotal: number, country: string, region?: string, shipping = 0): number {
  const rule = taxRateFor(country, region)
  return Math.round((subtotal + shipping) * rule.rate * 100) / 100
}
