import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAdmin } from "@lib/auth";
import { isLive, type Announcement } from "@lib/announcements";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const rows = (await sql`
        SELECT * FROM announcements
        WHERE active = true
        ORDER BY created_at DESC
        LIMIT 5
      `) as unknown as Announcement[];
      return res.status(200).json(rows.filter((a) => isLive(a)));
    }

    if (req.method === "POST") {
      const user = requireAdmin(req, res);
      if (!user) return;
      const { message, starts_at, ends_at } = req.body || {};
      if (!message || String(message).trim().length < 3) {
        return res.status(400).json({ message: "Message is required" });
      }
      const rows = (await sql`
        INSERT INTO announcements (message, starts_at, ends_at)
        VALUES (${String(message).trim()}, ${starts_at || null}, ${ends_at || null})
        RETURNING *
      `) as unknown as Announcement[];
      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("[/api/announcements]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
