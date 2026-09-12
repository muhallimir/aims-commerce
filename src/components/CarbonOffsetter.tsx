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
import { carbonQuote, type CarbonMode } from "@lib/service-quotes";

/**
 * Carbon-neutral delivery: distance, weight and transport mode in,
 * footprint and offset price out.
 */
export function CarbonOffsetter() {
  const [distance, setDistance] = useState(10);
  const [weight, setWeight] = useState(5);
  const [mode, setMode] = useState<CarbonMode>("van");

  const q = useMemo(() => carbonQuote(distance, weight, mode), [distance, weight, mode]);

  return (
    <Card data-testid="carbon-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Deliver it carbon-neutral</Typography>
        <Typography variant="body2" color="text.secondary">
          We fund verified offsets for every gram. See the footprint first.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Distance: <span data-testid="carbon-distance-label">{distance} km</span>
            </Typography>
            <Slider data-testid="carbon-distance" value={distance} min={1} max={200} step={1} onChange={(_, v) => setDistance(v as number)} valueLabelDisplay="auto" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Weight: <span data-testid="carbon-weight-label">{weight} kg</span>
            </Typography>
            <Slider data-testid="carbon-weight" value={weight} min={1} max={50} step={1} onChange={(_, v) => setWeight(v as number)} valueLabelDisplay="auto" />
          </Box>
        </Box>
        <FormControl size="small" sx={{ mt: 1, minWidth: 160 }}>
          <InputLabel id="carbon-mode-label">Transport</InputLabel>
          <Select data-testid="carbon-mode" labelId="carbon-mode-label" label="Transport" value={mode} onChange={(e) => setMode(e.target.value as CarbonMode)}>
            <MenuItem value="bike">Bike courier</MenuItem>
            <MenuItem value="van">Delivery van</MenuItem>
            <MenuItem value="air">Air freight</MenuItem>
          </Select>
        </FormControl>
        <Alert data-testid="carbon-result" severity="success" sx={{ mt: 2 }}>
          Footprint: <strong>{q.kgCO2.toFixed(3)} kg CO2</strong> · offset for <strong>${q.offsetFee.toFixed(2)}</strong>.
        </Alert>
      </CardContent>
    </Card>
  );
}
