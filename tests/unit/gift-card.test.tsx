import { render, screen } from '@testing-library/react'
import { GiftCardBadge } from '@components/GiftCardBadge'

describe('GiftCardBadge', () => {
  it('renders the balance', () => {
    render(<GiftCardBadge balance={50} currency="USD" active />)
    expect(screen.getByTestId('gcb').textContent).toMatch(/50/)
  })
  it('renders an inactive state', () => {
    render(<GiftCardBadge balance={50} currency="USD" active={false} />)
    expect(screen.getByTestId('gcb').textContent).toMatch(/inactive/i)
  })
})
