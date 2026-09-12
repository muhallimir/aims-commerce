export interface CoverageZone {
  prefix: string
  etaDays: number
  fee: number
}

export interface CoverageCheckResult {
  served: boolean
  etaDays: number | null
  fee: number | null
}

export function coverageCheck(postcode: string, zones: CoverageZone[]): CoverageCheckResult {
  const key = postcode.trim().slice(0, 3).toLowerCase()
  const zone = zones.find((z) => {
    const p = z.prefix.trim().toLowerCase()
    return key === p || key.startsWith(p) || p.startsWith(key)
  })
  if (!zone) {
    return { served: false, etaDays: null, fee: null }
  }
  return { served: true, etaDays: zone.etaDays, fee: zone.fee }
}
