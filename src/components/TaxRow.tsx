import { Stack, Typography } from '@mui/material'
import { computeTax, taxRateFor } from '@lib/tax'

export function TaxRow({ subtotal, country, region, shipping = 0 }: { subtotal: number; country: string; region?: string; shipping?: number }) {
  const rule = taxRateFor(country, region)
  const amount = computeTax(subtotal, country, region, shipping)
  return (
    <Stack data-testid="tr" direction="row" justifyContent="space-between">
      <span>Tax ({rule.label})</span>
      <Typography data-testid="tr-amount" component="span">${amount.toFixed(2)}</Typography>
    </Stack>
  )
}
