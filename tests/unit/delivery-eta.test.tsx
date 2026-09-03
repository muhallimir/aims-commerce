import { render, screen } from '@testing-library/react'
import { DeliveryEtaCard } from '@components/DeliveryEtaCard'

describe('DeliveryEtaCard', () => {
  it('renders the ETA and calendar days', () => {
    render(<DeliveryEtaCard arrivesAt="2026-01-08T00:00:00Z" calendarDays={4} businessDays={3} />)
    expect(screen.getByTestId('dec').textContent).toMatch(/2026-01-08/)
    expect(screen.getByTestId('dec').textContent).toMatch(/4 calendar/i)
  })
})
