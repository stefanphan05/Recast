import { useCallback, useLayoutEffect, type RefObject } from "react";
import {
  TEXTAREA_MAX_COMPACT_PX,
  TEXTAREA_MAX_LANDING_PX,
  TEXTAREA_MIN_COMPACT_PX,
  TEXTAREA_MIN_LANDING_PX,
} from "@/components/rewrite/constants";

export type TextareaSize = "landing" | "compact";

export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  size: TextareaSize,
) {
  const syncHeight = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const minHeight =
      size === "compact" ? TEXTAREA_MIN_COMPACT_PX : TEXTAREA_MIN_LANDING_PX;
    const maxHeight =
      size === "compact" ? TEXTAREA_MAX_COMPACT_PX : TEXTAREA_MAX_LANDING_PX;

    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const height = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    el.style.height = `${height}px`;
    el.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, size]);

  useLayoutEffect(() => {
    syncHeight();
  }, [value, size, syncHeight]);

  return syncHeight;
}
