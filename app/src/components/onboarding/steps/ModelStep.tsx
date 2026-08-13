"use client";

import ModelPicker from "@/components/onboarding/ModelPicker";
import { PrimaryButton, SecondaryButton } from "../OnboardingButtons";

type ModelStepProps = {
  selectedModel: string;
  onSelect: (model: string) => void;
  onBack: () => void;
  onDownload: () => void;
};

export default function ModelStep({
  selectedModel,
  onSelect,
  onBack,
  onDownload,
}: ModelStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          Choose a model
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Pick one to download to your Mac. Everything runs locally — no
          cloud. You can change this later in Settings.
        </p>
      </div>

      <ModelPicker selectedModel={selectedModel} onSelect={onSelect} />

      <div className="flex gap-2">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        <PrimaryButton onClick={onDownload}>Download model</PrimaryButton>
      </div>
    </div>
  );
}
