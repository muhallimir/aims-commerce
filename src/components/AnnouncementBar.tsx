import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface Announcement {
  id: string;
  message: string;
}

/**
 * Sitewide announcement bar: latest live banner, dismissible for
 * the session.
 */
export function AnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setItems(data.slice(0, 1));
      })
      .catch(() => {});
  }, []);

  const visible = items.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <Box
      data-testid="announcement-bar"
      sx={{ bgcolor: "info.main", color: "info.contrastText", px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}
    >
      <Typography data-testid="announcement-text" variant="body2">
        {visible[0].message}
      </Typography>
      <Typography
        data-testid="announcement-dismiss"
        variant="body2"
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => setDismissed((d) => [...d, visible[0].id])}
      >
        Dismiss
      </Typography>
    </Box>
  );
}
