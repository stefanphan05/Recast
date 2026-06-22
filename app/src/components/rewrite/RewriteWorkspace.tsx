"use client";

import PromptComposer from "@/components/rewrite/PromptComposer";
import OutputPanel from "@/components/rewrite/OutputPanel";
import { EXPANDED_BLOCK_GAP_CLASS, MAX_CHARS } from "@/components/rewrite/constants";
import {
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  type RewriteStyle,
} from "@/lib/rewrite";
import { requestRewrite, rewriteErrorMessage } from "@/lib/rewrite/client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const INITIAL_STYLE: RewriteStyle = "grammar";
const INITIAL_GENZ_INTENSITY = 5;
const INITIAL_FLIRT_INTENSITY = 5;

export default function RewriteWorkspace({
  selectedModel,
  onExpandedChange,
}: {
  selectedModel: string;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<RewriteStyle>(INITIAL_STYLE);
  const [genzIntensity, setGenzIntensity] = useState(INITIAL_GENZ_INTENSITY);
  const [flirtIntensity, setFlirtIntensity] = useState(INITIAL_FLIRT_INTENSITY);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const hasOutput = isLoading || result.length > 0;

  const resetWorkspace = useCallback(() => {
    requestIdRef.current += 1;
    setText("");
    setStyle(INITIAL_STYLE);
    setGenzIntensity(INITIAL_GENZ_INTENSITY);
    setFlirtIntensity(INITIAL_FLIRT_INTENSITY);
    setResult("");
    setIsLoading(false);
    setErrorMessage(null);
    window.electronAPI?.setLayout("prompt");
  }, []);

  useEffect(() => {
    const unsubscribe = window.electronAPI?.onWindowHidden(resetWorkspace);
    return unsubscribe;
  }, [resetWorkspace]);

  useLayoutEffect(() => {
    window.electronAPI?.setLayout(hasOutput ? "expanded" : "prompt");
  }, [hasOutput]);

  useLayoutEffect(() => {
    onExpandedChange?.(hasOutput);
  }, [hasOutput, onExpandedChange]);

  const canSubmit = useMemo(() => {
    const trimmedLength = text.trim().length;
    return trimmedLength > 0 && trimmedLength <= MAX_CHARS && !isLoading;
  }, [text, isLoading]);

  async function handleRewrite() {
    if (!canSubmit) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const rewritten = await requestRewrite(
        {
          text,
          style,
          genzIntensity: style === "genz" ? genzIntensity : undefined,
          flirtIntensity: style === "flirt" ? flirtIntensity : undefined,
          sourceLanguage: SOURCE_LANGUAGE_AUTO,
          targetLanguage: TARGET_LANGUAGE_SAME,
        },
        selectedModel,
      );
      if (requestId !== requestIdRef.current) return;
      setResult(rewritten);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setResult("");
      setErrorMessage(rewriteErrorMessage(error));
    } finally {
      if (requestId !== requestIdRef.current) return;
      setIsLoading(false);
    }
  }

  return (
    <main
      className={`flex w-full max-w-[480px] flex-col ${
        hasOutput
          ? `${EXPANDED_BLOCK_GAP_CLASS} min-h-0 w-full flex-1 overflow-hidden`
          : ""
      }`}
    >
      <div className={hasOutput ? "shrink-0" : undefined}>
        <PromptComposer
          value={text}
          onChange={setText}
          style={style}
          onStyleChange={setStyle}
          genzIntensity={genzIntensity}
          onGenzIntensityChange={setGenzIntensity}
          flirtIntensity={flirtIntensity}
          onFlirtIntensityChange={setFlirtIntensity}
          canSubmit={canSubmit}
          isLoading={isLoading}
          compact={hasOutput}
          onSubmit={handleRewrite}
        />

        {errorMessage ? (
          <div className="mt-3 flex flex-col items-center gap-2.5">
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              {errorMessage}
            </p>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleRewrite}
              className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-400/70 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:border-neutral-500/70 dark:hover:text-neutral-50"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>

      {hasOutput ? (
        <OutputPanel
          result={result}
          isLoading={isLoading}
          onReset={resetWorkspace}
        />
      ) : null}
    </main>
  );
}
