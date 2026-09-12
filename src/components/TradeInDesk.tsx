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
import { tradeInQuote } from "@lib/service-quotes";

const CATEGORIES = ["phone", "laptop", "tablet", "watch", "console"];
const CONDITIONS = ["mint", "good", "fair", "poor"];

/**
 * Trade-in estimator: device, condition and age in, store credit out.
 */
export function TradeInDesk() {
  const [category, setCategory] = useState("phone");
  const [condition, setCondition] = useState("good");
  const [age, setAge] = useState(1);

  const q = useMemo(() => tradeInQuote(category, condition, age), [category, condition, age]);

  return (
    <Card data-testid="tradein-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Trade it in</Typography>
        <Typography variant="body2" color="text.secondary">
          Your old device is worth store credit. Get the number upfront.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="tradein-cat-label">Device</InputLabel>
            <Select data-testid="tradein-category" labelId="tradein-cat-label" label="Device" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="tradein-cond-label">Condition</InputLabel>
            <Select data-testid="tradein-condition" labelId="tradein-cond-label" label="Condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Age: <span data-testid="tradein-age-label">{age} yrs</span>
          </Typography>
          <Slider data-testid="tradein-age" value={age} min={0} max={8} step={1} onChange={(_, v) => setAge(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Alert data-testid="tradein-result" severity="success" sx={{ mt: 1 }}>
          Credit: <strong>${q.credit.toFixed(2)}</strong> · {q.note}
        </Alert>
      </CardContent>
    </Card>
  );
}
