export interface AlterationQuote {
  total: number
  days: number
}

const PRICE_MAP: Record<string, number> = {
  hem: 12,
  taper: 18,
  zip: 15,
  resize: 25,
  patch: 9,
}

export function alterationQuote(garment: string, jobs: string[]): AlterationQuote {
  void garment
  const total = jobs.reduce((sum, job) => sum + (PRICE_MAP[job.toLowerCase()] ?? 0), 0)
  const days = 2 + jobs.length
  return { total, days }
}
