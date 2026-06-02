"use client";

import MessageInput from "@/components/rewrite/MessageInput";
import OutputPanel from "@/components/rewrite/OutputPanel";
import RewriteActions from "@/components/rewrite/RewriteActions";
import RewriteSettingsModal from "@/components/rewrite/RewriteSettingsModal";
import StylePicker from "@/components/rewrite/StylePicker";
import {
  MAX_CHARS,
  sourceLanguageOptions,
  targetLanguageOptions,
} from "@/components/rewrite/constants";
import {
  SOURCE_LANGUAGE_AUTO,
  TARGET_LANGUAGE_SAME,
  type RewriteStyle,
} from "@/lib/rewrite";
import { requestRewrite, rewriteErrorMessage } from "@/lib/rewrite/client";
import { useMemo, useState } from "react";

export default function RewriteWorkspace() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<RewriteStyle>("grammar");
  const [genzIntensity, setGenzIntensity] = useState(5);
  const [sourceLanguage, setSourceLanguage] = useState<string>(
    SOURCE_LANGUAGE_AUTO,
  );
  const [targetLanguage, setTargetLanguage] = useState<string>(
    TARGET_LANGUAGE_SAME,
  );
  const [instructions, setInstructions] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const hasOutput = isLoading || result.length > 0;

  const canSubmit = useMemo(() => {
    const trimmedLength = text.trim().length;
    return trimmedLength > 0 && trimmedLength <= MAX_CHARS && !isLoading;
  }, [text, isLoading]);

  const isCrossLanguage = targetLanguage !== TARGET_LANGUAGE_SAME;
  const hasCustomSettings =
    isCrossLanguage ||
    instructions.trim().length > 0 ||
    sourceLanguage !== SOURCE_LANGUAGE_AUTO;

  async function handleRewrite() {
    if (!canSubmit) return;

    setIsLoading(true);
    setErrorMessage(null);
    setIsRateLimited(false);

    try {
      const rewritten = await requestRewrite({
        text,
        style,
        genzIntensity: style === "genz" ? genzIntensity : undefined,
        sourceLanguage,
        targetLanguage,
        instructions: instructions.trim() || undefined,
      });
      setResult(rewritten);
    } catch (error) {
      setResult("");
      setIsRateLimited(
        error instanceof Error && error.name === "RateLimitError",
      );
      setErrorMessage(rewriteErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main
        className={`mx-auto flex w-full min-h-0 max-w-lg flex-1 flex-col ${
          hasOutput
            ? "gap-4 overflow-y-auto overscroll-y-contain"
            : "justify-center"
        }`}
      >
        <div
          className={`flex flex-col gap-5 ${hasOutput ? "shrink-0" : ""}`}
        >
          <MessageInput
            value={text}
            onChange={setText}
            compact={hasOutput}
          />

          <div className="flex flex-col">
            <StylePicker
              style={style}
              onStyleChange={setStyle}
              genzIntensity={genzIntensity}
              onGenzIntensityChange={setGenzIntensity}
              settingsOpen={settingsOpen}
              onOpenSettings={() => setSettingsOpen(true)}
              hasCustomSettings={hasCustomSettings}
            />
            <RewriteActions
              canSubmit={canSubmit}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isRateLimited={isRateLimited}
              onRewrite={handleRewrite}
            />
          </div>
        </div>

        {hasOutput ? (
          <OutputPanel result={result} isLoading={isLoading} />
        ) : null}
      </main>

      <RewriteSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        instructions={instructions}
        onInstructionsChange={setInstructions}
        sourceLanguage={sourceLanguage}
        onSourceLanguageChange={setSourceLanguage}
        targetLanguage={targetLanguage}
        onTargetLanguageChange={setTargetLanguage}
        isCrossLanguage={isCrossLanguage}
        sourceLanguageOptions={sourceLanguageOptions}
        targetLanguageOptions={targetLanguageOptions}
        sourceLanguageAuto={SOURCE_LANGUAGE_AUTO}
        targetLanguageSame={TARGET_LANGUAGE_SAME}
      />
    </>
  );
}
