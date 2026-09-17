import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { geocodeAddress } from "@lib/geocode";
import { apiFetch } from "@lib/authFetch";
import useThemeMode from "src/hooks/useThemeMode";

function MapLoading() {
  const { isDarkMode } = useThemeMode();
  return <Box data-testid="tracking-map-loading" color={isDarkMode ? "common.white" : "text.primary"}>Loading map…</Box>;
}

const TrackingMap = dynamic(
  () => import("@components/TrackingMap").then((m) => m.TrackingMap),
  { ssr: false, loading: () => <MapLoading /> }
);

const WAREHOUSE = { lat: 1.3521, lng: 103.8198, label: "AIMS warehouse, Singapore" };

interface Order {
  _id: string;
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  totalPrice: number;
  createdAt: string;
  orderItems: { name: string; qty: number; price: number }[];
  shippingAddress: { fullName: string; address: string; city: string; postalCode: string; country: string };
}

type TrackStatus = "placed" | "paid" | "delivered";

function statusOf(o: Order): TrackStatus {
  if (o.isDelivered) return "delivered";
  if (o.isPaid) return "paid";
  return "placed";
}

const STATUS_META: Record<TrackStatus, { label: string; percent: number }> = {
  placed: { label: "Order placed", percent: 15 },
  paid: { label: "Paid, on its way", percent: 55 },
  delivered: { label: "Delivered", percent: 100 },
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

/**
 * Real order tracking: the signed-in customer's own orders from
 * /api/orders/mine, status derived from payment/delivery flags,
 * destination geocoded from the shipping address on a live OSM map.
 */
export function OrderTracker() {
  const { userInfo } = useSelector(({ user }: any) => user ?? {});
  const { isDarkMode } = useThemeMode();
  const router = useRouter();
  const deepLink = typeof router.query.order === "string" ? router.query.order : "";
  const signedIn = Boolean(userInfo?._id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dest, setDest] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [geoNote, setGeoNote] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    setLoading(true);
    apiFetch("/api/orders/mine")
      .then(async (r) => {
        if (!r.ok) throw new Error(`Orders request failed (${r.status})`);
        return r.json();
      })
      .then((data: Order[]) => {
        setOrders(data);
        const match = deepLink ? data.find((o) => o._id === deepLink) : null;
        setSelectedId(match?._id ?? data[0]?._id ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [signedIn]);

  const order = useMemo(() => orders.find((o) => o._id === selectedId) ?? null, [orders, selectedId]);

  useEffect(() => {
    if (deepLink && orders.some((o) => o._id === deepLink)) setSelectedId(deepLink);
  }, [deepLink, orders]);

  useEffect(() => {
    setDest(null);
    setGeoNote("");
    if (!order) return;
    const q = [order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(", ");
    let cancelled = false;
    geocodeAddress(q).then((g) => {
      if (cancelled) return;
      if (g) setDest(g);
      else setGeoNote("Precise destination unavailable, showing warehouse and route progress.");
    });
    return () => {
      cancelled = true;
    };
  }, [order]);

  if (!signedIn) {
    return (
      <Card data-testid="tracker-signin-prompt" variant="outlined">
        <CardContent>
          <Typography variant="h6">Track your parcels</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to see your orders live on the map, with status and delivery progress.
          </Typography>
          <Button data-testid="tracker-signin-link" href="/signin" variant="contained" sx={{ mt: 2 }}>
            Sign in to track
          </Button>
        </CardContent>
      </Card>
    );
  }

  const meta = order ? STATUS_META[statusOf(order)] : null;

  return (
    <Box data-testid="order-tracker">
      {loading && <LinearProgress data-testid="tracker-loading" sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && orders.length === 0 && (
        <Alert data-testid="tracker-empty" severity="info">
          No orders yet. Your parcels will show up here once you check out.
        </Alert>
      )}
      {orders.length > 0 && (
        <Stack spacing={2}>
          <FormControl
            fullWidth
            size="small"
            sx={
              isDarkMode
                ? {
                    "& .MuiInputLabel-root": { color: "common.white" },
                    "& .MuiOutlinedInput-root": {
                      color: "common.white",
                      "& fieldset": { borderColor: "grey.500" },
                    },
                    "& .MuiSvgIcon-root": { color: "common.white" },
                  }
                : {}
            }
          >
            <InputLabel id="tracker-order-label">Your orders</InputLabel>
            <Select
              data-testid="tracker-order-select"
              labelId="tracker-order-label"
              label="Your orders"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {orders.map((o) => (
                <MenuItem key={o._id} value={o._id}>
                  {o._id.slice(0, 8)}… · {o.orderItems.length} item(s) · ${Number(o.totalPrice).toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {order && meta && (
            <Card data-testid="tracker-detail" variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography variant="h6">Order {order._id.slice(0, 8)}…</Typography>
                  <Chip data-testid="tracker-status" label={meta.label} color={statusOf(order) === "delivered" ? "success" : "primary"} />
                </Stack>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress data-testid="tracker-progress" variant="determinate" value={meta.percent} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Stack direction="row" spacing={3} sx={{ mt: 1.5 }} flexWrap="wrap">
                  <Typography variant="body2" color="text.secondary">Placed: {fmtDate(order.createdAt)}</Typography>
                  <Typography variant="body2" color="text.secondary">Paid: {fmtDate(order.paidAt)}</Typography>
                  <Typography variant="body2" color="text.secondary">Delivered: {fmtDate(order.deliveredAt)}</Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {order.orderItems.map((i) => `${i.qty} × ${i.name}`).join(", ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To: {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.postalCode}
                </Typography>
                <Box data-testid="tracker-map" sx={{ mt: 2 }}>
                  <TrackingMap origin={WAREHOUSE} destination={dest} progress={meta.percent / 100} />
                  {geoNote && <Typography data-testid="tracker-geo-note" variant="caption" color="text.secondary">{geoNote}</Typography>}
                  {dest && <Typography variant="caption" color="text.secondary">Destination: {dest.label}</Typography>}
                </Box>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </Box>
  );
}
