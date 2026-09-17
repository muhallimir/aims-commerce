import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

export interface SlipOrder {
  _id: string;
  orderItems: { name: string; qty: number; price: number }[];
  totalPrice: number;
  shippingAddress: { fullName?: string; address?: string; city?: string; postalCode?: string; country?: string };
}

export function slipLines(o: SlipOrder): string[] {
  return o.orderItems.map((i) => `${i.qty} × ${i.name} — $${(Number(i.price) * i.qty).toFixed(2)}`);
}

/** Packing slip: printable pick-pack sheet per order. */
export function PackingSlip({ order }: { order: SlipOrder }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button data-testid={`packing-open-${order._id}`} size="small" onClick={() => setOpen(true)}>
        Packing slip
      </Button>
      <Dialog data-testid="packing-dialog" open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Pack #{order._id.slice(-8)}</DialogTitle>
        <DialogContent>
          <Box data-testid="packing-body" data-print-area>
            {slipLines(order).map((l) => (
              <Typography key={l} variant="body2">{l}</Typography>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" fontWeight={700}>Total: ${Number(order.totalPrice).toFixed(2)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button data-testid="packing-print" variant="contained" onClick={() => window.print()}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
