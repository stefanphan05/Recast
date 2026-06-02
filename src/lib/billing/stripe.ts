import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2025-05-28.basil";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(apiKey, { apiVersion: STRIPE_API_VERSION });
  }

  return stripeClient;
}

export async function hasActivePremiumSubscription(
  email: string,
): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

  const customers = await stripe.customers.list({
    email: normalizedEmail,
    limit: 10,
  });

  for (const customer of customers.data) {
    if (customer.deleted) continue;

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 100,
    });

    const hasPremium = subscriptions.data.some((subscription) =>
      ["active", "trialing", "past_due"].includes(subscription.status),
    );

    if (hasPremium) return true;
  }

  return false;
}
