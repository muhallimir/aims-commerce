import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";

const KEY = "aims-gift";

export interface GiftOptions {
  wrap: boolean;
  message: string;
}

export function loadGift(): GiftOptions {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { wrap: Boolean(p.wrap), message: typeof p.message === "string" ? p.message : "" };
    }
  } catch {}
  return { wrap: false, message: "" };
}

export function saveGift(g: GiftOptions): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch {}
}

/**
 * Gift options: wrap toggle plus a message, remembered on device
 * and honored at checkout packing.
 */
export function GiftOptionsPanel() {
  const [gift, setGift] = useState<GiftOptions>({ wrap: false, message: "" });

  useEffect(() => {
    setGift(loadGift());
  }, []);

  function update(next: GiftOptions) {
    setGift(next);
    saveGift(next);
  }

  return (
    <Card data-testid="gift-options" variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>Sending a gift?</Typography>
        <FormControlLabel
          control={
            <Checkbox
              data-testid="gift-wrap-toggle"
              checked={gift.wrap}
              onChange={(e) => update({ ...gift, wrap: e.target.checked })}
            />
          }
          label="Wrap everything ($2.99/item at packing)"
        />
        {gift.wrap && (
          <TextField
            inputProps={{ "data-testid": "gift-message" }}
            size="small"
            label="Gift message"
            value={gift.message}
            onChange={(e) => update({ ...gift, message: e.target.value })}
            helperText={`${gift.message.length}/140 free characters`}
            fullWidth
            sx={{ mt: 1 }}
          />
        )}
        {gift.wrap && gift.message.trim().length > 0 && (
          <Alert data-testid="gift-summary" severity="info" sx={{ mt: 1 }}>
            Wrapped with note: “{gift.message.trim()}”.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
