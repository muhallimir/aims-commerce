import { render, screen } from '@testing-library/react'
import { RefundDialog } from '@components/RefundDialog'

describe('RefundDialog', () => {
  it('renders a success message for an accepted refund', () => {
    render(<RefundDialog decision={{ ok: true, reason: 'full_refund', refundPercent: 100, restockFeePercent: 0 }} />)
    expect(screen.getByTestId('rd-ok').textContent).toMatch(/approved/i)
    expect(screen.getByTestId('rd').textContent).toMatch(/100/)
  })

  it('renders a rejection for a final-sale item', () => {
    render(<RefundDialog decision={{ ok: false, reason: 'final_sale', refundPercent: 0, restockFeePercent: 0 }} />)
    expect(screen.getByTestId('rd-no').textContent).toMatch(/not eligible/i)
  })
})
