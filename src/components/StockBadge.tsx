import { Chip } from '@mui/material'

export function StockBadge({ available }: { available: number }) {
  if (available <= 0) return <Chip data-testid="sb" color="error" size="small" label="Out of stock" />
  if (available < 5) return <Chip data-testid="sb" color="warning" size="small" label={`Low stock (${available})`} />
  return <Chip data-testid="sb" color="success" size="small" label={`In stock (${available})`} />
}
