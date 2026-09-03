import { render, screen } from '@testing-library/react'
import { PriceDropCard } from '@components/PriceDropCard'

describe('PriceDropCard', () => {
  it('renders the previous and new price + savings', () => {
    render(<PriceDropCard productId="p1" previous={100} current={80} currency="USD" />)
    expect(screen.getByTestId('pdc').textContent).toMatch(/80\.00/)
    expect(screen.getByTestId('pdc').textContent).toMatch(/save/i)
  })
})
