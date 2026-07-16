import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId } = req.query;
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ message: "Invalid orderId" });
  }

  const user = requireSeller(req, res); if (!user) return;

  try {
    const { error, seller } = await ensureIsSeller(user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { isDelivered } = req.body || {};
    const deliveredAtVal = isDelivered ? new Date().toISOString() : null;

    // Verify this order contains items from this seller
    const hasItems = (await sql`
      SELECT 1 FROM order_items WHERE order_id = ${orderId} AND seller_id = ${seller.id} LIMIT 1
    `).length > 0;
    if (!hasItems) return res.status(404).json({ message: "Order not found for this seller" });

    const result = (await sql`
      UPDATE orders
      SET is_delivered = COALESCE(${isDelivered ?? null}, is_delivered),
          delivered_at = COALESCE(${deliveredAtVal ?? null}, delivered_at)
      WHERE id = ${orderId}
      RETURNING *;
    `)[0];

    if (!result) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Order status updated", order: result });
  } catch (err: any) {
    console.error(`[/api/sellers/orders/${orderId}/status]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
