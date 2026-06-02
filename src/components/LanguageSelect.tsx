"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type LanguageSelectOption = {
  value: string;
  label: string;
};

type LanguageSelectProps = {
  id?: string;
  label: string;
  value: string;
  options: LanguageSelectOption[];
  onChange: (value: string) => void;
  /** When true, trigger text uses placeholder-muted color. */
  muted?: boolean;
};

function labelMatches(label: string, query: string): boolean {
  const lower = label.toLowerCase();
  if (lower.startsWith(query)) return true;
  return lower.split(/\s+/).some((word) => word.startsWith(query));
}

function filterOptions(
  options: LanguageSelectOption[],
  query: string,
): LanguageSelectOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter(
    (option) =>
      labelMatches(option.label, q) ||
      option.value.toLowerCase().startsWith(q),
  );
}

export default function LanguageSelect({
  id: idProp,
  label,
  value,
  options,
  onChange,
  muted = false,
}: LanguageSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  const visibleOptions = useMemo(
    () => filterOptions(options, query),
    [options, query],
  );

  const visibleOptionsRef = useRef(visibleOptions);
  const highlightIndexRef = useRef(highlightIndex);
  const onChangeRef = useRef(onChange);
  visibleOptionsRef.current = visibleOptions;
  highlightIndexRef.current = highlightIndex;
  onChangeRef.current = onChange;

  function close() {
    setOpen(false);
    setQuery("");
    setHighlightIndex(0);
  }

  function selectOption(next: string) {
    onChange(next);
    close();
  }

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlightIndex(0);
      return;
    }
    listRef.current?.focus();
    setQuery("");
    setHighlightIndex(0);
  }, [open]);

  useEffect(() => {
    setHighlightIndex((index) =>
      Math.min(index, Math.max(0, visibleOptions.length - 1)),
    );
  }, [visibleOptions.length]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[highlightIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, open, visibleOptions]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const visible = visibleOptionsRef.current;
      const highlighted = highlightIndexRef.current;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((index) =>
          Math.min(index + 1, visible.length - 1),
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((index) => Math.max(index - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        const option = visible[highlighted];
        if (option) {
          event.preventDefault();
          onChangeRef.current(option.value);
          close();
        }
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        setQuery((prev) => prev.slice(0, -1));
        setHighlightIndex(0);
        return;
      }

      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setQuery((prev) => prev + event.key);
        setHighlightIndex(0);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex flex-col">
      <span
        id={`${id}-label`}
        className="text-[11px] uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500"
      >
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => (open ? close() : setOpen(true))}
        className="mt-2 flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-left text-[15px] leading-relaxed shadow-sm outline-none transition-[border-color,box-shadow] focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200/80 focus:ring-inset dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-700/50"
      >
        <span
          className={
            muted
              ? "text-neutral-400 dark:text-neutral-500"
              : "text-neutral-950 dark:text-neutral-50"
          }
        >
          {selectedLabel}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-neutral-400 transition-transform dark:text-neutral-500 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-full z-[60] mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-neutral-200 bg-white py-1 shadow-lg outline-none dark:border-neutral-700 dark:bg-neutral-900"
        >
          {visibleOptions.length === 0 ? (
            <li
              className="px-3 py-2.5 text-sm text-neutral-400 dark:text-neutral-500"
              aria-hidden
            >
              No matching languages
            </li>
          ) : (
            visibleOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightIndex;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHighlightIndex(index)}
                    className={`flex w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors ${
                      isHighlighted
                        ? "bg-neutral-100 font-medium text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50"
                        : isSelected
                          ? "font-medium text-neutral-950 dark:text-neutral-50"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-50"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
