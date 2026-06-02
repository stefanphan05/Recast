import Stripe from "stripe";

const STRIPE_API_VERSION = "2026-05-27.dahlia" as const;

let stripeClient: Stripe | null = null;

type PremiumStatusCacheEntry = {
  hasPremium: boolean;
  expiresAt: number;
};

const premiumStatusCache = new Map<string, PremiumStatusCacheEntry>();
const PREMIUM_STATUS_CACHE_TTL_MS = Number(
  process.env.PREMIUM_STATUS_CACHE_TTL_MS ?? 10_000,
);

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

  const cached = premiumStatusCache.get(normalizedEmail);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.hasPremium;
  }

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

    if (hasPremium) {
      premiumStatusCache.set(normalizedEmail, {
        hasPremium: true,
        expiresAt: Date.now() + PREMIUM_STATUS_CACHE_TTL_MS,
      });
      return true;
    }
  }

  premiumStatusCache.set(normalizedEmail, {
    hasPremium: false,
    expiresAt: Date.now() + PREMIUM_STATUS_CACHE_TTL_MS,
  });
  return false;
}
