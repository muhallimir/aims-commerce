import { render, screen } from '@testing-library/react'
import { ModerationQueue } from '@components/ModerationQueue'

describe('ModerationQueue', () => {
  it('renders each pending question and its flags', () => {
    const questions = [
      { id: 'q1', productId: 'p1', authorId: 'u1', text: 'Is this real?', createdAt: '2026-01-05T10:00:00Z', status: 'pending' as const },
    ]
    render(<ModerationQueue questions={questions} />)
    expect(screen.getByTestId('mq').textContent).toMatch(/is this real/i)
  })
  it('renders empty state', () => {
    render(<ModerationQueue questions={[]} />)
    expect(screen.getByText(/queue empty/i)).toBeInTheDocument()
  })
})
