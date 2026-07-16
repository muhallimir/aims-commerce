import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import bcrypt from "bcryptjs";
import { mapUser } from "@lib/userMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = (await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`)[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json(mapUser(user));
  } catch (e: any) {
    console.error("[/api/users/signin]", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
