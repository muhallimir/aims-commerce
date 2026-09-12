import { Box, Chip, Typography } from "@mui/material"
import type { GiftWrapQuote } from "@lib/services/gift-wrap"

export function GiftWrap(props: GiftWrapQuote) {
  return (
    <Box data-testid="gift-wrap-card" sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Gift wrap
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ${props.perItem.toFixed(2)} / item · Subtotal ${props.subtotal.toFixed(2)}
      </Typography>
      <Typography variant="h6">${props.total.toFixed(2)}</Typography>
      <Chip
        size="small"
        color={props.messageFee > 0 ? "primary" : "default"}
        label={props.messageFee > 0 ? `Message fee $${props.messageFee.toFixed(2)}` : "No message fee"}
      />
    </Box>
  )
}
