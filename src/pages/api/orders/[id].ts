import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth, requireAdmin } from "@lib/auth";
import { buildOrderResponse } from "@lib/orderMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

    const user = requireAuth(req, res); if (!user) return;

  try {
    if (req.method === "GET") {
      const orders = await sql`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ${id}
      `;
      const order = orders[0];
      if (!order) return res.status(404).json({ message: "Order not found" });

      const items = await sql`
        SELECT product_id, seller_id, name, qty, price, "image"
        FROM order_items WHERE "order_id" = ${id}
      `;
      return res.status(200).json(buildOrderResponse(order, items, null));
    }

    if (req.method === "DELETE") {
      if (!user.isAdmin) {
        return res.status(401).json({ message: "Invalid Admin Token" });
      }
      const result = await sql.begin(async (s) => {
        await s`DELETE FROM order_items WHERE "order_id" = ${id}`;
        const deleted = await s`DELETE FROM orders WHERE id = ${id} RETURNING *`;
        return deleted[0];
      });
      if (!result) return res.status(404).json({ message: "Order Not Found" });
      return res.status(200).json({ message: "Order Deleted", order: result });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error(`[/api/orders/${id}]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
