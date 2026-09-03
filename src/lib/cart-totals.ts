export interface CartItem {
  productId: string
  /** Numeric price in major units (e.g. dollars), not cents. */
  price: number
  qty: number
  /** Optional weight for shipping (kg). */
  weightKg?: number
}

export interface CartTotalsInput {
  items: CartItem[]
  /** Tax rate, e.g. 0.08 for 8%. */
  taxRate?: number
  /** Flat shipping in major units. */
  shippingFlat?: number
  /** Free shipping threshold in major units (subtotal >= threshold = free). */
  freeShippingThreshold?: number
  /** Per-kg shipping surcharge added to flat. */
  perKgRate?: number
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function computeCartTotals(input: CartTotalsInput): CartTotals {
  const subtotal = input.items.reduce((n, i) => n + i.price * i.qty, 0)
  const itemCount = input.items.reduce((n, i) => n + i.qty, 0)
  const totalWeight = input.items.reduce((n, i) => n + (i.weightKg ?? 0) * i.qty, 0)

  let shipping = 0
  const flat = input.shippingFlat ?? 0
  const perKg = input.perKgRate ?? 0
  const threshold = input.freeShippingThreshold ?? Infinity
  if (subtotal < threshold) {
    shipping = flat + perKg * totalWeight
  } else {
    shipping = 0
  }

  const taxableBase = subtotal + shipping
  const tax = (input.taxRate ?? 0) * taxableBase

  return {
    subtotal: round2(subtotal),
    shipping: round2(shipping),
    tax: round2(tax),
    total: round2(subtotal + shipping + tax),
    itemCount,
  }
}
