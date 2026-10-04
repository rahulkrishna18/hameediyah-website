"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { milestones, quotes, type Era } from "@/lib/content";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const ERA: Record<Era, { bg: string; label: string }> = {
  origin: { bg: "#2a1f17", label: "Arrival" },
  street: { bg: "#1f3b2c", label: "The street" },
  war: { bg: "#1a1815", label: "War years" },
  shop: { bg: "#4f2816", label: "No. 164" },
  growth: { bg: "#3b3019", label: "The city grows" },
  today: { bg: "#7a520f", label: "Today" },
};
const ERA_ORDER: Era[] = ["origin", "street", "war", "shop", "growth", "today"];

export function Timeline() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      const setEra = (era: Era) => {
        gsap.to(section, { backgroundColor: ERA[era].bg, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        section.querySelectorAll<HTMLElement>("[data-era-tab]").forEach((t) => t.toggleAttribute("data-active", t.dataset.eraTab === era));
      };

      mm.add(MQ.desktop, () => {
        const track = section.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: "[data-tpin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set("[data-tprogress]", { scaleX: self.progress }),
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          const era = panel.dataset.era as Era | undefined;
          if (era) {
            ScrollTrigger.create({
              trigger: panel,
              containerAnimation: horizontal,
              start: "left 55%",
              end: "right 55%",
              onToggle: (self) => self.isActive && setEra(era),
            });
          }
          const img = panel.querySelector("[data-pimg]");
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: -10, scale: 1.12 },
              { xPercent: 10, scale: 1.12, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true } },
            );
          }
          const year = panel.querySelector("[data-pyear]");
          if (year) {
            gsap.fromTo(
              year,
              { xPercent: 6 },
              { xPercent: -6, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true } },
            );
          }
        });
      });

      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          const era = panel.dataset.era as Era | undefined;
          if (era) ScrollTrigger.create({ trigger: panel, start: "top 60%", end: "bottom 60%", onToggle: (self) => self.isActive && setEra(era) });
          const fades = panel.querySelectorAll("[data-pfade]");
          if (!fades.length) return;
          gsap.from(fades, {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="legacy"
      data-theme="dark"
      data-journey="generations"
      aria-labelledby="legacy-title"
      className="relative text-ivory transition-none"
      style={{ backgroundColor: ERA.origin.bg }}
    >
      <div data-tpin className="relative overflow-hidden lg:h-[100svh]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/textures/paper.svg')] bg-[length:480px] opacity-40 mix-blend-soft-light" />

        <div data-track className="relative flex flex-col lg:h-full lg:w-max lg:flex-row lg:items-stretch">
          {/* Intro panel */}
          <div data-panel className="flex flex-col justify-center px-5 py-28 sm:px-8 lg:w-[56vw] lg:px-12 lg:py-0 lg:pl-[max(3rem,calc((100vw-1600px)/2+3rem))]">
            <SectionLabel index="05" tone="light">
              Legacy · 1907 → Today
            </SectionLabel>
            <h2 id="legacy-title" className="mt-8 font-display text-[clamp(2.8rem,6.4vw,6.6rem)] font-[330] leading-[0.95] tracking-[-0.035em]">
              History kept moving.
              <span className="block italic text-saffron">So did Hameediyah.</span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/70">
              Occupation, liberation, a free port lost, a city transformed. Through it all, people kept coming back for the nasi kandar.
            </p>
            <p className="caption mt-10 max-w-sm text-ivory/50">“{quotes.upheavals.text}” — {quotes.upheavals.by}</p>
            <p className="eyebrow mt-12 hidden items-center gap-3 text-[0.6rem] text-gold lg:flex">
              Scroll to travel through time
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" aria-hidden>
                <path d="M4 12h15m-6-6 6 6-6 6" strokeWidth="1.5" />
              </svg>
            </p>
          </div>

          {milestones.map((m, i) => (
            <article
              key={m.id}
              data-panel
              data-era={m.era}
              aria-labelledby={`ms-${m.id}`}
              className="relative flex flex-col overflow-hidden border-t border-ivory/10 px-5 py-16 sm:px-8 lg:w-[72vw] lg:max-w-[1180px] lg:flex-row lg:items-center lg:gap-14 lg:border-l lg:border-t-0 lg:px-14 lg:py-0"
            >
              <div className="relative lg:w-[48%]">
                <p className="eyebrow text-[0.62rem] text-gold" data-pfade>
                  <span className="mr-3 font-display normal-case tracking-normal italic text-ivory/45">{String(i + 1).padStart(2, "0")}</span>
                  {ERA[m.era].label}
                </p>
                <p
                  data-pyear
                  aria-hidden
                  className={cn(
                    "mt-4 whitespace-nowrap font-display font-[300] leading-[0.85] tracking-[-0.05em]",
                    /^\d{4}s?$/.test(m.year)
                      ? "text-[clamp(5rem,11vw,12rem)]"
                      : /^\d/.test(m.year)
                        ? "text-[clamp(4rem,7.4vw,8rem)]"
                        : "text-[clamp(3.2rem,5.6vw,6.2rem)] italic",
                    m.id === "angsana" || m.id === "today" ? "text-gold" : "text-ivory/90",
                  )}
                  data-pfade
                >
                  {m.year}
                </p>
                <h3 id={`ms-${m.id}`} className="mt-6 font-display text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight" data-pfade>
                  <span className="sr-only">{m.year}: </span>
                  {m.title}
                </h3>
                <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ivory/72" data-pfade>
                  {m.body}
                </p>
              </div>
              <figure className={cn("relative mt-10 lg:mt-0 lg:w-[52%]", i % 2 ? "lg:self-start lg:pt-[14vh]" : "lg:self-end lg:pb-[14vh]")} data-pfade>
                <div className="bg-[#f6efe2] p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] sm:p-2.5">
                  <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[46vh]">
                    <div data-pimg className="absolute inset-0">
                      <Image
                        src={m.image}
                        alt={m.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 38vw, 92vw"
                        className={cn("object-cover", m.era === "today" ? "" : "archival")}
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="caption mt-3 text-ivory/55">{m.caption}</figcaption>
              </figure>
            </article>
          ))}
          <div aria-hidden className="hidden lg:block lg:w-[12vw]" />
        </div>

        {/* Era rail */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden px-12 pb-8 lg:block">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex justify-between">
              {ERA_ORDER.map((era) => (
                <span
                  key={era}
                  data-era-tab={era}
                  className="eyebrow text-[0.58rem] text-ivory/35 transition-colors duration-700 data-[active]:text-gold"
                >
                  {ERA[era].label}
                </span>
              ))}
            </div>
            <div className="mt-3 h-px bg-ivory/15">
              <div data-tprogress className="h-px origin-left scale-x-0 bg-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
