import { Box, Chip, Typography } from "@mui/material"
import type { InsuranceQuote as InsuranceQuoteResult } from "@lib/services/shipping-insurance"

export function ShippingInsurance(props: InsuranceQuoteResult) {
  return (
    <Box
      data-testid="shipping-insurance-card"
      sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Shipping insurance
      </Typography>
      <Typography variant="h6">${props.fee.toFixed(2)}</Typography>
      <Typography variant="body2" color="text.secondary">
        {props.covers}
      </Typography>
      <Chip size="small" color="primary" label="Insured" />
    </Box>
  )
}
