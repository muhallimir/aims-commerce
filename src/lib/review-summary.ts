export interface Review {
  productId: string
  rating: number // 1..5
  text?: string
  authorId?: string
  verified?: boolean
  createdAt: string
}

export interface ReviewSummary {
  count: number
  average: number
  histogram: Record<1 | 2 | 3 | 4 | 5, number>
  verifiedCount: number
  pctVerified: number
}

export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const histogram: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let total = 0
  let verifiedCount = 0
  for (const r of reviews) {
    const rating = Math.max(1, Math.min(5, Math.round(r.rating)))
    histogram[rating as 1 | 2 | 3 | 4 | 5] += 1
    total += rating
    if (r.verified) verifiedCount += 1
  }
  const count = reviews.length
  const average = count === 0 ? 0 : Math.round((total / count) * 10) / 10
  const pctVerified = count === 0 ? 0 : Math.round((verifiedCount / count) * 100)
  return { count, average, histogram, verifiedCount, pctVerified }
}

export function distribution(stars: 1 | 2 | 3 | 4 | 5, summary: ReviewSummary): number {
  if (summary.count === 0) return 0
  return Math.round((summary.histogram[stars] / summary.count) * 100)
}
