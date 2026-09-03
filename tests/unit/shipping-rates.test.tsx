import { render, screen } from '@testing-library/react'
import { ShippingOptions } from '@components/ShippingOptions'

describe('ShippingOptions', () => {
  it('renders each service level with its ETA', () => {
    render(
      <ShippingOptions
        options={[
          { zoneId: 'domestic', service: 'standard', rate: 6.2, etaDays: 5, currency: 'USD' },
          { zoneId: 'domestic', service: 'overnight', rate: 18.6, etaDays: 1, currency: 'USD' },
        ]}
      />,
    )
    expect(screen.getByTestId('so').textContent).toMatch(/standard/i)
    expect(screen.getByTestId('so').textContent).toMatch(/overnight/i)
  })

  it('renders an empty state', () => {
    render(<ShippingOptions options={[]} />)
    expect(screen.getByText(/no shipping options/i)).toBeInTheDocument()
  })
})
