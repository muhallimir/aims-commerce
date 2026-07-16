/**
 * Shared order-shaping helper for Next.js API routes.
 * Mirrors `buildOrderResponse` in `backend/routers/orderRouter.js`.
 */

export interface OrderRow {
  id: string;
  user_id: string;
  payment_method: string;
  items_price: string | number;
  shipping_price: string | number;
  tax_price: string | number;
  total_price: string | number;
  shipping_full_name: string;
  shipping_contact: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  is_paid: boolean;
  paid_at: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  payment_result: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export function buildOrderResponse(order: any, items: any[], userInfo: { name?: string; email?: string } | null) {
  return {
    _id: order.id,
    user: {
      _id: order.user_id,
      name: userInfo?.name || order.user_name || "",
      email: userInfo?.email || order.user_email || "",
    },
    orderItems: items.map((item) => ({
      product: item.product_id,
      name: item.name,
      qty: item.qty,
      price: Number(item.price),
      image: item.image,
      seller: item.seller_id,
    })),
    itemsPrice: Number(order.items_price),
    shippingPrice: Number(order.shipping_price),
    taxPrice: Number(order.tax_price),
    totalPrice: Number(order.total_price),
    paymentMethod: order.payment_method,
    isPaid: order.is_paid,
    paidAt: order.paid_at,
    isDelivered: order.is_delivered,
    deliveredAt: order.delivered_at,
    shippingAddress: {
      fullName: order.shipping_full_name,
      contact: order.shipping_contact,
      address: order.shipping_address,
      city: order.shipping_city,
      postalCode: order.shipping_postal_code,
      country: order.shipping_country,
    },
    paymentResult: order.payment_result ? JSON.parse(order.payment_result) : null,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}
