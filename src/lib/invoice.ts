export interface InvoiceLine {
  description: string
  qty: number
  unitPrice: number
}

export interface InvoiceInput {
  invoiceNumber: string
  issuedAt: string
  dueAt?: string
  seller: { name: string; email?: string; address?: string }
  buyer: { name: string; email?: string; address?: string }
  lines: InvoiceLine[]
  taxRate?: number
  shipping?: number
  currency?: string
}

export interface InvoiceTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function computeInvoiceTotals(input: InvoiceInput): InvoiceTotals {
  const subtotal = input.lines.reduce((n, l) => n + l.unitPrice * l.qty, 0)
  const shipping = input.shipping ?? 0
  const taxRate = input.taxRate ?? 0
  const tax = Math.round((subtotal + shipping) * taxRate * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100
  return { subtotal: Math.round(subtotal * 100) / 100, shipping, tax, total }
}

function fmt(n: number, currency: string): string {
  const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }
  return `${sym[currency.toUpperCase()] ?? ''}${n.toFixed(2)}`
}

export function renderInvoiceText(input: InvoiceInput): string {
  const totals = computeInvoiceTotals(input)
  const currency = input.currency ?? 'USD'
  const lines = input.lines
    .map((l) => `${l.description}  x${l.qty}  ${fmt(l.unitPrice, currency)}  =  ${fmt(l.unitPrice * l.qty, currency)}`)
    .join('\n')
  return [
    `INVOICE ${input.invoiceNumber}`,
    `Issued: ${input.issuedAt}`,
    input.dueAt ? `Due: ${input.dueAt}` : '',
    ``,
    `From: ${input.seller.name}${input.seller.email ? ` <${input.seller.email}>` : ''}`,
    input.seller.address ?? '',
    ``,
    `To: ${input.buyer.name}${input.buyer.email ? ` <${input.buyer.email}>` : ''}`,
    input.buyer.address ?? '',
    ``,
    `Items:`,
    lines,
    ``,
    `Subtotal: ${fmt(totals.subtotal, currency)}`,
    `Shipping: ${fmt(totals.shipping, currency)}`,
    `Tax:      ${fmt(totals.tax, currency)}`,
    `TOTAL:    ${fmt(totals.total, currency)}`,
  ]
    .filter(Boolean)
    .join('\n')
}
