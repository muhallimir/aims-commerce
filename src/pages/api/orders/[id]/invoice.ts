import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { getUserFromCookieToken, getUserFromRequest } from "@lib/auth";
import { buildInvoiceDoc, renderInvoiceHtml } from "@lib/invoice";
import { renderInvoicePdf } from "@lib/invoicePdf";

/**
 * GET /api/orders/[id]/invoice — professional invoice for one order.
 * Visible to the buyer, admins, and sellers with items on the order.
 * ?format=html returns a standalone printable document for download.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, format } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }
  // Bearer header for API fetches, `token` cookie for new-tab
  // print/download navigations (window.open sends no headers).
  const user = getUserFromRequest(req) ?? getUserFromCookieToken(req.cookies?.token);
  if (!user) return res.status(401).json({ message: "No Token" });

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const rows = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `;
    const order = rows[0];
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = await sql`
      SELECT product_id, seller_id, name, qty, price, "image"
      FROM order_items WHERE "order_id" = ${id}
    `;

    const isOwner = order.user_id === user._id;
    let isSeller = false;
    if (!isOwner && !user.isAdmin) {
      const sellerIds = [...new Set(items.map((i: any) => i.seller_id).filter(Boolean))];
      if (sellerIds.length > 0) {
        const mine = await sql`
          SELECT 1 FROM sellers WHERE id = ANY(${sellerIds}) AND user_id = ${user._id} LIMIT 1
        `;
        isSeller = mine.length > 0;
      }
    }
    if (!isOwner && !user.isAdmin && !isSeller) {
      return res.status(403).json({ message: "Not your order" });
    }

    // Primary seller: first item's store, with tax id and address for the letterhead.
    const firstSellerId = items.map((i: any) => i.seller_id).find(Boolean) || null;
    let sellerInfo: any = null;
    if (firstSellerId) {
      const srows = await sql`
        SELECT s.store_name, s.name, s.tax_id, u.address, u.city, u.country, u.email
        FROM sellers s LEFT JOIN users u ON u.id = s.user_id
        WHERE s.id = ${firstSellerId}
      `;
      const s = srows[0];
      if (s) {
        sellerInfo = {
          storeName: s.store_name || s.name,
          taxId: s.tax_id || "",
          address: s.address || "",
          city: s.city || "",
          country: s.country || "",
          email: s.email || "",
        };
      }
    }
    const storeNames: Record<string, string> = {};
    if (items.some((i: any) => i.seller_id)) {
      const ids = [...new Set(items.map((i: any) => i.seller_id).filter(Boolean))];
      const snames = await sql`SELECT id, store_name, name FROM sellers WHERE id = ANY(${ids})`;
      for (const s of snames) storeNames[s.id] = s.store_name || s.name;
    }

    const doc = buildInvoiceDoc(
      {
        ...order,
        orderItems: items.map((i: any) => ({
          name: i.name,
          qty: i.qty,
          price: Number(i.price),
          sellerName: i.seller_id ? storeNames[i.seller_id] || "" : "",
        })),
      },
      sellerInfo
    );

    if (format === "pdf") {
      const pdf = await renderInvoicePdf(doc);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${doc.invoiceNumber}.pdf"`);
      return res.status(200).send(Buffer.from(pdf));
    }
    if (format === "html") {
      const autoprint = req.query.autoprint === "1";
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `inline; filename="${doc.invoiceNumber}.html"`);
      return res.status(200).send(renderInvoiceHtml(doc, { autoprint }));
    }
    return res.status(200).json({ doc });
  } catch (err: any) {
    console.error(`[/api/orders/${id}/invoice]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
