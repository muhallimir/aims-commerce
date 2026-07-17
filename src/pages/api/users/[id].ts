import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { getUserFromRequest, requireAuth, requireAdmin } from "@lib/auth";
import bcrypt from "bcryptjs";
import { mapUser } from "@lib/userMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  try {
    if (req.method === "GET") {
      // SECURITY: this endpoint exposes the full user row (email, phone,
      // address, store_name, is_admin, is_seller, created_at, etc). It must
      // not be world-readable. Allow only:
      //   - the user themselves, or
      //   - an admin
      // Anything else returns 401. This was previously open to anyone
      // (unauthenticated GET returned the full row), which is what the
      // StartSellingForm was abusing as a "refetch my profile" call —
      // it then dispatched the raw snake_case data into Redux and broke
      // userInfo.isSeller. The form is now fixed to use the /become response
      // directly, but we still need this gate.
      const auth = getUserFromRequest(req);
      if (!auth) return res.status(401).json({ message: "Authentication required" });
      const isSelf = auth._id === id;
      const isAdminUser = !!auth.isAdmin;
      if (!isSelf && !isAdminUser) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`)[0];
      if (!user) return res.status(404).json({ message: "User Not Found" });
      return res.status(200).json(mapUser(user));
    }

    if (req.method === "PUT") {
      const _auth = requireAdmin(req, res); if (!_auth) return;

      const existing = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`)[0];
      if (!existing) return res.status(404).json({ message: "User Not Found" });

      const { name, email, phone, address, city, country, storeName, isSeller, isAdmin } = req.body || {};
      const fields = [`updated_at = NOW()`];
      const values: any[] = [];
      let idx = 1;

      if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
      if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
      if (phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(phone); }
      if (address !== undefined) { fields.push(`address = $${idx++}`); values.push(address || null); }
      if (city !== undefined) { fields.push(`city = $${idx++}`); values.push(city || null); }
      if (country !== undefined) { fields.push(`country = $${idx++}`); values.push(country || null); }
      if (storeName !== undefined) { fields.push(`store_name = $${idx++}`); values.push(storeName || null); }
      if (isSeller !== undefined) { fields.push(`is_seller = $${idx++}`); values.push(Boolean(isSeller)); }
      if (isAdmin !== undefined) { fields.push(`is_admin = $${idx++}`); values.push(Boolean(isAdmin)); }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
      const result = await sql.unsafe(query, values);
      return res.status(200).json({ message: "User Updated", user: mapUser(result[0]) });
    }

    if (req.method === "DELETE") {
      const _auth = requireAdmin(req, res); if (!_auth) return;

      const existing = (await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`)[0];
      if (!existing) return res.status(404).json({ message: "User Not Found" });
      if (existing.email === "admin@example.com") {
        return res.status(400).json({ message: "Can Not Delete Admin User" });
      }
      await sql`DELETE FROM users WHERE id = ${id}`;
      return res.status(200).json({ message: "User Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e: any) {
    console.error(`[/api/users/${id}]`, e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
