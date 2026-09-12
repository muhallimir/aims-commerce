import { Box, Card, CardContent, Chip, Typography } from "@mui/material"
import type { SlotAvailability } from "@lib/services/delivery-slots"

export interface DeliverySlotsProps {
  slots: SlotAvailability[]
}

export function DeliverySlots({ slots }: DeliverySlotsProps) {
  return (
    <Card data-testid="delivery-slots-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Delivery slots
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {slots.map((s) => (
            <Chip key={s.slot} label={`${s.slot} (${s.left} left)`} size="small" color="primary" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
