import { buildInvoiceDoc, renderInvoiceHtml } from "@lib/invoice";

const order = {
  id: "order-12345678",
  invoice_number: "INV-000183",
  created_at: "2026-09-01T10:00:00.000Z",
  items_price: 100,
  shipping_price: 10,
  tax_price: 8.8,
  total_price: 118.8,
  payment_method: "Stripe",
  user: { name: "Sam Buyer", email: "sam@x.com" },
  shippingAddress: {
    fullName: "Sam Buyer",
    address: "1 Orchard Rd",
    city: "Singapore",
    postalCode: "238888",
    country: "SG",
  },
  orderItems: [{ name: "Widget", qty: 2, price: 50 }],
};

const seller = {
  storeName: "Acme Store",
  taxId: "SG-123",
  address: "9 Raffles Pl",
  city: "Singapore",
  country: "SG",
  email: "acme@x.com",
};

describe("buildInvoiceDoc", () => {
  it("uses stored charged totals instead of recomputing", () => {
    const doc = buildInvoiceDoc(order, seller);
    expect(doc.invoiceNumber).toBe("INV-000183");
    expect(doc.subtotal).toBe(100);
    expect(doc.shipping).toBe(10);
    expect(doc.tax).toBe(8.8);
    expect(doc.total).toBe(118.8);
    expect(doc.paymentMethod).toBe("Stripe");
  });

  it("keeps country, tax id and due date", () => {
    const doc = buildInvoiceDoc(order, seller);
    expect(doc.buyer.addressLines).toContain("SG");
    expect(doc.seller.taxId).toBe("SG-123");
    expect(doc.issuedAt).toBe("2026-09-01");
    expect(doc.dueAt).toBe("2026-09-15");
  });

  it("falls back to platform seller when unknown", () => {
    const doc = buildInvoiceDoc(order, null);
    expect(doc.seller.name).toBe("AIMS Commerce");
  });
});

describe("renderInvoiceHtml", () => {
  it("renders a self-contained printable document", () => {
    const html = renderInvoiceHtml(buildInvoiceDoc(order, seller));
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("INV-000183");
    expect(html).toContain("Tax ID: SG-123");
    expect(html).toContain("$118.80");
    expect(html).toContain("@media print");
    expect(html).not.toContain("<script");
  });

  it("auto-prints when requested for the print flow", () => {
    const html = renderInvoiceHtml(buildInvoiceDoc(order, seller), { autoprint: true });
    expect(html).toContain("window.print()");
  });
});
