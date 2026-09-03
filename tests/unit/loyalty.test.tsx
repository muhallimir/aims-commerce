import { render, screen } from '@testing-library/react'
import { LoyaltyBadge } from '@components/LoyaltyBadge'

describe('LoyaltyBadge', () => {
  it('renders points and tier', () => {
    render(<LoyaltyBadge points={1200} tier="gold" />)
    expect(screen.getByTestId('lb').textContent).toMatch(/1200/)
    expect(screen.getByTestId('lb').textContent).toMatch(/gold/i)
  })
})
