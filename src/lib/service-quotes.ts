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
