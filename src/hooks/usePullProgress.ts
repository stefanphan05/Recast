import {
  formatPullProgressStatus,
  type PullProgress,
} from "@/lib/rewrite";
import { useEffect, useRef, useState } from "react";

export function getPullProgressPercent(
  progress: PullProgress | null | undefined,
): number | null {
  if (!progress || progress.total <= 0) return null;
  return Math.min(
    100,
    Math.round((progress.completed / progress.total) * 100),
  );
}

export function formatDownloadTimeRemaining(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";

  if (seconds < 60) {
    return `~${Math.max(1, Math.round(seconds))} sec left`;
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `~${minutes} min left`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes > 0) {
    return `~${hours} hr ${remainingMinutes} min left`;
  }

  return `~${hours} hr left`;
}

export function formatPullProgressLine(
  progress: PullProgress | null | undefined,
  options?: { percent?: number | null; etaSeconds?: number | null },
): string {
  const parts = [formatPullProgressStatus(progress)];

  if (options?.percent != null) {
    parts.push(`${options.percent}%`);
  }

  if (options?.etaSeconds != null && options.etaSeconds > 0) {
    const eta = formatDownloadTimeRemaining(options.etaSeconds);
    if (eta) parts.push(eta);
  }

  return parts.join(" · ");
}

export function usePullProgressTracking(progress: PullProgress | null) {
  const startRef = useRef<{ completed: number; time: number } | null>(null);
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!progress) {
      startRef.current = null;
      setEtaSeconds(null);
      return;
    }

    if (progress.total <= 0 || progress.completed <= 0) {
      setEtaSeconds(null);
      return;
    }

    const now = Date.now();
    if (!startRef.current) {
      startRef.current = { completed: progress.completed, time: now };
      return;
    }

    const elapsedSec = (now - startRef.current.time) / 1000;
    const bytesDownloaded = progress.completed - startRef.current.completed;

    if (elapsedSec < 0.5 || bytesDownloaded <= 0) return;

    const rate = bytesDownloaded / elapsedSec;
    const remaining = progress.total - progress.completed;
    const eta = remaining / rate;

    if (Number.isFinite(eta) && eta > 0) {
      setEtaSeconds(eta);
    }
  }, [progress]);

  return {
    progressPercent: getPullProgressPercent(progress),
    etaSeconds,
  };
}
