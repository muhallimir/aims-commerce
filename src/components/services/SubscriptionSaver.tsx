import { Box, Chip, Typography } from "@mui/material"
import type { SubscriptionPlan as SubscriptionPlanResult } from "@lib/services/subscription-saver"

export function SubscriptionSaver(props: SubscriptionPlanResult) {
  return (
    <Box
      data-testid="subscription-saver-card"
      sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Subscription saver
      </Typography>
      <Typography variant="h6">${props.perDelivery.toFixed(2)} / delivery</Typography>
      <Typography variant="body2" color="text.secondary">
        ${props.annualTotal.toFixed(2)} / year
      </Typography>
      <Chip size="small" color="success" label={`Save $${props.savingsVsOneOff.toFixed(2)}`} />
    </Box>
  )
}
