import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

const KEY = "aims-consent";

export type Consent = "accepted" | "declined" | null;

export function loadConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(v: Exclude<Consent, null>): void {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
}

/**
 * Cookie consent: one decision, remembered, out of the way.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<Consent>(null);

  useEffect(() => {
    setChoice(loadConsent());
  }, []);

  function decide(v: Exclude<Consent, null>) {
    saveConsent(v);
    setChoice(v);
  }

  if (choice !== null) return null;

  return (
    <Paper
      data-testid="cookie-consent"
      elevation={4}
      sx={{ position: "fixed", bottom: 16, left: 16, right: 16, maxWidth: 480, mx: "auto", p: 2, zIndex: 1300 }}
    >
      <Typography variant="body2">
        We use cookies for carts, sign-in and analytics. Take them or leave them.
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
        <Button data-testid="cookie-decline" size="small" onClick={() => decide("declined")}>
          Essentials only
        </Button>
        <Button data-testid="cookie-accept" size="small" variant="contained" onClick={() => decide("accepted")}>
          Accept all
        </Button>
      </Box>
    </Paper>
  );
}
