import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import { requireAuth } from "@lib/auth";
import sql from "@lib/db";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

const STORAGE_BUCKET = "uploads";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireAuth(req, res); if (!user) return;

  const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });

  const { fields, files } = await new Promise<any>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = Array.isArray(files.image) ? files.image[0] : files.image;
  if (!file) return res.status(400).json({ message: "No image file provided" });
  if (!file.mimetype?.startsWith("image/")) {
    return res.status(400).json({ message: "Only image files are allowed" });
  }

  try {
    const fs = await import("fs/promises");
    const buffer = await fs.readFile(file.filepath);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.originalFilename?.replace(/\s+/g, "_").toLowerCase() || "upload"}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(uniqueName, buffer, { contentType: file.mimetype, upsert: false });
    if (error) {
      return res.status(500).json({ message: "Upload failed", error: error.message });
    }

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uniqueName);
    const imageUrl = urlData.publicUrl;

    // Optionally update a product row
    const productId = Array.isArray(fields.product_id) ? fields.product_id[0] : fields.product_id;
    if (productId) {
      await sql`UPDATE products SET image = ${imageUrl}, updated_at = NOW() WHERE id = ${productId}`;
    }

    return res.status(200).send(imageUrl);
  } catch (err: any) {
    console.error("[/api/uploads POST]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
