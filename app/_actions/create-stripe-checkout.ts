"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Chave secreta do Stripe não definida");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: "http://localhost:3000/app",
    cancel_url: "http://localhost:3000/app",
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
  });
  return { sessionUrl: session.url };
};
