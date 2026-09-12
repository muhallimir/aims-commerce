export interface AssemblyQuote {
  minutes: number
  fee: number
}

const BASE_MINUTES: Record<string, number> = {
  chair: 20,
  table: 45,
  wardrobe: 90,
  bed: 75,
  desk: 40,
}

export function assemblyQuote(itemType: string, qty: number): AssemblyQuote {
  const base = BASE_MINUTES[itemType.toLowerCase()] ?? 30
  const minutes = base
  const fee = Math.ceil(minutes / 30) * 15 * qty
  return { minutes, fee }
}
