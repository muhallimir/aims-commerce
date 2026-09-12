export interface ProofInput {
  photoUrl?: string
  signature?: boolean
  pin?: string
  required: string[]
}

export interface ProofResult {
  ok: boolean
  missing: string[]
}

export function validateProof(input: ProofInput): ProofResult {
  const missing: string[] = []
  for (const item of input.required) {
    if (item === "photo") {
      if (!input.photoUrl) missing.push(item)
    } else if (item === "signature") {
      if (input.signature !== true) missing.push(item)
    } else if (item === "pin") {
      if (!input.pin) missing.push(item)
    } else {
      missing.push(item)
    }
  }
  return { ok: missing.length === 0, missing }
}
