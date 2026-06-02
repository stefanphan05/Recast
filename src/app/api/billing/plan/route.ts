import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasActivePremiumSubscription } from "@/lib/billing/stripe";

type PlanTier = "free" | "premium";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    const res: { plan: PlanTier } = { plan: "free" };
    return NextResponse.json(res, { status: 200 });
  }

  const isPremium = await hasActivePremiumSubscription(email);
  const res: { plan: PlanTier } = { plan: isPremium ? "premium" : "free" };
  return NextResponse.json(res, { status: 200 });
}

