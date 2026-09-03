export interface PackageDimensions {
  weightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
}

export type ServiceLevel = 'standard' | 'expedited' | 'overnight'

export interface ShippingZone {
  id: string
  countries: string[] // ISO 3166-1 alpha-2
  baseRate: number
  perKg: number
  /** Multiplier applied to the base subtotal. */
  serviceMultiplier: Record<ServiceLevel, number>
  /** Estimated transit days per service level. */
  etaDays: Record<ServiceLevel, number>
}

export interface ShippingQuote {
  zoneId: string
  service: ServiceLevel
  rate: number
  etaDays: number
  currency: string
}

const DEFAULT_ZONES: ShippingZone[] = [
  {
    id: 'domestic',
    countries: ['US'],
    baseRate: 5,
    perKg: 1.2,
    serviceMultiplier: { standard: 1, expedited: 1.6, overnight: 3 },
    etaDays: { standard: 5, expedited: 2, overnight: 1 },
  },
  {
    id: 'north-america',
    countries: ['CA', 'MX'],
    baseRate: 8,
    perKg: 1.8,
    serviceMultiplier: { standard: 1, expedited: 1.7, overnight: 3.2 },
    etaDays: { standard: 7, expedited: 3, overnight: 2 },
  },
  {
    id: 'international',
    countries: [],
    baseRate: 15,
    perKg: 3,
    serviceMultiplier: { standard: 1, expedited: 1.8, overnight: 3.5 },
    etaDays: { standard: 14, expedited: 7, overnight: 3 },
  },
]

export function zoneForCountry(country: string, zones: ShippingZone[] = DEFAULT_ZONES): ShippingZone {
  const c = country.toUpperCase()
  for (const z of zones) {
    if (z.countries.map((x) => x.toUpperCase()).includes(c)) return z
  }
  return zones[zones.length - 1] // default = international
}

export function dimensionalWeightKg(dims: PackageDimensions, divisor = 5000): number {
  const { lengthCm, widthCm, heightCm } = dims
  if (!lengthCm || !widthCm || !heightCm) return 0
  return (lengthCm * widthCm * heightCm) / divisor
}

export function billableWeight(dims: PackageDimensions): number {
  return Math.max(dims.weightKg, dimensionalWeightKg(dims))
}

export function quote(pkg: PackageDimensions, country: string, service: ServiceLevel, zones: ShippingZone[] = DEFAULT_ZONES): ShippingQuote {
  const z = zoneForCountry(country, zones)
  const w = billableWeight(pkg)
  const rate = Math.round((z.baseRate + w * z.perKg) * z.serviceMultiplier[service] * 100) / 100
  return { zoneId: z.id, service, rate, etaDays: z.etaDays[service], currency: 'USD' }
}

export function quoteAll(pkg: PackageDimensions, country: string, zones: ShippingZone[] = DEFAULT_ZONES): ShippingQuote[] {
  return (['standard', 'expedited', 'overnight'] as ServiceLevel[]).map((s) => quote(pkg, country, s, zones))
}
