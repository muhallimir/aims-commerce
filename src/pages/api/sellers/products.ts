import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

function shapeProduct(p: any) {
  return {
    _id: p.id,
    id: p.id,
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
    isActive: p.is_active,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireSeller(req, res); if (!user) return;

  try {
    if (req.method === "GET") {
      const { error, seller } = await ensureIsSeller(user._id);
      if (error) return res.status(error.status).json({ message: error.message });

      const products = await sql`
        SELECT * FROM products WHERE seller_id = ${seller.id}
        ORDER BY created_at DESC
      `;
      return res.status(200).json(products.map(shapeProduct));
    }

    if (req.method === "POST") {
      const { error, seller } = await ensureIsSeller(user._id);
      if (error) return res.status(error.status).json({ message: error.message });

      const { name, image, price, category, brand, countInStock, description } = req.body || {};
      if (!name || !price || !category || !brand || countInStock === undefined || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = (await sql`
        INSERT INTO products (id, name, image, brand, category, description,
                              price, count_in_stock, rating, num_reviews,
                              seller_id, is_active)
        VALUES (gen_random_uuid(), ${name}, ${image || "/images/sample.jpg"},
                ${brand}, ${category}, ${description},
                ${Number(price)}, ${Number(countInStock)}, 0, 0,
                ${seller.id}, true)
        RETURNING *;
      `)[0];

      return res.status(201).json({ message: "Product created successfully", product: shapeProduct(product) });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("[/api/sellers/products]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
