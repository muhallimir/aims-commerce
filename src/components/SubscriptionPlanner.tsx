import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { subscriptionQuote } from "@lib/service-quotes";

/**
 * Subscribe-and-save planner: quantity and rhythm in, per-delivery
 * price and yearly savings out.
 */
export function SubscriptionPlanner() {
  const [qty, setQty] = useState(2);
  const [weeks, setWeeks] = useState(4);

  const q = useMemo(() => subscriptionQuote(20, qty, weeks), [qty, weeks]);

  return (
    <Card data-testid="subscription-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Never run out</Typography>
        <Typography variant="body2" color="text.secondary">
          Essentials on repeat at $20 a unit. Pause or cancel anytime.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Units per delivery: <span data-testid="subscription-qty-label">{qty}</span>
          </Typography>
          <Slider data-testid="subscription-qty" value={qty} min={1} max={12} step={1} onChange={(_, v) => setQty(v as number)} valueLabelDisplay="auto" />
        </Box>
        <FormControl size="small" sx={{ mt: 1, minWidth: 180 }}>
          <InputLabel id="subscription-weeks-label">Every</InputLabel>
          <Select data-testid="subscription-weeks" labelId="subscription-weeks-label" label="Every" value={weeks} onChange={(e) => setWeeks(e.target.value as number)}>
            <MenuItem value={1}>1 week (−5%)</MenuItem>
            <MenuItem value={2}>2 weeks (−5%)</MenuItem>
            <MenuItem value={4}>4 weeks (−10%)</MenuItem>
            <MenuItem value={8}>8 weeks (−10%)</MenuItem>
          </Select>
        </FormControl>
        <Alert data-testid="subscription-result" severity="success" sx={{ mt: 2 }}>
          <strong>${q.perDelivery.toFixed(2)}</strong> per delivery · save <strong>${q.annualSavings.toFixed(2)}</strong> a year.
        </Alert>
      </CardContent>
    </Card>
  );
}
