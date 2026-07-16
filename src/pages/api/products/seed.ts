import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";

const DATA = {
  users: [
    { name: "Amir", email: "admin@example.com", password: "123456" },
    { name: "Tems", email: "customer@example.com", password: "4321" },
  ],
  products: [
    { name: "Asus ZenBook Pro Duo", category: "Electronics", image: "/uploads/p1.jpg", brand: "Asus", description: "Asus ZenBook Pro Duo UX581 15.6inch 4K UHD NanoEdge Bezel Touch, Intel Core i9-9980HK, 32GB RAM, 1TB PCIe SSD, GeForce RTX 2060", price: 899.49, countInStock: 15 },
    { name: "ASUS UX534FTC", category: "Electronics", image: "/uploads/p2.jpg", brand: "Asus", description: "ASUS UX534FTC-AS77 ZenBook 15 Laptop, 15.6\" UHD 4K NanoEdge Display, Intel Core i7-10510U, GeForce GTX 1650, 16GB, 512GB PCIe SSD, ScreenPad 2.0", price: 1299.09, countInStock: 13 },
    { name: "ASUS ROG Strix Scar 15 (2020)", category: "Electronics", image: "/uploads/p3.jpg", brand: "Asus", description: "ASUS ROG Strix Scar 15 (2020) Gaming Laptop, 15.6\" 240Hz IPS Type FHD, NVIDIA GeForce RTX 2070 Super, Intel Core i7-10875H, 16GB DDR4, 1TB PCIe NVMe SSD", price: 799.59, countInStock: 23 },
    { name: "Acer Predator Helios", category: "Electronics", image: "/uploads/p4.jpg", brand: "Acer", description: "Acer Predator Helios 300 Gaming Laptop, Intel i7-10750H, NVIDIA GeForce RTX 2060 6GB", price: 1325.29, countInStock: 24 },
    { name: "HP Pavilion Gaming", category: "Electronics", image: "/uploads/p5.jpg", brand: "HP", description: "HP Pavilion Gaming 15-Inch Micro-EDGE Laptop, Intel Core i5-9300H Processor, NVIDIA GeForce GTX 1650 4GB", price: 799.25, countInStock: 51 },
    { name: "ASUS TUF Gaming 27inch 2K HDR Gaming Monitor", category: "Electronics", image: "/uploads/p6.jpg", brand: "Asus", description: "ASUS TUF Gaming 27inch 2K HDR Gaming Monitor (VG27AQ) - WQHD (2560 x 1440), 165Hz, 1ms, Extreme Low Motion Blur", price: 659.46, countInStock: 0 },
    { name: "Acer Nitro 5", category: "Electronics", image: "/uploads/p7.jpg", brand: "Acer", description: "Acer Nitro 5 Gaming Laptop, 9th Gen Intel Core i5-9300H, NVIDIA GeForce GTX 1650, 15.6\"", price: 875.05, countInStock: 0 },
    { name: "GE Forcce RTX 2080", category: "Gaming", image: "/uploads/p8.jpg", brand: "Nvidia", description: "GeForce RTX graphics cards are powered by the Turing GPU architecture and the all-new RTX platform", price: 1249.05, countInStock: 0 },
    { name: "Razer FHD 144hz", category: "Gaming", image: "/uploads/p9.jpg", brand: "Nvidia", description: "Razer Blade 15 with 12th Gen Intel Core and NVIDIA GeForce RTX 30 Series Laptop GPUs", price: 1249.05, countInStock: 0 },
    { name: "Nike Polo Shirt", category: "Shirts", image: "/uploads/p10.jpg", brand: "Nike", description: "Nike White Polo shirt", price: 100, countInStock: 15 },
    { name: "Under Armour Shirt", category: "Electronics", image: "/uploads/p11.jpg", brand: "Under Armour", description: "Under Armour Polo", price: 120, countInStock: 13 },
    { name: "Adidas Stripe Shirt", category: "Shirts", image: "/uploads/p12.jpg", brand: "Adidas", description: "Adidas Stripe Polo shirt", price: 140, countInStock: 23 },
    { name: "Nike Slack pants", category: "Pants", image: "/uploads/p13.jpg", brand: "Nike", description: "Formal Slack Pants", price: 125, countInStock: 24 },
    { name: "Under Armour Formal pants", category: "Pants", image: "/uploads/p14.jpg", brand: "Under Armour", description: "Premium Slack Pants", price: 155, countInStock: 51 },
    { name: "Adidas Premium Pants", category: "Pants", image: "/uploads/p15.jpg", brand: "Under Armour", description: "Adidas Premium Slack Pants", price: 150, countInStock: 0 },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const adminSeller = (await sql`
      SELECT u.id FROM users u
      WHERE u.is_admin = true AND u.is_seller = true
      LIMIT 1
    `)[0];

    if (!adminSeller) {
      return res.status(400).json({ message: "No admin seller found for seeding" });
    }

    const seller = (await sql`
      SELECT id FROM sellers WHERE user_id = ${adminSeller.id} LIMIT 1
    `)[0];

    if (!seller) {
      return res.status(400).json({ message: "No seller record found for admin user" });
    }

    let count = 0;
    for (const p of DATA.products) {
      const result = await sql`
        INSERT INTO products (id, name, image, brand, category, description,
                              price, count_in_stock, rating, num_reviews, seller_id, is_active)
        VALUES (gen_random_uuid(), ${p.name}, ${p.image}, ${p.brand}, ${p.category},
                ${p.description}, ${p.price}, ${p.countInStock}, 0, 0, ${seller.id}, true)
        ON CONFLICT (name) DO NOTHING
        RETURNING id;
      `;
      if (result[0]) count++;
    }

    return res.status(200).json({ productCount: count, createdCount: count });
  } catch (err: any) {
    console.error("[/api/products/seed GET]", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}
