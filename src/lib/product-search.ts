export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  brand?: string
  tags: string[]
  rating?: number
}

export interface SearchQuery {
  text?: string
  categories?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string[]
}

export interface SearchResult {
  product: Product
  score: number
}

function norm(s: string): string {
  return s.toLowerCase().trim()
}

function tokenMatch(haystack: string, q: string): number {
  const h = norm(haystack)
  const needle = norm(q)
  if (!needle) return 0
  if (h === needle) return 10
  if (h.startsWith(needle)) return 7
  if (h.includes(` ${needle}`) || h.includes(`${needle} `) || h.includes(needle)) return 4
  return 0
}

export function searchProducts(products: Product[], q: SearchQuery): SearchResult[] {
  const out: SearchResult[] = []
  for (const p of products) {
    if (q.categories && q.categories.length > 0 && !q.categories.map(norm).includes(norm(p.category))) continue
    if (q.brands && q.brands.length > 0 && (!p.brand || !q.brands.map(norm).includes(norm(p.brand)))) continue
    if (typeof q.minPrice === 'number' && p.price < q.minPrice) continue
    if (typeof q.maxPrice === 'number' && p.price > q.maxPrice) continue
    if (typeof q.minRating === 'number' && (p.rating ?? 0) < q.minRating) continue
    if (q.tags && q.tags.length > 0) {
      const has = q.tags.every((t) => p.tags.map(norm).includes(norm(t)))
      if (!has) continue
    }

    let score = 0
    if (q.text) {
      score += tokenMatch(p.name, q.text) * 2
      score += tokenMatch(p.description ?? '', q.text)
      score += tokenMatch(p.category, q.text)
      if (p.brand) score += tokenMatch(p.brand, q.text)
      if (p.tags.some((t) => norm(t).includes(norm(q.text!)))) score += 3
    } else {
      score += 5
    }
    if (typeof p.rating === 'number') score += Math.round(p.rating)
    out.push({ product: p, score })
  }
  return out.sort((a, b) => b.score - a.score)
}

export function facetCounts(products: Product[], facet: 'category' | 'brand' | 'tag'): { value: string; count: number }[] {
  const map = new Map<string, number>()
  for (const p of products) {
    if (facet === 'category') {
      map.set(p.category, (map.get(p.category) ?? 0) + 1)
    } else if (facet === 'brand' && p.brand) {
      map.set(p.brand, (map.get(p.brand) ?? 0) + 1)
    } else if (facet === 'tag') {
      for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1)
    }
  }
  return [...map.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}
