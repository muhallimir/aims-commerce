import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth } from "@lib/auth";
import { buildOrderResponse } from "@lib/orderMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

    const user = requireAuth(req, res); if (!user) return;

  try {
    const orderRows = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `;
    if (!orderRows[0]) return res.status(404).json({ message: "Order Not Found" });

    const paymentResult = {
      id: req.body?.id,
      status: req.body?.status,
      update_time: req.body?.update_time,
      email_address: req.body?.email_address,
    };

    const result = (await sql`
      UPDATE orders
      SET is_paid        = true,
          paid_at        = NOW(),
          payment_result = ${JSON.stringify(paymentResult)},
          updated_at     = NOW()
      WHERE id = ${id}
      RETURNING *;
    `)[0];

    const items = await sql`
      SELECT product_id, seller_id, name, qty, price, "image"
      FROM order_items WHERE "order_id" = ${id}
    `;

    return res.status(200).json({
      message: "Order Paid",
      order: buildOrderResponse(result, items, null),
    });
  } catch (err: any) {
    console.error(`[/api/orders/${id}/pay]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
