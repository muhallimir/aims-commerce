import { Stack, Typography } from '@mui/material'
import { formatCurrency } from '@lib/fx'

export function PriceTag({ amount, currency, compareAt }: { amount: number; currency: string; compareAt?: number }) {
  return (
    <Stack data-testid="pt" direction="row" spacing={1} alignItems="baseline">
      {typeof compareAt === 'number' && compareAt > amount && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textDecoration: 'line-through' }}
          data-testid="pt-compare"
        >
          {formatCurrency(compareAt, currency)}
        </Typography>
      )}
      <Typography variant="h6" fontWeight={700} color="primary.main">
        {formatCurrency(amount, currency)}
      </Typography>
    </Stack>
  )
}
