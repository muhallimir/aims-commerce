import { render, screen } from '@testing-library/react'
import { RecommendationRow } from '@components/RecommendationRow'

describe('RecommendationRow', () => {
  it('renders each recommendation with its score', () => {
    render(
      <RecommendationRow
        items={[
          { product: { id: 'p1', name: 'Sneaker', category: 'shoes', tags: ['red'], price: 50 }, score: 80 },
        ]}
      />,
    )
    expect(screen.getByText(/sneaker/i)).toBeInTheDocument()
    expect(screen.getByTestId('rr').textContent).toMatch(/80/)
  })
  it('renders an empty state', () => {
    render(<RecommendationRow items={[]} />)
    expect(screen.getByText(/no recommendations/i)).toBeInTheDocument()
  })
})
