import { Box, Stack, Typography } from '@mui/material'

export interface DeliveryEtaCardProps { arrivesAt: string; calendarDays: number; businessDays: number }

export function DeliveryEtaCard({ arrivesAt, calendarDays, businessDays }: DeliveryEtaCardProps) {
  const d = new Date(arrivesAt)
  return (
    <Box data-testid="dec" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="caption" color="text.secondary">Estimated arrival</Typography>
      <Typography variant="h6" fontWeight={700}>{d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Typography>
      <Stack direction="row" spacing={2} mt={1}>
        <Typography variant="caption">{businessDays} business days</Typography>
        <Typography variant="caption">{calendarDays} calendar days</Typography>
      </Stack>
    </Box>
  )
}
