"use client";

import { useEffect, useState } from "react";

/**
 * Turns true once the page has loaded, `delay` ms have passed and the main thread is idle.
 * Used to warm up WebGL scenes in the background so they are ready before they scroll into view.
 */
export function useIdleAfterLoad(delay = 0) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
        idle = ric(() => setReady(true), { timeout: 2000 }) as number;
      }, delay);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer);
      window.cancelIdleCallback?.(idle);
    };
  }, [delay]);
  return ready;
}
