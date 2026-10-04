"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MotionContextValue = { scrollTo: (target: string | number | HTMLElement, offset?: number) => void };

const MotionContext = createContext<MotionContextValue>({
  scrollTo: (target) => {
    if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  },
});

export const useMotion = () => useContext(MotionContext);

declare global {
  interface Window {
    __hameediyahReady?: boolean;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    window.__hameediyahReady = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) document.documentElement.classList.remove("js-motion");

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: false });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Layout can shift as fonts and lazy images settle — keep triggers accurate.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value: MotionContextValue = {
    scrollTo: (target, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
        return;
      }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el instanceof HTMLElement) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "auto" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target });
      }
    },
  };

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
