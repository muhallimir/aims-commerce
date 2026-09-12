import { Card, CardContent, Chip, Typography } from "@mui/material"

export interface LiveEtaProps {
  revisedAt: string
  addedMinutes: number
  onTime: boolean
}

export function LiveEta({ revisedAt, addedMinutes, onTime }: LiveEtaProps) {
  return (
    <Card data-testid="tracking-eta-live-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Live ETA
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(revisedAt).toLocaleString()} (+{addedMinutes} min)
        </Typography>
        <Chip
          label={onTime ? "On time" : "Delayed"}
          color={onTime ? "success" : "warning"}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  )
}
