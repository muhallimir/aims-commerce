import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { requireAuth } from "@lib/auth";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" as any })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const _auth = requireAuth(req, res); if (!_auth) return;

  if (!stripe) {
    return res.status(503).json({ message: "Stripe not configured" });
  }

  try {
    const { amount } = req.body || {};
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "usd",
    });
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("[/api/orders/create-payment-intent]", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
