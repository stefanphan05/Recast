"use client";

import AppModal from "@/components/AppModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SignInTrigger from "@/components/auth/SignInTrigger";
import { useAuth } from "@/contexts/AuthContext";

const signInClassName =
  "ml-1 rounded-lg bg-neutral-950 px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm dark:bg-neutral-50 dark:text-neutral-950";

function userInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

function UserAvatarMenu({
  email,
  name,
  image,
  plan,
  onSignOut,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
  plan: "free" | "premium";
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const planLabel = plan === "premium" ? "Premium" : "Free";
  const nameLabel = name?.trim() || "Signed in user";

  return (
    <div className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Account menu"
        className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-neutral-200 focus-visible:outline-none sm:h-9 sm:w-9 dark:ring-neutral-700"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {userInitial(email)}
          </span>
        )}
      </button>

      {open ? (
        <AppModal
          open={open}
          onClose={() => setOpen(false)}
          ariaLabelledBy="profile-title"
          panelClassName="max-w-lg pb-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
                Profile
              </p>
              <h2
                id="profile-title"
                className="truncate text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50"
              >
                {nameLabel}
              </h2>
              <p className="truncate text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
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

          <div className="mt-4 flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
              Current plan
            </p>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-950">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {planLabel}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${
                    plan === "premium"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200"
                      : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {plan}
                </span>
                {plan === "free" ? (
                  <Link
                    href="/pricing"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-85 dark:bg-neutral-100 dark:text-neutral-950"
                  >
                    Upgrade
                  </Link>
                ) : null}
              </div>
            </div>
            {plan === "free" ? (
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Unlock higher limits with Premium.{" "}
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="font-medium text-neutral-800 underline underline-offset-2 transition-opacity hover:opacity-80 dark:text-neutral-200"
                >
                  See plans
                </Link>
              </p>
            ) : null}
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-3 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full cursor-pointer rounded-2xl bg-red-600 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:bg-red-700 focus-visible:outline-none dark:bg-red-600 dark:hover:bg-red-500 dark:focus-visible:bg-red-500"
            >
              Log out
            </button>
          </div>
        </AppModal>
      ) : null}
    </div>
  );
}

export default function AuthNav() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <span
        className="mx-1 h-8 w-8 shrink-0 rounded-full bg-neutral-200/70 sm:h-9 sm:w-9 dark:bg-neutral-800"
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <UserAvatarMenu
        email={user.email}
        name={user.name}
        image={user.image}
        plan={user.plan}
        onSignOut={() => void signOut()}
      />
    );
  }

  return <SignInTrigger className={signInClassName}>Sign in</SignInTrigger>;
}
