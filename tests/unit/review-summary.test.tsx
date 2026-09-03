import { render, screen } from '@testing-library/react'
import { ReviewSummaryCard } from '@components/ReviewSummaryCard'

describe('ReviewSummaryCard', () => {
  it('renders the average and total count', () => {
    render(
      <ReviewSummaryCard
        summary={{
          count: 10, average: 4.3,
          histogram: { 1: 0, 2: 1, 3: 1, 4: 4, 5: 4 },
          verifiedCount: 6, pctVerified: 60,
        }}
      />,
    )
    expect(screen.getByTestId('rsc-avg').textContent).toMatch(/4\.3/)
    expect(screen.getByTestId('rsc').textContent).toMatch(/10/)
  })
  it('renders a zero state', () => {
    render(
      <ReviewSummaryCard
        summary={{ count: 0, average: 0, histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, verifiedCount: 0, pctVerified: 0 }}
      />,
    )
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument()
  })
})
