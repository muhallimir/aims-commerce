export interface InventoryState {
  productId: string
  /** Total on-hand units. */
  onHand: number
  /** Active reservations keyed by reservation id. */
  reservations: Record<string, { qty: number; expiresAt: string }>
}

export interface ReservationResult {
  state: InventoryState
  ok: boolean
  reason?: string
  reservationId?: string
}

function prune(state: InventoryState, now: Date): InventoryState {
  const reservations: InventoryState['reservations'] = {}
  for (const [id, r] of Object.entries(state.reservations)) {
    if (new Date(r.expiresAt) > now) reservations[id] = r
  }
  return { ...state, reservations }
}

export function available(state: InventoryState, now: Date = new Date()): number {
  const pruned = prune(state, now)
  const held = Object.values(pruned.reservations).reduce((n, r) => n + r.qty, 0)
  return Math.max(0, pruned.onHand - held)
}

let counter = 0
export function reserve(state: InventoryState, qty: number, holdMs: number, now: Date = new Date()): ReservationResult {
  if (qty <= 0) return { state, ok: false, reason: 'qty_must_be_positive' }
  const a = available(state, now)
  if (a < qty) return { state, ok: false, reason: 'insufficient_stock' }
  counter += 1
  const id = `r-${now.getTime().toString(36)}-${counter}`
  const expiresAt = new Date(now.getTime() + holdMs).toISOString()
  const next: InventoryState = {
    ...state,
    reservations: { ...state.reservations, [id]: { qty, expiresAt } },
  }
  return { state: next, ok: true, reservationId: id }
}

export function release(state: InventoryState, id: string): InventoryState {
  const reservations = { ...state.reservations }
  delete reservations[id]
  return { ...state, reservations }
}

export function confirm(state: InventoryState, id: string): { state: InventoryState; ok: boolean; reason?: string } {
  const pruned = prune(state, new Date())
  const r = pruned.reservations[id]
  if (!r) return { state: pruned, ok: false, reason: 'expired_or_missing' }
  if (r.qty > pruned.onHand) return { state: pruned, ok: false, reason: 'sold_out' }
  const next: InventoryState = {
    ...pruned,
    onHand: pruned.onHand - r.qty,
    reservations: { ...pruned.reservations },
  }
  delete next.reservations[id]
  return { state: next, ok: true }
}
