import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { quoteAll, type ServiceLevel } from "@lib/shipping-rates";

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "SG", label: "Singapore" },
  { code: "DE", label: "Germany" },
];

function etaDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

/**
 * Delivery estimator: pick a destination and parcel weight, get real
 * rates and arrival dates for every service level.
 */
export function DeliveryEstimator() {
  const [country, setCountry] = useState("US");
  const [weightKg, setWeightKg] = useState(2);

  const quotes = useMemo(
    () => quoteAll({ weightKg }, country),
    [weightKg, country]
  );

  return (
    <Card data-testid="delivery-estimator" variant="outlined">
      <CardContent>
        <Typography variant="h6">How fast, and how much?</Typography>
        <Typography variant="body2" color="text.secondary">
          Estimate shipping rates and arrival dates before you check out.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="estimator-country-label">Destination</InputLabel>
            <Select
              data-testid="estimator-country"
              labelId="estimator-country-label"
              label="Destination"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <MenuItem key={c.code} value={c.code}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Parcel weight: <span data-testid="estimator-weight-value">{weightKg} kg</span>
            </Typography>
            <Slider
              data-testid="estimator-weight"
              value={weightKg}
              min={0.5}
              max={30}
              step={0.5}
              onChange={(_, v) => setWeightKg(v as number)}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Arrives</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((q: { service: ServiceLevel; rate: number; etaDays: number }) => (
              <TableRow key={q.service} data-testid={`estimator-row-${q.service}`}>
                <TableCell sx={{ textTransform: "capitalize" }}>{q.service}</TableCell>
                <TableCell align="right">${q.rate.toFixed(2)}</TableCell>
                <TableCell align="right">{etaDate(q.etaDays)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
