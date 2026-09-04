import { useState } from 'react'
import {
  Container, Typography, Card, CardContent, Stack, Button, Box, Alert,
} from '@mui/material'
import { CartTotalsPanel } from '@components/CartTotalsPanel'
import { CouponResult } from '@components/CouponResult'
import { WishlistButton } from '@components/WishlistButton'
import { FacetChips } from '@components/FacetChips'
import { RecommendationRow } from '@components/RecommendationRow'
import { ReviewSummaryCard } from '@components/ReviewSummaryCard'
import { StockBadge } from '@components/StockBadge'
import { OrderProgressBar } from '@components/OrderProgressBar'
import { ShippingOptions } from '@components/ShippingOptions'
import { PriceTag } from '@components/PriceTag'
import { PayoutCard } from '@components/PayoutCard'
import { BundlePricingHint } from '@components/BundlePricingHint'
import { RecentlyViewedStrip } from '@components/RecentlyViewedStrip'
import { StockAlertBadge } from '@components/StockAlertBadge'
import { SlugPreview } from '@components/SlugPreview'
import { RefundDialog } from '@components/RefundDialog'
import { InvoicePreview } from '@components/InvoicePreview'
import { GiftCardBadge } from '@components/GiftCardBadge'
import { LoyaltyBadge } from '@components/LoyaltyBadge'
import { AddressForm } from '@components/AddressForm'
import { CompareTable } from '@components/CompareTable'
import { RecoveryStatsCard } from '@components/RecoveryStatsCard'
import { VariantMatrix } from '@components/VariantMatrix'
import { TaxRow } from '@components/TaxRow'
import { CsvPreview } from '@components/CsvPreview'
import { WeeklyAnalyticsCard } from '@components/WeeklyAnalyticsCard'
import { PriceDropCard } from '@components/PriceDropCard'
import { DeliveryEtaCard } from '@components/DeliveryEtaCard'
import { FraudBadge } from '@components/FraudBadge'
import { ModerationQueue } from '@components/ModerationQueue'

interface FeatureDef {
  id: string
  title: string
  endpoint: string
  description: string
  body?: any
}

const FEATURES: FeatureDef[] = [
  { id: 'cart-totals', title: 'Cart totals', endpoint: '/api/tools/cart-totals', description: 'Subtotal + shipping + tax', body: { items: [{ productId: 'p1', price: 25, qty: 2 }], taxRate: 0.08, shippingFlat: 5, freeShippingThreshold: 50 } },
  { id: 'coupon-engine', title: 'Coupon engine', endpoint: '/api/tools/coupon-engine', description: 'Apply coupon codes', body: { coupon: { code: 'WELCOME10', type: 'percentage', amount: 10, expiresAt: '2099-01-01' }, ctx: { subtotal: 100 } } },
  { id: 'wishlist', title: 'Wishlist', endpoint: '/api/tools/wishlist', description: 'Add/remove/check', body: { userId: 'u1', items: [{ productId: 'p1', addedAt: '2026-01-01' }], add: 'p2' } },
  { id: 'product-search', title: 'Product search', endpoint: '/api/tools/product-search', description: 'Search + facets', body: { products: [{ id: 'p1', name: 'Sneaker', price: 50, category: 'shoes', tags: ['red'] }, { id: 'p2', name: 'Hat', price: 20, category: 'hats', tags: [] }], query: { text: 'sneaker' } } },
  { id: 'recommendations', title: 'Recommendations', endpoint: '/api/tools/recommendations', description: 'Jaccard similarity', body: { seed: { id: 's', name: 'Sneaker', category: 'shoes', tags: ['red', 'leather'], price: 50 }, all: [{ id: 'a', name: 'Boot', category: 'shoes', tags: ['leather'], price: 80 }, { id: 'b', name: 'Cap', category: 'hats', tags: [], price: 15 }] } },
  { id: 'review-summary', title: 'Review summary', endpoint: '/api/tools/review-summary', description: 'Aggregate ratings', body: { reviews: [{ productId: 'p1', rating: 5, verified: true, createdAt: '2026-01-01' }, { productId: 'p1', rating: 4, verified: true, createdAt: '2026-01-02' }, { productId: 'p1', rating: 3, verified: false, createdAt: '2026-01-03' }] } },
  { id: 'inventory', title: 'Inventory', endpoint: '/api/tools/inventory', description: 'Stock reservation', body: { op: 'reserve', onHand: 10, qty: 3, holdMs: 600000 } },
  { id: 'order-status', title: 'Order status', endpoint: '/api/tools/order-status', description: 'Order state machine', body: { from: 'processing', to: 'shipped' } },
  { id: 'shipping-rates', title: 'Shipping rates', endpoint: '/api/tools/shipping-rates', description: 'Zone-based rates', body: { pkg: { weightKg: 2, lengthCm: 30, widthCm: 20, heightCm: 10 }, country: 'US' } },
  { id: 'fx', title: 'FX', endpoint: '/api/tools/fx', description: 'Currency conversion', body: { amount: 100, from: 'USD', to: 'EUR' } },
  { id: 'seller-payout', title: 'Seller payout', endpoint: '/api/tools/seller-payout', description: 'Payout calc', body: { lines: [{ orderId: 'o1', gross: 1000 }], refunds: [{ orderId: 'o1', amount: 50 }] } },
  { id: 'bundle-pricing', title: 'Bundle pricing', endpoint: '/api/tools/bundle-pricing', description: 'Tier discounts', body: { unitPrice: 10, qty: 3, tiers: [{ minQty: 2, discount: 0.1 }, { minQty: 5, discount: 0.2 }] } },
  { id: 'recently-viewed', title: 'Recently viewed', endpoint: '/api/tools/recently-viewed', description: 'Browsing history', body: { userId: 'u1', views: [{ productId: 'p1', viewedAt: '2026-01-05T10:00:00Z' }], track: 'p2' } },
  { id: 'low-stock', title: 'Low stock', endpoint: '/api/tools/low-stock', description: 'Stock alert classifier', body: { items: [{ productId: 'p1', name: 'A', available: 0, threshold: 5 }, { productId: 'p2', name: 'B', available: 2, threshold: 5 }, { productId: 'p3', name: 'C', available: 20, threshold: 5 }] } },
  { id: 'product-slug', title: 'Product slug', endpoint: '/api/tools/product-slug', description: 'Generate URL slug', body: { name: 'Red Sneaker', taken: ['red-sneaker'] } },
  { id: 'refund-policy', title: 'Refund policy', endpoint: '/api/tools/refund-policy', description: 'Eligibility engine', body: { orderDeliveredAt: '2026-01-01T00:00:00Z', itemCondition: 'sealed', hasReceipt: true, category: 'standard' } },
  { id: 'invoice', title: 'Invoice', endpoint: '/api/tools/invoice', description: 'Generate invoice', body: { invoiceNumber: 'INV-1', issuedAt: '2026-01-05', seller: { name: 'Acme' }, buyer: { name: 'Sam' }, lines: [{ description: 'Widget', qty: 2, unitPrice: 10 }], taxRate: 0.08 } },
  { id: 'gift-card', title: 'Gift card', endpoint: '/api/tools/gift-card', description: 'Balance + redeem', body: { card: { code: 'G1', initialBalance: 100, balance: 100, currency: 'USD', active: true, transactions: [] }, op: 'redeem', amount: 25 } },
  { id: 'loyalty', title: 'Loyalty', endpoint: '/api/tools/loyalty', description: 'Tier points', body: { member: { userId: 'u1', points: 0, lifetimeSpend: 0, tier: 'bronze' }, purchaseAmount: 250 } },
  { id: 'address-validate', title: 'Address validate', endpoint: '/api/tools/address-validate', description: 'Postal regex', body: { line1: '1 Main St', city: 'NYC', postalCode: '10001', country: 'US' } },
  { id: 'compare', title: 'Product compare', endpoint: '/api/tools/compare', description: 'Side-by-side', body: { products: [{ id: 'a', name: 'A', price: 100, rating: 4, inStock: true }, { id: 'b', name: 'B', price: 80, rating: 3.5, inStock: false }] } },
  { id: 'abandoned-cart', title: 'Abandoned cart', endpoint: '/api/tools/abandoned-cart', description: 'Recovery stats', body: { carts: [{ id: 'c1', userId: 'u1', items: [{ productId: 'p1', name: 'X', price: 50, qty: 1 }], totalValue: 50, lastActivityAt: '2025-01-01', reminderCount: 0, recovered: false }, { id: 'c2', userId: 'u2', items: [], totalValue: 0, lastActivityAt: '2025-01-01', reminderCount: 0, recovered: true }] } },
  { id: 'variants', title: 'Variants', endpoint: '/api/tools/variants', description: 'Variant matrix', body: { variants: [{ id: 'v1', options: { size: 'S', color: 'red' }, price: 10, stock: 5 }, { id: 'v2', options: { size: 'M', color: 'red' }, price: 10, stock: 0 }], selected: { size: 'S', color: 'red' } } },
  { id: 'tax', title: 'Tax', endpoint: '/api/tools/tax', description: 'Regional tax', body: { subtotal: 100, country: 'US', region: 'CA', shipping: 10 } },
  { id: 'csv', title: 'CSV', endpoint: '/api/tools/csv', description: 'CSV serialize/parse', body: { products: [{ id: '1', name: 'A, with comma', price: 10, category: 'x', stock: 1 }] } },
  { id: 'analytics-weekly', title: 'Weekly analytics', endpoint: '/api/tools/analytics-weekly', description: 'Sales rollup', body: { records: [{ date: '2026-01-05', orderId: 'o1', productId: 'p1', qty: 2, revenue: 50 }] } },
  { id: 'price-alert', title: 'Price alert', endpoint: '/api/tools/price-alert', description: 'Drop detection', body: { prev: 100, current: 80, history: [{ productId: 'p1', price: 100, at: '2026-01-01' }], alerts: [{ productId: 'p1', userId: 'u1', threshold: 90, triggered: false }] } },
  { id: 'delivery-eta', title: 'Delivery ETA', endpoint: '/api/tools/delivery-eta', description: 'Estimate arrival', body: { orderPlacedAt: '2026-01-05T10:00:00Z', businessDays: 3, cutoffHour: 14, skipWeekends: true } },
  { id: 'fraud-score', title: 'Fraud score', endpoint: '/api/tools/fraud-score', description: 'Risk scoring', body: { emailAgeDays: 1, accountAgeDays: 1, addressMismatch: 1, orderTotal: 1500, recentOrderCount: 6, hasPriorCompletedOrder: false } },
  { id: 'qa-moderation', title: 'Q&A moderation', endpoint: '/api/tools/qa-moderation', description: 'Banned-word check', body: { text: 'Is this real leather?' } },
]

export default function ToolsPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  async function run(f: FeatureDef) {
    setLoading((s) => ({ ...s, [f.id]: true }))
    try {
      const r = await fetch(f.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f.body ?? {}) })
      const json = await r.json()
      setResults((s) => ({ ...s, [f.id]: { status: r.status, body: json } }))
    } catch (e) {
      setResults((s) => ({ ...s, [f.id]: { error: e instanceof Error ? e.message : String(e) } }))
    } finally {
      setLoading((s) => ({ ...s, [f.id]: false }))
    }
  }

  return (
    <Container data-testid="tools-page" maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>aims-commerce · tools showcase</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        30 features shipped behind one public route. Click <em>Run</em> on any card to hit the live API and render the real component.
      </Typography>
      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {FEATURES.map((f) => (
          <Card key={f.id} data-testid={`card-${f.id}`} variant="outlined" sx={{ p: 1.5 }}>
            <CardContent>
              <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography variant="h6">{f.title}</Typography>
                <Typography variant="caption" color="text.secondary" fontFamily="monospace">{f.endpoint}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{f.description}</Typography>
              <Button data-testid={`run-${f.id}`} onClick={() => run(f)} disabled={loading[f.id]} size="small" variant="contained" sx={{ mt: 1 }}>
                {loading[f.id] ? 'Running…' : 'Run'}
              </Button>
              {results[f.id] && (
                <Box data-testid={`result-${f.id}`} sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: 12 }}>
                  <Typography variant="caption" color="text.secondary">HTTP {results[f.id].status ?? '—'}</Typography>
                  <pre data-testid={`payload-${f.id}`} style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11 }}>{JSON.stringify(results[f.id].body ?? results[f.id], null, 2)}</pre>
                </Box>
              )}
              <RenderPreview id={f.id} result={results[f.id]} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

function RenderPreview({ id, result }: { id: string; result?: any }) {
  if (!result?.body?.result) return null
  const r = result.body.result
  try {
    switch (id) {
      case 'cart-totals':
        return <Box sx={{ mt: 1 }}><CartTotalsPanel subtotal={r.subtotal} shipping={r.shipping} tax={r.tax} total={r.total} itemCount={r.itemCount} /></Box>
      case 'coupon-engine':
        return typeof r.discount === 'number' && typeof r.newSubtotal === 'number' ? (
          <Box sx={{ mt: 1 }}><CouponResult ok={r.ok} reason={r.reason} discount={r.discount} newSubtotal={r.newSubtotal} /></Box>
        ) : null
      case 'wishlist':
        return <Box sx={{ mt: 1 }}><WishlistButton inList={r.list?.items?.length > 0} onClick={() => {}} /></Box>
      case 'product-search':
        return r.facets?.length > 0 ? <Box sx={{ mt: 1 }}><FacetChips facets={r.facets} /></Box> : null
      case 'recommendations':
        return Array.isArray(r) ? <Box sx={{ mt: 1 }}><RecommendationRow items={r.slice(0, 3).map((x: any) => ({ product: x.product, score: x.score }))} /></Box> : null
      case 'review-summary':
        return <Box sx={{ mt: 1 }}><ReviewSummaryCard summary={r.summary} /></Box>
      case 'inventory':
        return r.available != null ? <Box sx={{ mt: 1 }}><StockBadge available={r.available} /></Box> : null
      case 'order-status':
        return <Box sx={{ mt: 1 }}><OrderProgressBar status={r.terminal ? 'delivered' : 'processing'} /></Box>
      case 'shipping-rates':
        return r.all ? <Box sx={{ mt: 1 }}><ShippingOptions options={r.all} /></Box> : null
      case 'fx':
        return <Box sx={{ mt: 1 }}><PriceTag amount={r.converted} currency={result?.body?.result?.formatted ? 'EUR' : 'USD'} /></Box>
      case 'seller-payout':
        return r.payout ? <Box sx={{ mt: 1 }}><PayoutCard payout={r.payout} /></Box> : null
      case 'bundle-pricing':
        return r.breakdown?.appliedTier ? <Box sx={{ mt: 1 }}><BundlePricingHint message={`Save $${r.breakdown.discount.toFixed(2)}`} targetQty={r.breakdown.qty} /></Box> : null
      case 'recently-viewed':
        return r.recent ? <Box sx={{ mt: 1 }}><RecentlyViewedStrip views={r.recent} products={r.recent.map((v: any) => ({ id: v.productId, name: `Product ${v.productId}` }))} /></Box> : null
      case 'low-stock':
        return Array.isArray(r.alerts) ? <Stack direction="row" spacing={1} sx={{ mt: 1 }}>{r.alerts.slice(0, 3).map((a: any) => <StockAlertBadge key={a.productId} severity={a.severity} available={a.available} />)}</Stack> : null
      case 'product-slug':
        return r.slug ? <Box sx={{ mt: 1 }}><SlugPreview source="Product Name" slug={r.slug} /></Box> : null
      case 'refund-policy':
        return <Box sx={{ mt: 1 }}><RefundDialog decision={r} /></Box>
      case 'invoice':
        return <Box sx={{ mt: 1 }}><InvoicePreview text={r.text} total={r.totals.total} currency={r.currency} /></Box>
      case 'gift-card':
        return r.card ? <Box sx={{ mt: 1 }}><GiftCardBadge balance={r.card.balance} currency={r.card.currency} active={r.card.active} /></Box> : null
      case 'loyalty':
        return r.member ? <Box sx={{ mt: 1 }}><LoyaltyBadge points={r.member.points} tier={r.member.tier} /></Box> : null
      case 'address-validate':
        return <Box sx={{ mt: 1 }}><AddressForm address={result?.body?.result?.formatted ? { line1: '1 Main St', city: 'NYC', postalCode: '10001', country: 'US' } : { line1: '', city: '', postalCode: '', country: '' }} valid={r.result?.ok} errors={r.result?.errors ?? []} /></Box>
      case 'compare':
        return Array.isArray(r.kept) ? <Box sx={{ mt: 1 }}><CompareTable products={r.kept} /></Box> : null
      case 'abandoned-cart':
        return r.stats ? <Box sx={{ mt: 1 }}><RecoveryStatsCard stats={r.stats} /></Box> : null
      case 'variants':
        return Array.isArray(result.body?.result?.found) ? <Box sx={{ mt: 1 }}><VariantMatrix variants={[]} /></Box> : null
      case 'tax':
        return <Box sx={{ mt: 1 }}><TaxRow subtotal={result.body?.result?.tax ? 100 : 100} country="US" region="CA" /></Box>
      case 'csv':
        return r.csv ? <Box sx={{ mt: 1 }}><CsvPreview csv={r.csv} /></Box> : null
      case 'analytics-weekly':
        return <Box sx={{ mt: 1 }}><WeeklyAnalyticsCard analytics={r} /></Box>
      case 'price-alert':
        return r.drop ? <Box sx={{ mt: 1 }}><PriceDropCard productId="p1" previous={100} current={80} currency="USD" /></Box> : null
      case 'delivery-eta':
        return <Box sx={{ mt: 1 }}><DeliveryEtaCard arrivesAt={r.arrivesAt} calendarDays={r.calendarDays} businessDays={r.businessDays} /></Box>
      case 'fraud-score':
        return <Box sx={{ mt: 1 }}><FraudBadge score={r.score} level={r.level} flags={r.flags} /></Box>
      case 'qa-moderation':
        return <Box sx={{ mt: 1 }}><ModerationQueue questions={[]} /></Box>
      default:
        return null
    }
  } catch (e) {
    return <Alert severity="error" sx={{ mt: 1 }}>Render error: {e instanceof Error ? e.message : String(e)}</Alert>
  }
}
