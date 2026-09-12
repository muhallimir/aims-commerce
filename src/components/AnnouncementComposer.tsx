import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { apiFetch } from "@lib/authFetch";

/**
 * Announcement composer: admins write a storefront banner, live on
 * publish. Message only — scheduling stays server-side.
 */
export function AnnouncementComposer() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function publish() {
    if (message.trim().length < 3) {
      setError("Write a message of at least 3 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await apiFetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!res.ok) throw new Error("Publish failed — admins only.");
      setMessage("");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card data-testid="announcement-composer" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">Store announcement</Typography>
        <Typography variant="body2" color="text.secondary">
          Published banners show to every shopper until removed.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField
            inputProps={{ "data-testid": "announcement-input" }}
            size="small"
            label="Banner message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setSaved(false);
            }}
            fullWidth
          />
          <Button data-testid="announcement-publish" variant="contained" disabled={busy} onClick={publish}>
            Publish
          </Button>
        </Box>
        {error && (
          <Alert data-testid="announcement-error" severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        {saved && (
          <Alert data-testid="announcement-saved" severity="success" sx={{ mt: 1 }}>
            Live on the storefront now.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
