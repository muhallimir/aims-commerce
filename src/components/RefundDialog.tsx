import { Alert, AlertTitle, Box, Stack, Typography } from '@mui/material'

export interface RefundDecision { ok: boolean; reason: string; refundPercent: number; restockFeePercent: number }

export function RefundDialog({ decision }: { decision: RefundDecision }) {
  if (!decision.ok) {
    return (
      <Alert data-testid="rd-no" severity="error">
        <AlertTitle>Refund not eligible</AlertTitle>
        Reason: {decision.reason.replace(/_/g, ' ')}
      </Alert>
    )
  }
  return (
    <Box data-testid="rd" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Alert data-testid="rd-ok" severity="success" variant="outlined">
        <AlertTitle>Refund approved</AlertTitle>
        You will receive {decision.refundPercent}% of the purchase price.
      </Alert>
      {decision.restockFeePercent > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          A {decision.restockFeePercent}% restocking fee will be deducted.
        </Typography>
      )}
    </Box>
  )
}
