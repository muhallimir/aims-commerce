import { render, screen } from '@testing-library/react'
import { FacetChips } from '@components/FacetChips'

describe('FacetChips', () => {
  it('renders each facet as a chip with a count', () => {
    render(<FacetChips facets={[{ value: 'shoes', count: 12 }, { value: 'hats', count: 4 }]} />)
    expect(screen.getByTestId('fc-shoes').textContent).toMatch(/12/)
  })

  it('renders an empty state', () => {
    render(<FacetChips facets={[]} />)
    expect(screen.getByText(/no facets/i)).toBeInTheDocument()
  })
})
