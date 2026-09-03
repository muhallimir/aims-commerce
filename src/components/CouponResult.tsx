import { Alert, AlertTitle, Box } from '@mui/material'

export interface CouponResultProps {
  ok: boolean
  reason?: string
  discount: number
  newSubtotal: number
}

export function CouponResult({ ok, reason, discount, newSubtotal }: CouponResultProps) {
  const fmt = (n: number) => `$${n.toFixed(2)}`
  if (ok) {
    return (
      <Alert data-testid="cr-ok" severity="success" variant="outlined">
        <AlertTitle>Coupon applied</AlertTitle>
        -{fmt(discount)} — new subtotal {fmt(newSubtotal)}
      </Alert>
    )
  }
  return (
    <Alert data-testid="cr-error" severity="error" variant="outlined">
      <AlertTitle>Coupon not applied</AlertTitle>
      Reason: {reason ?? 'unknown'}
    </Alert>
  )
}
