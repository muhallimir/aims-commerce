import { Card, CardContent, Typography } from "@mui/material"

export interface TrackingRouteProps {
  lat: number
  lng: number
  segmentIndex: number
  percent?: number
}

export function TrackingRoute({ lat, lng, segmentIndex, percent }: TrackingRouteProps) {
  return (
    <Card data-testid="tracking-route-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Live position
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {lat.toFixed(4)}, {lng.toFixed(4)} (segment {segmentIndex})
        </Typography>
        {typeof percent === "number" && (
          <Typography variant="caption" color="text.secondary">
            {percent}% along route
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
