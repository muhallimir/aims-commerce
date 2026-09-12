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
import { repairQuote } from "@lib/service-quotes";

const CATEGORIES = ["phone", "laptop", "shoe", "watch", "bike"];

/**
 * Repair desk: what broke and how old it is, honest price band
 * plus whether the fix is worth it.
 */
export function RepairDesk() {
  const [category, setCategory] = useState("phone");
  const [age, setAge] = useState(2);

  const q = useMemo(() => repairQuote(category, age), [category, age]);

  return (
    <Card data-testid="repair-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Fix it, don&apos;t bin it</Typography>
        <Typography variant="body2" color="text.secondary">
          Certified repairs with an upfront price band.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="repair-cat-label">Device</InputLabel>
            <Select
              data-testid="repair-category"
              labelId="repair-cat-label"
              label="Device"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Age: <span data-testid="repair-age-label">{age} yrs</span>
            </Typography>
            <Slider
              data-testid="repair-age"
              value={age}
              min={0}
              max={12}
              step={1}
              onChange={(_, v) => setAge(v as number)}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
        <Alert data-testid="repair-result" severity={q.viable ? "info" : "warning"} sx={{ mt: 1 }}>
          Estimate: <strong>${q.low} – ${q.high}</strong> ·{" "}
          {q.viable ? "worth repairing." : "beyond economical repair, consider trade-in below."}
        </Alert>
      </CardContent>
    </Card>
  );
}
