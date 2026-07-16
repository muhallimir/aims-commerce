/**
 * Shared seller-mapping helper for Next.js API routes.
 * Mirrors the `mapSeller` and `ensureIsSeller` helpers in
 * `backend/routers/sellerRouter.js`.
 */

import sql from "@lib/db";

export function mapSeller(s: any) {
  return {
    _id: s.id,
    name: s.name,
    email: "",
    isSeller: true,
    storeName: s.store_name || "",
    storeDescription: s.store_description || "",
    profileImage: s.profile_image || "",
    isActiveStore: s.is_active_store || false,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
}

export async function findSellerByUser(userId: string) {
  return (await sql`SELECT * FROM sellers WHERE user_id = ${userId}`)[0] || null;
}

export async function ensureIsSeller(userId: string) {
  const seller = await findSellerByUser(userId);
  if (!seller) {
    return { error: { status: 404, message: "Seller not found" }, seller: null };
  }
  return { error: null, seller };
}
