import { render, screen } from '@testing-library/react'
import { PriceTag } from '@components/PriceTag'

describe('PriceTag', () => {
  it('renders the price in the target currency', () => {
    render(<PriceTag amount={99.99} currency="USD" />)
    expect(screen.getByTestId('pt').textContent).toMatch(/99\.99/)
  })

  it('renders a strikethrough when on sale', () => {
    render(<PriceTag amount={80} currency="USD" compareAt={120} />)
    const el = screen.getByTestId('pt')
    expect(el.textContent).toMatch(/120/)
    expect(el.textContent).toMatch(/80/)
  })
})
