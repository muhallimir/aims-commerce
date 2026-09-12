export interface PriceMatchResult {
  approved: boolean
  matchPrice: number | null
  reason: string
}

const ALLOWLIST = ["amazon", "bestbuy", "target", "walmart", "costco"]

export function priceMatch(
  ourPrice: number,
  competitorPrice: number,
  competitor: string,
  inStock: boolean,
): PriceMatchResult {
  const name = competitor.trim().toLowerCase()
  if (!ALLOWLIST.includes(name)) {
    return { approved: false, matchPrice: null, reason: `Competitor ${competitor} is not eligible` }
  }
  if (!inStock) {
    return { approved: false, matchPrice: null, reason: "Competitor item is out of stock" }
  }
  if (!(competitorPrice < ourPrice)) {
    return { approved: false, matchPrice: null, reason: "Competitor price is not lower" }
  }
  return { approved: true, matchPrice: competitorPrice, reason: "Price match approved" }
}
