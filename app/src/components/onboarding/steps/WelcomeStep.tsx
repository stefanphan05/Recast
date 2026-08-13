"use client";

import { PrimaryButton } from "../OnboardingButtons";

type WelcomeStepProps = {
  onGetStarted: () => void;
};

export default function WelcomeStep({ onGetStarted }: WelcomeStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Welcome to Recast
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Rewrite messages in different styles using AI that runs entirely
          on your Mac. Your text never leaves your device.
        </p>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        This one-time setup downloads a local AI engine and a model —
        Gemma, Qwen, and more. After that, just open Recast and start
        rewriting.
      </p>
      <PrimaryButton onClick={onGetStarted}>Get started</PrimaryButton>
    </div>
  );
}
