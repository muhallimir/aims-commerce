import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Slider, TextField, Typography } from "@mui/material";

export function makeCampaignCode(pct: number): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SAVE${pct}-${rand}`;
}

export function campaignPreview(pct: number, endsAt: string): string {
  const date = endsAt ? new Date(`${endsAt}T23:59:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "soon";
  return `${pct}% off everything, ends ${date}.`;
}

/**
 * Campaign creator: discount, window and auto-generated code with
 * the storefront banner preview.
 */
export function CampaignCreator() {
  const [pct, setPct] = useState(20);
  const [endsAt, setEndsAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [code, setCode] = useState(() => makeCampaignCode(20));

  const preview = useMemo(() => campaignPreview(pct, endsAt), [pct, endsAt]);

  return (
    <Card data-testid="campaign-creator" variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Sale campaign</Typography>
        <Typography variant="body2" color="text.secondary">
          Design the discount, take the code to your store banners.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Discount: <span data-testid="campaign-pct-label">{pct}%</span>
          </Typography>
          <Slider data-testid="campaign-pct" value={pct} min={5} max={70} step={5} onChange={(_, v) => { setPct(v as number); setCode(makeCampaignCode(v as number)); }} valueLabelDisplay="auto" />
        </Box>
        <TextField
          inputProps={{ "data-testid": "campaign-ends" }}
          type="date"
          size="small"
          label="Ends"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 1 }}
        />
        <Alert data-testid="campaign-preview" severity="info" sx={{ mt: 2 }}>
          <span data-testid="campaign-text">{preview}</span> Code: <strong data-testid="campaign-code">{code}</strong>
        </Alert>
        <Button data-testid="campaign-regen" size="small" sx={{ mt: 1 }} onClick={() => setCode(makeCampaignCode(pct))}>
          New code
        </Button>
      </CardContent>
    </Card>
  );
}
