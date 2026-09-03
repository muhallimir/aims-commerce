export interface Address {
  line1: string
  line2?: string
  city: string
  region?: string
  postalCode: string
  country: string
}

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

const POSTAL_RE: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i,
  UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  IN: /^\d{6}$/,
}

export function validateAddress(a: Address): ValidationResult {
  const errors: string[] = []
  if (!a.line1 || a.line1.trim().length < 3) errors.push('line1 required')
  if (!a.city || a.city.trim().length < 2) errors.push('city required')
  if (!a.country || a.country.trim().length !== 2) errors.push('country must be ISO-2')
  if (!a.postalCode || a.postalCode.trim().length < 3) errors.push('postalCode required')

  if (a.country && a.postalCode) {
    const re = POSTAL_RE[a.country.toUpperCase()]
    if (re && !re.test(a.postalCode.trim())) {
      errors.push(`postalCode does not match format for ${a.country.toUpperCase()}`)
    }
  }
  return { ok: errors.length === 0, errors }
}

export function formatAddress(a: Address): string {
  return [a.line1, a.line2, [a.city, a.region, a.postalCode].filter(Boolean).join(', '), a.country]
    .filter(Boolean)
    .join('\n')
}
