import { Alert, Typography } from "@mui/material";
import { computePayout } from "@lib/seller-payout";

export interface PayoutOrder {
  _id: string;
  totalPrice: number;
}

/**
 * Payout preview: net payout across the visible orders after the
 * 10% marketplace fee.
 */
export function PayoutPreview({ orders }: { orders: PayoutOrder[] }) {
  if (orders.length === 0) return null;
  const p = computePayout({ lines: orders.map((o) => ({ orderId: o._id, gross: Number(o.totalPrice) || 0 })) });
  return (
    <Alert data-testid="payout-preview" severity="success" sx={{ mb: 2 }}>
      <Typography variant="body2">
        Payout preview: <strong data-testid="payout-net">${p.net.toFixed(2)}</strong> net from $
        {p.gross.toFixed(2)} gross across {orders.length} order(s) after {(p.feeRate * 100).toFixed(0)}% fees.
      </Typography>
    </Alert>
  );
}
