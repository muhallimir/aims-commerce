import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
} from "@mui/material";
import { insuranceFee } from "@lib/service-quotes";

/**
 * Shipping insurance: declared value plus handling options,
 * instant protection quote with plain-language cover note.
 */
export function InsuranceCalculator() {
  const [value, setValue] = useState(250);
  const [fragile, setFragile] = useState(false);
  const [international, setInternational] = useState(false);

  const q = useMemo(
    () => insuranceFee(value, fragile, international),
    [value, fragile, international]
  );

  return (
    <Card data-testid="insurance-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Protect your parcel</Typography>
        <Typography variant="body2" color="text.secondary">
          Full cover against loss, damage and theft, from $1.99.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Declared value: <span data-testid="insurance-value-label">${value}</span>
          </Typography>
          <Slider
            data-testid="insurance-value"
            value={value}
            min={10}
            max={5000}
            step={10}
            onChange={(_, v) => setValue(v as number)}
            valueLabelDisplay="auto"
          />
        </Box>
        <FormControlLabel
          control={<Checkbox data-testid="insurance-fragile" checked={fragile} onChange={(e) => setFragile(e.target.checked)} />}
          label="Fragile contents (+$2.00)"
        />
        <FormControlLabel
          control={<Checkbox data-testid="insurance-intl" checked={international} onChange={(e) => setInternational(e.target.checked)} />}
          label="International route (+$3.00)"
        />
        <Alert data-testid="insurance-result" severity="info" sx={{ mt: 1 }}>
          Protection: <strong>${q.fee.toFixed(2)}</strong> · {q.covers}.
        </Alert>
      </CardContent>
    </Card>
  );
}
