import { render, screen } from '@testing-library/react'
import { RecentlyViewedStrip } from '@components/RecentlyViewedStrip'

describe('RecentlyViewedStrip', () => {
  it('renders each product name', () => {
    render(
      <RecentlyViewedStrip
        views={[
          { productId: 'p1', viewedAt: '2026-01-05T10:00:00Z' },
        ]}
        products={[{ id: 'p1', name: 'Sneaker' }]}
      />,
    )
    expect(screen.getByTestId('rvs').textContent).toMatch(/sneaker/i)
  })
  it('renders an empty state', () => {
    render(<RecentlyViewedStrip views={[]} products={[]} />)
    expect(screen.getByText(/no recently viewed/i)).toBeInTheDocument()
  })
})
