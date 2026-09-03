import { Box, Stack, Typography } from '@mui/material'

export interface PayoutResult { gross: number; fees: number; refunds: number; net: number; feeRate: number }

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function PayoutCard({ payout }: { payout: PayoutResult }) {
  if (payout.gross === 0) {
    return <Typography data-testid="pc-empty" variant="body2" color="text.secondary">No earnings yet.</Typography>
  }
  return (
    <Box data-testid="pc" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Seller payout</Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between"><span>Gross</span><span>{fmt(payout.gross)}</span></Stack>
        <Stack direction="row" justifyContent="space-between" color="text.secondary"><span>Platform fee ({(payout.feeRate * 100).toFixed(1)}%)</span><span>-{fmt(payout.fees)}</span></Stack>
        <Stack direction="row" justifyContent="space-between" color="text.secondary"><span>Refunds</span><span>-{fmt(payout.refunds)}</span></Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ borderTop: 1, borderColor: 'divider', pt: 1, mt: 1 }}>
          <Typography fontWeight={700}>Net payout</Typography>
          <Typography data-testid="pc-net" fontWeight={700}>{fmt(payout.net)}</Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
