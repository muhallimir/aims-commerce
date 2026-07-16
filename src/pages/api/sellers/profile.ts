import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireSeller(req, res); if (!user) return;

  try {
    const {
      name, storeName, storeDescription, phone, address, city, country, isActiveStore,
    } = req.body || {};

    if (!name || !storeName) {
      return res.status(400).json({ message: "Missing required fields: name and storeName are required" });
    }

    const { error, seller } = await ensureIsSeller(user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const result = await sql.begin(async (s) => {
      const updatedUser = (await s`
        UPDATE users
        SET name = ${name},
            phone = COALESCE(${phone ?? null}, phone),
            address = COALESCE(${address ?? null}, address),
            city = COALESCE(${city ?? null}, city),
            country = COALESCE(${country ?? null}, country),
            store_name = COALESCE(${storeName ?? null}, store_name)
        WHERE id = ${user._id} AND is_seller = true
        RETURNING *;
      `)[0];

      const updatedSeller = (await s`
        UPDATE sellers
        SET name = ${name},
            store_name = COALESCE(${storeName ?? null}, store_name),
            store_description = COALESCE(${storeDescription ?? null}, store_description),
            is_active_store = COALESCE(${isActiveStore ?? null}, is_active_store)
        WHERE id = ${seller.id}
        RETURNING *;
      `)[0];

      return { user: updatedUser, seller: updatedSeller };
    });

    if (!result.user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Seller profile updated successfully",
      user: {
        _id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone || "",
        address: result.user.address || "",
        city: result.user.city || "",
        country: result.user.country || "",
        isSeller: result.user.is_seller,
        storeName: result.user.store_name || "",
        updatedAt: result.user.updated_at,
      },
      seller: {
        _id: result.seller.id,
        storeName: result.seller.store_name || "",
        storeDescription: result.seller.store_description || "",
        isActiveStore: result.seller.is_active_store || false,
        updatedAt: result.seller.updated_at,
      },
    });
  } catch (err: any) {
    console.error("[/api/sellers/profile PUT]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
