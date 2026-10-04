"use client";

import { useEffect, useState } from "react";
import { journey } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Fixed progress through the nine chapters of the story (desktop only). */
export function JourneyRail() {
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    journey.forEach((stage, i) => {
      const el = document.querySelector(`[data-journey="${stage.id}"]`);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          onEnter: () => setActive(i),
          onLeaveBack: () => setActive(i - 1),
        }),
      );
    });
    const story = document.getElementById("story");
    const footer = document.querySelector("footer");
    if (story && footer) {
      triggers.push(
        ScrollTrigger.create({
          trigger: story,
          start: "top 60%",
          endTrigger: footer,
          end: "top 80%",
          onToggle: (self) => setShown(self.isActive),
        }),
      );
    }
    // Pinned sections are created first; refresh so these start/end positions account for pin spacing.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <nav
      aria-label="Story progress"
      className={cn(
        "fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-[opacity,translate] duration-700 ease-[var(--ease-heritage)] xl:block",
        shown ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0",
      )}
    >
      <ol className="relative flex flex-col gap-3.5 mix-blend-difference">
        <span aria-hidden className="absolute bottom-1 left-[3px] top-1 w-px bg-white/25" />
        {journey.map((stage, i) => (
          <li key={stage.id} className="group relative flex items-center gap-3">
            <span
              className={cn(
                "relative z-10 h-[7px] w-[7px] rounded-full border border-white transition-colors duration-500",
                i <= active ? "bg-white" : "bg-transparent",
              )}
            />
            <span
              className={cn(
                "eyebrow whitespace-nowrap text-[0.55rem] text-white transition-[opacity,translate] duration-500",
                i === active ? "translate-x-0 opacity-90" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
              )}
              aria-current={i === active ? "step" : undefined}
            >
              {stage.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
