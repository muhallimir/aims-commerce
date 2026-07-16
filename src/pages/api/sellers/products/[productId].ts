import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;
  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const user = requireSeller(req, res); if (!user) return;

  try {
    const { error, seller } = await ensureIsSeller(user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    if (req.method === "PUT") {
      const { name, price, category, brand, countInStock, description, image, isActive } = req.body || {};
      const existing = (await sql`
        SELECT * FROM products WHERE id = ${productId} AND seller_id = ${seller.id}
      `)[0];
      if (!existing) return res.status(404).json({ message: "Product not found" });

      const product = (await sql`
        UPDATE products
        SET name = COALESCE(${name ?? null}, name),
            price = COALESCE(${price ?? null}, price),
            category = COALESCE(${category ?? null}, category),
            brand = COALESCE(${brand ?? null}, brand),
            count_in_stock = COALESCE(${countInStock ?? null}, count_in_stock),
            description = COALESCE(${description ?? null}, description),
            image = COALESCE(${image ?? null}, image),
            is_active = COALESCE(${isActive ?? null}, is_active)
        WHERE id = ${productId} AND seller_id = ${seller.id}
        RETURNING *;
      `)[0];

      return res.status(200).json({ message: "Product updated successfully", product });
    }

    if (req.method === "DELETE") {
      const existing = (await sql`
        SELECT * FROM products WHERE id = ${productId} AND seller_id = ${seller.id}
      `)[0];
      if (!existing) return res.status(404).json({ message: "Product not found" });

      await sql`DELETE FROM products WHERE id = ${productId} AND seller_id = ${seller.id}`;
      return res.status(200).json({ message: "Product deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error(`[/api/sellers/products/${productId}]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
