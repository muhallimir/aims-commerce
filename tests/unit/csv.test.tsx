import { render, screen } from '@testing-library/react'
import { CsvPreview } from '@components/CsvPreview'

describe('CsvPreview', () => {
  it('renders the first 5 lines of the CSV', () => {
    const csv = 'id,name,price\n1,A,10\n2,B,20'
    render(<CsvPreview csv={csv} />)
    expect(screen.getByTestId('cp').textContent).toMatch(/id,name,price/)
  })
})
