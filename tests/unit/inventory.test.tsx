import { render, screen } from '@testing-library/react'
import { StockBadge } from '@components/StockBadge'

describe('StockBadge', () => {
  it('renders "In stock" with a positive tone when available', () => {
    render(<StockBadge available={5} />)
    expect(screen.getByTestId('sb').textContent).toMatch(/in stock/i)
  })
  it('renders "Low stock" when under 5', () => {
    render(<StockBadge available={2} />)
    expect(screen.getByTestId('sb').textContent).toMatch(/low stock/i)
  })
  it('renders "Out of stock" when zero', () => {
    render(<StockBadge available={0} />)
    expect(screen.getByTestId('sb').textContent).toMatch(/out of stock/i)
  })
})
