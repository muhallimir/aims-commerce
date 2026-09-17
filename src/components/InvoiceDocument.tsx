import { Box, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { InvoiceDoc } from "@lib/invoice";

function money(n: number): string {
  return `$${Number(n).toFixed(2)}`;
}

/**
 * Professional invoice sheet: letterhead, parties, line-item table,
 * stored totals, payment method. White island, print-scoped via
 * data-print-area plus the global print stylesheet.
 */
export function InvoiceDocument({ doc, printArea = false, testId = "invoice-preview" }: { doc: InvoiceDoc; printArea?: boolean; testId?: string }) {
  return (
    <Box
      data-testid={testId}
      {...(printArea ? { "data-print-area": true } : {})}
      sx={{ mt: 2, p: { xs: 2, sm: 3 }, bgcolor: "common.white", color: "common.black", border: "1px solid #e0e0e0", borderRadius: 1 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="common.black">INVOICE</Typography>
          <Typography data-testid="invoice-number" variant="body2" color="text.secondary">{doc.invoiceNumber}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2" color="text.secondary">Issued: {doc.issuedAt}</Typography>
          <Typography variant="body2" color="text.secondary">Due: {doc.dueAt}</Typography>
          <Typography variant="body2" color="text.secondary">Order: {doc.orderId.slice(0, 8)}…</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="overline" color="text.secondary">From</Typography>
          <Typography variant="body2" fontWeight={700} color="common.black">{doc.seller.name}</Typography>
          {doc.seller.email && <Typography variant="body2" color="text.secondary">{doc.seller.email}</Typography>}
          {doc.seller.addressLines.map((l) => (
            <Typography key={l} variant="body2" color="text.secondary">{l}</Typography>
          ))}
          {doc.seller.taxId && (
            <Typography variant="body2" color="text.secondary">Tax ID: {doc.seller.taxId}</Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="overline" color="text.secondary">Bill to</Typography>
          <Typography variant="body2" fontWeight={700} color="common.black">{doc.buyer.name}</Typography>
          {doc.buyer.email && <Typography variant="body2" color="text.secondary">{doc.buyer.email}</Typography>}
          {doc.buyer.addressLines.map((l) => (
            <Typography key={l} variant="body2" color="text.secondary">{l}</Typography>
          ))}
        </Box>
      </Box>
      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doc.lines.map((l, i) => (
            <TableRow key={`${l.description}-${i}`}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                {l.description}
                {l.sellerName && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Sold by {l.sellerName}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">{l.qty}</TableCell>
              <TableCell align="right">{money(l.unitPrice)}</TableCell>
              <TableCell align="right">{money(l.lineTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Box sx={{ minWidth: 220 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2" color="common.black">{money(doc.subtotal)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Shipping</Typography>
            <Typography variant="body2" color="common.black">{money(doc.shipping)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Tax</Typography>
            <Typography variant="body2" color="common.black">{money(doc.tax)}</Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" fontWeight={800} color="common.black">Total ({doc.currency})</Typography>
            <Typography data-testid="invoice-total" variant="body1" fontWeight={800} color="common.black">
              {money(doc.total)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
        Payment method: {doc.paymentMethod || "—"} · Thank you for shopping with {doc.seller.name}.
      </Typography>
    </Box>
  );
}
