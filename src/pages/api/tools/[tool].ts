/**
 * Unified tools API for the 30 features shipped to aims-commerce.
 * Each feature exposes a small public endpoint that the /tools showcase
 * page (and the e2e specs) can hit without auth.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { computeCartTotals } from '@lib/cart-totals'
import { applyCoupon } from '@lib/coupon-engine'
import { addItem, removeItem, hasItem } from '@lib/wishlist'
import { searchProducts, facetCounts } from '@lib/product-search'
import { recommend } from '@lib/recommendations'
import { summarizeReviews, distribution } from '@lib/review-summary'
import { available, reserve, release, confirm } from '@lib/inventory'
import { canTransition, progress, isTerminal } from '@lib/order-status'
import { quote, quoteAll } from '@lib/shipping-rates'
import { convert, formatCurrency } from '@lib/fx'
import { computePayout, projectedMonthly } from '@lib/seller-payout'
import { applyBundle, nextTierSavings } from '@lib/bundle-pricing'
import { trackView, mostRecent, clearViews } from '@lib/recently-viewed'
import { classify, buildAlerts, alertSummary } from '@lib/low-stock'
import { slugify, uniquify, productSlug } from '@lib/product-slug'
import { decideRefund } from '@lib/refund-policy'
import { computeInvoiceTotals, renderInvoiceText } from '@lib/invoice'
import { redeem, topUp, isUsable } from '@lib/gift-card'
import { earnPoints, redeemPoints, tierFor, TIER_MULTIPLIER } from '@lib/loyalty'
import { validateAddress, formatAddress } from '@lib/address-validate'
import { jaccard, buildCompareRows, compareLimit } from '@lib/compare'
import { abandonedCarts, recoveryStats, nextReminderDelayHours } from '@lib/abandoned-cart'
import { buildAxes, findVariant, stockFor, priceFor } from '@lib/variants'
import { taxRateFor, computeTax } from '@lib/tax'
import { toCsv, fromCsv } from '@lib/csv'
import { computeWeeklyAnalytics } from '@lib/analytics-weekly'
import { isDropSignificant, evaluateAlerts, savings } from '@lib/price-alert'
import { estimateDelivery } from '@lib/delivery-eta'
import { scoreFraud } from '@lib/fraud-score'
import { moderate, applyModeration, pendingQueue } from '@lib/qa-moderation'

type Handler = (req: NextApiRequest) => any

const TOOL_HANDLERS: Record<string, { methods: string[]; handle: Handler; description: string }> = {
  'cart-totals': { methods: ['POST'], description: 'Compute cart subtotal/shipping/tax/total', handle: (r) => computeCartTotals(r.body?.items ? r.body : { items: r.body?.items ?? [], taxRate: r.body?.taxRate, shippingFlat: r.body?.shippingFlat }) },
  'coupon-engine': { methods: ['POST'], description: 'Apply a coupon', handle: (r) => applyCoupon(r.body?.coupon ?? { code: 'X', type: 'percentage', amount: 10 }, r.body?.ctx ?? { subtotal: 100 }) },
  'wishlist': { methods: ['POST'], description: 'Wishlist add/remove/has', handle: (r) => {
    let list = { userId: r.body?.userId ?? 'u1', items: r.body?.items ?? [] }
    if (r.body?.add) list = addItem(list, r.body.add, r.body.note)
    if (r.body?.remove) list = removeItem(list, r.body.remove)
    return { list, has: hasItem(list, r.body?.check ?? '') }
  } },
  'product-search': { methods: ['POST'], description: 'Search products with facets', handle: (r) => ({
    results: searchProducts(r.body?.products ?? [], r.body?.query ?? {}),
    facets: facetCounts(r.body?.products ?? [], r.body?.facet ?? 'category'),
  }) },
  'recommendations': { methods: ['POST'], description: 'Jaccard-based product recommendations', handle: (r) => recommend(r.body?.seed ?? { id: 'seed', name: 'S', category: 'x', tags: [], price: 10 }, r.body?.all ?? [], { limit: r.body?.limit ?? 5 }) },
  'review-summary': { methods: ['POST'], description: 'Aggregate product reviews', handle: (r) => {
    const s = summarizeReviews(r.body?.reviews ?? [])
    return { summary: s, distribution5: distribution(5, s), distribution1: distribution(1, s) }
  } },
  'inventory': { methods: ['POST'], description: 'Stock reservation + expiry', handle: (r) => {
    let state = r.body?.state ?? { productId: 'p1', onHand: r.body?.onHand ?? 10, reservations: {} }
    if (r.body?.op === 'reserve') return reserve(state, r.body.qty ?? 1, r.body.holdMs ?? 600000)
    if (r.body?.op === 'release') return { state: release(state, r.body.id) }
    if (r.body?.op === 'confirm') return confirm(state, r.body.id)
    return { available: available(state) }
  } },
  'order-status': { methods: ['POST'], description: 'Order state machine', handle: (r) => ({
    canTransition: canTransition(r.body?.from, r.body?.to),
    progress: progress(r.body?.to ?? 'created'),
    terminal: isTerminal(r.body?.to ?? 'created'),
  }) },
  'shipping-rates': { methods: ['POST'], description: 'Zone-based shipping rate calc', handle: (r) => ({
    single: quote(r.body?.pkg ?? { weightKg: 1 }, r.body?.country ?? 'US', r.body?.service ?? 'standard'),
    all: quoteAll(r.body?.pkg ?? { weightKg: 1 }, r.body?.country ?? 'US'),
  }) },
  'fx': { methods: ['POST'], description: 'Currency conversion', handle: (r) => ({
    converted: convert(r.body?.amount ?? 100, r.body?.from ?? 'USD', r.body?.to ?? 'EUR'),
    formatted: formatCurrency(r.body?.amount ?? 100, r.body?.to ?? 'USD'),
  }) },
  'seller-payout': { methods: ['POST'], description: 'Seller payout calc', handle: (r) => ({
    payout: computePayout(r.body?.lines ? r.body : { lines: r.body?.lines ?? [] }),
    monthly: projectedMonthly(r.body?.payouts ?? []),
  }) },
  'bundle-pricing': { methods: ['POST'], description: 'Bundle tier pricing', handle: (r) => ({
    breakdown: applyBundle(r.body?.unitPrice != null ? r.body : { unitPrice: 10, qty: r.body?.qty ?? 1, tiers: r.body?.tiers ?? [] }),
    nextTier: nextTierSavings(r.body?.unitPrice != null ? r.body : { unitPrice: 10, qty: r.body?.qty ?? 1, tiers: r.body?.tiers ?? [] }),
  }) },
  'recently-viewed': { methods: ['POST'], description: 'Recently viewed tracker', handle: (r) => {
    let s = { userId: r.body?.userId ?? 'u1', views: r.body?.views ?? [], maxItems: 20 }
    if (r.body?.track) s = trackView(s, r.body.track)
    if (r.body?.clear) s = clearViews(s)
    return { state: s, recent: mostRecent(s, r.body?.n ?? 5) }
  } },
  'low-stock': { methods: ['POST'], description: 'Low-stock classifier', handle: (r) => ({
    alerts: buildAlerts(r.body?.items ?? []),
    summary: alertSummary(buildAlerts(r.body?.items ?? [])),
  }) },
  'product-slug': { methods: ['POST'], description: 'Product slug generator', handle: (r) => ({
    slug: productSlug(r.body?.name ?? 'product', r.body?.taken ?? []),
    base: slugify(r.body?.base ?? ''),
    uniquified: uniquify(slugify(r.body?.base ?? ''), r.body?.taken ?? []),
  }) },
  'refund-policy': { methods: ['POST'], description: 'Refund eligibility engine', handle: (r) => decideRefund(r.body) },
  'invoice': { methods: ['POST'], description: 'Invoice totals + text', handle: (r) => {
    const input = r.body?.lines ? r.body : { invoiceNumber: 'INV-1', issuedAt: '2026-01-05', seller: { name: 'Acme' }, buyer: { name: 'Sam' }, lines: r.body?.lines ?? [], taxRate: r.body?.taxRate }
    const totals = computeInvoiceTotals(input)
    return { totals, text: renderInvoiceText(input), currency: input.currency ?? 'USD' }
  } },
  'gift-card': { methods: ['POST'], description: 'Gift card redeem/top-up', handle: (r) => {
    let c = r.body?.card
    if (!c) return { error: 'card required' }
    if (r.body?.op === 'redeem') c = redeem(c, r.body.amount)
    if (r.body?.op === 'topup') c = topUp(c, r.body.amount)
    return { card: c, usable: isUsable(c) }
  } },
  'loyalty': { methods: ['POST'], description: 'Loyalty tier points', handle: (r) => ({
    member: earnPoints(r.body?.member, r.body?.purchaseAmount ?? 0),
    tier: tierFor(r.body?.lifetimeSpend ?? 0),
    multiplier: TIER_MULTIPLIER[tierFor(r.body?.lifetimeSpend ?? 0)],
  }) },
  'address-validate': { methods: ['POST'], description: 'Address validator', handle: (r) => ({
    result: validateAddress(r.body),
    formatted: formatAddress(r.body),
  }) },
  'compare': { methods: ['POST'], description: 'Product comparison', handle: (r) => ({
    rows: buildCompareRows(r.body?.products ?? []),
    kept: compareLimit(r.body?.products ?? [], r.body?.max ?? 4),
  }) },
  'abandoned-cart': { methods: ['POST'], description: 'Abandoned cart recovery stats', handle: (r) => ({
    stats: recoveryStats(r.body?.carts ?? []),
    pending: abandonedCarts(r.body?.carts ?? [], r.body?.cutoff ?? '2026-01-01'),
    nextDelayHours: nextReminderDelayHours(r.body?.reminderCount ?? 0),
  }) },
  'variants': { methods: ['POST'], description: 'Product variant matrix', handle: (r) => ({
    axes: buildAxes(r.body?.variants ?? []),
    found: findVariant(r.body?.variants ?? [], r.body?.selected ?? {}),
    stockFor: stockFor(r.body?.variants ?? [], r.body?.selected ?? {}),
    priceFor: priceFor(r.body?.variants ?? [], r.body?.selected ?? {}, r.body?.fallback ?? 0),
  }) },
  'tax': { methods: ['POST'], description: 'Regional tax calc', handle: (r) => ({
    rule: taxRateFor(r.body?.country ?? 'US', r.body?.region),
    tax: computeTax(r.body?.subtotal ?? 0, r.body?.country ?? 'US', r.body?.region, r.body?.shipping ?? 0),
  }) },
  'csv': { methods: ['POST'], description: 'Product CSV serialize/parse', handle: (r) => {
    if (r.body?.parse) return { parsed: fromCsv(r.body.parse) }
    return { csv: toCsv(r.body?.products ?? []) }
  } },
  'analytics-weekly': { methods: ['POST'], description: 'Weekly sales analytics', handle: (r) => computeWeeklyAnalytics(r.body?.records ?? []) },
  'price-alert': { methods: ['POST'], description: 'Price drop alerts', handle: (r) => ({
    drop: r.body?.prev != null ? isDropSignificant(r.body.prev, r.body.current, r.body.minDropPct) : null,
    savings: r.body?.prev != null ? savings(r.body.prev, r.body.current) : null,
    evaluated: evaluateAlerts(r.body?.history ?? [], r.body?.alerts ?? []),
  }) },
  'delivery-eta': { methods: ['POST'], description: 'Delivery ETA estimator', handle: (r) => estimateDelivery(r.body?.orderPlacedAt ? r.body : { orderPlacedAt: r.body?.orderPlacedAt ?? '2026-01-05T10:00:00Z', businessDays: r.body?.businessDays ?? 3, cutoffHour: r.body?.cutoffHour ?? 14, skipWeekends: r.body?.skipWeekends ?? true }) },
  'fraud-score': { methods: ['POST'], description: 'Order fraud scoring', handle: (r) => scoreFraud(r.body) },
  'qa-moderation': { methods: ['POST'], description: 'Q&A moderation', handle: (r) => {
    const text = r.body?.text ?? ''
    return { verdict: moderate(text), queue: pendingQueue(r.body?.queue ?? []) }
  } },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const tool = String(req.query.tool ?? '')
  const entry = TOOL_HANDLERS[tool]
  if (!entry) {
    return res.status(404).json({ error: 'unknown_tool', tool, available: Object.keys(TOOL_HANDLERS) })
  }
  if (!entry.methods.includes(req.method ?? '')) {
    return res.status(405).json({ error: 'method_not_allowed', method: req.method, allowed: entry.methods })
  }
  try {
    const result = entry.handle(req)
    return res.status(200).json({ tool, ok: true, result })
  } catch (e) {
    return res.status(400).json({ tool, ok: false, error: e instanceof Error ? e.message : String(e) })
  }
}
