import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/billing/stripe";

const PREMIUM_PRICE_AUD_CENTS = 1000;

export async function POST() {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { message: "Stripe is not configured." },
      { status: 500 },
    );
  }

  const origin =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL;

  if (!origin) {
    return NextResponse.json(
      { message: "App URL is not configured." },
      { status: 500 },
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${origin}/pricing?success=1`,
    cancel_url: `${origin}/pricing?canceled=1`,
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: PREMIUM_PRICE_AUD_CENTS,
          recurring: { interval: "month" },
          product_data: {
            name: "Message Rewriter Premium",
            description: "Premium subscription billed monthly",
          },
        },
      },
    ],
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    subscription_data: {
      metadata: {
        app_plan: "premium",
      },
    },
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      { message: "Failed to create checkout session." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}
