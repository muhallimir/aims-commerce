import React from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { InvoiceDoc } from "@lib/invoice";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, color: "#111", fontFamily: "Helvetica" },
  head: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  invNo: { fontSize: 11, color: "#555" },
  meta: { fontSize: 10, color: "#555", textAlign: "right", lineHeight: 1.5 },
  cols: { flexDirection: "row", gap: 24, marginBottom: 16 },
  col: { flex: 1, lineHeight: 1.5 },
  label: { fontSize: 9, color: "#555", marginBottom: 2 },
  name: { fontWeight: "bold" },
  tableHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#999", paddingVertical: 4 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 4 },
  th: { fontWeight: "bold", fontSize: 10 },
  cIdx: { width: 28 },
  cDesc: { flex: 1 },
  cNum: { width: 64, textAlign: "right" },
  sub: { fontSize: 9, color: "#555" },
  totals: { marginLeft: "auto", width: 200, marginTop: 12 },
  totRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderTopColor: "#111", marginTop: 4, paddingTop: 6, fontWeight: "bold", fontSize: 13 },
  foot: { marginTop: 24, fontSize: 9, color: "#555" },
});

function money(n: number): string {
  return `$${Number(n).toFixed(2)}`;
}

function InvoicePdfDoc({ doc }: { doc: InvoiceDoc }) {
  return (
    <Document title={`Invoice ${doc.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.head}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invNo}>{doc.invoiceNumber}</Text>
          </View>
          <Text style={styles.meta}>
            Issued: {doc.issuedAt}{"\n"}Due: {doc.dueAt}{"\n"}Order: {doc.orderId.slice(0, 8)}…
          </Text>
        </View>
        <View style={styles.cols}>
          <View style={styles.col}>
            <Text style={styles.label}>FROM</Text>
            <Text style={styles.name}>{doc.seller.name}</Text>
            {doc.seller.email ? <Text>{doc.seller.email}</Text> : null}
            {doc.seller.addressLines.map((l) => (
              <Text key={l}>{l}</Text>
            ))}
            {doc.seller.taxId ? <Text>Tax ID: {doc.seller.taxId}</Text> : null}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>BILL TO</Text>
            <Text style={styles.name}>{doc.buyer.name}</Text>
            {doc.buyer.email ? <Text>{doc.buyer.email}</Text> : null}
            {doc.buyer.addressLines.map((l) => (
              <Text key={l}>{l}</Text>
            ))}
          </View>
        </View>
        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.cIdx]}>#</Text>
          <Text style={[styles.th, styles.cDesc]}>Description</Text>
          <Text style={[styles.th, styles.cNum]}>Qty</Text>
          <Text style={[styles.th, styles.cNum]}>Unit</Text>
          <Text style={[styles.th, styles.cNum]}>Amount</Text>
        </View>
        {doc.lines.map((l, i) => (
          <View key={`${l.description}-${i}`} style={styles.tableRow}>
            <Text style={styles.cIdx}>{i + 1}</Text>
            <View style={styles.cDesc}>
              <Text>{l.description}</Text>
              {l.sellerName ? <Text style={styles.sub}>Sold by {l.sellerName}</Text> : null}
            </View>
            <Text style={styles.cNum}>{l.qty}</Text>
            <Text style={styles.cNum}>{money(l.unitPrice)}</Text>
            <Text style={styles.cNum}>{money(l.lineTotal)}</Text>
          </View>
        ))}
        <View style={styles.totals}>
          <View style={styles.totRow}>
            <Text>Subtotal</Text>
            <Text>{money(doc.subtotal)}</Text>
          </View>
          <View style={styles.totRow}>
            <Text>Shipping</Text>
            <Text>{money(doc.shipping)}</Text>
          </View>
          <View style={styles.totRow}>
            <Text>Tax</Text>
            <Text>{money(doc.tax)}</Text>
          </View>
          <View style={styles.grand}>
            <Text>Total ({doc.currency})</Text>
            <Text>{money(doc.total)}</Text>
          </View>
        </View>
        <Text style={styles.foot}>
          Payment method: {doc.paymentMethod || "—"} · Thank you for shopping with {doc.seller.name}.
        </Text>
      </Page>
    </Document>
  );
}

/** Server-side binary PDF for an invoice document. */
export async function renderInvoicePdf(doc: InvoiceDoc): Promise<Uint8Array> {
  return renderToBuffer(<InvoicePdfDoc doc={doc} />);
}
