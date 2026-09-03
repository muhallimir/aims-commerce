import { render, screen } from '@testing-library/react'
import { CompareTable } from '@components/CompareTable'

describe('CompareTable', () => {
  it('renders a row for each field and highlights the best price', () => {
    const products = [
      { id: 'a', name: 'A', price: 100, rating: 4, inStock: true },
      { id: 'b', name: 'B', price: 80, rating: 3.5, inStock: false },
    ]
    render(<CompareTable products={products} />)
    expect(screen.getByTestId('ct-row-price').textContent).toMatch(/80/)
    expect(screen.getByTestId('ct-best-b').textContent).toMatch(/best/i)
  })

  it('renders an empty state when no products', () => {
    render(<CompareTable products={[]} />)
    expect(screen.getByText(/no products to compare/i)).toBeInTheDocument()
  })
})
