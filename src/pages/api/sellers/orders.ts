import type { NextApiRequest, NextApiResponse } from "next";
import sql from "@lib/db";
import { requireSeller } from "@lib/auth";
import { ensureIsSeller } from "@lib/sellerMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireSeller(req, res); if (!user) return;

  try {
    const { error, seller } = await ensureIsSeller(user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const orders = await sql`
      SELECT o.id, o.user_id, o.payment_method, o.items_price, o.shipping_price,
             o.tax_price, o.total_price, o.is_paid, o.paid_at, o.is_delivered, o.delivered_at,
             o.shipping_full_name, o.shipping_contact, o.shipping_address, o.shipping_city,
             o.shipping_postal_code, o.shipping_country, o.created_at, o.updated_at,
             u.name AS user_name, u.email AS user_email,
             (
               SELECT json_agg(json_build_object(
                 'product_id', oi2.product_id,
                 'seller_id', oi2.seller_id,
                 'name', oi2.name,
                 'qty', oi2.qty,
                 'price', oi2.price,
                 'image', oi2.image
               ))
               FROM order_items oi2 WHERE oi2.order_id = o.id
             ) AS items
      FROM orders o
      JOIN (
        SELECT DISTINCT order_id FROM order_items WHERE seller_id = ${seller.id}
      ) seller_orders ON seller_orders.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;

    const result = orders.map((o: any) => ({
      _id: o.id,
      user: { _id: o.user_id, name: o.user_name, email: o.user_email },
      paymentMethod: o.payment_method,
      itemsPrice: Number(o.items_price),
      shippingPrice: Number(o.shipping_price),
      taxPrice: Number(o.tax_price),
      totalPrice: Number(o.total_price),
      isPaid: o.is_paid,
      paidAt: o.paid_at,
      isDelivered: o.is_delivered,
      deliveredAt: o.delivered_at,
      shippingAddress: {
        fullName: o.shipping_full_name,
        contact: o.shipping_contact,
        address: o.shipping_address,
        city: o.shipping_city,
        postalCode: o.shipping_postal_code,
        country: o.shipping_country,
      },
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("[/api/sellers/orders]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
