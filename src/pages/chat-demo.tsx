/**
 * Public chat demo that exercises the chatbot end-to-end without
 * requiring Clerk/Supabase auth. Uses the existing chatbotService
 * knowledge-base responses so the full request/response cycle runs
 * in the browser and the test can assert on real DOM updates.
 */

import { useState } from 'react'
import {
  Container, Typography, Paper, Box, TextField, Button, Stack, Alert,
} from '@mui/material'
import chatbotService from '@services/chatbotService'
import type { ChatbotMessage } from '@services/chatbotService'

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<ChatbotMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    const body = input.trim()
    if (!body || busy) return
    setBusy(true)
    setError(null)
    setInput('')
    const userMsg: ChatbotMessage = { name: 'You', body, type: 'user', timestamp: new Date() }
    setMessages((m) => [...m, userMsg])
    try {
      // Use the same path the existing CustomerChatbox uses
      const ctx: any = { userInfo: { _id: null, isAdmin: false } }
      const reply: any = await chatbotService.generateResponse(body)
      const botMsg: ChatbotMessage = {
        name: 'Bot',
        body: typeof reply === 'string' ? reply : reply?.message ?? '...',
        type: 'bot',
        timestamp: new Date(),
        products: reply?.products,
        isProductSuggestion: reply?.type === 'product_suggestions',
      }
      setMessages((m) => [...m, botMsg])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container data-testid="chat-demo-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>aims-commerce · chat demo</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        End-to-end chat flow using the existing chatbot service. Send a message below.
      </Typography>
      <Paper data-testid="chat-window" variant="outlined" sx={{ p: 2, mt: 2, minHeight: 320, maxHeight: 480, overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <Typography data-testid="chat-empty" color="text.secondary">No messages yet — say hi!</Typography>
        ) : (
          <Stack spacing={1} data-testid="chat-messages">
            {messages.map((m, i) => (
              <Box
                key={i}
                data-testid={`chat-msg-${i}`}
                data-type={m.type}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: m.type === 'user' ? 'primary.light' : 'grey.100',
                  color: m.type === 'user' ? 'primary.contrastText' : 'text.primary',
                  alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>{m.name}</Typography>
                <Typography variant="body2">{m.body}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
      {error && <Alert severity="error" sx={{ mt: 2 }} data-testid="chat-error">{error}</Alert>}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about shipping, returns, products…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          inputProps={{ 'data-testid': 'chat-input' }}
        />
        <Button data-testid="chat-send" variant="contained" onClick={send} disabled={busy || !input.trim()}>
          {busy ? '…' : 'Send'}
        </Button>
      </Stack>
    </Container>
  )
}
