import { Alert, AlertTitle, Box, Typography } from '@mui/material'

export interface AddressFormProps {
  address: { line1: string; line2?: string; city: string; region?: string; postalCode: string; country: string }
  valid: boolean
  errors: string[]
}

export function AddressForm({ address, valid, errors }: AddressFormProps) {
  return (
    <Box data-testid="af" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="body2">
        {address.line1}
        {address.line2 ? <>, {address.line2}</> : ''}
        <br />
        {address.city}{address.region ? `, ${address.region}` : ''} {address.postalCode}
        <br />
        {address.country}
      </Typography>
      {!valid && (
        <Alert data-testid="af-err" severity="warning" variant="outlined" sx={{ mt: 1 }}>
          <AlertTitle>Please fix</AlertTitle>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </Alert>
      )}
    </Box>
  )
}
