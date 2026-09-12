import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Slider,
  Typography,
} from "@mui/material";
import { rentalQuote } from "@lib/service-quotes";

/**
 * Try-before-you-buy: retail price and trial length in, rental fee
 * plus refundable deposit out.
 */
export function RentalPlanner() {
  const [retail, setRetail] = useState(800);
  const [days, setDays] = useState(7);

  const q = useMemo(() => rentalQuote(retail, days), [retail, days]);

  return (
    <Card data-testid="rental-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Try it at home</Typography>
        <Typography variant="body2" color="text.secondary">
          Live with it for a week or two. Keep it and the rental comes off the price.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Item price: <span data-testid="rental-retail-label">${retail}</span>
          </Typography>
          <Slider data-testid="rental-retail" value={retail} min={100} max={5000} step={50} onChange={(_, v) => setRetail(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Trial: <span data-testid="rental-days-label">{days} days</span>
          </Typography>
          <Slider data-testid="rental-days" value={days} min={7} max={28} step={7} onChange={(_, v) => setDays(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Alert data-testid="rental-result" severity="info" sx={{ mt: 1 }}>
          Rental: <strong>${q.rentalFee.toFixed(2)}</strong> + ${q.deposit.toFixed(2)} refundable deposit = <strong>${q.totalDue.toFixed(2)}</strong> due today.
        </Alert>
      </CardContent>
    </Card>
  );
}
