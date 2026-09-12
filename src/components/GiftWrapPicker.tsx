import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { giftWrapQuote } from "@lib/service-quotes";

/**
 * Gift wrap: items, premium paper, a message with a live counter,
 * honest total before checkout.
 */
export function GiftWrapPicker() {
  const [items, setItems] = useState(2);
  const [premium, setPremium] = useState(false);
  const [message, setMessage] = useState("");

  const q = useMemo(() => giftWrapQuote(items, premium, message), [items, premium, message]);

  return (
    <Card data-testid="giftwrap-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Wrap it like you mean it</Typography>
        <Typography variant="body2" color="text.secondary">
          Hand-wrapped with ribbon. Long messages cost a little extra ink.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Items: <span data-testid="giftwrap-items-label">{items}</span>
          </Typography>
          <Slider data-testid="giftwrap-items" value={items} min={1} max={10} step={1} onChange={(_, v) => setItems(v as number)} valueLabelDisplay="auto" />
        </Box>
        <FormControlLabel
          control={<Checkbox data-testid="giftwrap-premium" checked={premium} onChange={(e) => setPremium(e.target.checked)} />}
          label="Premium paper ($4.99/item instead of $2.99)"
        />
        <TextField
          inputProps={{ "data-testid": "giftwrap-message", maxLength: 200 }}
          size="small"
          label="Gift message"
          multiline
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          helperText={`${message.length}/140 free characters`}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Alert data-testid="giftwrap-result" severity="info" sx={{ mt: 2 }}>
          Wrap total: <strong>${q.total.toFixed(2)}</strong>
          {q.messageFee > 0 ? " (includes $1.99 long-message fee)." : "."}
        </Alert>
      </CardContent>
    </Card>
  );
}
