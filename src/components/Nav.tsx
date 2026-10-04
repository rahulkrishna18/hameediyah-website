"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { HeritageButton } from "@/components/ui/HeritageButton";
import { cn } from "@/lib/cn";
import { mapsDirectionsUrl, nav, visit } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Wordmark({ light = true, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-2.5", className)}>
      <span className={cn("font-display text-[1.45rem] leading-none tracking-[-0.01em]", light ? "text-ivory" : "text-ink")}>
        Hameediyah
      </span>
      <span className={cn("eyebrow hidden text-[0.56rem] tracking-[0.3em] sm:inline", light ? "text-gold" : "text-cinnamon")}>Est. 1907</span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [onLight, setOnLight] = useState(false);
  const { scrollTo } = useMotion();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > window.innerHeight * 0.9);
      last = y;
      // Pick the theme of whichever section sits under the bar
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36).find((el) => el instanceof HTMLElement && el.dataset.theme);
      setOnLight((probe as HTMLElement | undefined)?.dataset.theme === "light");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
    history.replaceState(null, "", href);
  };

  const light = scrolled && onLight && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[translate,background-color,box-shadow,color] duration-700 ease-[var(--ease-heritage)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open
            ? light
              ? "bg-ivory/85 shadow-[0_1px_0_rgb(27_24_20/0.08)] backdrop-blur-md"
              : "bg-charcoal/75 shadow-[0_1px_0_rgb(244_236_222/0.06)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[var(--nav-h)] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" onClick={(e) => go(e, "#top")} aria-label="Hameediyah — back to top" className="relative z-10">
            <Wordmark light={!light} />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative py-2 text-[0.82rem] font-medium tracking-wide transition-colors duration-500",
                      light ? "text-ink/70 hover:text-ink" : "text-ivory/70 hover:text-ivory",
                      isActive && (light ? "text-ink" : "text-ivory"),
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-turmeric transition-transform duration-700 ease-[var(--ease-heritage)]",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <HeritageButton href="#visit" variant="solid" icon="pin" className="!min-h-11 !px-5">
                Find Hameediyah
              </HeritageButton>
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden",
                light ? "border-ink/20 text-ink" : "border-ivory/25 text-ivory",
              )}
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-500", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-500", open && "-translate-y-1.5 -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="paper-dark fixed inset-0 z-40 flex flex-col overflow-y-auto px-6 pb-10 pt-[calc(var(--nav-h)+2rem)] text-ivory lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease }}
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className="flex items-baseline gap-4 py-2 font-display text-[2.6rem] leading-tight xs:text-5xl"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.06 }}
                  >
                    <span className="font-display text-sm italic text-gold">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="mt-auto border-t border-ivory/15 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
            >
              <p className="eyebrow text-gold">Find us</p>
              <p className="mt-3 font-display text-xl leading-snug">
                {visit.street}
                <br />
                {visit.postcode} {visit.city}, {visit.state}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <HeritageButton href={mapsDirectionsUrl} external icon="pin">
                  Directions
                </HeritageButton>
                <HeritageButton href={visit.phoneHref} variant="ghost-light" icon="phone">
                  {visit.phoneDisplay}
                </HeritageButton>
              </div>
              <p className="mt-8 font-tamil text-sm text-ivory/45" lang="ta">
                ஹமீதியா உணவகம்
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
