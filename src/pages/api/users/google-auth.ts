import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import sql from "@lib/db";
import bcrypt from "bcryptjs";
import { mapUser } from "@lib/userMap";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    }).catch((err) => {
      // Bogus / expired / wrong-audience token — return a clean 401 instead of 500.
      // The error shape from google-auth-library is an instance of GaxiosError;
      // we don't need to inspect it, just translate to 401.
      throw Object.assign(new Error("Invalid Google token"), { statusCode: 401, cause: err });
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload || {};
    if (!email) return res.status(400).json({ message: "Google login failed" });

    let user = (await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`)[0];

    if (!user) {
      const password = bcrypt.hashSync(googleId + (process.env.JWT_SECRET || ""));
      user = (await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (gen_random_uuid(), ${name || email}, ${email}, ${password})
        RETURNING *
      `)[0];
    }

    return res.status(200).json(mapUser(user));
  } catch (e: any) {
    console.error("[/api/users/google-auth]", e);
    // Distinguish auth failures (401) from server errors (500) so the test
    // suite and the frontend can react appropriately.
    if (e?.statusCode === 401) {
      return res.status(401).json({ message: e.message || "Invalid Google token" });
    }
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
