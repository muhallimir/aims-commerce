export interface BundleTier {
  /** Minimum quantity required to qualify for this tier. */
  minQty: number
  /** Discount percentage (0..1) applied to line total at this tier. */
  discount: number
}

export interface BundleInput {
  unitPrice: number
  qty: number
  tiers: BundleTier[]
}

export interface BundleBreakdown {
  unitPrice: number
  qty: number
  unitPriceAfterDiscount: number
  lineTotal: number
  discount: number
  appliedTier: BundleTier | null
}

export function applyBundle(input: BundleInput): BundleBreakdown {
  const sorted = [...input.tiers].sort((a, b) => b.minQty - a.minQty)
  const tier = sorted.find((t) => input.qty >= t.minQty) ?? null
  const discount = tier?.discount ?? 0
  const unitAfter = Math.round(input.unitPrice * (1 - discount) * 100) / 100
  const lineTotal = Math.round(unitAfter * input.qty * 100) / 100
  const saved = Math.round((input.unitPrice * input.qty - lineTotal) * 100) / 100
  return {
    unitPrice: input.unitPrice,
    qty: input.qty,
    unitPriceAfterDiscount: unitAfter,
    lineTotal,
    discount: saved,
    appliedTier: tier,
  }
}

export function nextTierSavings(input: BundleInput): { qty: number; unitPrice: number; savings: number } | null {
  const sorted = [...input.tiers].sort((a, b) => a.minQty - b.minQty)
  const next = sorted.find((t) => t.minQty > input.qty)
  if (!next) return null
  const after = applyBundle({ ...input, qty: next.minQty })
  return { qty: next.minQty, unitPrice: after.unitPriceAfterDiscount, savings: after.discount }
}
