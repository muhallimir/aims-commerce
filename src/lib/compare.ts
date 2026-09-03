export interface CompareProduct {
  id: string
  name: string
  price: number
  rating?: number
  inStock: boolean
  brand?: string
  weightKg?: number
}

export interface CompareRow {
  field: keyof CompareProduct
  label: string
  values: (string | number | boolean | undefined)[]
  bestIndex?: number
}

export function buildCompareRows(products: CompareProduct[]): CompareRow[] {
  if (products.length === 0) return []
  const fields: { field: keyof CompareProduct; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'brand', label: 'Brand' },
    { field: 'price', label: 'Price' },
    { field: 'rating', label: 'Rating' },
    { field: 'inStock', label: 'In stock' },
    { field: 'weightKg', label: 'Weight (kg)' },
  ]
  return fields.map(({ field, label }) => {
    const values = products.map((p) => p[field] as never)
    let bestIndex: number | undefined
    if (field === 'price') {
      const numeric = values.map((v) => (typeof v === 'number' ? v : Infinity))
      const min = Math.min(...numeric)
      if (Number.isFinite(min)) bestIndex = numeric.indexOf(min)
    } else if (field === 'rating') {
      const numeric = values.map((v) => (typeof v === 'number' ? v : -Infinity))
      const max = Math.max(...numeric)
      if (max > -Infinity) bestIndex = numeric.indexOf(max)
    }
    return { field, label, values, bestIndex }
  })
}

export function compareLimit(products: CompareProduct[], max = 4): CompareProduct[] {
  return products.slice(0, max)
}
