export interface LiveEta {
  revisedAt: string
  addedMinutes: number
  onTime: boolean
}

const ON_TIME_THRESHOLD_MIN = 15

export function liveEta(
  baseArrivesAt: string,
  delayMinutes: number,
  trafficFactor: number,
): LiveEta {
  const base = new Date(baseArrivesAt)
  if (Number.isNaN(base.getTime())) throw new Error("liveEta: invalid baseArrivesAt")
  if (!Number.isFinite(delayMinutes)) throw new Error("liveEta: invalid delayMinutes")
  if (!Number.isFinite(trafficFactor)) throw new Error("liveEta: invalid trafficFactor")
  const addedMinutes = Math.max(0, Math.round(delayMinutes * trafficFactor))
  const revisedAt = new Date(base.getTime() + addedMinutes * 60000).toISOString()
  return { revisedAt, addedMinutes, onTime: addedMinutes <= ON_TIME_THRESHOLD_MIN }
}
