import { Card, CardContent, Chip, Typography } from "@mui/material"

export interface SignatureRuleProps {
  required: boolean
  reason: string
}

export function SignatureRule({ required, reason }: SignatureRuleProps) {
  return (
    <Card data-testid="tracking-signature-card">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          Signature
        </Typography>
        <Chip
          label={required ? "Required" : "Not required"}
          color={required ? "primary" : "default"}
          size="small"
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          {reason}
        </Typography>
      </CardContent>
    </Card>
  )
}
