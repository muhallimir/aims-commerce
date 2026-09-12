export interface RecyclingCredit {
  credit: number
  pickupFree: boolean
}

const BASE_CREDIT: Record<string, number> = {
  sofa: 25,
  fridge: 40,
  mattress: 30,
  tv: 15,
}

const CONDITION_MULT: Record<string, number> = {
  good: 1,
  fair: 0.6,
  poor: 0.2,
}

export function recyclingCredit(category: string, condition: string): RecyclingCredit {
  const base = BASE_CREDIT[category.toLowerCase()] ?? 0
  const mult = CONDITION_MULT[condition.toLowerCase()] ?? 0
  const credit = Math.round(base * mult * 100) / 100
  const pickupFree = credit >= 20
  return { credit, pickupFree }
}
