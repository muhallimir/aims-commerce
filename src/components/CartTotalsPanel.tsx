import { Box, Stack, Typography } from '@mui/material'

export interface CartTotalsPanelProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}

export function CartTotalsPanel({ subtotal, shipping, tax, total, itemCount }: CartTotalsPanelProps) {
  const fmt = (n: number) => `$${n.toFixed(2)}`
  return (
    <Box data-testid="ctp" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">Subtotal ({itemCount} items)</Typography>
          <Typography data-testid="ctp-subtotal" variant="body2">{fmt(subtotal)}</Typography>
        </Stack>
        {shipping > 0 ? (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shipping</Typography>
            <Typography data-testid="ctp-shipping" variant="body2">{fmt(shipping)}</Typography>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shipping</Typography>
            <Typography data-testid="ctp-free" variant="body2" color="success.main">Free</Typography>
          </Stack>
        )}
        {tax > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Tax</Typography>
            <Typography data-testid="ctp-tax" variant="body2">{fmt(tax)}</Typography>
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between" sx={{ borderTop: 1, borderColor: 'divider', pt: 1, mt: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>Total</Typography>
          <Typography data-testid="ctp-total" variant="subtitle1" fontWeight={600}>{fmt(total)}</Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
