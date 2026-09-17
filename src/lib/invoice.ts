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

export interface InvoiceParty {
  name: string
  email?: string
  addressLines: string[]
  taxId?: string
}

export interface InvoiceDocLine {
  description: string
  qty: number
  unitPrice: number
  lineTotal: number
  sellerName?: string
}

export interface InvoiceDoc {
  invoiceNumber: string
  issuedAt: string
  dueAt: string
  orderId: string
  seller: InvoiceParty
  buyer: InvoiceParty
  lines: InvoiceDocLine[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  paymentMethod: string
}

export interface StoredOrderLike {
  id?: string
  _id?: string
  invoice_number?: string | null
  invoiceNumber?: string | null
  created_at?: string
  createdAt?: string
  items_price?: number | string
  itemsPrice?: number | string
  shipping_price?: number | string
  shippingPrice?: number | string
  tax_price?: number | string
  taxPrice?: number | string
  total_price?: number | string
  totalPrice?: number | string
  payment_method?: string
  paymentMethod?: string
  user_name?: string
  user_email?: string
  user?: { name?: string; email?: string }
  shipping_full_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_postal_code?: string
  shipping_country?: string
  shippingAddress?: { fullName?: string; address?: string; city?: string; postalCode?: string; country?: string }
  orderItems?: { name: string; qty: number; price: number | string; sellerName?: string }[]
  items?: { name: string; qty: number; price: number | string; sellerName?: string }[]
}

export interface InvoiceSellerLike {
  storeName?: string
  store_name?: string
  name?: string
  taxId?: string
  tax_id?: string
  address?: string
  city?: string
  country?: string
  email?: string
}

const money = (n: number): number => Math.round(Number(n) * 100) / 100;

function dayPlus(dateIso: string, days: number): string {
  const d = new Date(dateIso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/**
 * Build a professional invoice from STORED order values. Totals come
 * from what was actually charged (items/shipping/tax/total price),
 * never recomputed, so the invoice always matches the charge.
 */
export function buildInvoiceDoc(order: StoredOrderLike, seller: InvoiceSellerLike | null): InvoiceDoc {
  const id = String(order.id ?? order._id ?? "")
  const created = String(order.created_at ?? order.createdAt ?? new Date().toISOString())
  const rawLines = order.orderItems ?? order.items ?? []
  const buyerName =
    order.user?.name || order.user_name ||
    order.shippingAddress?.fullName || order.shipping_full_name || "Customer"
  const buyerEmail = order.user?.email || order.user_email || ""
  const buyerAddress = [
    order.shippingAddress?.address ?? order.shipping_address ?? "",
    [order.shippingAddress?.city ?? order.shipping_city ?? "",
     order.shippingAddress?.postalCode ?? order.shipping_postal_code ?? ""].join(" ").trim(),
    order.shippingAddress?.country ?? order.shipping_country ?? "",
  ].filter(Boolean)
  const sellerName =
    seller?.storeName || seller?.store_name || seller?.name || "AIMS Commerce"
  const sellerAddress = [
    seller?.address ?? "",
    [seller?.city ?? "", seller?.country ?? ""].join(" ").trim(),
  ].filter(Boolean)
  return {
    invoiceNumber: String(order.invoice_number ?? order.invoiceNumber ?? `INV-${id.slice(0, 8).toUpperCase()}`),
    issuedAt: created.slice(0, 10),
    dueAt: dayPlus(created, 14),
    orderId: id,
    seller: {
      name: sellerName,
      email: seller?.email ?? "",
      addressLines: sellerAddress,
      taxId: seller?.taxId ?? seller?.tax_id ?? "",
    },
    buyer: { name: buyerName, email: buyerEmail, addressLines: buyerAddress },
    lines: rawLines.map((l) => ({
      description: l.name,
      qty: Number(l.qty),
      unitPrice: money(Number(l.price)),
      lineTotal: money(Number(l.price) * Number(l.qty)),
      sellerName: l.sellerName ?? "",
    })),
    subtotal: money(Number(order.items_price ?? order.itemsPrice ?? 0)),
    shipping: money(Number(order.shipping_price ?? order.shippingPrice ?? 0)),
    tax: money(Number(order.tax_price ?? order.taxPrice ?? 0)),
    total: money(Number(order.total_price ?? order.totalPrice ?? 0)),
    currency: "USD",
    paymentMethod: String(order.payment_method ?? order.paymentMethod ?? ""),
  }
}

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function moneyFmt(n: number): string {
  return `$${Number(n).toFixed(2)}`
}

/**
 * Standalone printable invoice document (used for download). Self-contained
 * HTML with inline print CSS: printing it yields only the invoice.
 */
export function renderInvoiceHtml(doc: InvoiceDoc): string {
  const rows = doc.lines
    .map(
      (l, i) => `<tr>
        <td>${i + 1}</td>
        <td>${esc(l.description)}${l.sellerName ? `<div class="muted">Sold by ${esc(l.sellerName)}</div>` : ""}</td>
        <td class="num">${l.qty}</td>
        <td class="num">${moneyFmt(l.unitPrice)}</td>
        <td class="num">${moneyFmt(l.lineTotal)}</td>
      </tr>`
    )
    .join("")
  const addr = (p: InvoiceParty) =>
    [`<strong>${esc(p.name)}</strong>`, p.email ? esc(p.email) : "",
     ...p.addressLines.map(esc), p.taxId ? `Tax ID: ${esc(p.taxId)}` : ""]
      .filter(Boolean)
      .join("<br>")
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice ${esc(doc.invoiceNumber)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; background: #fff; }
  .sheet { max-width: 760px; margin: 24px auto; padding: 32px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  .muted { color: #555; font-size: 13px; }
  .cols { display: flex; gap: 24px; margin: 24px 0; }
  .cols > div { flex: 1; font-size: 14px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
  th.num, td.num { text-align: right; }
  .totals { margin-left: auto; width: 260px; margin-top: 16px; font-size: 14px; }
  .totals div { display: flex; justify-content: space-between; padding: 3px 0; }
  .grand { font-weight: bold; font-size: 17px; border-top: 2px solid #111; margin-top: 6px; padding-top: 8px; }
  .foot { margin-top: 28px; font-size: 12px; color: #555; }
  .toolbar { text-align: right; margin-bottom: 12px; }
  .toolbar button { padding: 8px 16px; font-size: 14px; cursor: pointer; }
  @media print {
    .toolbar { display: none; }
    .sheet { margin: 0; padding: 0; max-width: none; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="toolbar"><button onclick="window.print()">Print / save PDF</button></div>
  <div class="head">
    <div><h1>INVOICE</h1><div class="muted">${esc(doc.invoiceNumber)}</div></div>
    <div class="muted">Issued: ${esc(doc.issuedAt)}<br>Due: ${esc(doc.dueAt)}<br>Order: ${esc(doc.orderId.slice(0, 8))}…</div>
  </div>
  <div class="cols">
    <div><div class="muted">FROM</div>${addr(doc.seller)}</div>
    <div><div class="muted">BILL TO</div>${addr(doc.buyer)}</div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Description</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal</span><span>${moneyFmt(doc.subtotal)}</span></div>
    <div><span>Shipping</span><span>${moneyFmt(doc.shipping)}</span></div>
    <div><span>Tax</span><span>${moneyFmt(doc.tax)}</span></div>
    <div class="grand"><span>Total (${esc(doc.currency)})</span><span>${moneyFmt(doc.total)}</span></div>
  </div>
  <div class="foot">Payment method: ${esc(doc.paymentMethod || "—")} · Thank you for shopping with ${esc(doc.seller.name)}.</div>
</div>
</body>
</html>`
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
