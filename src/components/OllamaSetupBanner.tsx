"use client";

import {
  getOllamaHealthStatus,
  type OllamaHealthStatus,
} from "@/lib/rewrite/ollama";
import { useCallback, useEffect, useState } from "react";

type OllamaSetupBannerProps = {
  selectedModel: string;
};

export default function OllamaSetupBanner({
  selectedModel,
}: OllamaSetupBannerProps) {
  const [health, setHealth] = useState<OllamaHealthStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    setChecking(true);
    const status = await getOllamaHealthStatus(selectedModel);
    setHealth(status);
    if (status.status === "ok") {
      setDismissed(false);
    }
    setChecking(false);
  }, [selectedModel]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (dismissed || health?.status === "ok" || health === null) {
    return null;
  }

  const model = health.status === "model_missing" ? health.model : selectedModel;

  return (
    <div
      role="alert"
      className="border-b border-amber-200/80 bg-amber-50/75 px-4 py-3 text-sm text-amber-950 backdrop-blur-md dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {health.status === "not_running" ? (
            <>
              <p className="font-medium">Ollama is not running</p>
              <ol className="list-decimal space-y-0.5 pl-5 text-amber-900/90 dark:text-amber-100/90">
                <li>
                  Install Ollama from{" "}
                  <a
                    href="https://ollama.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    ollama.com
                  </a>
                </li>
                <li>
                  Run:{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/50">
                    ollama pull {selectedModel}
                  </code>
                </li>
                <li>Ollama starts automatically after install</li>
              </ol>
              <p className="text-amber-900/80 dark:text-amber-100/80">
                If Ollama is installed but not running, open your terminal and
                run{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/50">
                  ollama serve
                </code>
                .
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Required model not installed</p>
              <p className="text-amber-900/90 dark:text-amber-100/90">
                Recast needs{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/50">
                  {model}
                </code>
                . Run:{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/50">
                  ollama pull {model}
                </code>
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={checking}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900"
          >
            {checking ? "Checking…" : "Retry"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-amber-900/80 transition-colors hover:bg-amber-100 dark:text-amber-100/80 dark:hover:bg-amber-900"
            aria-label="Dismiss setup banner"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
