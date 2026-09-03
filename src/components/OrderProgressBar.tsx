import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { progress, type OrderStatus } from '@lib/order-status'

const LABELS: Record<OrderStatus, string> = {
  created: 'Created',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function OrderProgressBar({ status }: { status: OrderStatus }) {
  const pct = progress(status)
  const isBad = status === 'cancelled' || status === 'refunded'
  return (
    <Box data-testid="opb" data-status={status}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2" fontWeight={600}>{LABELS[status]}</Typography>
        <Typography variant="caption" color="text.secondary">{pct}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={isBad ? 'error' : status === 'delivered' ? 'success' : 'primary'}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  )
}
