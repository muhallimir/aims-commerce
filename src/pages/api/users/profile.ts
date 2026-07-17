import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { getUserFromRequest } from "@lib/auth";
import bcrypt from "bcryptjs";
import { mapUser } from "@lib/userMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ message: "No Token" });

  if (req.method === "GET") {
    try {
      const current = (await sql`SELECT * FROM users WHERE id = ${user._id} LIMIT 1`)[0];
      if (!current) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(mapUser(current));
    } catch (e: any) {
      console.error("[/api/users/profile GET]", e);
      return res.status(500).json({ message: "Internal server error", error: e.message });
    }
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, address, city, country, storeName, password } = req.body || {};
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
    if (phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(phone); }
    if (address !== undefined) { fields.push(`address = $${idx++}`); values.push(address || null); }
    if (city !== undefined) { fields.push(`city = $${idx++}`); values.push(city || null); }
    if (country !== undefined) { fields.push(`country = $${idx++}`); values.push(country || null); }
    if (storeName !== undefined) { fields.push(`store_name = $${idx++}`); values.push(storeName || null); }
    if (password !== undefined) { fields.push(`password = $${idx++}`); values.push(bcrypt.hashSync(password, 8)); }

    if (fields.length === 0) {
      const current = (await sql`SELECT * FROM users WHERE id = ${user._id} LIMIT 1`)[0];
      return res.status(200).json(mapUser(current));
    }

    fields.push(`updated_at = NOW()`);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    values.push(user._id);

    const result = await sql.unsafe(query, values);
    return res.status(200).json(mapUser(result[0]));
  } catch (e: any) {
    console.error("[/api/users/profile PUT]", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
