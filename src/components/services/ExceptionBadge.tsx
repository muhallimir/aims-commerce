import { Card, CardContent, Chip, Typography } from "@mui/material"
import type { ExceptionType } from "@lib/services/tracking-exceptions"

export interface ExceptionBadgeProps {
  type: ExceptionType
  confidence: number
}

export function ExceptionBadge({ type, confidence }: ExceptionBadgeProps) {
  return (
    <Card data-testid="tracking-exceptions-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Delivery exception
        </Typography>
        <Chip
          label={type}
          color={type === "none" ? "default" : "warning"}
          size="small"
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Confidence {Math.round(confidence * 100)}%
        </Typography>
      </CardContent>
    </Card>
  )
}
