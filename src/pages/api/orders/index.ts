import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireAuth, requireAdmin } from "@lib/auth";
import { buildOrderResponse } from "@lib/orderMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
            const user = requireAuth(req, res); if (!user) return;
      if (!user.isAdmin) {
        return res.status(401).json({ message: "Invalid Admin Token" });
      }

      const orders = await sql`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `;

      const orderIds = orders.map((o) => o.id);
      const allItems = orderIds.length > 0
        ? await sql`
            SELECT "order_id" as order_id, product_id, seller_id, name, qty, price, "image"
            FROM order_items WHERE "order_id" = ANY(${orderIds})
          `
        : [];

      const itemsByOrder: Record<string, any[]> = {};
      for (const item of allItems) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        itemsByOrder[item.order_id].push(item);
      }

      return res.status(200).json(orders.map((o) => buildOrderResponse(o, itemsByOrder[o.id] || [], null)));
    }

    if (req.method === "POST") {
            const user = requireAuth(req, res); if (!user) return;

      const { orderItems, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress } = req.body || {};
      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const productIds = orderItems.map((item: any) => item.product);
      const products = await sql`SELECT id, seller_id FROM products WHERE id = ANY(${productIds})`;
      if (products.length !== productIds.length) {
        return res.status(400).json({ message: "One or more products not found" });
      }

      const sellerMap: Record<string, string> = {};
      for (const p of products) sellerMap[p.id] = p.seller_id;

      const result = await sql.begin(async (s) => {
        const order = (await s`
          INSERT INTO orders
            (id, user_id, payment_method, items_price, shipping_price,
             tax_price, total_price,
             shipping_full_name, shipping_contact, shipping_address,
             shipping_city, shipping_postal_code, shipping_country,
             is_paid, is_delivered)
          VALUES (gen_random_uuid(), ${user._id}, ${paymentMethod},
                  ${itemsPrice}, ${shippingPrice},
                  ${taxPrice}, ${totalPrice},
                  ${shippingAddress.fullName}, ${shippingAddress.contact},
                  ${shippingAddress.address}, ${shippingAddress.city},
                  ${shippingAddress.postalCode}, ${shippingAddress.country},
                  false, false)
          RETURNING *;
        `)[0];

        for (const item of orderItems) {
          await s`
            INSERT INTO order_items (id, "order_id", product_id, seller_id, name, qty, "image", price)
            VALUES (gen_random_uuid(), ${order.id}, ${item.product},
                    ${sellerMap[item.product] || null}, ${item.name},
                    ${item.qty}, ${item.image}, ${item.price})
          `;
        }

        const fullOrder = (await s`
          SELECT o.*, u.name as user_name, u.email as user_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE o.id = ${order.id}
        `)[0];

        const items = await s`
          SELECT product_id, seller_id, name, qty, price, "image"
          FROM order_items WHERE "order_id" = ${order.id}
        `;

        return { order: fullOrder, items };
      });

      return res.status(201).json({
        message: "New Order Created",
        order: buildOrderResponse(result.order, result.items, null),
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("[/api/orders]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
