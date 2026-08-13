export type LocalAIEngineProgress = {
  phase: "downloading" | "extracting" | "starting" | "ready" | "error";
  percent?: number;
  message?: string;
};

/** Fallback progress bar position while waiting for a real percent from the engine. */
export function getEngineProgressPercent(
  progress: LocalAIEngineProgress | null,
): number {
  if (progress?.percent != null) return progress.percent;
  return progress?.phase === "extracting" ? 100 : 8;
}

/** True while the managed AI engine (not the model download) is being installed/started. */
export function isEngineSettingUp(
  busy: boolean,
  hasDownloadProgress: boolean,
  engineProgress: LocalAIEngineProgress | null,
): boolean {
  return (
    busy &&
    !hasDownloadProgress &&
    engineProgress !== null &&
    engineProgress.phase !== "ready"
  );
}
