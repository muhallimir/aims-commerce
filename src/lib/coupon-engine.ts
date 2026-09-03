export type DiscountType = 'percentage' | 'fixed'

export interface Coupon {
  code: string
  type: DiscountType
  /** Percent (1..100) when type=percentage, dollars when type=fixed. */
  amount: number
  expiresAt?: string
  minSubtotal?: number
  maxRedemptions?: number
  redemptions?: number
}

export interface ApplyContext {
  subtotal: number
  shipping?: number
  now?: Date
  customerRedemptions?: number
  perCustomerLimit?: number
}

export interface ApplyResult {
  ok: boolean
  reason?: string
  discount: number
  newSubtotal: number
}

export function applyCoupon(coupon: Coupon, ctx: ApplyContext): ApplyResult {
  const now = ctx.now ?? new Date()
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return { ok: false, reason: 'expired', discount: 0, newSubtotal: ctx.subtotal }
  }
  if (typeof coupon.maxRedemptions === 'number' && (coupon.redemptions ?? 0) >= coupon.maxRedemptions) {
    return { ok: false, reason: 'maxed_out', discount: 0, newSubtotal: ctx.subtotal }
  }
  if (typeof ctx.perCustomerLimit === 'number' && (ctx.customerRedemptions ?? 0) >= ctx.perCustomerLimit) {
    return { ok: false, reason: 'customer_limit', discount: 0, newSubtotal: ctx.subtotal }
  }
  if (typeof coupon.minSubtotal === 'number' && ctx.subtotal < coupon.minSubtotal) {
    return { ok: false, reason: 'below_minimum', discount: 0, newSubtotal: ctx.subtotal }
  }
  let discount = 0
  if (coupon.type === 'percentage') {
    if (coupon.amount <= 0 || coupon.amount > 100) {
      return { ok: false, reason: 'invalid_amount', discount: 0, newSubtotal: ctx.subtotal }
    }
    discount = Math.round((ctx.subtotal * coupon.amount) / 100 * 100) / 100
  } else if (coupon.type === 'fixed') {
    if (coupon.amount <= 0) {
      return { ok: false, reason: 'invalid_amount', discount: 0, newSubtotal: ctx.subtotal }
    }
    discount = Math.min(coupon.amount, ctx.subtotal)
  } else {
    return { ok: false, reason: 'unknown_type', discount: 0, newSubtotal: ctx.subtotal }
  }
  discount = Math.round(discount * 100) / 100
  return { ok: true, discount, newSubtotal: Math.max(0, Math.round((ctx.subtotal - discount) * 100) / 100) }
}
