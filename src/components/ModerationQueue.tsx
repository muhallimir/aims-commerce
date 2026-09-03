import { Box, Chip, Stack, Typography } from '@mui/material'

export interface ModerationQuestion { id: string; productId: string; authorId: string; text: string; createdAt: string; status: 'pending' | 'approved' | 'rejected' }

export function ModerationQueue({ questions }: { questions: ModerationQuestion[] }) {
  if (questions.length === 0) {
    return <Typography data-testid="mq-empty" variant="body2" color="text.secondary">Queue is empty.</Typography>
  }
  return (
    <Box data-testid="mq" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Stack spacing={1}>
        {questions.map((q) => (
          <Stack key={q.id} direction="row" spacing={1} alignItems="flex-start">
            <Chip size="small" label={q.status} color={q.status === 'pending' ? 'warning' : q.status === 'approved' ? 'success' : 'default'} />
            <Box>
              <Typography variant="body2">{q.text}</Typography>
              <Typography variant="caption" color="text.secondary">{q.productId} · {q.authorId} · {new Date(q.createdAt).toLocaleString()}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
