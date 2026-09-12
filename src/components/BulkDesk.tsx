import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { bulkQuote } from "@lib/service-quotes";

const TIERS = [
  { min: 10, pct: 5 },
  { min: 20, pct: 10 },
  { min: 50, pct: 15 },
  { min: 100, pct: 20 },
];

/**
 * Bulk desk: quantity slider against the tier table, live total
 * with the unlocked discount highlighted.
 */
export function BulkDesk() {
  const [qty, setQty] = useState(25);

  const q = useMemo(() => bulkQuote(10, qty), [qty]);

  return (
    <Card data-testid="bulk-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Buying for the team?</Typography>
        <Typography variant="body2" color="text.secondary">
          Volume pricing at $10 a unit. Discounts unlock automatically.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quantity: <span data-testid="bulk-qty-label">{qty}</span>
          </Typography>
          <Slider data-testid="bulk-qty" value={qty} min={1} max={150} step={1} onChange={(_, v) => setQty(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Table size="small">
          <TableBody>
            {TIERS.map((t) => (
              <TableRow key={t.min} selected={q.discountPct === t.pct} data-testid={`bulk-tier-${t.min}`}>
                <TableCell>{t.min}+ units</TableCell>
                <TableCell align="right">−{t.pct}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Alert data-testid="bulk-result" severity={q.discountPct > 0 ? "success" : "info"} sx={{ mt: 1 }}>
          {q.discountPct > 0 ? (
            <>{q.discountPct}% off applied · total <strong>${q.total.toFixed(2)}</strong>.</>
          ) : (
            <>No discount yet · total <strong>${q.total.toFixed(2)}</strong>. Reach 10 units for 5% off.</>
          )}
        </Alert>
      </CardContent>
    </Card>
  );
}
