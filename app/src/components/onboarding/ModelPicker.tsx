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
      className={`w-full cursor-pointer rounded-[20px] border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-[rgba(244,201,120,0.32)] bg-[rgba(244,201,120,0.1)] text-[var(--foreground)]"
          : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:border-[rgba(244,201,120,0.24)] hover:bg-[rgba(244,201,120,0.05)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-medium">{model.label}</span>
          {recommended ? (
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                selected
                  ? "bg-[rgba(246,239,227,0.1)] text-[var(--foreground)]"
                  : "bg-[rgba(255,255,255,0.05)] text-[var(--muted)]"
              }`}
            >
              Recommended
            </span>
          ) : null}
        </div>
        <span
          className={`shrink-0 text-xs tabular-nums ${
            selected
              ? "text-[rgba(246,239,227,0.72)]"
              : "text-[var(--muted)]"
          }`}
        >
          {model.size}
        </span>
      </div>
      <p
        className={`mt-0.5 text-xs ${
          selected
            ? "text-[rgba(246,239,227,0.8)]"
            : "text-[var(--muted)]"
        }`}
      >
        {model.description}
      </p>
    </button>
  );
}
