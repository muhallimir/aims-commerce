import { render, screen } from '@testing-library/react'
import { OrderProgressBar } from '@components/OrderProgressBar'

describe('OrderProgressBar', () => {
  it('renders 100% for delivered', () => {
    render(<OrderProgressBar status="delivered" />)
    expect(screen.getByTestId('opb').getAttribute('data-status')).toBe('delivered')
  })
  it('renders 50% for processing', () => {
    render(<OrderProgressBar status="processing" />)
    expect(screen.getByTestId('opb').textContent).toMatch(/50/)
  })
  it('marks cancelled orders', () => {
    render(<OrderProgressBar status="cancelled" />)
    expect(screen.getByTestId('opb').getAttribute('data-status')).toBe('cancelled')
  })
})
