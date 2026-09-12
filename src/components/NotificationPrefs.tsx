import { useEffect, useState } from "react";
import { Card, CardContent, FormControlLabel, Switch, Typography } from "@mui/material";

const KEY = "aims-notify-prefs";

export interface NotifyPrefs {
  orderUpdates: boolean;
  priceDrops: boolean;
  backInStock: boolean;
  newsletter: boolean;
}

export const DEFAULT_PREFS: NotifyPrefs = {
  orderUpdates: true,
  priceDrops: false,
  backInStock: false,
  newsletter: false,
};

export function loadPrefs(): NotifyPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PREFS };
}

export function savePrefs(p: NotifyPrefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

const ROWS: { key: keyof NotifyPrefs; label: string; hint: string }[] = [
  { key: "orderUpdates", label: "Order updates", hint: "Shipped, out for delivery, delivered" },
  { key: "priceDrops", label: "Price drops", hint: "Wishlist items that get cheaper" },
  { key: "backInStock", label: "Back in stock", hint: "Sold-out items you asked about" },
  { key: "newsletter", label: "Newsletter", hint: "Deals and new arrivals, weekly" },
];

/**
 * Notification preferences: channel toggles remembered on device.
 */
export function NotificationPrefs() {
  const [prefs, setPrefs] = useState<NotifyPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  function toggle(key: keyof NotifyPrefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    savePrefs(next);
  }

  return (
    <Card data-testid="notify-prefs" variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Notifications</Typography>
        <Typography variant="body2" color="text.secondary">
          Choose what we may ping you about.
        </Typography>
        {ROWS.map((r) => (
          <FormControlLabel
            key={r.key}
            control={
              <Switch
                data-testid={`notify-${r.key}`}
                checked={prefs[r.key]}
                onChange={() => toggle(r.key)}
              />
            }
            label={`${r.label} — ${r.hint}`}
            sx={{ display: "flex", mt: 1 }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
