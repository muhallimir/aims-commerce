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

export interface WarrantyQuote {
  premium: number;
  perYear: string[];
}

const WARRANTY_RATES: Record<number, number> = { 1: 0.08, 2: 0.14, 3: 0.19 };

/** Extended warranty: percentage of item price by cover length. */
export function warrantyQuote(price: number, years: 1 | 2 | 3): WarrantyQuote {
  const premium = Math.round(Math.max(0, price) * WARRANTY_RATES[years] * 100) / 100;
  const perYear = [
    "Accidental damage and breakdowns",
    ...(years >= 2 ? ["Battery and wear-and-tear"] : []),
    ...(years >= 3 ? ["Free annual health check"] : []),
  ];
  return { premium, perYear };
}

export interface PriceMatchVerdict {
  approved: boolean;
  matchPrice: number | null;
  reason: string;
}

const ELIGIBLE = ["amazon", "bestbuy", "target", "walmart", "costco"];

/** Price-match desk: eligible competitor, lower price, in stock. */
export function priceMatchVerdict(ourPrice: number, competitorPrice: number, competitor: string): PriceMatchVerdict {
  const name = competitor.trim().toLowerCase();
  if (!ELIGIBLE.includes(name)) {
    return { approved: false, matchPrice: null, reason: `${competitor || "That store"} is outside our matched retailers.` };
  }
  if (!(competitorPrice > 0) || competitorPrice >= ourPrice) {
    return { approved: false, matchPrice: null, reason: "The competitor price must be lower than ours to match." };
  }
  return { approved: true, matchPrice: competitorPrice, reason: `Approved: we match ${competitor} at $${competitorPrice.toFixed(2)}.` };
}

export interface RepairQuote {
  low: number;
  high: number;
  viable: boolean;
}

const REPAIR_BASES: Record<string, [number, number]> = {
  phone: [39, 129],
  laptop: [79, 249],
  shoe: [15, 45],
  watch: [49, 199],
  bike: [25, 120],
};

/** Repair desk: category price band, unviable once the item is 8+ years old. */
export function repairQuote(category: string, ageYears: number): RepairQuote {
  const [low, high] = REPAIR_BASES[category.toLowerCase()] ?? [30, 100];
  return { low, high, viable: Math.max(0, ageYears) < 8 };
}

export interface TradeInQuote {
  credit: number;
  note: string;
}

const TRADE_BASES: Record<string, number> = { phone: 200, laptop: 350, tablet: 150, watch: 120, console: 180 };
const CONDITION_MULT: Record<string, number> = { mint: 0.9, good: 0.7, fair: 0.45, poor: 0.2 };

/** Trade-in credit: base value by condition and yearly depreciation. */
export function tradeInQuote(category: string, condition: string, ageYears: number): TradeInQuote {
  const base = TRADE_BASES[category.toLowerCase()] ?? 100;
  const mult = CONDITION_MULT[condition.toLowerCase()] ?? CONDITION_MULT.fair;
  const ageFactor = Math.max(0.2, 1 - Math.max(0, ageYears) * 0.15);
  const credit = Math.round(base * mult * ageFactor * 100) / 100;
  return { credit, note: credit >= 50 ? "Paid as store credit on your next order." : "Below the $50 minimum: recycle it free instead." };
}

export interface GiftWrapQuote {
  perItem: number;
  messageFee: number;
  total: number;
}

/** Gift wrap: per-item wrap plus a fee for long messages. */
export function giftWrapQuote(items: number, premium: boolean, message: string): GiftWrapQuote {
  const perItem = premium ? 4.99 : 2.99;
  const messageFee = message.trim().length > 140 ? 1.99 : 0;
  const total = Math.round((Math.max(0, items) * perItem + messageFee) * 100) / 100;
  return { perItem, messageFee, total };
}

export interface EngravingQuote {
  fee: number;
  ok: boolean;
  note: string;
}

const MATERIAL_FEES: Record<string, number> = { wood: 0, metal: 5, glass: 8, leather: 3 };

/** Engraving: 10 chars free, then per-character plus material setup. */
export function engravingQuote(text: string, material: string): EngravingQuote {
  const chars = text.length;
  if (chars === 0) return { fee: 0, ok: true, note: "Type something to preview the engraving." };
  if (chars > 50) return { fee: 0, ok: false, note: "Over the 50-character limit: shorten the text." };
  const fee = Math.round(((Math.max(0, chars - 10) * 0.5) + (MATERIAL_FEES[material.toLowerCase()] ?? 0)) * 100) / 100;
  return { fee, ok: true, note: chars <= 10 ? "Short and sweet: free." : `${chars - 10} paid characters plus ${material} setup.` };
}

export interface SubscriptionQuote {
  perDelivery: number;
  annualTotal: number;
  annualSavings: number;
  discountPct: number;
}

/** Subscribe-and-save: frequent plans save 5%, relaxed plans 10%. */
export function subscriptionQuote(unitPrice: number, qty: number, intervalWeeks: number): SubscriptionQuote {
  const safeWeeks = Math.max(1, intervalWeeks);
  const discountPct = safeWeeks <= 2 ? 5 : 10;
  const perDelivery = Math.round(Math.max(0, unitPrice) * Math.max(0, qty) * (1 - discountPct / 100) * 100) / 100;
  const deliveries = 52 / safeWeeks;
  const annualTotal = Math.round(perDelivery * deliveries * 100) / 100;
  const annualSavings = Math.round((Math.max(0, unitPrice) * Math.max(0, qty) * deliveries - annualTotal) * 100) / 100;
  return { perDelivery, annualTotal, annualSavings, discountPct };
}

export interface EcoPackageQuote {
  option: "compostable" | "recycled" | "reusable";
  fee: number;
  blurb: string;
}

/** Greenest viable packaging: reusable for big hauls, compostable unless fragile. */
export function ecoPackageQuote(items: number, fragile: boolean): EcoPackageQuote {
  const n = Math.max(1, items);
  if (n > 5) {
    return { option: "reusable", fee: Math.round(n * 0.4 * 100) / 100 + 2, blurb: "A reusable tote the courier takes back next time." };
  }
  if (!fragile) {
    return { option: "compostable", fee: Math.round(n * 0.4 * 100) / 100, blurb: "Compostable mailers that break down in 90 days." };
  }
  return { option: "recycled", fee: Math.round(n * 0.4 * 100) / 100, blurb: "100% recycled box with paper padding, no plastic." };
}

export type CarbonMode = "bike" | "van" | "air";

export interface CarbonQuote {
  kgCO2: number;
  offsetFee: number;
}

const CARBON_FACTORS: Record<CarbonMode, number> = { bike: 0.01, van: 0.12, air: 0.55 };

/** Carbon footprint of a delivery leg plus the offset price. */
export function carbonQuote(distanceKm: number, weightKg: number, mode: CarbonMode): CarbonQuote {
  const kgCO2 = Math.round(Math.max(0, distanceKm) * Math.max(0, weightKg) * (CARBON_FACTORS[mode] / 1000) * 1000) / 1000;
  const offsetFee = Math.round(kgCO2 * 1.5 * 100) / 100;
  return { kgCO2, offsetFee };
}

export interface AssemblyQuote {
  minutes: number;
  fee: number;
}

const ASSEMBLY_MINUTES: Record<string, number> = { chair: 20, table: 45, wardrobe: 90, bed: 75, desk: 40 };

/** Furniture assembly: half-hour blocks at $15, scaled by quantity. */
export function assemblyQuote(itemType: string, qty: number): AssemblyQuote {
  const minutes = ASSEMBLY_MINUTES[itemType.toLowerCase()] ?? 30;
  const fee = Math.ceil(minutes / 30) * 15 * Math.max(1, qty);
  return { minutes, fee };
}

export interface InstallOption {
  date: string;
  windows: string[];
}

const INSTALL_WINDOWS = ["08:00 – 12:00", "12:00 – 16:00", "16:00 – 20:00"];

/** Installation visits: next open days from the chosen lead time. */
export function installOptions(daysOut: number[]): InstallOption[] {
  const today = new Date();
  return daysOut.map((d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return { date: dt.toISOString().slice(0, 10), windows: INSTALL_WINDOWS };
  });
}

export type WhiteGloveTier = "standard" | "plus" | "premium";

export interface WhiteGloveQuote {
  tier: WhiteGloveTier;
  fee: number;
}

/** White-glove: room-of-choice delivery priced by stairs, bulk and rooms. */
export function whiteGloveQuote(floor: number, bulky: boolean, rooms: number): WhiteGloveQuote {
  const fee = 49 + Math.max(0, floor) * 10 + (bulky ? 40 : 0) + Math.max(0, rooms - 1) * 15;
  const tier: WhiteGloveTier = fee > 150 ? "premium" : fee > 90 ? "plus" : "standard";
  return { tier, fee };
}

export interface AlterationQuote {
  total: number;
  days: number;
}

const ALTERATION_PRICES: Record<string, number> = { hem: 12, taper: 18, zip: 15, resize: 25, patch: 9 };

/** Tailoring: per-job prices, two days plus a day per job. */
export function alterationQuote(jobs: string[]): AlterationQuote {
  const total = jobs.reduce((s, j) => s + (ALTERATION_PRICES[j.toLowerCase()] ?? 0), 0);
  return { total, days: 2 + jobs.length };
}

export interface RentalQuote {
  rentalFee: number;
  deposit: number;
  totalDue: number;
}

/** Try-before-you-buy: weekly rate plus a refundable deposit. */
export function rentalQuote(retail: number, days: number): RentalQuote {
  const weeks = Math.max(1, Math.ceil(Math.max(1, days) / 7));
  const rentalFee = Math.round(Math.max(0, retail) * 0.05 * weeks * 100) / 100;
  const deposit = Math.round(Math.max(0, retail) * 0.3 * 100) / 100;
  return { rentalFee, deposit, totalDue: Math.round((rentalFee + deposit) * 100) / 100 };
}

export interface BulkQuote {
  discountPct: number;
  total: number;
  tier: string;
}

/** B2B tiers: 10+ saves 5%, 20+ saves 10%, 50+ saves 15%, 100+ saves 20%. */
export function bulkQuote(unitPrice: number, qty: number): BulkQuote {
  const q = Math.max(0, Math.floor(qty));
  const discountPct = q >= 100 ? 20 : q >= 50 ? 15 : q >= 20 ? 10 : q >= 10 ? 5 : 0;
  const total = Math.round(Math.max(0, unitPrice) * q * (1 - discountPct / 100) * 100) / 100;
  const tier = discountPct === 0 ? "retail" : `bulk-${discountPct}`;
  return { discountPct, total, tier };
}
