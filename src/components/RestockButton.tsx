import { useState } from "react";
import { Button } from "@mui/material";

export const RESTOCK_QTY = 10;

/**
 * One-click restock: adds a fixed batch to current stock. Proof of
 * success is the refetched count from the server, so this button
 * keeps no local confirmation state.
 */
export function RestockButton({ productId, current, onRestock }: {
  productId: string;
  current: number;
  onRestock: (productId: string, next: number) => Promise<unknown>;
}) {
  const [busy, setBusy] = useState(false);

  async function restock() {
    setBusy(true);
    try {
      await onRestock(productId, current + RESTOCK_QTY);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      data-testid={`restock-${productId}`}
      size="small"
      variant="outlined"
      disabled={busy}
      onClick={restock}
    >
      {busy ? "Restocking…" : `+${RESTOCK_QTY}`}
    </Button>
  );
}
