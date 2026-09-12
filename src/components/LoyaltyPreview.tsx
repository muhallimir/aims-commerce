import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Slider,
  Typography,
} from "@mui/material";
import { earnPoints, TIER_THRESHOLDS, type LoyaltyTier } from "@lib/loyalty";

const TIERS: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];

/**
 * Loyalty preview: lifetime spend slider shows tier, multiplier and
 * what the next purchase earns.
 */
export function LoyaltyPreview() {
  const [spend, setSpend] = useState(250);

  const member = useMemo(
    () => earnPoints({ userId: "guest", points: 0, lifetimeSpend: 0, tier: "bronze" }, spend),
    [spend]
  );
  const nextTier = useMemo(() => {
    const order: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];
    const idx = order.indexOf(member.tier);
    return idx < order.length - 1 ? order[idx + 1] : null;
  }, [member.tier]);

  return (
    <Card data-testid="loyalty-widget" variant="outlined">
      <CardContent>
        <Typography variant="h6">Loyalty that pays</Typography>
        <Typography variant="body2" color="text.secondary">
          Earn a point per dollar, multiplied by tier. Slide your yearly spend.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Yearly spend: <span data-testid="loyalty-spend-label">${spend}</span>
          </Typography>
          <Slider data-testid="loyalty-spend" value={spend} min={0} max={6000} step={50} onChange={(_, v) => setSpend(v as number)} valueLabelDisplay="auto" />
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {TIERS.map((t) => (
            <Chip
              key={t}
              data-testid={`loyalty-tier-${t}`}
              label={`${t} ($${TIER_THRESHOLDS[t]}+)`}
              color={member.tier === t ? "primary" : "default"}
              sx={{ textTransform: "capitalize" }}
            />
          ))}
        </Box>
        <Alert data-testid="loyalty-result" severity="info" sx={{ mt: 2 }}>
          <span data-testid="loyalty-tier-name" style={{ textTransform: "capitalize" }}>{member.tier}</span> tier ·{" "}
          <strong>{member.points} points</strong> on that spend
          {nextTier ? ` · $${(TIER_THRESHOLDS[nextTier] - spend).toLocaleString()} to ${nextTier}.` : " · top tier, enjoy it."}
        </Alert>
      </CardContent>
    </Card>
  );
}
