"use client";

import { useRef, type FC, type HTMLAttributes, type ReactNode, type RefAttributes } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Variant = "up" | "fade" | "clip" | "scale" | "left" | "right";

type RevealTag = "div" | "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "blockquote" | "span" | "section";
type TagComponent = FC<HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement>>;

type Props = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  duration?: number;
  start?: string;
  stagger?: number;
  /** animate direct children individually */
  childrenStagger?: boolean;
  immediate?: boolean;
  id?: string;
};

const fromVars: Record<Variant, gsap.TweenVars> = {
  up: { y: 48, opacity: 0 },
  fade: { opacity: 0 },
  clip: { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 },
  scale: { scale: 1.08, opacity: 0 },
  left: { x: -60, opacity: 0 },
  right: { x: 60, opacity: 0 },
};

export function Reveal({
  as = "div",
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 1.3,
  start = "top 88%",
  stagger = 0.1,
  childrenStagger = false,
  immediate = false,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as unknown as TagComponent;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const targets = childrenStagger ? Array.from(el.children) : el;
        gsap.set(el, { opacity: 1 });
        const to: gsap.TweenVars = variant === "clip" ? { clipPath: "inset(0% 0% 0% 0%)" } : { x: 0, y: 0, scale: 1, opacity: 1 };
        gsap.fromTo(targets, fromVars[variant], {
          ...to,
          duration,
          delay,
          ease: variant === "clip" ? "expo.inOut" : "expo.out",
          stagger: childrenStagger ? stagger : 0,
          scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
        });
      });
      mm.add(MQ.reduce, () => gsap.set(el, { opacity: 1 }));
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={className}>
      {children}
    </Tag>
  );
}
