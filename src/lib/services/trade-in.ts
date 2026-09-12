export interface TradeInResult {
  credit: number
  note: string
}

const BASE_VALUES: Record<string, number> = {
  phone: 200,
  laptop: 350,
  tablet: 150,
  watch: 120,
  console: 180,
}

const CONDITION_MULT: Record<string, number> = {
  mint: 0.9,
  good: 0.7,
  fair: 0.45,
  poor: 0.2,
}

export function tradeInCredit(
  category: string,
  condition: string,
  ageYears: number,
): TradeInResult {
  const base = BASE_VALUES[category.toLowerCase()] ?? 100
  const mult = CONDITION_MULT[condition.toLowerCase()] ?? CONDITION_MULT.fair
  const ageFactor = Math.max(0.2, 1 - ageYears * 0.15)
  const credit = Math.round(base * mult * ageFactor * 100) / 100
  const note = `${condition} ${category}, ${ageYears}y old`
  return { credit, note }
}
