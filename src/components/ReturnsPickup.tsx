import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { quoteReturnsPickup } from "@lib/returns-pickup";

/**
 * Returns pickup: tell us how far the courier travels and whether the
 * item is bulky, get an instant pickup quote and schedule it.
 */
export function ReturnsPickup() {
  const [orderRef, setOrderRef] = useState("");
  const [distanceKm, setDistanceKm] = useState(5);
  const [bulky, setBulky] = useState(false);
  const [scheduled, setScheduled] = useState<string | null>(null);

  const q = useMemo(
    () => quoteReturnsPickup({ distanceKm, bulky, isMember: false }),
    [distanceKm, bulky]
  );

  function schedule() {
    const ref = `RP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setScheduled(ref);
  }

  return (
    <Card data-testid="returns-pickup" variant="outlined">
      <CardContent>
        <Typography variant="h6">Send it back, we collect</Typography>
        <Typography variant="body2" color="text.secondary">
          Book a doorstep returns pickup. Instant quote, no phone calls.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
          <TextField
            data-testid="returns-order-ref"
            inputProps={{ "data-testid": "returns-order-ref-input" }}
            size="small"
            label="Order number"
            placeholder="e.g. 64f2…"
            value={orderRef}
            onChange={(e) => {
              setOrderRef(e.target.value);
              setScheduled(null);
            }}
            fullWidth
          />
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Courier distance: <span data-testid="returns-distance-value">{distanceKm} km</span>
            </Typography>
            <Slider
              data-testid="returns-distance"
              value={distanceKm}
              min={1}
              max={50}
              step={1}
              onChange={(_, v) => {
                setDistanceKm(v as number);
                setScheduled(null);
              }}
              valueLabelDisplay="auto"
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                data-testid="returns-bulky"
                checked={bulky}
                onChange={(e) => {
                  setBulky(e.target.checked);
                  setScheduled(null);
                }}
              />
            }
            label="Bulky item (furniture, appliances)"
          />
          <Alert data-testid="returns-quote" severity={q.free ? "success" : "info"}>
            {q.free ? "Free pickup" : `Pickup fee: $${q.fee.toFixed(2)}`} · {q.courierNote}
          </Alert>
          <Button
            data-testid="returns-schedule"
            variant="contained"
            disabled={orderRef.trim().length < 4}
            onClick={schedule}
          >
            Schedule pickup
          </Button>
          {scheduled && (
            <Alert data-testid="returns-confirmation" severity="success">
              Pickup {scheduled} booked for order {orderRef.trim()}. The courier arrives in ~{q.etaDays} days.
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
