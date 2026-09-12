import dynamic from "next/dynamic";
import { Box, Card, CardContent, Link, Typography } from "@mui/material";

const StoreMap = dynamic(
  () => import("@components/StoreMap").then((m) => m.StoreMap),
  { ssr: false, loading: () => <Box data-testid="store-map-loading">Loading map…</Box> }
);

/**
 * Visit us: flagship address, hours and a live OpenStreetMap
 * with directions out to OSM.
 */
export function VisitStore() {
  return (
    <Card data-testid="visit-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Visit the flagship</Typography>
        <Typography data-testid="visit-address" variant="body2" color="text.secondary">
          1 Orchard Road, Singapore · open 10:00 – 21:00 daily.
        </Typography>
        <Box data-testid="store-map" sx={{ mt: 2 }}>
          <StoreMap />
        </Box>
        <Link
          data-testid="visit-directions"
          href="https://www.openstreetmap.org/directions?to=1.3521%2C103.8198"
          target="_blank"
          rel="noopener"
          sx={{ mt: 1, display: "inline-block" }}
        >
          Get directions
        </Link>
      </CardContent>
    </Card>
  );
}
