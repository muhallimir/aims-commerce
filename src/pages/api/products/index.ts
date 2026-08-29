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
        let seller = (await sql`SELECT id FROM sellers WHERE user_id = ${user._id} LIMIT 1`)[0] as any;
        if (!seller) {
          // Auto-create seller profile for admin without one (monorepo migration fix:
          // admins were not auto-assigned a seller row, so generate new product would
          // fail with seller_id NOT NULL violation). Use the users.is_seller trigger
          // path when possible, fallback to direct insert.
          const adminRow = (await sql`SELECT name, store_name FROM users WHERE id = ${user._id}`)[0] as any;
          const storeName = adminRow?.store_name || `${adminRow?.name || "Admin"}'s Store`;
          await sql`UPDATE users SET is_seller = true, store_name = COALESCE(store_name, ${storeName}) WHERE id = ${user._id}`;
          seller = (await sql`SELECT id FROM sellers WHERE user_id = ${user._id} LIMIT 1`)[0] as any;
          if (!seller) {
            const inserted = (await sql`
              INSERT INTO sellers (id, user_id, name, store_name, is_active_store, rating, num_reviews)
              VALUES (gen_random_uuid(), ${user._id}, ${adminRow?.name || "Admin"}, ${storeName}, true, 0, 0)
              RETURNING id;
            `)[0] as any;
            seller = inserted;
          } else {
            await sql`UPDATE sellers SET is_active_store = true WHERE id = ${seller.id} AND is_active_store = false`;
          }
        } else {
          await sql`UPDATE sellers SET is_active_store = true WHERE id = ${seller.id} AND is_active_store = false`;
        }
        ownerId = seller?.id || null;
      }
      if (!ownerId) {
        return res.status(500).json({ message: "Failed to resolve seller for admin" });
      }

      const product = (await sql`
        INSERT INTO products (id, name, image, price, category, brand,
                              count_in_stock, rating, num_reviews, description, seller_id, is_active)
        VALUES (gen_random_uuid(),
                ${name || `New Product ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`},
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
