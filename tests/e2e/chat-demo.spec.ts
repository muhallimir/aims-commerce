/**
 * End-to-end chat test for the public /chat-demo page.
 * Confirms the chatbot is wired through the real React UI and the
 * chatbotService responds to messages with knowledge-base content.
 */

import { test, expect } from '@playwright/test'

test('chat demo page loads with empty state', async ({ page }) => {
  await page.goto('/chat-demo', { waitUntil: 'networkidle' })
  await expect(page.getByTestId('chat-demo-page')).toBeVisible()
  await expect(page.getByTestId('chat-empty')).toBeVisible()
  await expect(page.getByTestId('chat-input')).toBeVisible()
  await expect(page.getByTestId('chat-send')).toBeVisible()
})

test('user can send a message and get a bot reply', async ({ page }) => {
  await page.goto('/chat-demo', { waitUntil: 'networkidle' })

  await page.getByTestId('chat-input').fill('How much is shipping?')
  await page.getByTestId('chat-send').click()

  // User message appears immediately
  await expect(page.getByTestId('chat-msg-0')).toBeVisible()
  await expect(page.getByTestId('chat-msg-0')).toHaveAttribute('data-type', 'user')
  await expect(page.getByTestId('chat-msg-0')).toContainText('How much is shipping')

  // Bot response appears after processing
  await expect(page.getByTestId('chat-msg-1')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByTestId('chat-msg-1')).toHaveAttribute('data-type', 'bot')
  await expect(page.getByTestId('chat-msg-1')).toContainText(/shipping/i)
})

test('multiple messages form a conversation', async ({ page }) => {
  await page.goto('/chat-demo', { waitUntil: 'networkidle' })

  const turns = ['Hello!', 'What is your return policy?', 'Thanks!']
  for (let i = 0; i < turns.length; i++) {
    await page.getByTestId('chat-input').fill(turns[i])
    await page.getByTestId('chat-send').click()
    // Each turn produces 1 user message + 1 bot reply → 2 more messages
    await expect(page.getByTestId(`chat-msg-${i * 2}`)).toBeVisible()
    await expect(page.getByTestId(`chat-msg-${i * 2}`)).toHaveAttribute('data-type', 'user')
    await expect(page.getByTestId(`chat-msg-${i * 2 + 1}`)).toHaveAttribute('data-type', 'bot')
  }

  // Final state: 6 messages total (3 user + 3 bot)
  await expect(page.locator('[data-testid^="chat-msg-"]')).toHaveCount(6)
})
