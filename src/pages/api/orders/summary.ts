import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAdmin } from "@lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const _auth = requireAdmin(req, res); if (!_auth) return;
  } catch (e: any) {
    if (e?.message) return res.status(500).json({ message: "Internal server error", error: e.message });
  }

  try {
    const userResult = (await sql`SELECT COUNT(*) AS cnt FROM users`)[0];
    const orderResult = (await sql`
      SELECT COUNT(*) AS numOrders, COALESCE(SUM(total_price), 0) AS totalSales FROM orders
    `)[0];
    const dailyOrders = await sql`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS "_id",
             COUNT(*) AS orders,
             COALESCE(SUM(total_price), 0) AS sales
      FROM orders GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      ORDER BY "_id" ASC
    `;
    const categories = await sql`
      SELECT category AS "_id", COUNT(*) AS count
      FROM products GROUP BY category ORDER BY count DESC
    `;

    return res.status(200).json({
      users: [{ _id: null, numUsers: Number(userResult.cnt) }],
      orders: [{ _id: null, numOrders: Number(orderResult.numOrders), totalSales: orderResult.totalSales }],
      dailyOrders: dailyOrders.map((d: any) => ({ _id: d._id, orders: Number(d.orders), sales: d.sales })),
      productCategories: categories.map((c: any) => ({ _id: c._id, count: Number(c.count) })),
    });
  } catch (err: any) {
    console.error("[/api/orders/summary]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
