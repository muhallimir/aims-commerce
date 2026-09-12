/**
 * Unified services API for the 30 features shipped under /services.
 * Public, auth-free. Each service is a pure lib in src/lib/services/*.
 * Free-map note: tracking-route uses OSM tile URLs client-side only;
 * no server key is required, so no new env vars were added.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { buildTimeline } from '@lib/services/tracking-timeline'
import { interpolateRoute, routeProgress } from '@lib/services/tracking-route'
import { liveEta } from '@lib/services/tracking-eta-live'
import { nextCheckpoint } from '@lib/services/tracking-checkpoints'
import { validateProof } from '@lib/services/tracking-proof'
import { classifyException } from '@lib/services/tracking-exceptions'
import { notificationPlan } from '@lib/services/tracking-notify'
import { signatureRule } from '@lib/services/tracking-signature'
import { rankPickups } from '@lib/services/pickup-points'
import { availableSlots, bookSlot } from '@lib/services/delivery-slots'
import { giftWrapQuote } from '@lib/services/gift-wrap'
import { assemblyQuote } from '@lib/services/assembly'
import { installWindow } from '@lib/services/installation'
import { recyclingCredit } from '@lib/services/recycling'
import { warrantyQuote } from '@lib/services/warranty'
import { insuranceQuote } from '@lib/services/shipping-insurance'
import { returnsPickupFee } from '@lib/services/returns-pickup'
import { alterationQuote } from '@lib/services/alteration'
import { engravingQuote } from '@lib/services/engraving'
import { subscriptionPlan } from '@lib/services/subscription-saver'
import { bulkQuote } from '@lib/services/bulk-quote'
import { whiteGloveFee } from '@lib/services/white-glove'
import { carbonOffset } from '@lib/services/carbon-offset'
import { ecoPackage } from '@lib/services/eco-packaging'
import { matchConcierge } from '@lib/services/concierge-match'
import { repairEstimate } from '@lib/services/repair-estimate'
import { rentalQuote } from '@lib/services/rental-price'
import { tradeInCredit } from '@lib/services/trade-in'
import { priceMatch } from '@lib/services/price-match'
import { coverageCheck } from '@lib/services/service-coverage'

type Handler = (req: NextApiRequest) => any

const DEMO_ROUTE = [
  { lat: 1.3521, lng: 103.8198 },
  { lat: 1.3621, lng: 103.8298 },
  { lat: 1.3721, lng: 103.8398 },
]
const DEMO_PICKUPS = [
  { id: 'pp1', name: 'Hub Central', lat: 1.3531, lng: 103.8208, hours: '9-21' },
  { id: 'pp2', name: 'Hub North', lat: 1.3721, lng: 103.8398, hours: '10-20' },
]

const SERVICE_HANDLERS: Record<string, { methods: string[]; handle: Handler; description: string }> = {
  'tracking-timeline': { methods: ['POST'], description: 'Order status timeline steps', handle: (r) => buildTimeline(r.body?.current ?? 'shipped') },
  'tracking-route': { methods: ['POST'], description: 'Animated courier position on route', handle: (r) => {
    const points = r.body?.points ?? DEMO_ROUTE
    const t = typeof r.body?.t === 'number' ? r.body.t : 0.5
    return { position: interpolateRoute(points, t), progress: routeProgress(points, t), tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }
  } },
  'tracking-eta-live': { methods: ['POST'], description: 'Live ETA with delay + traffic', handle: (r) => liveEta(r.body?.baseArrivesAt ?? '2026-02-01T10:00:00Z', r.body?.delayMinutes ?? 10, r.body?.trafficFactor ?? 1.2) },
  'tracking-checkpoints': { methods: ['POST'], description: 'Checkpoint history + next', handle: (r) => nextCheckpoint(r.body?.history ?? [], r.body?.plan ?? ['label', 'packed', 'shipped', 'delivered']) },
  'tracking-proof': { methods: ['POST'], description: 'Delivery proof validation', handle: (r) => validateProof({ photoUrl: r.body?.photoUrl, signature: r.body?.signature, pin: r.body?.pin, required: r.body?.required ?? [] }) },
  'tracking-exceptions': { methods: ['POST'], description: 'Delivery exception classifier', handle: (r) => classifyException(r.body?.note ?? 'delayed due to weather') },
  'tracking-notify': { methods: ['POST'], description: 'Tracking notification plan', handle: (r) => notificationPlan(r.body?.status ?? 'shipped') },
  'tracking-signature': { methods: ['POST'], description: 'Signature requirement rules', handle: (r) => signatureRule(r.body?.orderTotal ?? 100, r.body?.category ?? 'apparel') },
  'pickup-points': { methods: ['POST'], description: 'Nearest pickup point ranker (haversine)', handle: (r) => rankPickups(r.body?.user ?? { lat: 1.3521, lng: 103.8198 }, r.body?.points ?? DEMO_PICKUPS) },
  'delivery-slots': { methods: ['POST'], description: 'Delivery slot availability + booking', handle: (r) => {
    const capacity = r.body?.capacity ?? [{ slot: '08-12', cap: 10, booked: 3 }, { slot: '12-16', cap: 10, booked: 10 }]
    if (r.body?.book) return { booked: bookSlot(capacity, r.body.book), available: availableSlots(capacity) }
    return { available: availableSlots(capacity) }
  } },
  'gift-wrap': { methods: ['POST'], description: 'Gift wrap pricing', handle: (r) => giftWrapQuote(r.body?.items ?? 2, r.body?.premium ?? false, r.body?.message) },
  'assembly': { methods: ['POST'], description: 'Furniture assembly quote', handle: (r) => assemblyQuote(r.body?.itemType ?? 'chair', r.body?.qty ?? 1) },
  'installation': { methods: ['POST'], description: 'Appliance install scheduling', handle: (r) => installWindow(r.body?.postcode ?? '10001', r.body?.daysOut ?? [1, 2, 3]) },
  'recycling': { methods: ['POST'], description: 'Old-item recycling credit', handle: (r) => recyclingCredit(r.body?.category ?? 'sofa', r.body?.condition ?? 'good') },
  'warranty': { methods: ['POST'], description: 'Extended warranty pricing', handle: (r) => warrantyQuote(r.body?.price ?? 500, r.body?.years ?? 2) },
  'shipping-insurance': { methods: ['POST'], description: 'Shipping insurance quote', handle: (r) => insuranceQuote(r.body?.declaredValue ?? 200, r.body?.fragile ?? false, r.body?.international ?? false) },
  'returns-pickup': { methods: ['POST'], description: 'Returns doorstep pickup', handle: (r) => returnsPickupFee(r.body?.distanceKm ?? 5, r.body?.bulky ?? false, r.body?.memberTier ?? 'silver') },
  'alteration': { methods: ['POST'], description: 'Clothing alteration quote', handle: (r) => alterationQuote(r.body?.garment ?? 'pants', r.body?.jobs ?? ['hem']) },
  'engraving': { methods: ['POST'], description: 'Personalization pricing', handle: (r) => engravingQuote(r.body?.chars ?? 8, r.body?.material ?? 'wood') },
  'subscription-saver': { methods: ['POST'], description: 'Subscribe-and-save planner', handle: (r) => subscriptionPlan(r.body?.unitPrice ?? 20, r.body?.qtyPerDelivery ?? 2, r.body?.intervalWeeks ?? 4) },
  'bulk-quote': { methods: ['POST'], description: 'B2B bulk discount', handle: (r) => bulkQuote(r.body?.unitPrice ?? 10, r.body?.qty ?? 25) },
  'white-glove': { methods: ['POST'], description: 'White-glove delivery tiers', handle: (r) => whiteGloveFee(r.body?.floor ?? 1, r.body?.bulky ?? false, r.body?.rooms ?? 1) },
  'carbon-offset': { methods: ['POST'], description: 'Carbon offset calculator', handle: (r) => carbonOffset(r.body?.distanceKm ?? 10, r.body?.weightKg ?? 5, r.body?.mode ?? 'van') },
  'eco-packaging': { methods: ['POST'], description: 'Eco packaging picker', handle: (r) => ecoPackage(r.body?.items ?? 3, r.body?.fragile ?? false) },
  'concierge-match': { methods: ['POST'], description: 'Personal shopper matcher', handle: (r) => matchConcierge(r.body?.budget ?? 300, r.body?.style ?? ['modern'], r.body?.stylists ?? [{ id: 'c1', name: 'Ava', styles: ['modern'], minBudget: 100 }]) },
  'repair-estimate': { methods: ['POST'], description: 'Repair service estimator', handle: (r) => repairEstimate(r.body?.category ?? 'phone', r.body?.issue ?? 'screen', r.body?.ageYears ?? 2) },
  'rental-price': { methods: ['POST'], description: 'Try-before-buy rental pricing', handle: (r) => rentalQuote(r.body?.retail ?? 200, r.body?.days ?? 7, r.body?.depositPct ?? 0.3) },
  'trade-in': { methods: ['POST'], description: 'Trade-in credit estimator', handle: (r) => tradeInCredit(r.body?.category ?? 'phone', r.body?.condition ?? 'good', r.body?.ageYears ?? 1) },
  'price-match': { methods: ['POST'], description: 'Price-match validator', handle: (r) => priceMatch(r.body?.ourPrice ?? 100, r.body?.competitorPrice ?? 90, r.body?.competitor ?? 'amazon', r.body?.inStock ?? true) },
  'service-coverage': { methods: ['POST'], description: 'Serviceability by postcode', handle: (r) => coverageCheck(r.body?.postcode ?? '10001', r.body?.zones ?? [{ prefix: '100', etaDays: 2, fee: 0 }]) },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const service = String(req.query.service ?? '')
  const entry = SERVICE_HANDLERS[service]
  if (!entry) {
    return res.status(404).json({ error: 'unknown_service', service, available: Object.keys(SERVICE_HANDLERS) })
  }
  if (!entry.methods.includes(req.method ?? '')) {
    return res.status(405).json({ error: 'method_not_allowed', method: req.method, allowed: entry.methods })
  }
  try {
    const result = entry.handle(req)
    return res.status(200).json({ service, ok: true, result })
  } catch (e) {
    return res.status(400).json({ service, ok: false, error: e instanceof Error ? e.message : String(e) })
  }
}
