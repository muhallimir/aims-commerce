import { Box, Card, CardContent, Chip, Typography } from "@mui/material"

export interface NotifyPlanProps {
  channels: string[]
  cadenceMinutes: number
  template: string
}

export function NotifyPlan({ channels, cadenceMinutes, template }: NotifyPlanProps) {
  return (
    <Card data-testid="tracking-notify-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Notify plan ({template})
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {channels.map((c) => (
            <Chip key={c} label={c} size="small" />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Every {cadenceMinutes} min
        </Typography>
      </CardContent>
    </Card>
  )
}
