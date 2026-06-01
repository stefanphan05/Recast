"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const signInClassName =
  "ml-1 rounded-xl bg-neutral-950 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none dark:bg-neutral-50 dark:text-neutral-950";

function userInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

function UserAvatarMenu({
  email,
  image,
  onSignOut,
}: {
  email: string;
  image?: string | null;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative ml-1" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-neutral-200 focus-visible:outline-none dark:ring-neutral-700"
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
        <div className="absolute right-0 top-full z-20 pt-2">
          <div
            role="menu"
            className="min-w-30 overflow-hidden rounded-lg shadow-md"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full cursor-pointer bg-red-600 px-3 py-2 text-left text-xs font-medium text-white transition-opacity hover:opacity-90 dark:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AuthNav() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();

  if (pathname === "/login") {
    return null;
  }

  if (isLoading) {
    return (
      <span
        className="mx-1 h-9 w-9 shrink-0 rounded-full bg-neutral-200/70 dark:bg-neutral-800"
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <UserAvatarMenu
        email={user.email}
        image={user.image}
        onSignOut={() => void signOut()}
      />
    );
  }

  return (
    <Link href="/login" className={signInClassName}>
      Sign in
    </Link>
  );
}
