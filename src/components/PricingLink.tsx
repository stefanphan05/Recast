"use client";

import IconTooltip from "@/components/IconTooltip";
import { PAYMENTS_ENABLED } from "@/lib/features";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconButtonClass =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 focus-visible:bg-neutral-200/70 focus-visible:text-neutral-600 focus-visible:outline-none sm:h-9 sm:w-9 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:bg-neutral-800 dark:focus-visible:text-neutral-200";

export default function PricingLink() {
  const pathname = usePathname();
  const isActive = pathname === "/pricing";

  return (
    <IconTooltip
      label={PAYMENTS_ENABLED ? "View pricing plans" : "Premium — coming soon"}
      align="end"
    >
      <Link
        href="/pricing"
        aria-label="Pricing"
        aria-current={isActive ? "page" : undefined}
        onMouseDown={(e) => e.preventDefault()}
        className={`${iconButtonClass} ${isActive ? "bg-neutral-200/70 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200" : ""}`}
      >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </Link>
    </IconTooltip>
  );
}
