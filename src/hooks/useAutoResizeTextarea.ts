import {
  useCallback,
  useLayoutEffect,
  type RefObject,
} from "react";
import {
  TEXTAREA_MAX_COMPACT_PX,
  TEXTAREA_MAX_HEIGHT_PX,
  TEXTAREA_MIN_COMPACT_PX,
  TEXTAREA_MIN_HEIGHT_PX,
} from "@/components/rewrite/constants";

export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  compact: boolean,
) {
  const syncHeight = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const minHeight = compact
      ? TEXTAREA_MIN_COMPACT_PX
      : TEXTAREA_MIN_HEIGHT_PX;
    const maxHeight = compact
      ? TEXTAREA_MAX_COMPACT_PX
      : TEXTAREA_MAX_HEIGHT_PX;

    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const height = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    el.style.height = `${height}px`;
    el.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, compact]);

  useLayoutEffect(() => {
    syncHeight();
  }, [value, compact, syncHeight]);

  return syncHeight;
}
