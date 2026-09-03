import { Chip } from '@mui/material'

const TONE: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  out: 'error',
  critical: 'warning',
  warning: 'info',
  ok: 'success',
}

const LABEL: Record<string, string> = {
  out: 'Out of stock',
  critical: 'Critical',
  warning: 'Low',
  ok: 'OK',
}

export function StockAlertBadge({ severity, available }: { severity: 'ok' | 'warning' | 'critical' | 'out'; available: number }) {
  return (
    <Chip
      data-testid="sab"
      data-severity={severity}
      color={TONE[severity]}
      size="small"
      label={`${LABEL[severity]} (${available})`}
    />
  )
}
