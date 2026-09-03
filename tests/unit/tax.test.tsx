import { render, screen } from '@testing-library/react'
import { TaxRow } from '@components/TaxRow'

describe('TaxRow', () => {
  it('renders a 0% rate for no-tax regions', () => {
    render(<TaxRow subtotal={100} country="US" region="OR" />)
    expect(screen.getByTestId('tr').textContent).toMatch(/no sales tax/i)
  })
  it('renders a positive rate for CA', () => {
    render(<TaxRow subtotal={100} country="US" region="CA" />)
    expect(screen.getByTestId('tr-amount').textContent).toMatch(/7\.25/)
  })
})
