import { Box, Card, CardContent, Chip, Typography } from "@mui/material"
import type { TimelineStep } from "@lib/services/tracking-timeline"

export interface TrackingTimelineProps {
  steps: TimelineStep[]
  percent: number
}

function chipColor(state: TimelineStep["state"]): "success" | "primary" | "default" {
  if (state === "done") return "success"
  if (state === "current") return "primary"
  return "default"
}

export function TrackingTimeline({ steps, percent }: TrackingTimelineProps) {
  return (
    <Card data-testid="tracking-timeline-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Tracking timeline ({percent}%)
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {steps.map((s) => (
            <Chip key={s.key} label={s.label} color={chipColor(s.state)} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
