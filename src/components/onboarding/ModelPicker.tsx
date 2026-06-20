"use client";

import {
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
          onSelect={() => onSelect(model.id)}
        />
      ))}
    </div>
  );
}

function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: RecommendedModel;
  selected: boolean;
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
        <span className="text-sm font-medium">{model.label}</span>
        <span
          className={`text-xs tabular-nums ${
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
      <p
        className={`mt-1 font-mono text-[11px] ${
          selected
            ? "text-white/60 dark:text-neutral-950/60"
            : "text-neutral-400 dark:text-neutral-500"
        }`}
      >
        {model.id}
      </p>
    </button>
  );
}
