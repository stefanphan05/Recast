"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SignInTrigger from "@/components/auth/SignInTrigger";
import { PAYMENTS_ENABLED } from "@/lib/features";

type BillingMode = "checkout" | "portal";

async function createBillingSession(mode: BillingMode): Promise<string> {
  const endpoint =
    mode === "checkout" ? "/api/billing/checkout" : "/api/billing/portal";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as { url?: string; message?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.message ?? "Failed to open billing.");
  }

  return payload.url;
}

export default function BillingActionButton() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = user?.plan === "premium";
  const mode: BillingMode = isPremium ? "portal" : "checkout";
  const buttonLabel = useMemo(() => {
    if (isSubmitting) return "Redirecting...";
    return isPremium ? "Manage billing" : "Upgrade to Premium";
  }, [isPremium, isSubmitting]);

  if (!PAYMENTS_ENABLED) {
    return (
      <div
        className="mt-8 flex w-full cursor-not-allowed items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-100/80 py-3 text-sm font-medium text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400"
        aria-disabled="true"
      >
        Coming soon
      </div>
    );
  }

  if (!user) {
    return (
      <SignInTrigger className="mt-8 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-950">
        Sign in to subscribe
      </SignInTrigger>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-2">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={async () => {
          try {
            setError(null);
            setIsSubmitting(true);
            const url = await createBillingSession(mode);
            window.location.assign(url);
          } catch (caughtError) {
            const message =
              caughtError instanceof Error
                ? caughtError.message
                : "Failed to open billing.";
            setError(message);
            setIsSubmitting(false);
          }
        }}
        className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-neutral-100 dark:text-neutral-950"
      >
        {buttonLabel}
      </button>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
