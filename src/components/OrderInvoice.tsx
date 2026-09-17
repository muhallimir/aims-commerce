import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { InvoiceDoc } from "@lib/invoice";
import { InvoiceDocument } from "@components/InvoiceDocument";
import { apiFetch } from "@lib/authFetch";

interface OrderChoice {
  _id: string;
  totalPrice: number;
  invoiceNumber?: string | null;
}

/**
 * Order invoices: signed-in customers pick one of their real orders
 * and get a professional invoice built from stored charged totals,
 * printable in isolation or downloadable as a document.
 */
export function OrderInvoice() {
  const { userInfo } = useSelector(({ user }: any) => user ?? {});
  const signedIn = Boolean(userInfo?._id);
  const [orders, setOrders] = useState<OrderChoice[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [doc, setDoc] = useState<InvoiceDoc | null>(null);
  const [failed, setFailed] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    apiFetch("/api/orders/mine")
      .then((r) => {
        if (!r.ok) throw new Error("orders failed");
        return r.json();
      })
      .then((data: OrderChoice[]) => {
        setOrders(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      })
      .catch(() => setFailed(true));
  }, [signedIn]);

  useEffect(() => {
    if (!signedIn || !selectedId) {
      setDoc(null);
      return;
    }
    apiFetch(`/api/orders/${selectedId}/invoice`)
      .then((r) => {
        if (!r.ok) throw new Error("invoice failed");
        return r.json();
      })
      .then((data: { doc: InvoiceDoc }) => setDoc(data.doc))
      .catch(() => setDoc(null));
  }, [signedIn, selectedId]);

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
                    {o.invoiceNumber ?? `${o._id.slice(0, 8)}…`} · ${Number(o.totalPrice).toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {doc && <InvoiceDocument doc={doc} />}
            {doc && (
              <>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button data-testid="invoice-print" variant="contained" size="small" onClick={() => setPrintOpen(true)}>
                    Print / save PDF
                  </Button>
                  <Button
                    data-testid="invoice-download"
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(`/api/orders/${selectedId}/invoice?format=pdf`, "_blank", "noopener")}
                  >
                    Download PDF
                  </Button>
                </Stack>
                <Dialog data-testid="invoice-print-dialog" open={printOpen} onClose={() => setPrintOpen(false)} maxWidth="md" fullWidth>
                  <DialogContent>
                    <InvoiceDocument doc={doc} printArea testId="invoice-print-preview" />
                  </DialogContent>
                  <DialogActions>
                    <Button data-testid="invoice-print-close" onClick={() => setPrintOpen(false)}>
                      Close
                    </Button>
                    <Button data-testid="invoice-print-now" variant="contained" onClick={() => window.print()}>
                      Print
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
