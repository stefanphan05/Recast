"use client";

import { useCallback } from "react";
import AppModal from "@/components/AppModal";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

type SignInModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SignInModal({ open, onClose }: SignInModalProps) {
  const requestClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AppModal open={open} onClose={requestClose} ariaLabelledBy="sign-in-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            Sign in
          </p>
          <h2
            id="sign-in-title"
            className="text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            Continue with Google
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            Optional — for Premium when it launches. The rewriter works without an
            account.
          </p>
        </div>
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-600 focus-visible:bg-neutral-200/70 focus-visible:text-neutral-600 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-8">
        <GoogleSignInButton />
      </div>
    </AppModal>
  );
}
