import { Alert, AlertTitle } from '@mui/material'

export function BundlePricingHint({ message, targetQty }: { message: string; targetQty: number }) {
  return (
    <Alert data-testid="bph" severity="info" variant="outlined">
      <AlertTitle>Bundle savings</AlertTitle>
      {message} (target qty {targetQty})
    </Alert>
  )
}
