import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const SLOTS = ["08:00 – 12:00", "12:00 – 16:00", "16:00 – 20:00"];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Slot booking: pick a delivery day and a time window, get a
 * confirmed booking reference.
 */
export function SlotBooking() {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [booking, setBooking] = useState<string | null>(null);

  function book() {
    setBooking(`DL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }

  return (
    <Card data-testid="slot-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Book your delivery window</Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a day and a 4-hour window. The courier commits to it.
        </Typography>
        <TextField
          data-testid="slot-date-wrap"
          inputProps={{ "data-testid": "slot-date" }}
          type="date"
          size="small"
          label="Delivery day"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setBooking(null);
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl sx={{ mt: 2 }}>
          <RadioGroup
            value={slot}
            onChange={(e) => {
              setSlot(e.target.value);
              setBooking(null);
            }}
          >
            {SLOTS.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio data-testid={`slot-option-${s.slice(0, 2)}`} />}
                label={s}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button
          data-testid="slot-book"
          variant="contained"
          disabled={!date}
          onClick={book}
          sx={{ mt: 1 }}
        >
          Confirm window
        </Button>
        {booking && (
          <Alert data-testid="slot-result" severity="success" sx={{ mt: 2 }}>
            Booking {booking}: {date}, {slot}. We will text you when the courier is 30 minutes out.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
