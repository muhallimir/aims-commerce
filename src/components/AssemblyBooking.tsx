import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
import { assemblyQuote } from "@lib/service-quotes";

const ITEMS = ["chair", "table", "wardrobe", "bed", "desk"];

/**
 * Assembly booking: furniture type and quantity in, fixed fee
 * and a booked visit out.
 */
export function AssemblyBooking() {
  const [item, setItem] = useState("wardrobe");
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");
  const [booking, setBooking] = useState<string | null>(null);

  const q = useMemo(() => assemblyQuote(item, qty), [item, qty]);

  return (
    <Card data-testid="assembly-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">We build it for you</Typography>
        <Typography variant="body2" color="text.secondary">
          Certified assemblers, fixed fee, packaging taken away.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="assembly-item-label">Furniture</InputLabel>
            <Select data-testid="assembly-item" labelId="assembly-item-label" label="Furniture" value={item} onChange={(e) => { setItem(e.target.value); setBooking(null); }}>
              {ITEMS.map((i) => (
                <MenuItem key={i} value={i} sx={{ textTransform: "capitalize" }}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            inputProps={{ "data-testid": "assembly-date" }}
            type="date"
            size="small"
            label="Visit day"
            value={date}
            onChange={(e) => { setDate(e.target.value); setBooking(null); }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quantity: <span data-testid="assembly-qty-label">{qty}</span>
          </Typography>
          <Slider data-testid="assembly-qty" value={qty} min={1} max={6} step={1} onChange={(_, v) => { setQty(v as number); setBooking(null); }} valueLabelDisplay="auto" />
        </Box>
        <Alert data-testid="assembly-result" severity="info" sx={{ mt: 1 }}>
          ~{q.minutes} min per item · fixed fee <strong>${q.fee.toFixed(2)}</strong>.
        </Alert>
        <Button data-testid="assembly-book" variant="contained" disabled={!date} onClick={() => setBooking(`AS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)} sx={{ mt: 1 }}>
          Book assembly
        </Button>
        {booking && (
          <Alert data-testid="assembly-confirmation" severity="success" sx={{ mt: 2 }}>
            Visit {booking} booked for {date}. The assembler brings tools and takes the packaging.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
