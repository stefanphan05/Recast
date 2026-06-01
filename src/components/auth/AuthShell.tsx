import type { ReactNode } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppHeader />
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-24">
        <main className="mx-auto flex w-full min-h-0 max-w-lg flex-1 flex-col justify-center gap-8">
          <div className="flex flex-col gap-2.5 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              Sign in
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
              Continue with Google
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Optional — for Premium when it launches. The rewriter works without
              an account.
            </p>
          </div>

          {children}

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
            <Link
              href="/"
              className="font-medium text-neutral-950 underline decoration-neutral-400 underline-offset-2 transition-colors hover:decoration-neutral-950 dark:text-neutral-50 dark:decoration-neutral-500 dark:hover:decoration-neutral-50"
            >
              Back to rewriter
            </Link>
          </p>
        </main>
      </div>
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}
