import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import {
  clearViews,
  mostRecent,
  type RecentlyViewedState,
} from "@lib/recently-viewed";

const STORAGE_KEY = "aims-recent";

function load(): RecentlyViewedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userId: "guest", views: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.views)) return { userId: "guest", views: [] };
    return { userId: "guest", views: parsed.views };
  } catch {
    return { userId: "guest", views: [] };
  }
}

/**
 * Recently viewed: the shopper's browsing trail from this browser,
 * with per-item remove and clear-all. Product pages record views;
 * this strip reads them back.
 */
export function RecentlyViewedStrip() {
  const [state, setState] = useState<RecentlyViewedState>({ userId: "guest", views: [] });

  useEffect(() => {
    setState(load());
  }, []);

  const views = mostRecent(state, 6);

  function remove(productId: string) {
    const next: RecentlyViewedState = {
      ...state,
      views: state.views.filter((v) => v.productId !== productId),
    };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function clear() {
    const next = clearViews(state);
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <Card data-testid="recent-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Picked up where you left off</Typography>
        <Typography variant="body2" color="text.secondary">
          Products you viewed on this device.
        </Typography>
        {views.length === 0 ? (
          <Alert data-testid="recent-empty" severity="info" sx={{ mt: 2 }}>
            Nothing here yet. <Button data-testid="recent-browse" href="/store" size="small">Browse the store</Button>
          </Alert>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {views.map((v) => (
                <Chip
                  key={v.productId}
                  data-testid={`recent-item-${v.productId}`}
                  label={v.productId}
                  onDelete={() => remove(v.productId)}
                />
              ))}
            </Box>
            <Button data-testid="recent-clear" size="small" onClick={clear} sx={{ mt: 1 }}>
              Clear all
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
