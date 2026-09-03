import { render, screen } from '@testing-library/react'
import { RecoveryStatsCard } from '@components/RecoveryStatsCard'

describe('RecoveryStatsCard', () => {
  it('renders recovery rate and totals', () => {
    render(
      <RecoveryStatsCard
        stats={{
          total: 10, recovered: 4, pending: 6, recoveryRate: 40,
          recoveredRevenue: 400, pendingRevenue: 800,
        }}
      />,
    )
    expect(screen.getByTestId('rsc-rate').textContent).toMatch(/40%/)
    expect(screen.getByTestId('rsc').textContent).toMatch(/4 of 10/)
  })
})
