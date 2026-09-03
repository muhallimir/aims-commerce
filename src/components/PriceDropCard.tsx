import { Alert, AlertTitle, Stack, Typography } from '@mui/material'

const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }

export function PriceDropCard({ productId, previous, current, currency }: { productId: string; previous: number; current: number; currency: string }) {
  const save = Math.max(0, previous - current)
  const s = sym[currency.toUpperCase()] ?? ''
  return (
    <Alert data-testid="pdc" severity="success" variant="outlined">
      <AlertTitle>Price drop · {productId}</AlertTitle>
      <Stack>
        <Typography>Was <s>{s}{previous.toFixed(2)}</s> — now <strong>{s}{current.toFixed(2)}</strong></Typography>
        <Typography variant="caption" color="text.secondary">You save {s}{save.toFixed(2)}</Typography>
      </Stack>
    </Alert>
  )
}
