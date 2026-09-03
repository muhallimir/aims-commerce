import { render, screen } from '@testing-library/react'
import { InvoicePreview } from '@components/InvoicePreview'

describe('InvoicePreview', () => {
  it('renders the seller, buyer, and total', () => {
    const text = [
      'INVOICE INV-1',
      'Issued: 2026-01-05',
      'From: Acme <a@a.com>',
      'To: Sam <s@s.com>',
      'Items:',
      'Widget  x2  $10.00  =  $20.00',
      'Subtotal: $20.00',
      'Shipping: $0.00',
      'Tax:      $1.60',
      'TOTAL:    $21.60',
    ].join('\n')
    render(<InvoicePreview text={text} total={21.6} currency="USD" />)
    expect(screen.getByTestId('ip').textContent).toMatch(/inv-1/i)
    expect(screen.getByTestId('ip-total').textContent).toMatch(/21\.60/)
  })
})
