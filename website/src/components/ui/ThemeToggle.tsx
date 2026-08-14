"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Starts matching the server-rendered default (html defaults to "dark") so
  // the first client paint is identical to the SSR output — no hydration
  // mismatch. Corrected to the real value right after mount, below.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // One-time sync with whatever the pre-hydration theme-init script already
    // applied to <html> (it may differ from our SSR default if the visitor
    // previously chose light mode). Runs after the SSR-matching paint above,
    // so this is a normal client update, not a hydration diff.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");

    const next = !isDark;
    root.classList.toggle("dark", next);
    window.localStorage.setItem("recast-theme", next ? "dark" : "light");
    setIsDark(next);

    window.setTimeout(() => root.classList.remove("theme-transitioning"), 300);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
