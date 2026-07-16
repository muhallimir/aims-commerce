import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const cats = await sql`
      SELECT DISTINCT p.category
      FROM products p
      JOIN sellers s ON p.seller_id = s.id
      WHERE p.is_active = true AND s.is_active_store = true
      ORDER BY p.category ASC
    `;
    return res.status(200).json(Array.from(cats).map((c: any) => c.category));
  } catch (err: any) {
    console.error("[/api/products/categories GET]", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}
