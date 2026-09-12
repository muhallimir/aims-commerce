export interface Stylist {
  id: string
  name: string
  styles: string[]
  minBudget: number
}

export interface ConciergeMatch {
  id: string
  name: string
  score: number
}

export function matchConcierge(
  budget: number,
  style: string[],
  stylists: Stylist[],
): ConciergeMatch[] {
  const wanted = new Set(style.map((s) => s.toLowerCase()))
  return stylists
    .map((s) => {
      const overlap = s.styles.filter((x) => wanted.has(x.toLowerCase())).length
      const budgetGap = Math.max(0, s.minBudget - budget)
      const score = Math.round((overlap * 10 - budgetGap / 10) * 10) / 10
      return { id: s.id, name: s.name, score }
    })
    .sort((a, b) => b.score - a.score)
}
