export interface DeliveryEstimateInput {
  orderPlacedAt: string // ISO
  /** Service level ETA in business days. */
  businessDays: number
  /** Hour of day (24h) after which the order ships the next business day. */
  cutoffHour: number
  /** Saturdays are not business days. */
  skipWeekends: boolean
}

export interface DeliveryEstimate {
  shipsAt: string
  arrivesAt: string
  businessDays: number
  calendarDays: number
}

const MS_DAY = 86400000

export function estimateDelivery(input: DeliveryEstimateInput): DeliveryEstimate {
  const placed = new Date(input.orderPlacedAt)
  if (Number.isNaN(placed.getTime())) throw new Error('estimateDelivery: invalid orderPlacedAt')
  const ships = new Date(placed)
  if (ships.getHours() >= input.cutoffHour) {
    ships.setDate(ships.getDate() + 1)
  }
  if (input.skipWeekends) {
    while (ships.getDay() === 0 || ships.getDay() === 6) {
      ships.setDate(ships.getDate() + 1)
    }
  }

  let cursor = new Date(ships)
  let added = 0
  while (added < input.businessDays) {
    cursor = new Date(cursor.getTime() + MS_DAY)
    if (input.skipWeekends && (cursor.getDay() === 0 || cursor.getDay() === 6)) continue
    added += 1
  }

  const calendarDays = Math.round((cursor.getTime() - placed.getTime()) / MS_DAY)
  return {
    shipsAt: ships.toISOString(),
    arrivesAt: cursor.toISOString(),
    businessDays: input.businessDays,
    calendarDays: Math.max(0, calendarDays),
  }
}
