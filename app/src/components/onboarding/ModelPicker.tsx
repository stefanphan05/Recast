"use client";

import {
  DEFAULT_MODEL_ID,
  RECOMMENDED_MODELS,
  type RecommendedModel,
} from "@/lib/rewrite/models";

type ModelPickerProps = {
  selectedModel: string;
  onSelect: (modelId: string) => void;
};

export default function ModelPicker({
  selectedModel,
  onSelect,
}: ModelPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {RECOMMENDED_MODELS.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          selected={selectedModel === model.id}
          recommended={model.id === DEFAULT_MODEL_ID}
          onSelect={() => onSelect(model.id)}
        />
      ))}
    </div>
  );
}

function ModelCard({
  model,
  selected,
  recommended,
  onSelect,
}: {
  model: RecommendedModel;
  selected: boolean;
  recommended: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-xl border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
          : "border-[var(--border)] bg-[var(--surface-elevated)] text-neutral-950 hover:border-neutral-400/70 dark:text-neutral-50 dark:hover:border-neutral-500/70"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-medium">{model.label}</span>
          {recommended ? (
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                selected
                  ? "bg-white/15 text-white/90 dark:bg-neutral-950/10 dark:text-neutral-950/80"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              Recommended
            </span>
          ) : null}
        </div>
        <span
          className={`shrink-0 text-xs tabular-nums ${
            selected
              ? "text-white/70 dark:text-neutral-950/70"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {model.size}
        </span>
      </div>
      <p
        className={`mt-0.5 text-xs ${
          selected
            ? "text-white/80 dark:text-neutral-950/80"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        {model.description}
      </p>
    </button>
  );
}
