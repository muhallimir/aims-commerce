import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { getUserFromRequest } from "@lib/auth";
import bcrypt from "bcryptjs";

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
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT p.id, p.name, p.image, p.brand, p.category, p.description,
               p.price, p.count_in_stock, p.rating, p.num_reviews,
               p.seller_id, p.is_active, p.created_at, p.updated_at,
               COALESCE(
                 (SELECT json_agg(json_build_object(
                   '_id', r.id,
                   'name', r.name,
                   'rating', r.rating,
                   'comment', r.comment,
                   'created_at', r.created_at
                 ) ORDER BY r.created_at DESC)
                 FROM reviews r WHERE r.product_id = p.id),
                 '[]'
               ) AS reviews
        FROM products p
        WHERE p.id = ${id}
          AND p.is_active = true
          AND EXISTS (SELECT 1 FROM sellers s WHERE s.id = p.seller_id AND s.is_active_store = true)
      `;
      const product = rows[0];
      if (!product) {
        return res.status(404).json({ message: "Product Not Found or Store Inactive" });
      }
      return res.status(200).json({
        id: product.id,
        name: product.name,
        image: product.image,
        brand: product.brand,
        category: product.category,
        description: product.description,
        price: parseFloat(product.price),
        count_in_stock: product.count_in_stock,
        rating: parseFloat(product.rating),
        num_reviews: product.num_reviews,
        seller_id: product.seller_id,
        reviews: typeof product.reviews === "string" ? JSON.parse(product.reviews) : product.reviews || [],
        is_active: product.is_active,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
    }

    if (req.method === "PUT") {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ message: "No Token" });
      if (!user.isAdmin) return res.status(401).json({ message: "Invalid Admin Token" });

      const { name, image, price, category, brand, countInStock, description } = req.body || {};
      const result = await sql`
        UPDATE products
        SET name           = COALESCE(${name ?? null}, name),
            image          = COALESCE(${image ?? null}, image),
            price          = COALESCE(${price ?? null}, price),
            category       = COALESCE(${category ?? null}, category),
            brand          = COALESCE(${brand ?? null}, brand),
            count_in_stock = COALESCE(${countInStock ?? null}, count_in_stock),
            description    = COALESCE(${description ?? null}, description),
            updated_at     = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;
      if (!result[0]) return res.status(404).json({ message: "Product Not Found" });
      return res.status(200).json({ message: "Product Updated", product: shapeProduct(result[0]) });
    }

    if (req.method === "DELETE") {
      const user = getUserFromRequest(req);
      if (!user) return res.status(401).json({ message: "No Token" });
      if (!user.isAdmin) return res.status(401).json({ message: "Invalid Admin Token" });

      const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;
      if (!result[0]) return res.status(404).json({ message: "Product Not Found" });
      return res.status(200).json({ message: "Product Successfully Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error(`[/api/products/${id}]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
