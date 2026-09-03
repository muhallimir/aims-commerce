import { render, screen } from '@testing-library/react'
import { FraudBadge } from '@components/FraudBadge'

describe('FraudBadge', () => {
  it('renders high risk', () => {
    render(<FraudBadge score={80} level="high" flags={['new email', 'address mismatch']} />)
    expect(screen.getByTestId('fb').getAttribute('data-level')).toBe('high')
  })
  it('renders low risk', () => {
    render(<FraudBadge score={5} level="low" flags={[]} />)
    expect(screen.getByTestId('fb').getAttribute('data-level')).toBe('low')
  })
})
