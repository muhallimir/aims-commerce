import { Chip } from '@mui/material'

const COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning'> = {
  bronze: 'default',
  silver: 'primary',
  gold: 'warning',
  platinum: 'secondary',
}

export function LoyaltyBadge({ points, tier }: { points: number; tier: 'bronze' | 'silver' | 'gold' | 'platinum' }) {
  return (
    <Chip
      data-testid="lb"
      data-tier={tier}
      color={COLORS[tier]}
      size="small"
      label={`${tier.toUpperCase()} · ${points} pts`}
    />
  )
}
