export interface SlotCapacity {
  slot: string
  cap: number
  booked: number
}

export interface SlotAvailability {
  slot: string
  left: number
}

export function availableSlots(capacity: SlotCapacity[]): SlotAvailability[] {
  return capacity
    .map((c) => ({ slot: c.slot, left: c.cap - c.booked }))
    .filter((s) => s.left > 0)
}

export function bookSlot(capacity: SlotCapacity[], slot: string): SlotCapacity {
  const entry = capacity.find((c) => c.slot === slot)
  if (!entry) throw new Error(`bookSlot: unknown slot ${slot}`)
  if (entry.booked >= entry.cap) throw new Error(`bookSlot: slot ${slot} is full`)
  return { ...entry, booked: entry.booked + 1 }
}
