"use client";

import { useEffect, useState, type RefObject } from "react";

/** Tracks whether an element is near the viewport. `once` keeps it true after the first hit. */
export function useInViewport(ref: RefObject<Element | null>, { rootMargin = "0px", once = false } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}
