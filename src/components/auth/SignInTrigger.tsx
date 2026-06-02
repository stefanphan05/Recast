"use client";

import { useState, type ReactNode } from "react";
import SignInModal from "@/components/auth/SignInModal";

type SignInTriggerProps = {
  className: string;
  children: ReactNode;
};

export default function SignInTrigger({
  className,
  children,
}: SignInTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <SignInModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
