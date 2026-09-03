import { render, screen } from '@testing-library/react'
import { StockAlertBadge } from '@components/StockAlertBadge'

describe('StockAlertBadge', () => {
  it('renders "Out" for out-of-stock items', () => {
    render(<StockAlertBadge severity="out" available={0} />)
    expect(screen.getByTestId('sab').textContent).toMatch(/out/i)
  })
  it('renders "Critical" when below 25% threshold', () => {
    render(<StockAlertBadge severity="critical" available={2} />)
    expect(screen.getByTestId('sab').textContent).toMatch(/critical/i)
  })
  it('renders "OK" when healthy', () => {
    render(<StockAlertBadge severity="ok" available={50} />)
    expect(screen.getByTestId('sab').textContent).toMatch(/ok/i)
  })
})
