"use client";

import CustomModeForm from "@/components/settings/CustomModeForm";
import { ToggleSwitch } from "@/components/settings/SettingsToggle";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  MAX_CUSTOM_MODES,
  createCustomModeId,
  isCustomStyleId,
  orderStyleOptions,
  type CustomStyleId,
  type StyleOption,
} from "@/lib/rewrite";
import {
  Delete02Icon,
  DragDropVerticalIcon,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState, type DragEvent, type KeyboardEvent } from "react";

const ICON_BUTTON_CLASS =
  "shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus-visible:outline-neutral-50";

type EditorState = { mode: "create" } | { mode: "edit"; id: CustomStyleId };

function moveItem<T>(items: T[], from: number, to: number) {
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function RewriteModesSection() {
  const { settings, updateSettings } = useAppSettings();

  const storedOrder = useMemo(
    () => orderStyleOptions(settings.styleOrder, settings.customModes),
    [settings.styleOrder, settings.customModes],
  );

  /** Live preview while a row is being dragged; null when idle. */
  const [dragOrder, setDragOrder] = useState<StyleOption[] | null>(null);
  const [draggingValue, setDraggingValue] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const options = dragOrder ?? storedOrder;

  const enabledCount = options.filter(
    (option) => !settings.hiddenStyles.includes(option.value),
  ).length;
  const canAddMode = settings.customModes.length < MAX_CUSTOM_MODES;

  function persistOrder(next: StyleOption[]) {
    void updateSettings({ styleOrder: next.map((option) => option.value) });
  }

  function handleDragStart(value: string) {
    setDraggingValue(value);
    setDragOrder(storedOrder);
  }

  /** Dragging text inside the inline form also fires dragstart/drop on the row;
   *  only the row itself may start or absorb a reorder drag. */
  function isRowDrag(event: DragEvent<HTMLLIElement>) {
    return event.target === event.currentTarget;
  }

  function handleDragEnter(index: number) {
    if (!draggingValue) return;
    const from = options.findIndex((option) => option.value === draggingValue);
    if (from === -1 || from === index) return;
    setDragOrder(moveItem(options, from, index));
  }

  /** Only a real drop commits: dragend also fires for a cancelled drag (Escape,
   *  or a release outside the list), which should leave the order untouched. */
  function handleDrop() {
    if (dragOrder) persistOrder(dragOrder);
  }

  function handleDragEnd() {
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

  function createMode(values: { label: string; prompt: string }) {
    // No styleOrder write: orderStyleOptions already appends ids it hasn't seen,
    // and materializing the order here would freeze the built-in list in place.
    void updateSettings({
      customModes: [
        ...settings.customModes,
        { id: createCustomModeId(), ...values },
      ],
    });
    setEditor(null);
  }

  function saveMode(id: CustomStyleId, values: { label: string; prompt: string }) {
    void updateSettings({
      customModes: settings.customModes.map((mode) =>
        mode.id === id ? { ...mode, ...values } : mode,
      ),
    });
    setEditor(null);
  }

  function deleteMode(id: CustomStyleId) {
    // Strip the id everywhere so no orphan entries linger in settings.json.
    void updateSettings({
      customModes: settings.customModes.filter((mode) => mode.id !== id),
      hiddenStyles: settings.hiddenStyles.filter((style) => style !== id),
      styleOrder: settings.styleOrder.filter((style) => style !== id),
    });
    setEditor(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Rewrite modes
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Choose which modes appear in Recast, drag to reorder them, or write
          your own.
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
            /** Non-null narrows `option.value` to a CustomStyleId, no casts needed. */
            const customId = isCustomStyleId(option.value) ? option.value : null;
            const isEditing =
              editor?.mode === "edit" && editor.id === option.value;

            return (
              <li
                key={option.value}
                // A draggable ancestor swallows text selection inside the form.
                draggable={editor === null}
                onDragStart={(event: DragEvent<HTMLLIElement>) => {
                  if (!isRowDrag(event)) return;
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", option.value);
                  handleDragStart(option.value);
                }}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(event: DragEvent<HTMLLIElement>) => {
                  if (!draggingValue) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event: DragEvent<HTMLLIElement>) => {
                  if (!draggingValue) return;
                  event.preventDefault();
                  handleDrop();
                }}
                onDragEnd={handleDragEnd}
                className={`py-2.5 transition-opacity first:pt-0 last:pb-0 ${
                  isDragging ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-center gap-3">
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

                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-950 dark:text-neutral-50">
                    {option.label}
                  </p>

                  {customId ? (
                    <>
                      <button
                        type="button"
                        aria-label={`Edit ${option.label}`}
                        onClick={() =>
                          setEditor(
                            isEditing ? null : { mode: "edit", id: customId },
                          )
                        }
                        className={ICON_BUTTON_CLASS}
                      >
                        <HugeiconsIcon
                          icon={PencilEdit02Icon}
                          size={16}
                          strokeWidth={2}
                          aria-hidden
                        />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${option.label}`}
                        disabled={isLastVisible}
                        onClick={() => deleteMode(customId)}
                        className={ICON_BUTTON_CLASS}
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={16}
                          strokeWidth={2}
                          aria-hidden
                        />
                      </button>
                    </>
                  ) : null}

                  <ToggleSwitch
                    label={option.label}
                    checked={visible}
                    disabled={isLastVisible}
                    onChange={(checked) => toggleMode(option.value, checked)}
                  />
                </div>

                {isEditing && customId ? (
                  <CustomModeForm
                    key={customId}
                    initialLabel={option.label}
                    initialPrompt={option.prompt}
                    onCancel={() => setEditor(null)}
                    onSave={(values) => saveMode(customId, values)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        {editor?.mode === "create" ? (
          <CustomModeForm
            key="create"
            submitLabel="Add mode"
            onCancel={() => setEditor(null)}
            onSave={createMode}
          />
        ) : (
          <button
            type="button"
            disabled={!canAddMode}
            onClick={() => setEditor({ mode: "create" })}
            className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--settings-border)] bg-[var(--settings-panel)] px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70"
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={16}
              strokeWidth={2}
              aria-hidden
            />
            Add custom mode
          </button>
        )}

        {!canAddMode ? (
          <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
            You have reached the limit of {MAX_CUSTOM_MODES} custom modes.
          </p>
        ) : null}
      </section>
    </div>
  );
}
