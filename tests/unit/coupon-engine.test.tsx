import { render, screen } from '@testing-library/react'
import { CouponResult } from '@components/CouponResult'

describe('CouponResult', () => {
  it('renders an accepted coupon', () => {
    render(<CouponResult ok discount={5} newSubtotal={45} />)
    expect(screen.getByTestId('cr-ok').textContent).toMatch(/5\.00/)
  })
  it('renders a rejection reason', () => {
    render(<CouponResult ok={false} reason="expired" discount={0} newSubtotal={50} />)
    expect(screen.getByTestId('cr-error').textContent).toMatch(/expired/i)
  })
})
