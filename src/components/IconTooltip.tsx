import type { ReactNode } from "react";

type IconTooltipProps = {
  label: string;
  align?: "center" | "end";
  children: ReactNode;
};

const ALIGN_CLASS = {
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
} as const;

export default function IconTooltip({
  label,
  align = "center",
  children,
}: IconTooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-neutral-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-neutral-100 dark:text-neutral-950 ${ALIGN_CLASS[align]}`}
      >
        {label}
      </span>
    </span>
  );
}
