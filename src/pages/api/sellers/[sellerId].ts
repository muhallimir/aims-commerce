import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { mapSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { sellerId } = req.query;
  if (!sellerId || typeof sellerId !== "string") {
    return res.status(400).json({ message: "Invalid sellerId" });
  }

  try {
    const sellers = await sql`SELECT * FROM sellers WHERE id = ${sellerId}`;
    const seller = sellers[0];
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const userRows = await sql`SELECT email FROM users WHERE id = ${seller.user_id}`;
    const mapped = mapSeller(seller);
    return res.status(200).json({ ...mapped, email: userRows[0]?.email || "" });
  } catch (err: any) {
    console.error(`[/api/sellers/${sellerId}]`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
