import { render, screen } from '@testing-library/react'
import { AddressForm } from '@components/AddressForm'

describe('AddressForm', () => {
  it('renders the address summary when valid', () => {
    const a = { line1: '1 Main St', city: 'NYC', region: 'NY', postalCode: '10001', country: 'US' }
    render(<AddressForm address={a} valid errors={[]} />)
    expect(screen.getByTestId('af').textContent).toMatch(/1 main st/i)
  })
  it('renders errors when invalid', () => {
    render(<AddressForm address={{ line1: '', city: '', postalCode: '', country: '' }} valid={false} errors={['line1 required', 'city required']} />)
    expect(screen.getByTestId('af-err').textContent).toMatch(/line1 required/i)
  })
})
