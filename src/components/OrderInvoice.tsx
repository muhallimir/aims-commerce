import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { computeInvoiceTotals, renderInvoiceText } from "@lib/invoice";

interface Order {
  _id: string;
  totalPrice: number;
  shippingPrice: number;
  taxPrice: number;
  itemsPrice: number;
  createdAt: string;
  user: { name: string; email: string };
  orderItems: { name: string; qty: number; price: number }[];
  shippingAddress: { fullName: string; address: string; city: string; postalCode: string; country: string };
}

/**
 * Order invoices: signed-in customers pick one of their real orders
 * and get a printable invoice rendered from its line items.
 */
export function OrderInvoice() {
  const { userInfo } = useSelector(({ user }: any) => user ?? {});
  const signedIn = Boolean(userInfo?._id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    fetch("/api/orders/mine")
      .then((r) => {
        if (!r.ok) throw new Error("orders failed");
        return r.json();
      })
      .then((data: Order[]) => {
        setOrders(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      })
      .catch(() => setFailed(true));
  }, [signedIn]);

  if (!signedIn) {
    return (
      <Card data-testid="invoice-signin-prompt" variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Sign in to download invoices for your orders.
          </Typography>
          <Button data-testid="invoice-signin-link" href="/signin" variant="outlined" size="small" sx={{ mt: 1 }}>
            Sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  const order = orders.find((o) => o._id === selectedId) ?? null;
  const invoice = order
    ? renderInvoiceText({
        invoiceNumber: `INV-${order._id.slice(0, 8).toUpperCase()}`,
        issuedAt: new Date(order.createdAt).toISOString().slice(0, 10),
        seller: { name: "AIMS Commerce" },
        buyer: {
          name: order.user.name || order.shippingAddress.fullName,
          email: order.user.email,
          address: `${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}`,
        },
        lines: order.orderItems.map((i) => ({ description: i.name, qty: i.qty, unitPrice: Number(i.price) })),
        shipping: Number(order.shippingPrice),
        taxRate: 0,
      })
    : null;
  const totals = order
    ? computeInvoiceTotals({
        invoiceNumber: "x",
        issuedAt: "x",
        seller: { name: "x" },
        buyer: { name: "x" },
        lines: order.orderItems.map((i) => ({ description: i.name, qty: i.qty, unitPrice: Number(i.price) })),
        shipping: Number(order.shippingPrice),
      })
    : null;

  return (
    <Box data-testid="invoice-widget">
      {failed && <Alert severity="error">Could not load your orders.</Alert>}
      {!failed && orders.length === 0 && (
        <Alert data-testid="invoice-empty" severity="info">No orders yet. Invoices appear here after checkout.</Alert>
      )}
      {orders.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <FormControl fullWidth size="small">
              <InputLabel id="invoice-order-label">Order</InputLabel>
              <Select data-testid="invoice-order-select" labelId="invoice-order-label" label="Order" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                {orders.map((o) => (
                  <MenuItem key={o._id} value={o._id}>
                    {o._id.slice(0, 8)}… · ${Number(o.totalPrice).toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {invoice && totals && (
              <>
                <Box
                  data-testid="invoice-preview"
                  component="pre"
                  sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1, fontSize: 12, whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                >
                  {invoice}
                </Box>
                <Button data-testid="invoice-print" variant="contained" size="small" sx={{ mt: 1 }} onClick={() => window.print()}>
                  Print / save PDF
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
