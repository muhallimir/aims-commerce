import { render, screen } from '@testing-library/react'
import { CartTotalsPanel } from '@components/CartTotalsPanel'

describe('CartTotalsPanel', () => {
  it('renders subtotal, shipping, tax, and total', () => {
    render(<CartTotalsPanel subtotal={100} shipping={10} tax={8.8} total={118.8} itemCount={3} />)
    expect(screen.getByTestId('ctp-subtotal').textContent).toMatch(/100\.00/)
    expect(screen.getByTestId('ctp-total').textContent).toMatch(/118\.80/)
  })

  it('hides tax row when zero', () => {
    render(<CartTotalsPanel subtotal={50} shipping={5} tax={0} total={55} itemCount={1} />)
    expect(screen.queryByTestId('ctp-tax')).toBeNull()
  })

  it('hides shipping row when free', () => {
    render(<CartTotalsPanel subtotal={150} shipping={0} tax={12} total={162} itemCount={2} />)
    expect(screen.getByTestId('ctp-free').textContent).toMatch(/free/i)
  })
})
