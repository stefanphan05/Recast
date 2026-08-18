import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";

export function useHorizontalScroll(
  ref: RefObject<HTMLElement | null>,
  contentKey?: unknown,
) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, [ref]);

  // `contentKey` re-runs this when the items change: a ResizeObserver on the
  // container never fires for a scrollWidth-only change.
  useLayoutEffect(() => {
    updateScrollState();
  }, [updateScrollState, contentKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, updateScrollState]);

  const scroll = useCallback(
    (direction: -1 | 1) => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({
        left: direction * el.clientWidth * 0.55,
        behavior: "smooth",
      });
    },
    [ref],
  );

  return {
    canScrollLeft,
    canScrollRight,
    onScroll: updateScrollState,
    scroll,
  };
}
