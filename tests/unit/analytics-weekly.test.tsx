import { render, screen } from '@testing-library/react'
import { WeeklyAnalyticsCard } from '@components/WeeklyAnalyticsCard'

describe('WeeklyAnalyticsCard', () => {
  it('renders revenue, orders, AOV, and top products', () => {
    const a = {
      weekStart: '2026-01-04', weekEnd: '2026-01-10',
      orderCount: 12, revenue: 1200, unitsSold: 24, averageOrderValue: 100,
      topProducts: [{ productId: 'p1', revenue: 600, qty: 10 }],
    }
    render(<WeeklyAnalyticsCard analytics={a} />)
    expect(screen.getByTestId('wac-rev').textContent).toMatch(/1,200\.00/)
    expect(screen.getByTestId('wac').textContent).toMatch(/p1/)
  })
})
