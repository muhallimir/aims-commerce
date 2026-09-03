export interface RefundRequest {
  orderDeliveredAt: string
  requestAt?: string
  itemCondition: 'sealed' | 'opened' | 'used' | 'damaged'
  hasReceipt: boolean
  category: 'standard' | 'final_sale' | 'perishable' | 'digital'
  returnWindowDays?: number
}

export interface RefundDecision {
  ok: boolean
  reason: string
  refundPercent: number
  restockFeePercent: number
}

const DEFAULT_WINDOW = 30

export function decideRefund(req: RefundRequest): RefundDecision {
  const requestAt = req.requestAt ? new Date(req.requestAt) : new Date()
  const deliveredAt = new Date(req.orderDeliveredAt)
  const windowDays = req.returnWindowDays ?? DEFAULT_WINDOW

  if (req.category === 'final_sale') {
    return { ok: false, reason: 'final_sale', refundPercent: 0, restockFeePercent: 0 }
  }
  if (req.category === 'digital') {
    return { ok: true, reason: 'digital_full_refund', refundPercent: 100, restockFeePercent: 0 }
  }
  if (req.category === 'perishable') {
    return { ok: true, reason: 'perishable_partial', refundPercent: 50, restockFeePercent: 0 }
  }

  const days = Math.floor((requestAt.getTime() - deliveredAt.getTime()) / 86400000)
  if (days > windowDays) {
    return { ok: false, reason: 'window_expired', refundPercent: 0, restockFeePercent: 0 }
  }

  if (!req.hasReceipt) {
    return { ok: true, reason: 'no_receipt_partial', refundPercent: 50, restockFeePercent: 15 }
  }

  let refundPercent = 100
  let restockFeePercent = 0
  let reason = 'full_refund'
  if (req.itemCondition === 'opened') {
    restockFeePercent = 15
    reason = 'opened_with_restock'
  } else if (req.itemCondition === 'used') {
    refundPercent = 50
    restockFeePercent = 0
    reason = 'used_partial'
  } else if (req.itemCondition === 'damaged') {
    refundPercent = 100
    reason = 'damaged_full'
  }
  return { ok: true, reason, refundPercent, restockFeePercent }
}
