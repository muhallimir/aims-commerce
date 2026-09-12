export interface EngravingQuote {
  fee: number
  ok: boolean
  note: string
}

const MATERIAL_FEE: Record<string, number> = {
  wood: 0,
  metal: 5,
  glass: 8,
  leather: 3,
}

export function engravingQuote(chars: number, material: string): EngravingQuote {
  const ok = chars <= 50
  if (chars <= 10) {
    return {
      fee: 0,
      ok,
      note: ok ? "First 10 characters free" : "Exceeds 50 character limit",
    }
  }
  const materialFee = MATERIAL_FEE[material.toLowerCase()] ?? 0
  const fee = Math.round(((chars - 10) * 0.5 + materialFee) * 100) / 100
  return {
    fee,
    ok,
    note: ok ? "Engraving available" : "Exceeds 50 character limit",
  }
}
