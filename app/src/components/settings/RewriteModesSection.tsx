"use client";

import { ToggleSwitch } from "@/components/settings/SettingsToggle";
import { useAppSettings } from "@/hooks/useAppSettings";
import { orderStyleOptions, type StyleOption } from "@/lib/rewrite";
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState, type DragEvent, type KeyboardEvent } from "react";

function moveItem<T>(items: T[], from: number, to: number) {
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function RewriteModesSection() {
  const { settings, updateSettings } = useAppSettings();

  const storedOrder = useMemo(
    () => orderStyleOptions(settings.styleOrder),
    [settings.styleOrder],
  );

  /** Live preview while a row is being dragged; null when idle. */
  const [dragOrder, setDragOrder] = useState<StyleOption[] | null>(null);
  const [draggingValue, setDraggingValue] = useState<string | null>(null);
  const options = dragOrder ?? storedOrder;

  const enabledCount = options.filter(
    (option) => !settings.hiddenStyles.includes(option.value),
  ).length;

  function persistOrder(next: StyleOption[]) {
    void updateSettings({ styleOrder: next.map((option) => option.value) });
  }

  function handleDragStart(value: string) {
    setDraggingValue(value);
    setDragOrder(storedOrder);
  }

  function handleDragEnter(index: number) {
    if (!draggingValue) return;
    const from = options.findIndex((option) => option.value === draggingValue);
    if (from === -1 || from === index) return;
    setDragOrder(moveItem(options, from, index));
  }

  function handleDragEnd() {
    if (dragOrder) persistOrder(dragOrder);
    setDragOrder(null);
    setDraggingValue(null);
  }

  function handleHandleKeyDown(event: KeyboardEvent, index: number) {
    const delta =
      event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (delta === 0) return;

    const target = index + delta;
    if (target < 0 || target >= options.length) return;

    event.preventDefault();
    persistOrder(moveItem(options, index, target));
  }

  function toggleMode(value: string, visible: boolean) {
    const hiddenStyles = visible
      ? settings.hiddenStyles.filter((style) => style !== value)
      : [...settings.hiddenStyles, value];
    void updateSettings({ hiddenStyles });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Rewrite modes
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Choose which modes appear in Recast, and drag to reorder them.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
        <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
          Modes
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          At least one mode stays visible.
        </p>

        <ul className="mt-3 divide-y divide-[var(--settings-border)]">
          {options.map((option, index) => {
            const visible = !settings.hiddenStyles.includes(option.value);
            const isLastVisible = visible && enabledCount === 1;
            const isDragging = draggingValue === option.value;

            return (
              <li
                key={option.value}
                draggable
                onDragStart={(event: DragEvent<HTMLLIElement>) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", option.value);
                  handleDragStart(option.value);
                }}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(event: DragEvent<HTMLLIElement>) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event: DragEvent<HTMLLIElement>) =>
                  event.preventDefault()
                }
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 py-2.5 transition-opacity first:pt-0 last:pb-0 ${
                  isDragging ? "opacity-40" : ""
                }`}
              >
                <button
                  type="button"
                  aria-label={`Reorder ${option.label}`}
                  onKeyDown={(event) => handleHandleKeyDown(event, index)}
                  className="shrink-0 cursor-grab rounded-md p-0.5 text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:cursor-grabbing dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus-visible:outline-neutral-50"
                >
                  <HugeiconsIcon
                    icon={DragDropVerticalIcon}
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>

                <p className="min-w-0 flex-1 text-sm font-medium text-neutral-950 dark:text-neutral-50">
                  {option.label}
                </p>

                <ToggleSwitch
                  label={option.label}
                  checked={visible}
                  disabled={isLastVisible}
                  onChange={(checked) => toggleMode(option.value, checked)}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
