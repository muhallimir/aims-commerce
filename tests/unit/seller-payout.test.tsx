import { render, screen } from '@testing-library/react'
import { PayoutCard } from '@components/PayoutCard'

describe('PayoutCard', () => {
  it('renders gross, fees, refunds, and net', () => {
    render(<PayoutCard payout={{ gross: 1000, fees: 100, refunds: 50, net: 850, feeRate: 0.1 }} />)
    expect(screen.getByTestId('pc-net').textContent).toMatch(/850\.00/)
  })

  it('renders zero state', () => {
    render(<PayoutCard payout={{ gross: 0, fees: 0, refunds: 0, net: 0, feeRate: 0.1 }} />)
    expect(screen.getByText(/no earnings yet/i)).toBeInTheDocument()
  })
})
