export type WhiteGloveTier = "standard" | "plus" | "premium"

export interface WhiteGloveResult {
  tier: WhiteGloveTier
  fee: number
}

export function whiteGloveFee(floor: number, bulky: boolean, rooms: number): WhiteGloveResult {
  const fee = 49 + floor * 10 + (bulky ? 40 : 0) + Math.max(0, rooms - 1) * 15
  const tier: WhiteGloveTier = fee > 150 ? "premium" : fee > 90 ? "plus" : "standard"
  return { tier, fee }
}
