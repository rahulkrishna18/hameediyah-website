"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** Figure number shown before caption, e.g. "Fig. 3" */
  label?: string;
  className?: string;
  frameClassName?: string;
  aspect?: string;
  sizes: string;
  rotate?: number;
  tone?: "archival" | "archival-strong" | "food-grade" | "none";
  parallax?: number;
  priority?: boolean;
  tape?: boolean;
  dark?: boolean;
  objectPosition?: string;
};

/** A photograph presented as a physical print: paper border, soft shadow, inner parallax. */
export function ArchivalPrint({
  src,
  alt,
  caption,
  label,
  className,
  frameClassName,
  aspect = "4 / 3",
  sizes,
  rotate = 0,
  tone = "archival",
  parallax = 8,
  priority,
  tape,
  dark,
  objectPosition,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!parallax) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-print-img]",
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} className={cn("relative", className)} style={{ rotate: rotate ? `${rotate}deg` : undefined }}>
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-parchment/80 shadow-sm mix-blend-multiply"
        />
      )}
      <div
        className={cn(
          "relative p-2 shadow-[0_30px_60px_-30px_rgb(18_16_14/0.55),0_8px_20px_-12px_rgb(18_16_14/0.35)] sm:p-3",
          dark ? "bg-soot" : "bg-[#f8f2e6]",
          frameClassName,
        )}
      >
        <div className="relative overflow-hidden bg-parchment" style={{ aspectRatio: aspect }}>
          <div data-print-img className="absolute inset-x-0 -inset-y-[12%]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              preload={priority}
              className={cn("object-cover", tone !== "none" && tone)}
              style={objectPosition ? { objectPosition } : undefined}
            />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgb(60_35_15/0.35)]" />
        </div>
      </div>
      {caption && (
        <figcaption className={cn("caption mt-3 max-w-[38ch]", dark ? "text-ivory/60" : "text-ink/65")}>
          {label && <span className="eyebrow not-italic mr-2 text-[0.6rem] text-cinnamon">{label}</span>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
