import { Box, Chip, Typography } from "@mui/material"
import type { RentalQuoteResult } from "@lib/services/rental-price"

export interface RentalQuoteProps extends RentalQuoteResult {}

export function RentalQuote({ rentalFee, deposit, total }: RentalQuoteProps) {
  return (
    <Box data-testid="rental-price-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Rental quote</Typography>
      <Typography variant="h6" fontWeight={700}>${total.toFixed(2)}</Typography>
      <Chip label={`Fee $${rentalFee.toFixed(2)}`} size="small" sx={{ mt: 1 }} />
      <Typography variant="caption" display="block" mt={1}>Deposit: ${deposit.toFixed(2)}</Typography>
    </Box>
  )
}
