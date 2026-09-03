import { render, screen } from '@testing-library/react'
import { VariantMatrix } from '@components/VariantMatrix'

describe('VariantMatrix', () => {
  it('renders a cell for each axis combination', () => {
    const variants = [
      { id: 'v1', options: { size: 'S', color: 'red' }, price: 10, stock: 5 },
      { id: 'v2', options: { size: 'M', color: 'red' }, price: 10, stock: 0 },
    ]
    render(<VariantMatrix variants={variants} />)
    expect(screen.getByTestId('vm')).toBeInTheDocument()
    expect(screen.getByTestId('vm-cell-S-red').textContent).toMatch(/5/)
  })

  it('renders an empty state', () => {
    render(<VariantMatrix variants={[]} />)
    expect(screen.getByText(/no variants/i)).toBeInTheDocument()
  })
})
