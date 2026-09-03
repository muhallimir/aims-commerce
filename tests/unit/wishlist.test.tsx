import { render, screen } from '@testing-library/react'
import { WishlistButton } from '@components/WishlistButton'

describe('WishlistButton', () => {
  it('renders an "Add" label when item is not in wishlist', () => {
    render(<WishlistButton inList={false} onClick={() => {}} />)
    expect(screen.getByTestId('wlb').textContent).toMatch(/add/i)
  })

  it('renders a "Remove" label when item is in wishlist', () => {
    render(<WishlistButton inList onClick={() => {}} />)
    expect(screen.getByTestId('wlb').textContent).toMatch(/remove/i)
  })
})
