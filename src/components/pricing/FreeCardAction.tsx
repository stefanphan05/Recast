"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function FreeCardAction() {
  const { user } = useAuth();

  const isPremium = user?.plan === "premium";

  if (isPremium) {
    return (
      <div
        className="mt-8 flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-white/90 py-3 text-sm font-medium text-neutral-950/70 dark:bg-neutral-950/90 dark:text-neutral-50/70"
        aria-disabled="true"
      >
        Included with Premium
      </div>
    );
  }

  return (
    <Link
      href="/"
      className="mt-8 flex w-full items-center justify-center rounded-2xl bg-white py-3 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90 dark:bg-neutral-950 dark:text-neutral-50"
    >
      Start rewriting
    </Link>
  );
}

