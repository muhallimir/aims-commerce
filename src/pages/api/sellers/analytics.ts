import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireSeller(req, res); if (!user) return;

  try {
    const { error, seller } = await ensureIsSeller(user._id);
    if (error) return res.status(error.status).json({ message: error.message });
    const sellerId = seller.id;

    const revenueResult = await sql`
      SELECT COALESCE(SUM(oi.price * oi.qty), 0) AS total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.seller_id = ${sellerId}
        AND o.is_paid = true
    `;
    const totalRevenue = Number(revenueResult[0].total_revenue);

    const totalOrders = await sql`
      SELECT COUNT(DISTINCT o.id) AS count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.seller_id = ${sellerId}
        AND o.is_paid = true
    `;
    const numOrders = Number(totalOrders[0].count);

    const totalProducts = await sql`
      SELECT COUNT(*) AS count FROM products WHERE seller_id = ${sellerId}
    `;
    const numProducts = Number(totalProducts[0].count);

    const dailySales = await sql`
      SELECT TO_CHAR(o.created_at, 'YYYY-MM-DD') AS "_id",
             COALESCE(SUM(oi.price * oi.qty), 0) AS sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.seller_id = ${sellerId}
        AND o.is_paid = true
      GROUP BY TO_CHAR(o.created_at, 'YYYY-MM-DD')
      ORDER BY "_id" ASC
    `;

    const productSales = await sql`
      SELECT p.id, p.name,
             COALESCE(SUM(oi.qty), 0)::int AS units_sold,
             COALESCE(SUM(oi.price * oi.qty), 0) AS revenue
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.is_paid = true
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.id, p.name
      ORDER BY units_sold DESC
    `;

    const lowStock = await sql`
      SELECT id, name, count_in_stock
      FROM products
      WHERE seller_id = ${sellerId} AND count_in_stock < 10
      ORDER BY count_in_stock ASC
      LIMIT 10
    `;

    return res.status(200).json({
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        numOrders,
        numProducts,
        sellerRating: Number(seller.rating || 0),
        numReviews: Number(seller.num_reviews || 0),
      },
      dailySales: dailySales.map((d: any) => ({ _id: d._id, sales: Number(d.sales) })),
      productSales: productSales.map((p: any) => ({
        _id: p.id,
        name: p.name,
        unitsSold: p.units_sold,
        revenue: Number(p.revenue),
      })),
      lowStock: lowStock.map((p: any) => ({
        _id: p.id,
        name: p.name,
        countInStock: p.count_in_stock,
      })),
    });
  } catch (err: any) {
    console.error("[/api/sellers/analytics]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
