import { render, screen } from '@testing-library/react'
import { SlugPreview } from '@components/SlugPreview'

describe('SlugPreview', () => {
  it('renders the slug and the source', () => {
    render(<SlugPreview source="Red Sneaker" slug="red-sneaker" />)
    expect(screen.getByTestId('sp').textContent).toMatch(/red-sneaker/)
  })
})
