import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth, generateToken } from "@lib/auth";
import { findSellerByUser } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireAuth(req, res); if (!user) return;

  try {
    const { name, storeName } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existing = (await sql`SELECT * FROM users WHERE id = ${user._id}`)[0];
    if (!existing) return res.status(404).json({ message: "User not found" });
    if (existing.is_seller) {
      return res.status(400).json({ message: "User is already a seller" });
    }

    const storeNameVal = storeName || `${name}'s Store`;

    const result = await sql.begin(async (s) => {
      const updatedUser = (await s`
        UPDATE users
        SET is_seller = true, store_name = ${storeNameVal}
        WHERE id = ${user._id}
        RETURNING *;
      `)[0];

      // Trigger `trigger_auto_create_seller` creates the seller row.
      const newSeller = (await s`
        SELECT * FROM sellers WHERE user_id = ${user._id}
        ORDER BY created_at DESC LIMIT 1
      `)[0];

      if (!newSeller) throw new Error("Trigger failed to create seller record");

      await s`
        UPDATE sellers
        SET name = ${name},
            store_name = ${storeNameVal},
            is_active_store = true
        WHERE id = ${newSeller.id}
      `;

      await s`UPDATE users SET seller_id = ${newSeller.id} WHERE id = ${user._id}`;

      return {
        user: updatedUser,
        seller: { ...newSeller, name, store_name: storeNameVal, is_active_store: true },
      };
    });

    const token = generateToken({
      _id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      isAdmin: result.user.is_admin,
      isSeller: true,
    });

    return res.status(201).json({
      message: "Successfully became a seller",
      user: {
        _id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        isSeller: result.user.is_seller,
        storeName: result.user.store_name,
        createdAt: result.user.created_at,
        updatedAt: result.user.updated_at,
      },
      token,
    });
  } catch (err: any) {
    console.error("[/api/sellers/become]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
