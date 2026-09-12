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
  TextField,
  Typography,
} from "@mui/material";
import { computeTax, taxRateFor } from "@lib/tax";

const COUNTRIES = ["US", "GB", "DE", "CA", "AU", "SG"];

/**
 * Tax estimator: order value plus destination, landed total with
 * the exact rate applied.
 */
export function TaxEstimator() {
  const [subtotal, setSubtotal] = useState(100);
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("CA");

  const tax = useMemo(() => computeTax(subtotal, country, region || undefined), [subtotal, country, region]);
  const rule = useMemo(() => taxRateFor(country, region || undefined), [country, region]);

  return (
    <Card data-testid="tax-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">No checkout surprises</Typography>
        <Typography variant="body2" color="text.secondary">
          See duties and taxes for your region before you pay.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order value: <span data-testid="tax-subtotal-label">${subtotal}</span>
          </Typography>
          <Slider data-testid="tax-subtotal" value={subtotal} min={10} max={2000} step={10} onChange={(_, v) => setSubtotal(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Box sx={{ mt: 1, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="tax-country-label">Country</InputLabel>
            <Select data-testid="tax-country" labelId="tax-country-label" label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            inputProps={{ "data-testid": "tax-region" }}
            size="small"
            label="State / region (optional)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </Box>
        <Alert data-testid="tax-result" severity="info" sx={{ mt: 2 }}>
          Tax (<span data-testid="tax-rule">{rule.label ?? `${(rule.rate * 100).toFixed(2)}%`}</span>):{" "}
          <strong>${tax.toFixed(2)}</strong> · landed total <strong>${(subtotal + tax).toFixed(2)}</strong>.
        </Alert>
      </CardContent>
    </Card>
  );
}
