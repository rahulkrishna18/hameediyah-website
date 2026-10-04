"use client";

import { useRef, type FC, type HTMLAttributes, type RefAttributes } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export type Segment = string | { t: string; c?: string };
export type Line = string | Segment[];

type RevealTag = "div" | "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "blockquote" | "span" | "section";
type TagComponent = FC<HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>>;

type Props = {
  as?: RevealTag;
  lines: Line[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  start?: string;
  id?: string;
};

const toSegments = (line: Line): { t: string; c?: string }[] =>
  typeof line === "string" ? [{ t: line }] : line.map((s) => (typeof s === "string" ? { t: s } : s));

export const lineText = (line: Line) => toSegments(line).map((s) => s.t).join("");

/** Editorial headline: each word rises out of its own mask. */
export function RevealText({
  as = "h2",
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
  start = "top 85%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as unknown as TagComponent;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll("[data-word]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(el, { opacity: 1 });
        gsap.from(words, {
          yPercent: 118,
          rotate: 3,
          duration: 1.5,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
        });
      });
      mm.add(MQ.reduce, () => gsap.set(el, { opacity: 1 }));
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={className} aria-label={lines.map(lineText).join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassName)} aria-hidden>
          {toSegments(line).map((seg, s) =>
            seg.t.split(/(\s+)/).map((w, j) =>
              /^\s+$/.test(w) || w === "" ? (
                w === "" ? null : <span key={`${s}-${j}`}> </span>
              ) : (
                <span key={`${s}-${j}`} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span data-word className={cn("inline-block will-change-transform", seg.c)}>
                    {w}
                  </span>
                </span>
              ),
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}
