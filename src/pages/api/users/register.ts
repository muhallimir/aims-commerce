import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import bcrypt from "bcryptjs";
import { mapUser } from "@lib/userMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = (await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (gen_random_uuid(), ${name}, ${email}, ${bcrypt.hashSync(password, 8)})
      RETURNING *
    `)[0];

    return res.status(200).json(mapUser(user));
  } catch (e: any) {
    console.error("[/api/users/register]", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
