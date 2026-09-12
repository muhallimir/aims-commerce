import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { priceMatchVerdict } from "@lib/service-quotes";

/**
 * Price-match desk: our price, competitor name and price,
 * instant match verdict.
 */
export function PriceMatchDesk() {
  const [ours, setOurs] = useState("100");
  const [theirs, setTheirs] = useState("90");
  const [store, setStore] = useState("amazon");

  const verdict = useMemo(() => {
    const o = Number(ours);
    const t = Number(theirs);
    if (!o || o <= 0) return null;
    return priceMatchVerdict(o, t, store);
  }, [ours, theirs, store]);

  return (
    <Card data-testid="pricematch-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Found it cheaper?</Typography>
        <Typography variant="body2" color="text.secondary">
          We match eligible retailers. Tell us the price, we verify instantly.
        </Typography>
        <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" } }}>
          <TextField
            inputProps={{ "data-testid": "pricematch-ours" }}
            size="small"
            label="Our price ($)"
            value={ours}
            onChange={(e) => setOurs(e.target.value)}
          />
          <TextField
            inputProps={{ "data-testid": "pricematch-store" }}
            size="small"
            label="Competitor"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />
          <TextField
            inputProps={{ "data-testid": "pricematch-theirs" }}
            size="small"
            label="Their price ($)"
            value={theirs}
            onChange={(e) => setTheirs(e.target.value)}
          />
        </Box>
        {verdict && (
          <Alert data-testid="pricematch-result" severity={verdict.approved ? "success" : "warning"} sx={{ mt: 2 }}>
            {verdict.reason}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
