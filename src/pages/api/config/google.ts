import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  });
}
