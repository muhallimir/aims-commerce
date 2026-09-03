import { render, screen } from '@testing-library/react'
import { BundlePricingHint } from '@components/BundlePricingHint'

describe('BundlePricingHint', () => {
  it('renders the next tier message', () => {
    render(
      <BundlePricingHint
        message="Add 2 more to save $4.00"
        targetQty={3}
      />,
    )
    expect(screen.getByTestId('bph').textContent).toMatch(/add 2 more/i)
  })
})
