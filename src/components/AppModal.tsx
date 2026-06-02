"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  panelClassName?: string;
};

export default function AppModal({
  open,
  onClose,
  children,
  ariaLabelledBy,
  ariaLabel,
  panelClassName,
}: AppModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-neutral-950/40 modal-backdrop-in dark:bg-neutral-950/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        className={`relative flex w-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl modal-panel-in dark:border-neutral-800 dark:bg-neutral-900 ${
          panelClassName ?? "max-w-lg"
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
