import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAdmin } from "@lib/auth";
import { mapUser } from "@lib/userMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const _auth = requireAdmin(req, res); if (!_auth) return;
  } catch (r) {
    if (r instanceof Response) return r;
    throw r;
  }

  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return res.status(200).json(users.map(mapUser));
  } catch (e: any) {
    console.error("[/api/users GET]", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
