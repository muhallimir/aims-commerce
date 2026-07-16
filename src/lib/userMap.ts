/**
 * Shared user-mapping helper for Next.js API routes.
 * Mirrors the `mapUser` function in `backend/routers/userRouter.js`.
 */

import { generateToken } from "@lib/auth";

export function mapUser(user: any) {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    storeName: user.store_name || "",
    isAdmin: user.is_admin,
    isSeller: user.is_seller,
    sellerId: user.seller_id,
    token: generateToken({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      isSeller: user.is_seller,
    }),
  };
}
