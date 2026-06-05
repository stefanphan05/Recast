"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PAYMENTS_ENABLED } from "@/lib/features";

type PlanTier = "free" | "premium";

type BillingPlanResponse = {
  plan: PlanTier;
};

export default function PlanStatusBadge({ tier }: { tier: PlanTier }) {
  const { user } = useAuth();
  const initialPlan = user?.plan === "premium" ? "premium" : "free";

  const [currentPlan, setCurrentPlan] = useState<PlanTier>(initialPlan);

  useEffect(() => {
    // For correctness after upgrading in Stripe portal/checkout, we fetch
    // the authoritative plan from the server.
    if (!user?.email) return;

    let cancelled = false;

    fetch("/api/billing/plan")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch plan.");
        return res.json() as Promise<BillingPlanResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.plan === "premium" || data.plan === "free") {
          setCurrentPlan(data.plan);
        }
      })
      .catch(() => {
        // Keep optimistic UI; rate limiting will still be correct server-side.
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const isCurrent = useMemo(() => currentPlan === tier, [currentPlan, tier]);

  if (tier === "free") {
    const label =
      currentPlan === "premium" ? "Included" : isCurrent ? "Current" : "Free";

    return (
      <span
        className={
          currentPlan === "premium"
            ? "rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-white/80 dark:bg-neutral-950/10 dark:text-neutral-950/70"
            : isCurrent
            ? "rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] dark:bg-neutral-950/10"
            : "rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-white/70 dark:bg-neutral-950/10"
        }
      >
        {label}
      </span>
    );
  }

  const premiumLabel = isCurrent
    ? "Current"
    : PAYMENTS_ENABLED
      ? "Upgrade"
      : "Coming soon";

  return (
    <span
      className={
        isCurrent
          ? "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
      }
    >
      {premiumLabel}
    </span>
  );
}

