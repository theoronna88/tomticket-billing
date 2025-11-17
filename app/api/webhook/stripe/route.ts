import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.error();
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-10-29.clover",
  });
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const clerkUserId = invoice.lines.data[0].metadata.clerk_user_id;
      const customerId = invoice.customer;
      const subscriptionId =
        invoice.lines.data[0].pricing?.price_details?.price;

      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        publicMetadata: {
          subscriptionPlan: "paid",
        },
        privateMetadata: {
          stripeCustomerId: customerId as string,
          stripeSubscriptionId: subscriptionId as string,
        },
      });
    }
    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      );
      const clerkuserId = subscription.metadata.clerk_user_id;
      const client = await clerkClient();
      await client.users.updateUser(clerkuserId, {
        publicMetadata: {
          subscriptionPlan: null,
        },
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          tomTicketApiToken: null,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      );
      const clerkuserId = subscription.metadata.clerk_user_id;
      const client = await clerkClient();
      await client.users.updateUser(clerkuserId, {
        publicMetadata: {
          subscriptionPlan: null,
          tomTicketApiToken: null,
          empresaNome: null,
          cnpj: null,
          endereco: null,
          cidade: null,
          estado: null,
          cep: null,
          telefone: null,
          email: null,
          site: null,
          imageLogoUrl: null,
        },
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          tomTicketApiToken: null,
        },
      });
      break;
    }
  }
  return NextResponse.json({ received: true });
};
