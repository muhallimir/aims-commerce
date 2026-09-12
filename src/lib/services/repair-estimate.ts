export interface RepairEstimateResult {
  low: number
  high: number
  viable: boolean
}

const BASE_RANGES: Record<string, [number, number]> = {
  phone: [39, 129],
  laptop: [79, 249],
  shoe: [15, 45],
  watch: [49, 199],
  bike: [25, 120],
}

export function repairEstimate(
  category: string,
  issue: string,
  ageYears: number,
): RepairEstimateResult {
  void issue
  const [low, high] = BASE_RANGES[category.toLowerCase()] ?? [30, 100]
  const viable = ageYears < 8
  return { low, high, viable }
}
