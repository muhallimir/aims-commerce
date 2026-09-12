import { useEffect, useMemo, useState } from 'react'
import {
  Container, Typography, Card, CardContent, Stack, Button, Box, Alert,
  TextField, Slider, Chip,
} from '@mui/material'
import { TrackingTimeline } from '@components/services/TrackingTimeline'
import { TrackingRoute } from '@components/services/TrackingRoute'
import { LiveEta } from '@components/services/LiveEta'
import { Checkpoints } from '@components/services/Checkpoints'
import { DeliveryProof } from '@components/services/DeliveryProof'
import { ExceptionBadge } from '@components/services/ExceptionBadge'
import { NotifyPlan } from '@components/services/NotifyPlan'
import { SignatureRule } from '@components/services/SignatureRule'
import { PickupPoints } from '@components/services/PickupPoints'
import { DeliverySlots } from '@components/services/DeliverySlots'
import { GiftWrap } from '@components/services/GiftWrap'
import { AssemblyQuote } from '@components/services/AssemblyQuote'
import { InstallWindow } from '@components/services/InstallWindow'
import { RecyclingCredit } from '@components/services/RecyclingCredit'
import { WarrantyQuote } from '@components/services/WarrantyQuote'
import { ShippingInsurance } from '@components/services/ShippingInsurance'
import { ReturnsPickup } from '@components/services/ReturnsPickup'
import { AlterationQuote } from '@components/services/AlterationQuote'
import { EngravingQuote } from '@components/services/EngravingQuote'
import { SubscriptionSaver } from '@components/services/SubscriptionSaver'
import { BulkQuote } from '@components/services/BulkQuote'
import { WhiteGlove } from '@components/services/WhiteGlove'
import { CarbonOffset } from '@components/services/CarbonOffset'
import { EcoPackaging } from '@components/services/EcoPackaging'
import { ConciergeMatch } from '@components/services/ConciergeMatch'
import { RepairEstimate } from '@components/services/RepairEstimate'
import { RentalQuote } from '@components/services/RentalQuote'
import { TradeIn } from '@components/services/TradeIn'
import { PriceMatch } from '@components/services/PriceMatch'
import { ServiceCoverage } from '@components/services/ServiceCoverage'
import { buildTimeline } from '@lib/services/tracking-timeline'

interface FeatureDef {
  id: string
  title: string
  endpoint: string
  description: string
  body?: any
}

const FEATURES: FeatureDef[] = [
  { id: 'tracking-timeline', title: 'Tracking timeline', endpoint: '/api/services/tracking-timeline', description: 'Animated order status steps', body: { current: 'shipped' } },
  { id: 'tracking-route', title: 'Live route map', endpoint: '/api/services/tracking-route', description: 'Courier position on OSM route (free tiles)', body: { t: 0.5 } },
  { id: 'tracking-eta-live', title: 'Live ETA', endpoint: '/api/services/tracking-eta-live', description: 'Delay + traffic adjusted arrival', body: { baseArrivesAt: '2026-02-01T10:00:00Z', delayMinutes: 10, trafficFactor: 1.2 } },
  { id: 'tracking-checkpoints', title: 'Checkpoints', endpoint: '/api/services/tracking-checkpoints', description: 'History + next predicted stop', body: { history: [{ code: 'label', at: '2026-01-01' }], plan: ['label', 'packed', 'shipped', 'delivered'] } },
  { id: 'tracking-proof', title: 'Delivery proof', endpoint: '/api/services/tracking-proof', description: 'Photo / signature / PIN check', body: { signature: true, required: ['signature'] } },
  { id: 'tracking-exceptions', title: 'Exceptions', endpoint: '/api/services/tracking-exceptions', description: 'Weather / customs / address classifier', body: { note: 'held at customs clearance' } },
  { id: 'tracking-notify', title: 'Notify plan', endpoint: '/api/services/tracking-notify', description: 'Channels + cadence per status', body: { status: 'shipped' } },
  { id: 'tracking-signature', title: 'Signature rules', endpoint: '/api/services/tracking-signature', description: 'When signature is required', body: { orderTotal: 600, category: 'electronics' } },
  { id: 'pickup-points', title: 'Pickup points', endpoint: '/api/services/pickup-points', description: 'Nearest hubs by haversine km', body: {} },
  { id: 'delivery-slots', title: 'Delivery slots', endpoint: '/api/services/delivery-slots', description: 'Slot capacity + booking', body: {} },
  { id: 'gift-wrap', title: 'Gift wrap', endpoint: '/api/services/gift-wrap', description: 'Wrap pricing + message', body: { items: 2, premium: true, message: 'Happy birthday!' } },
  { id: 'assembly', title: 'Assembly', endpoint: '/api/services/assembly', description: 'Furniture assembly quote', body: { itemType: 'wardrobe', qty: 1 } },
  { id: 'installation', title: 'Installation', endpoint: '/api/services/installation', description: 'Appliance install windows', body: { postcode: '10001', daysOut: [1, 2] } },
  { id: 'recycling', title: 'Recycling', endpoint: '/api/services/recycling', description: 'Old-item credit + free pickup', body: { category: 'fridge', condition: 'good' } },
  { id: 'warranty', title: 'Warranty', endpoint: '/api/services/warranty', description: 'Extended coverage pricing', body: { price: 500, years: 2 } },
  { id: 'shipping-insurance', title: 'Insurance', endpoint: '/api/services/shipping-insurance', description: 'Parcel cover quote', body: { declaredValue: 200, fragile: true, international: false } },
  { id: 'returns-pickup', title: 'Returns pickup', endpoint: '/api/services/returns-pickup', description: 'Doorstep return scheduling', body: { distanceKm: 5, bulky: false, memberTier: 'silver' } },
  { id: 'alteration', title: 'Alterations', endpoint: '/api/services/alteration', description: 'Clothing fix pricing', body: { garment: 'pants', jobs: ['hem', 'taper'] } },
  { id: 'engraving', title: 'Engraving', endpoint: '/api/services/engraving', description: 'Personalization pricing', body: { chars: 20, material: 'metal' } },
  { id: 'subscription-saver', title: 'Subscriptions', endpoint: '/api/services/subscription-saver', description: 'Subscribe-and-save planner', body: { unitPrice: 20, qtyPerDelivery: 2, intervalWeeks: 4 } },
  { id: 'bulk-quote', title: 'Bulk quote', endpoint: '/api/services/bulk-quote', description: 'B2B tier discounts', body: { unitPrice: 10, qty: 25 } },
  { id: 'white-glove', title: 'White glove', endpoint: '/api/services/white-glove', description: 'Premium room-of-choice delivery', body: { floor: 2, bulky: true, rooms: 2 } },
  { id: 'carbon-offset', title: 'Carbon offset', endpoint: '/api/services/carbon-offset', description: 'Green delivery calculator', body: { distanceKm: 10, weightKg: 5, mode: 'van' } },
  { id: 'eco-packaging', title: 'Eco packaging', endpoint: '/api/services/eco-packaging', description: 'Compostable / recycled / reusable', body: { items: 6, fragile: false } },
  { id: 'concierge-match', title: 'Concierge', endpoint: '/api/services/concierge-match', description: 'Personal shopper matcher', body: { budget: 300, style: ['modern'] } },
  { id: 'repair-estimate', title: 'Repairs', endpoint: '/api/services/repair-estimate', description: 'Fix-it estimate + viability', body: { category: 'phone', issue: 'screen', ageYears: 2 } },
  { id: 'rental-price', title: 'Rentals', endpoint: '/api/services/rental-price', description: 'Try-before-buy pricing', body: { retail: 200, days: 7, depositPct: 0.3 } },
  { id: 'trade-in', title: 'Trade-in', endpoint: '/api/services/trade-in', description: 'Old-device credit', body: { category: 'phone', condition: 'good', ageYears: 1 } },
  { id: 'price-match', title: 'Price match', endpoint: '/api/services/price-match', description: 'Competitor match validator', body: { ourPrice: 100, competitorPrice: 90, competitor: 'amazon', inStock: true } },
  { id: 'service-coverage', title: 'Coverage', endpoint: '/api/services/service-coverage', description: 'Postcode serviceability', body: { postcode: '10001' } },
]

const DEMO_PATH = 'M 20 180 C 90 120, 150 200, 220 140 S 340 60, 460 120'

function TrackingHero() {
  const [t, setT] = useState(0.35)
  const [orderId, setOrderId] = useState('AIMS-10482')
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setT((v) => (v >= 1 ? 0 : Math.round((v + 0.02) * 100) / 100)), 300)
    return () => clearInterval(id)
  }, [playing])
  const timeline = useMemo(() => buildTimeline(t > 0.85 ? 'delivered' : t > 0.6 ? 'shipped' : t > 0.3 ? 'processing' : 'paid'), [t])
  return (
    <Card data-testid="tracking-hero" variant="outlined" sx={{ mb: 3, overflow: 'hidden' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={800}>Track {orderId}</Typography>
            <Typography variant="body2" color="text.secondary">Live courier position, animated route, free OpenStreetMap tiles. No API key needed.</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
              <TextField data-testid="hero-order-input" size="small" label="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              <Button data-testid="hero-play-toggle" size="small" variant="outlined" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</Button>
              <Chip data-testid="hero-pct" label={`${Math.round(t * 100)}% en route`} color="primary" size="small" />
            </Stack>
            <Slider data-testid="hero-slider" value={t} min={0} max={1} step={0.01} onChange={(_, v) => setT(v as number)} sx={{ mt: 2 }} />
            <Box sx={{ mt: 1 }}><TrackingTimeline steps={timeline.steps} percent={timeline.percent} /></Box>
          </Box>
          <Box flex={1} data-testid="hero-map">
            <svg viewBox="0 0 480 220" width="100%" height="220" role="img" aria-label="delivery route map">
              <rect x="0" y="0" width="480" height="220" rx="12" fill="#eef4ea" />
              {[20, 60, 100, 140, 180].map((y) => (
                <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="#d7e3d3" strokeWidth="1" />
              ))}
              <path d={DEMO_PATH} fill="none" stroke="#9db89a" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8">
                <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.2s" repeatCount="indefinite" />
              </path>
              <circle cx="20" cy="180" r="8" fill="#2e7d32" />
              <circle cx="460" cy="120" r="8" fill="#1565c0" />
              <circle r="9" fill="#ff6f00">
                <animateMotion dur="12s" repeatCount="indefinite" path={DEMO_PATH} />
              </circle>
            </svg>
            <Typography variant="caption" color="text.secondary">
              Map tiles: (c) OpenStreetMap contributors, free tile.openstreetmap.org, no key required. Animated SVG route overlays the courier.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function ServicesPage() {
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
    <Container data-testid="services-page" maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>aims-commerce · services</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        30 service features: animated order tracking plus the services menu. Click Run on any card to hit the live API.
      </Typography>
      <TrackingHero />
      <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {FEATURES.map((f) => (
          <Card key={f.id} data-testid={`card-${f.id}`} variant="outlined" sx={{ p: 1.5 }}>
            <CardContent>
              <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                <Typography variant="h6">{f.title}</Typography>
                <Typography variant="caption" color="text.secondary" fontFamily="monospace">{f.endpoint}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{f.description}</Typography>
              <Button data-testid={`run-${f.id}`} onClick={() => run(f)} disabled={loading[f.id]} size="small" variant="contained" sx={{ mt: 1 }}>
                {loading[f.id] ? 'Running...' : 'Run'}
              </Button>
              {results[f.id] && (
                <Box data-testid={`result-${f.id}`} sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1, fontSize: 12 }}>
                  <Typography variant="caption" color="text.secondary">HTTP {results[f.id].status ?? '-'}</Typography>
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
      case 'tracking-timeline': return <Box sx={{ mt: 1 }}><TrackingTimeline steps={r.steps} percent={r.percent} /></Box>
      case 'tracking-route': return <Box sx={{ mt: 1 }}><TrackingRoute lat={r.position.lat} lng={r.position.lng} segmentIndex={r.position.segmentIndex} percent={r.progress} /></Box>
      case 'tracking-eta-live': return <Box sx={{ mt: 1 }}><LiveEta revisedAt={r.revisedAt} addedMinutes={r.addedMinutes} onTime={r.onTime} /></Box>
      case 'tracking-checkpoints': return <Box sx={{ mt: 1 }}><Checkpoints next={r.next} done={r.done} remaining={r.remaining} /></Box>
      case 'tracking-proof': return <Box sx={{ mt: 1 }}><DeliveryProof ok={r.ok} missing={r.missing} /></Box>
      case 'tracking-exceptions': return <Box sx={{ mt: 1 }}><ExceptionBadge type={r.type} confidence={r.confidence} /></Box>
      case 'tracking-notify': return <Box sx={{ mt: 1 }}><NotifyPlan channels={r.channels} cadenceMinutes={r.cadenceMinutes} template={r.template} /></Box>
      case 'tracking-signature': return <Box sx={{ mt: 1 }}><SignatureRule required={r.required} reason={r.reason} /></Box>
      case 'pickup-points': return <Box sx={{ mt: 1 }}><PickupPoints points={(Array.isArray(r) ? r : []).slice(0, 3).map((p: any) => ({ id: p.id, name: p.name, distanceKm: p.distanceKm, etaMin: p.etaMin }))} /></Box>
      case 'delivery-slots': return <Box sx={{ mt: 1 }}><DeliverySlots slots={r.available ?? []} /></Box>
      case 'gift-wrap': return <Box sx={{ mt: 1 }}><GiftWrap {...r} /></Box>
      case 'assembly': return <Box sx={{ mt: 1 }}><AssemblyQuote {...r} /></Box>
      case 'installation': return <Box sx={{ mt: 1 }}><InstallWindow {...r} /></Box>
      case 'recycling': return <Box sx={{ mt: 1 }}><RecyclingCredit {...r} /></Box>
      case 'warranty': return <Box sx={{ mt: 1 }}><WarrantyQuote {...r} /></Box>
      case 'shipping-insurance': return <Box sx={{ mt: 1 }}><ShippingInsurance {...r} /></Box>
      case 'returns-pickup': return <Box sx={{ mt: 1 }}><ReturnsPickup {...r} /></Box>
      case 'alteration': return <Box sx={{ mt: 1 }}><AlterationQuote {...r} /></Box>
      case 'engraving': return <Box sx={{ mt: 1 }}><EngravingQuote {...r} /></Box>
      case 'subscription-saver': return <Box sx={{ mt: 1 }}><SubscriptionSaver {...r} /></Box>
      case 'bulk-quote': return <Box sx={{ mt: 1 }}><BulkQuote {...r} /></Box>
      case 'white-glove': return <Box sx={{ mt: 1 }}><WhiteGlove {...r} /></Box>
      case 'carbon-offset': return <Box sx={{ mt: 1 }}><CarbonOffset {...r} /></Box>
      case 'eco-packaging': return <Box sx={{ mt: 1 }}><EcoPackaging {...r} /></Box>
      case 'concierge-match': return <Box sx={{ mt: 1 }}><ConciergeMatch matches={Array.isArray(r) ? r : []} /></Box>
      case 'repair-estimate': return <Box sx={{ mt: 1 }}><RepairEstimate {...r} /></Box>
      case 'rental-price': return <Box sx={{ mt: 1 }}><RentalQuote {...r} /></Box>
      case 'trade-in': return <Box sx={{ mt: 1 }}><TradeIn {...r} /></Box>
      case 'price-match': return <Box sx={{ mt: 1 }}><PriceMatch {...r} /></Box>
      case 'service-coverage': return <Box sx={{ mt: 1 }}><ServiceCoverage {...r} /></Box>
      default: return null
    }
  } catch (e) {
    return <Alert severity="error" sx={{ mt: 1 }}>Render error: {e instanceof Error ? e.message : String(e)}</Alert>
  }
}
