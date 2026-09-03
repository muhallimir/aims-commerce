import { Chip } from '@mui/material'

export function GiftCardBadge({ balance, currency, active }: { balance: number; currency: string; active: boolean }) {
  const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }
  if (!active) {
    return <Chip data-testid="gcb" size="small" color="default" label="Gift card inactive" />
  }
  return (
    <Chip
      data-testid="gcb"
      size="small"
      color="primary"
      label={`Gift card ${sym[currency.toUpperCase()] ?? ''}${balance.toFixed(2)}`}
    />
  )
}
