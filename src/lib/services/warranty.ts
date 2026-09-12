export interface WarrantyQuote {
  premium: number
  coverage: string[]
}

const RATE: Record<number, number> = {
  1: 0.08,
  2: 0.14,
  3: 0.19,
}

const COVERAGE: Record<number, string[]> = {
  1: ["Parts", "Labor"],
  2: ["Parts", "Labor", "Accidental damage"],
  3: ["Parts", "Labor", "Accidental damage", "On-site service"],
}

export function warrantyQuote(price: number, years: 1 | 2 | 3): WarrantyQuote {
  const premium = Math.round(price * RATE[years] * 100) / 100
  const coverage = [...(COVERAGE[years] ?? [])]
  return { premium, coverage }
}
