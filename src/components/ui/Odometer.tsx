"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Rolls each digit into place like a mechanical counter. */
export function Odometer({ value, className, group = true }: { value: number; className?: string; group?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatted = group ? value.toLocaleString("en-US") : String(value);
  const chars = formatted.split("");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const cols = el.querySelectorAll<HTMLElement>("[data-col]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        cols.forEach((col, i) => {
          const digit = Number(col.dataset.col);
          gsap.fromTo(
            col,
            { y: 0, yPercent: 0 },
            {
              y: 0,
              yPercent: -(digit + 10) * 5,
              duration: 2.2 + i * 0.25,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)} aria-label={formatted}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} aria-hidden className="relative inline-block h-[1.15em] overflow-hidden leading-none">
            <span className="invisible block h-[1.15em] leading-none">{ch}</span>
            <span
              data-col={ch}
              className="absolute inset-x-[-0.2em] top-0 flex flex-col text-center will-change-transform"
              style={{ transform: `translateY(${-(Number(ch) + 10) * 5}%)` }}
            >
              {[...DIGITS, ...DIGITS].map((d, j) => (
                <span key={j} className="block h-[1.15em] leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden className="inline-block leading-none">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
