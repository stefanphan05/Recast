import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BillingActionButton from "@/components/billing/BillingActionButton";
import Footer from "@/components/Footer";
import PlanStatusBadge from "@/components/pricing/PlanStatusBadge";

const FREE_REWRITES_PER_MINUTE = Number(process.env.RATE_LIMIT_MAX ?? 5);
const PREMIUM_REWRITES_PER_MINUTE = Number(
  process.env.RATE_LIMIT_MAX_PREMIUM ??
    FREE_REWRITES_PER_MINUTE * 4,
);

export const metadata: Metadata = {
  title: "Pricing — Message Rewriter",
  description: "Free and Premium plans for Message Rewriter.",
};

const FREE_FEATURES = [
  `${FREE_REWRITES_PER_MINUTE} rewrites per minute`,
  "All rewrite styles",
  "No account required",
] as const;

const PREMIUM_FEATURES = [
  `Up to ${PREMIUM_REWRITES_PER_MINUTE} rewrites per minute`,
  "Priority provider routing",
  "Manage subscription anytime",
] as const;

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center px-5 py-16 sm:py-24">
        <main className="flex w-full max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
              Pricing
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
              Simple plans
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Start free, then upgrade to Premium for A$10 per month.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="flex flex-col rounded-2xl border border-neutral-950 bg-neutral-950 p-6 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-medium">Free</h2>
                <PlanStatusBadge tier="free" />
              </div>
              <p className="mt-3 text-3xl font-medium tracking-tight">
                $0
                <span className="text-sm font-normal text-white/70 dark:text-neutral-950/70">
                  {" "}
                  / forever
                </span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm leading-relaxed text-white/90 dark:text-neutral-950/90">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-white/60 dark:text-neutral-950/60" aria-hidden>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-white py-3 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90 dark:bg-neutral-950 dark:text-neutral-50"
              >
                Start rewriting
              </Link>
            </section>

            <section className="relative flex flex-col rounded-2xl border border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-medium text-neutral-950 dark:text-neutral-50">
                  Premium
                </h2>
                <PlanStatusBadge tier="premium" />
              </div>
              <p className="mt-3 text-3xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                A$10
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                  {" "}
                  / month
                </span>
              </p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Cancel anytime from your Stripe billing portal.
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-600" aria-hidden>
                      ·
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <BillingActionButton />
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
