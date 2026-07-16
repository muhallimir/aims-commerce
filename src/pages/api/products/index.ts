import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { getUserFromRequest } from "@lib/auth";

function shapeProduct(p: any) {
  return {
    _id: p.id,
    name: p.name,
    image: p.image,
    brand: p.brand,
    category: p.category,
    description: p.description,
    price: parseFloat(p.price),
    countInStock: p.count_in_stock,
    rating: parseFloat(p.rating),
    numReviews: p.num_reviews,
    seller: p.seller_id,
    is_active: p.is_active,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { name, category, order, min, max, rating } = req.query;
      const sortOrder =
        order === "lowest" ? "p.price ASC"
        : order === "highest" ? "p.price DESC"
        : order === "toprated" ? "p.rating DESC"
        : "p.id ASC";

      const products = await sql`
        SELECT p.id, p.name, p.image, p.brand, p.category, p.description,
               p.price, p.count_in_stock, p.rating, p.num_reviews,
               p.seller_id, p.is_active, p.created_at, p.updated_at
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE p.is_active = true AND s.is_active_store = true
        ${name ? sql`AND p.name ILIKE ${"%" + String(name) + "%"}` : sql``}
        ${category ? sql`AND p.category = ${String(category)}` : sql``}
        ${min !== undefined && Number(min) !== 0 ? sql`AND p.price >= ${Number(min)}` : sql``}
        ${max !== undefined && Number(max) !== 0 ? sql`AND p.price <= ${Number(max)}` : sql``}
        ${rating !== undefined && Number(rating) !== 0 ? sql`AND p.rating >= ${Number(rating)}` : sql``}
        ORDER BY ${sql.unsafe(sortOrder)}
      `;

      const formatted = products.map((p: any) => ({
        ...p,
        price: parseFloat(p.price),
        count_in_stock: Number(p.count_in_stock),
        rating: parseFloat(p.rating),
        num_reviews: Number(p.num_reviews),
      }));
      return res.status(200).json(formatted);
    }

    if (req.method === "POST") {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ message: "No Token" });
      if (!user.isAdmin) return res.status(401).json({ message: "Invalid Admin Token" });

      const { seller_id, name, image, price, category, brand, countInStock, description } = req.body || {};

      let ownerId = seller_id || null;
      if (!ownerId) {
        const adminUser = (await sql`
          SELECT u.id FROM users u
          WHERE u.id = ${user._id} AND (u.is_admin = true OR u.is_seller = true)
          LIMIT 1
        `)[0];
        if (adminUser) {
          const seller = (await sql`
            SELECT id FROM sellers WHERE user_id = ${adminUser.id} LIMIT 1
          `)[0];
          ownerId = seller?.id || null;
        }
      }

      const product = (await sql`
        INSERT INTO products (id, name, image, price, category, brand,
                              count_in_stock, rating, num_reviews, description, seller_id, is_active)
        VALUES (gen_random_uuid(),
                ${name || `New Product ${Date.now()}`},
                ${image || "/images/sample.jpg"},
                ${price ?? 0},
                ${category || "Category"},
                ${brand || "Brand"},
                ${countInStock ?? 0},
                0, 0,
                ${description || "Product description"},
                ${ownerId}, true)
        RETURNING *;
      `)[0];

      return res.status(200).json({ message: "New Product Created", product: shapeProduct(product) });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("[/api/products]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
