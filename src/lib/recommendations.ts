export interface RecProduct {
  id: string
  name: string
  category: string
  brand?: string
  tags: string[]
  price: number
}

export function jaccard<T>(a: T[], b: T[]): number {
  const A = new Set(a)
  const B = new Set(b)
  let inter = 0
  A.forEach((x) => { if (B.has(x)) inter++ })
  const union = A.size + B.size - inter
  return union === 0 ? 0 : inter / union
}

export function scoreSimilarity(seed: RecProduct, candidate: RecProduct): number {
  if (seed.id === candidate.id) return 0
  let score = 0
  if (seed.category === candidate.category) score += 40
  if (seed.brand && candidate.brand && seed.brand === candidate.brand) score += 20
  const tagScore = jaccard(seed.tags, candidate.tags) * 40
  score += tagScore
  const priceDelta = Math.abs(seed.price - candidate.price) / Math.max(seed.price, 1)
  if (priceDelta < 0.2) score += 5
  return Math.round(Math.min(100, score))
}

export function recommend(seed: RecProduct, all: RecProduct[], options: { limit?: number; excludeIds?: string[] } = {}): { product: RecProduct; score: number }[] {
  const exclude = new Set([seed.id, ...(options.excludeIds ?? [])])
  const limit = options.limit ?? 5
  return all
    .filter((p) => !exclude.has(p.id))
    .map((p) => ({ product: p, score: scoreSimilarity(seed, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
