export type OrderStatus =
  | 'created'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderEvent {
  status: OrderStatus
  at: string // ISO
  note?: string
}

export const ORDER_FLOW: Record<OrderStatus, OrderStatus[]> = {
  created: ['paid', 'cancelled'],
  paid: ['processing', 'refunded', 'cancelled'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_FLOW[from]?.includes(to) ?? false
}

export function progress(status: OrderStatus): number {
  const order: OrderStatus[] = ['created', 'paid', 'processing', 'shipped', 'delivered']
  if (status === 'cancelled' || status === 'refunded') return 100
  const idx = order.indexOf(status)
  if (idx < 0) return 0
  return Math.round((idx / (order.length - 1)) * 100)
}

export function isTerminal(status: OrderStatus): boolean {
  return status === 'delivered' || status === 'cancelled' || status === 'refunded'
}
