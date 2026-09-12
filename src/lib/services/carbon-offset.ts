export type CarbonMode = "van" | "bike" | "air"

export interface CarbonOffsetResult {
  kgCO2: number
  offsetFee: number
}

const FACTORS: Record<CarbonMode, number> = {
  van: 0.12,
  bike: 0.01,
  air: 0.55,
}

export function carbonOffset(
  distanceKm: number,
  weightKg: number,
  mode: CarbonMode,
): CarbonOffsetResult {
  const factor = FACTORS[mode] ?? FACTORS.van
  const kgCO2 = Math.round(distanceKm * weightKg * (factor / 1000) * 1000) / 1000
  const offsetFee = Math.round(kgCO2 * 1.5 * 100) / 100
  return { kgCO2, offsetFee }
}
