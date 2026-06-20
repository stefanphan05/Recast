"use client";

import { checkOllamaRunning } from "@/lib/rewrite";
import { useCallback, useEffect, useState } from "react";

export default function SetupSection() {
  const [ollamaRunning, setOllamaRunning] = useState<boolean | null>(null);
  const [checkingOllama, setCheckingOllama] = useState(false);

  const refreshOllama = useCallback(async () => {
    setCheckingOllama(true);
    const running = await checkOllamaRunning();
    setOllamaRunning(running);
    setCheckingOllama(false);
    return running;
  }, []);

  useEffect(() => {
    void refreshOllama();
    const interval = window.setInterval(() => {
      void refreshOllama();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [refreshOllama]);

  async function handleOpenOllama() {
    await window.electronAPI?.openExternal("https://ollama.com");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Setup
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Recast uses Ollama to run AI models locally on your Mac.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--settings-border)] bg-[var(--settings-panel)] p-5">
        <h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
          Ollama
        </h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Install Ollama once, then keep it running in the background while you
          use Recast.
        </p>

        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          <li>Download and install Ollama from ollama.com</li>
          <li>Ollama starts automatically after install</li>
          <li>Return here and click Check again</li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => void handleOpenOllama()}>
            Open ollama.com
          </SecondaryButton>
          <SecondaryButton
            onClick={() => void refreshOllama()}
            disabled={checkingOllama}
          >
            {checkingOllama ? "Checking…" : "Check again"}
          </SecondaryButton>
        </div>

        {ollamaRunning === true ? (
          <p className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Ollama is running
          </p>
        ) : ollamaRunning === false ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-300">
            Ollama is not running yet. If you just installed it, wait a moment
            and check again.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-xl border border-[var(--settings-border)] bg-[var(--settings-panel)] px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70"
    >
      {children}
    </button>
  );
}
