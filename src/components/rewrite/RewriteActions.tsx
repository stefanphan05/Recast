"use client";

import { useRouter } from "next/navigation";
import { PAYMENTS_ENABLED } from "@/lib/features";

type RewriteActionsProps = {
  canSubmit: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  isRateLimited: boolean;
  onRewrite: () => void;
};

export default function RewriteActions({
  canSubmit,
  isLoading,
  errorMessage,
  isRateLimited,
  onRewrite,
}: RewriteActionsProps) {
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        disabled={!canSubmit}
        onClick={onRewrite}
        aria-busy={isLoading}
        className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 py-3 text-sm font-medium text-white transition-opacity enabled:cursor-pointer enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-100 dark:bg-neutral-50 dark:text-neutral-950 ${
          isLoading ? "cursor-wait opacity-80" : ""
        }`}
      >
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white dark:border-neutral-950/25 dark:border-t-neutral-950"
            aria-hidden
          />
        ) : null}
        {isLoading ? "Rewriting" : "Rewrite"}
      </button>
      {errorMessage ? (
        <div className="mt-3 flex flex-col items-center gap-2.5">
          {isRateLimited ? (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              {PAYMENTS_ENABLED
                ? "You've reached your free plan limit. Wait a moment and try again, or upgrade to Premium for higher limits and priority access."
                : "You've reached the rate limit. Wait a moment and try again."}
            </p>
          ) : (
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              {errorMessage}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onRewrite}
              className="cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-50"
            >
              Retry
            </button>
            {isRateLimited && PAYMENTS_ENABLED ? (
              <button
                type="button"
                onClick={() => router.push("/pricing")}
                className="cursor-pointer rounded-xl bg-neutral-950 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-neutral-50 dark:text-neutral-950"
              >
                Upgrade
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
