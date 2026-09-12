import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

const KEY = "aims-stock-alerts";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function saveAlert(productId: string, email: string): void {
  const raw = localStorage.getItem(KEY);
  const list = raw ? (JSON.parse(raw) as { productId: string; email: string }[]) : [];
  if (!list.some((a) => a.productId === productId && a.email === email.trim().toLowerCase())) {
    list.push({ productId, email: email.trim().toLowerCase() });
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

/**
 * Back-in-stock notifier: email in, confirmation out, alert stored
 * on this device until the product returns.
 */
export function StockNotifier({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function subscribe() {
    if (!isValidEmail(email)) {
      setError("Enter a valid email so we can reach you.");
      return;
    }
    saveAlert(productId, email);
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <Alert data-testid="stock-notifier-done" severity="success" sx={{ mt: 2 }}>
        You&apos;re on the list — we&apos;ll email you when {productName} is back.
      </Alert>
    );
  }

  return (
    <Box data-testid="stock-notifier" sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Sold out. Leave your email and we&apos;ll ping you when it&apos;s back.
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          inputProps={{ "data-testid": "stock-notifier-email" }}
          size="small"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <Button data-testid="stock-notifier-submit" variant="outlined" onClick={subscribe}>
          Notify me
        </Button>
      </Box>
    </Box>
  );
}
