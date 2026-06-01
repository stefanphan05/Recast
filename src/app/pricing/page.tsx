import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing — Message Rewriter",
  description: "Free and Premium plans for Message Rewriter.",
};

const FREE_FEATURES = [
  "5 rewrites per minute",
  "All rewrite styles",
  "No account required",
] as const;

const PREMIUM_FEATURES = [
  "Higher rate limits",
  "Priority provider routing",
  "More coming soon…",
] as const;

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center px-5 py-24">
        <main className="flex w-full max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
              Pricing
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
              Simple plans
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Start free. Premium is on the way — we&apos;re still building it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="flex flex-col rounded-2xl border border-neutral-950 bg-neutral-950 p-6 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-medium">Free</h2>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] dark:bg-neutral-950/10">
                  Current
                </span>
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

            <section className="relative flex flex-col rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-medium text-neutral-950 dark:text-neutral-50">
                  Premium
                </h2>
                <span className="rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 text-[11px] uppercase tracking-[0.06em] text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  In development
                </span>
              </div>
              <p className="mt-3 text-3xl font-medium tracking-tight text-neutral-400 dark:text-neutral-500">
                TBD
              </p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Still cooking — check back soon hehe
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
              <Link
                href="/login"
                className="mt-8 flex w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-950 transition-colors hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:border-neutral-500"
              >
                Sign in with Google
              </Link>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
