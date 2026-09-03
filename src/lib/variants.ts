export interface Variant {
  id: string
  options: Record<string, string> // e.g. { size: 'M', color: 'red' }
  price: number
  stock: number
}

export interface VariantAxis {
  name: string
  values: string[]
}

export function buildAxes(variants: Variant[]): VariantAxis[] {
  const axes = new Map<string, Set<string>>()
  for (const v of variants) {
    for (const [k, val] of Object.entries(v.options)) {
      if (!axes.has(k)) axes.set(k, new Set())
      axes.get(k)!.add(val)
    }
  }
  return [...axes.entries()].map(([name, values]) => ({ name, values: [...values] }))
}

export function findVariant(variants: Variant[], selected: Record<string, string>): Variant | undefined {
  return variants.find((v) =>
    Object.entries(selected).every(([k, val]) => v.options[k] === val),
  )
}

export function stockFor(variants: Variant[], selected: Record<string, string>): number {
  return findVariant(variants, selected)?.stock ?? 0
}

export function priceFor(variants: Variant[], selected: Record<string, string>, fallback = 0): number {
  return findVariant(variants, selected)?.price ?? fallback
}
