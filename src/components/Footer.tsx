"use client";

import { useEffect, useState } from "react";

const DOB = new Date(2005, 11, 29).getTime();
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

function getPreciseAge(): string {
  const age = (Date.now() - DOB) / MS_PER_YEAR;
  return age.toFixed(15);
}

export default function Footer() {
  const [age, setAge] = useState("");

  useEffect(() => {
    const id = setInterval(() => setAge(getPreciseAge()), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="w-full px-5 pb-4 sm:pb-10">
      <div className="mx-auto max-w-lg border-t border-neutral-200 pt-3 sm:pt-8 dark:border-neutral-800">
        <p className="text-center text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
          &copy; 2026 Stefan Phan
        </p>
        {age ? (
          <p className="mt-1.5 hidden text-center font-mono text-xs tabular-nums tracking-wider text-neutral-400/80 sm:mt-2 sm:block dark:text-neutral-500/80">
            {age}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
