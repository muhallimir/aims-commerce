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
import { ecoPackageQuote } from "@lib/service-quotes";

/**
 * Eco packaging picker: order size and fragility in, the greenest
 * viable packaging out.
 */
export function EcoPackagingPicker() {
  const [items, setItems] = useState(3);
  const [fragile, setFragile] = useState(false);

  const q = useMemo(() => ecoPackageQuote(items, fragile), [items, fragile]);

  return (
    <Card data-testid="eco-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Ship it green</Typography>
        <Typography variant="body2" color="text.secondary">
          We pick the greenest packaging your order allows.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Items: <span data-testid="eco-items-label">{items}</span>
          </Typography>
          <Slider data-testid="eco-items" value={items} min={1} max={12} step={1} onChange={(_, v) => setItems(v as number)} valueLabelDisplay="auto" />
        </Box>
        <FormControlLabel
          control={<Checkbox data-testid="eco-fragile" checked={fragile} onChange={(e) => setFragile(e.target.checked)} />}
          label="Contains fragile items"
        />
        <Alert data-testid="eco-result" severity="success" sx={{ mt: 1 }}>
          <span data-testid="eco-option" style={{ textTransform: "capitalize" }}>{q.option}</span> packaging · ${q.fee.toFixed(2)} · {q.blurb}
        </Alert>
      </CardContent>
    </Card>
  );
}
