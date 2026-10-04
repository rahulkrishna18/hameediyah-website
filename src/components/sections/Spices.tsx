"use client";

import { useRef, useState } from "react";
import { SpiceScene } from "@/components/three/lazy";
import type { SpiceKind } from "@/components/three/spiceGeometries";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInViewport } from "@/hooks/useInViewport";
import { useFinePointer, useIsDesktop, useReducedMotion } from "@/hooks/useMediaQuery";
import { masala, masalaProcess, quotes } from "@/lib/content";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function Spices() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [highlight, setHighlight] = useState<SpiceKind | null>(null);
  const near = useInViewport(ref, { rootMargin: "100% 0px", once: true });
  const visible = useInViewport(ref);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const fine = useFinePointer();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(progress, {
          current: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.from("[data-process-step]", {
          opacity: 0,
          y: 30,
          stagger: 0.18,
          duration: 1.2,
          scrollTrigger: { trigger: "[data-process]", start: "top 80%", once: true },
        });
        gsap.from("[data-process-arrow]", {
          scaleX: 0,
          transformOrigin: "left center",
          stagger: 0.18,
          duration: 1,
          delay: 0.3,
          scrollTrigger: { trigger: "[data-process]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="spices" data-theme="dark" aria-labelledby="spices-title" className="paper-dark relative isolate overflow-hidden text-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {near && (
          <SpiceScene
            active={visible}
            layout="field"
            perKind={desktop ? 16 : 8}
            highlight={highlight}
            progress={progress}
            reduced={reduced}
            interactive={fine}
            background="#12100e"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_25%_45%,rgb(18_16_14/0.92),rgb(18_16_14/0.35)_70%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="06" tone="light">
              The Masala
            </SectionLabel>
            <RevealText
              id="spices-title"
              className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] font-[330] leading-[0.96] tracking-[-0.035em]"
              lines={["The same masala", [{ t: "Mohamed Thamby", c: "italic text-saffron" }], [{ t: "came up with.", c: "italic text-saffron" }]]}
            />
            <Reveal className="mt-8 max-w-lg text-lg leading-relaxed text-ivory/70">
              <p>
                It is still the base of every Hameediyah curry. These are five of the ingredients the family names in it.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow mb-4 text-[0.6rem] text-gold">{fine ? "Hover to find each spice" : "Tap to find each spice"}</p>
            <ul className="border-t border-ivory/12" onMouseLeave={() => setHighlight(null)}>
              {masala.map((m, i) => {
                const active = highlight === m.id;
                return (
                  <li key={m.id} className="border-b border-ivory/12">
                    <button
                      type="button"
                      aria-pressed={active}
                      onMouseEnter={() => fine && setHighlight(m.id)}
                      onFocus={() => setHighlight(m.id)}
                      onBlur={() => setHighlight(null)}
                      onClick={() => setHighlight(active ? null : m.id)}
                      className="group flex min-h-16 w-full items-baseline gap-5 py-4 text-left sm:py-5"
                    >
                      <span className="w-6 font-display text-sm italic text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(2rem,4vw,3.4rem)] leading-none tracking-[-0.02em] transition-[color,translate] duration-700 ease-[var(--ease-heritage)]",
                          active ? "translate-x-2 text-saffron" : "text-ivory group-hover:translate-x-2",
                          highlight && !active && "text-ivory/35",
                        )}
                      >
                        {m.name}
                      </span>
                      <span className="ml-auto flex flex-col items-end gap-1 text-right">
                        <span lang="ta" className="font-tamil text-sm text-gold/80">
                          {m.tamil}
                        </span>
                        <span className="hidden text-xs text-ivory/45 sm:block">{m.note}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="caption mt-4 text-ivory/40">Named by Abdul Sukkor Syed Ibrahim, seventh generation (NST, 2019). Spices rendered in 3D for illustration.</p>
          </div>
        </div>

        {/* Process */}
        <div className="mt-28 border-t border-ivory/10 pt-14 lg:mt-40">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-gold">Still done by hand</p>
              <Reveal as="blockquote" className="mt-5">
                <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-snug">“{quotes.wholeSpices.text}”</p>
                <footer className="eyebrow mt-5 text-[0.6rem] text-ivory/45">— {quotes.wholeSpices.by}</footer>
              </Reveal>
            </div>
            <ol data-process className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:col-start-6 lg:self-end">
              {masalaProcess.map((step, i) => (
                <li key={step} data-process-step className="relative">
                  <p className="font-display text-[clamp(3rem,6vw,5.5rem)] font-[300] leading-none text-gold/90">{String(i + 1).padStart(2, "0")}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <p className="font-display text-xl sm:text-2xl">{step}</p>
                    {i < masalaProcess.length - 1 && (
                      <span data-process-arrow aria-hidden className="hidden h-px flex-1 bg-gold/50 sm:block" />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Reveal className="mt-16 max-w-2xl">
            <p className="text-ivory/60">“{quotes.quality.text}” — {quotes.quality.by}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
