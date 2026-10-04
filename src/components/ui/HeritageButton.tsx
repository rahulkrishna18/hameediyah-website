"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMotion } from "@/components/providers/MotionProvider";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost-light" | "dark";
  className?: string;
  icon?: "arrow" | "pin" | "phone" | "none";
  external?: boolean;
  onClick?: () => void;
};

const icons = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  none: null,
};

const styles = {
  solid: "bg-turmeric text-charcoal",
  outline: "border border-current text-ink",
  "ghost-light": "border border-ivory/40 text-ivory",
  dark: "bg-charcoal text-ivory",
};

const fills = {
  solid: "bg-ivory",
  outline: "bg-ink",
  "ghost-light": "bg-ivory",
  dark: "bg-turmeric",
};

const hoverText = {
  solid: "group-hover:text-charcoal",
  outline: "group-hover:text-ivory",
  "ghost-light": "group-hover:text-charcoal",
  dark: "group-hover:text-charcoal",
};

/** Pill CTA with a rising fill and a gentle magnetic pull on fine pointers. */
export function HeritageButton({ href, children, variant = "solid", className, icon = "arrow", external, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollTo } = useMotion();

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    el.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollTo(href);
      history.replaceState(null, "", href);
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-[transform,color] duration-500 ease-[var(--ease-heritage)]",
        styles[variant],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-[50%_50%_0_0] transition-[translate,border-radius] duration-700 ease-[var(--ease-heritage)] group-hover:translate-y-0 group-hover:rounded-none",
          fills[variant],
        )}
      />
      <span className={cn("relative transition-colors duration-500", hoverText[variant])}>{children}</span>
      {icon !== "none" && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            "relative h-4 w-4 fill-none stroke-current stroke-[1.6] transition-[transform,color] duration-500 group-hover:translate-x-0.5",
            hoverText[variant],
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[icon]}
        </svg>
      )}
    </a>
  );
}
