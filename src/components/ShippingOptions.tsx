import { Box, Radio, RadioGroup, FormControlLabel, Typography, Stack } from '@mui/material'

export interface ShippingOption { zoneId: string; service: string; rate: number; etaDays: number; currency: string }

export function ShippingOptions({ options }: { options: ShippingOption[] }) {
  if (options.length === 0) {
    return <Typography data-testid="so-empty" variant="body2" color="text.secondary">No shipping options available.</Typography>
  }
  return (
    <Box data-testid="so" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Shipping options</Typography>
      <RadioGroup>
        {options.map((o) => (
          <FormControlLabel
            key={o.service}
            value={o.service}
            control={<Radio size="small" />}
            label={
              <Stack>
                <span>{o.service} · ${o.rate.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: '#666' }}>ETA: {o.etaDays} day{o.etaDays === 1 ? '' : 's'}</span>
              </Stack>
            }
          />
        ))}
      </RadioGroup>
    </Box>
  )
}
