"use client";

import HotkeyRecorder from "@/components/settings/HotkeyRecorder";
import { getEffectiveHotkey } from "@/lib/hotkey";
import { PrimaryButton } from "../OnboardingButtons";

type DoneStepProps = {
  globalHotkey: string;
  onFinish: () => void;
};

export default function DoneStep({ globalHotkey, onFinish }: DoneStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          You&apos;re all set
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Your model is downloaded and ready. Choose a keyboard shortcut
          to show or hide Recast from anywhere.
        </p>
      </div>

      <HotkeyRecorder
        hotkey={getEffectiveHotkey(globalHotkey)}
        variant="embedded"
      />

      <PrimaryButton onClick={onFinish}>Start rewriting</PrimaryButton>
    </div>
  );
}
