import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/billing/stripe";

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

  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  const customer = customers.data.find((item) => !item.deleted);
  if (!customer) {
    return NextResponse.json(
      { message: "No billing account found for this user." },
      { status: 404 },
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
