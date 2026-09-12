import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { decideRefund } from "@lib/refund-policy";

const CONDITIONS = ["sealed", "opened", "used", "damaged"] as const;

/**
 * Refund preview: delivered date plus item condition in, honest
 * eligibility verdict out.
 */
export function RefundPreview({ deliveredAt, total }: { deliveredAt: string | null; total: number }) {
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("sealed");

  if (!deliveredAt) return null;
  const decision = decideRefund({ orderDeliveredAt: deliveredAt, itemCondition: condition, hasReceipt: true, category: "standard" });
  const amount = Math.round(total * (decision.refundPercent / 100) * 100) / 100;

  return (
    <Card data-testid="refund-preview" variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Am I eligible for a refund?
        </Typography>
        <FormControl size="small" sx={{ mt: 1, minWidth: 180 }}>
          <InputLabel id="refund-cond-label">Item condition</InputLabel>
          <Select data-testid="refund-condition" labelId="refund-cond-label" label="Item condition" value={condition} onChange={(e) => setCondition(e.target.value as (typeof CONDITIONS)[number])}>
            {CONDITIONS.map((c) => (
              <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Alert data-testid="refund-verdict" severity={decision.ok ? "success" : "warning"} sx={{ mt: 2 }}>
          {decision.ok ? (
            <Box>Eligible: <strong>${amount.toFixed(2)}</strong> back ({decision.refundPercent}% — {decision.reason}).</Box>
          ) : (
            <Box>Not eligible: {decision.reason}.</Box>
          )}
        </Alert>
      </CardContent>
    </Card>
  );
}
