import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

const KEY = "aims-newsletter";

export function isNewsletterEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Footer newsletter signup: validated email, persisted locally,
 * confirmed inline.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(() => {
    try {
      return Boolean(localStorage.getItem(KEY));
    } catch {
      return false;
    }
  });
  const [error, setError] = useState("");

  function subscribe() {
    if (!isNewsletterEmail(email)) {
      setError("Enter a valid email to join.");
      return;
    }
    try {
      localStorage.setItem(KEY, email.trim().toLowerCase());
    } catch {}
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <Alert data-testid="newsletter-done" severity="success" sx={{ mt: 2, maxWidth: 420, mx: "auto" }}>
        You&apos;re on the list — deals land every Friday.
      </Alert>
    );
  }

  return (
    <Box data-testid="newsletter-signup" sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
      <Typography variant="body2" sx={{ width: "100%", color: "white" }}>
        Deals every Friday. No spam, unsubscribe anytime.
      </Typography>
      <TextField
        inputProps={{ "data-testid": "newsletter-email" }}
        size="small"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={Boolean(error)}
        helperText={error}
        sx={{ bgcolor: "white", borderRadius: 1, minWidth: 240 }}
      />
      <Button data-testid="newsletter-submit" variant="contained" color="warning" onClick={subscribe}>
        Join
      </Button>
    </Box>
  );
}
