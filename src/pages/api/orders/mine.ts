import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth } from "@lib/auth";
import { buildOrderResponse } from "@lib/orderMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireAuth(req, res); if (!user) return;

  try {
    const orders = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ${user._id}
      ORDER BY o.created_at DESC
    `;

    const orderIds = orders.map((o) => o.id);
    const items = orderIds.length > 0
      ? await sql`
          SELECT "order_id" as order_id, product_id, seller_id, name, qty, price, "image"
          FROM order_items WHERE "order_id" = ANY(${orderIds})
        `
      : [];

    const itemsByOrder: Record<string, any[]> = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    return res.status(200).json(orders.map((o) => buildOrderResponse(o, itemsByOrder[o.id] || [], null)));
  } catch (err: any) {
    console.error("[/api/orders/mine]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
