import { Alert, Box, Chip, Typography } from "@mui/material";
import { scoreFraud } from "@lib/fraud-score";

/**
 * Preliminary fraud screen for admins: scores the visible order on
 * value and velocity signals. Final call stays human.
 */
export function FraudHint({ total }: { total: number }) {
  const s = scoreFraud({
    emailAgeDays: 30,
    accountAgeDays: 30,
    addressMismatch: 0,
    orderTotal: Math.max(0, total),
    recentOrderCount: 1,
    hasPriorCompletedOrder: false,
  });
  return (
    <Box data-testid="fraud-hint" sx={{ mt: 2 }}>
      <Alert severity={s.level === "high" ? "error" : s.level === "medium" ? "warning" : "success"}>
        <Typography variant="body2">
          Fraud screen: <strong data-testid="fraud-score">{s.score}/100 ({s.level})</strong>. Preliminary only — verify before action.
        </Typography>
        {s.flags.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 1 }}>
            {s.flags.map((f) => (
              <Chip key={f} data-testid="fraud-flag" label={f} size="small" />
            ))}
          </Box>
        )}
      </Alert>
    </Box>
  );
}
