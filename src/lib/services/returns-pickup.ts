export interface ReturnsPickup {
  fee: number
  free: boolean
  etaDays: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function returnsPickupFee(
  distanceKm: number,
  bulky: boolean,
  memberTier: string,
): ReturnsPickup {
  const tier = memberTier.toLowerCase()
  const free = tier === "gold" || tier === "platinum" || (distanceKm < 3 && !bulky)
  const fee = free ? 0 : round2(4.99 + distanceKm * 1.2 + (bulky ? 10 : 0))
  let etaDays = distanceKm > 20 ? 5 : distanceKm > 10 ? 4 : 2
  if (bulky) etaDays += 1
  return { fee, free, etaDays }
}
