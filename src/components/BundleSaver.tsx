import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Slider,
  Typography,
} from "@mui/material";
import { applyBundle, nextTierSavings } from "@lib/bundle-pricing";

const TIERS = [
  { minQty: 2, discount: 0.1 },
  { minQty: 5, discount: 0.2 },
];

/**
 * Bundle saver: slide quantity on a $10 staple, watch tiers unlock
 * and the nudge toward the next saving.
 */
export function BundleSaver() {
  const [qty, setQty] = useState(3);

  const deal = useMemo(() => applyBundle({ unitPrice: 10, qty, tiers: TIERS }), [qty]);
  const next = useMemo(() => nextTierSavings({ unitPrice: 10, qty, tiers: TIERS }), [qty]);

  return (
    <Card data-testid="bundle-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Stock up and save</Typography>
        <Typography variant="body2" color="text.secondary">
          Everyday staple at $10 a unit. More in the box, less on the bill.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quantity: <span data-testid="bundle-qty-label">{qty}</span>
          </Typography>
          <Slider data-testid="bundle-qty" value={qty} min={1} max={8} step={1} onChange={(_, v) => setQty(v as number)} valueLabelDisplay="auto" />
        </Box>
        <LinearProgress data-testid="bundle-progress" variant="determinate" value={Math.min(100, (qty / 5) * 100)} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
        <Alert data-testid="bundle-result" severity="success" sx={{ mt: 2 }}>
          Line total: <strong>${deal.lineTotal.toFixed(2)}</strong>
          {deal.discount > 0 ? ` · you save $${deal.discount.toFixed(2)}.` : " · no tier yet."}
        </Alert>
        {next && (
          <Typography data-testid="bundle-next" variant="body2" color="primary.main" sx={{ mt: 1 }}>
            Add {next.qty - qty} more to unlock ${next.savings.toFixed(2)} total savings.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
