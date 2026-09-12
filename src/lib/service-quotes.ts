export interface CoverageResult {
  served: boolean;
  etaDays: number | null;
  fee: number | null;
  zone: string;
}

interface Zone {
  id: string;
  prefixes: string[];
  etaDays: number;
  fee: number;
}

const ZONES: Zone[] = [
  { id: "metro", prefixes: ["100", "101", "102", "200", "300"], etaDays: 2, fee: 0 },
  { id: "regional", prefixes: ["400", "500", "600", "700", "800", "900"], etaDays: 4, fee: 4.99 },
];

/**
 * Postcode serviceability: metro prefixes get free 2-day delivery,
 * regional prefixes pay a surcharge, anything else is unserved.
 */
export function coverageFor(postcode: string): CoverageResult {
  const digits = postcode.replace(/\D/g, "").slice(0, 3);
  for (const z of ZONES) {
    if (z.prefixes.some((p) => digits.startsWith(p))) {
      return { served: true, etaDays: z.etaDays, fee: z.fee, zone: z.id };
    }
  }
  return { served: false, etaDays: null, fee: null, zone: "unserved" };
}

export interface InsuranceQuote {
  fee: number;
  covers: string;
}

/** Parcel protection: 1.2% of declared value plus handling extras. */
export function insuranceFee(declaredValue: number, fragile: boolean, international: boolean): InsuranceQuote {
  const raw = Math.max(0, declaredValue) * 0.012 + (fragile ? 2 : 0) + (international ? 3 : 0);
  const fee = Math.round(Math.max(1.99, raw) * 100) / 100;
  return { fee, covers: `Loss, damage and theft up to $${Math.max(0, declaredValue).toFixed(2)}` };
}
