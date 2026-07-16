import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth } from "@lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireAuth(req, res); if (!user) return;

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    const productId = id;
    const { rating, comment } = req.body || {};

    const product = (await sql`SELECT id FROM products WHERE id = ${productId} AND is_active = true`)[0];
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const existing = (await sql`
      SELECT COUNT(*) AS cnt FROM reviews
      WHERE product_id = ${productId} AND user_id = ${user._id}
    `)[0];
    if (Number(existing.cnt) > 0) {
      return res.status(400).json({ message: "You already submitted a review" });
    }

    const newReview = (await sql`
      INSERT INTO reviews (id, product_id, user_id, name, comment, rating)
      VALUES (gen_random_uuid(), ${productId}, ${user._id},
              ${user.name}, ${comment || ""}, ${rating})
      RETURNING *;
    `)[0];

    const stats = (await sql`
      SELECT COUNT(*) AS cnt, COALESCE(AVG(rating), 0)::decimal(3,2) AS avg_rating
      FROM reviews WHERE product_id = ${productId}
    `)[0];

    const avgRatingNum = parseFloat(stats.avg_rating);
    await sql`
      UPDATE products
      SET num_reviews = ${Number(stats.cnt)},
          rating      = ${avgRatingNum},
          updated_at  = NOW()
      WHERE id = ${productId}
    `;

    return res.status(201).json({
      message: "Review Created",
      review: {
        _id: newReview.id,
        name: newReview.name,
        rating: parseFloat(newReview.rating),
        comment: newReview.comment,
        created_at: newReview.created_at,
      },
    });
  } catch (err: any) {
    console.error(`[/api/products/${id}/reviews POST]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
