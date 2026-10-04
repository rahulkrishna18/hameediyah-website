"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { signatureDishes } from "@/lib/content";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function SignatureFood() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const plates = gsap.utils.toArray<HTMLElement>("[data-plate]");
        const names = gsap.utils.toArray<HTMLElement>("[data-plate-name]");
        gsap.set(plates, { clipPath: "circle(0% at 50% 50%)", rotate: -25 });
        gsap.set(plates[0], { clipPath: "circle(50% at 50% 50%)", rotate: 0 });
        gsap.set(names, { yPercent: 100, opacity: 0 });
        gsap.set(names[0], { yPercent: 0, opacity: 1 });
        let current = 0;
        const show = (i: number) => {
          if (i === current) return;
          const dir = i > current ? 1 : -1;
          gsap.to(plates[current], { clipPath: "circle(0% at 50% 50%)", rotate: 25 * dir, duration: 1.1, ease: "expo.inOut" });
          gsap.fromTo(plates[i], { clipPath: "circle(0% at 50% 50%)", rotate: -25 * dir }, { clipPath: "circle(50% at 50% 50%)", rotate: 0, duration: 1.3, ease: "expo.inOut" });
          gsap.to(names[current], { yPercent: -100 * dir, opacity: 0, duration: 0.9, ease: "expo.inOut" });
          gsap.fromTo(names[i], { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.inOut" });
          current = i;
        };
        gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((ch, i) => {
          ScrollTrigger.create({ trigger: ch, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && show(i) });
        });
        gsap.to("[data-ring]", {
          rotate: 300,
          ease: "none",
          scrollTrigger: { trigger: "[data-chapters]", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="food" data-theme="light" aria-labelledby="food-title" className="paper relative">
      <div className="mx-auto max-w-[1600px] px-5 pt-28 sm:px-8 sm:pt-36 lg:px-12 lg:pt-44">
        <SectionLabel index="07">Our Food</SectionLabel>
        <RevealText
          id="food-title"
          className="mt-8 max-w-5xl font-display text-[clamp(2.6rem,6.6vw,6.6rem)] font-[330] leading-[0.95] tracking-[-0.035em]"
          lines={["Recipes carried", [{ t: "through generations.", c: "italic text-cinnamon" }]]}
        />
        <Reveal className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
          <p>
            After the war, at No. 164, Hameediyah became famous for its curries, kurmas, kapitan, murtabak, nasi briyani, rendang and
            mee goreng. The younger generation has stuck precisely to the recipes of their elders.
          </p>
        </Reveal>
      </div>

      <div data-chapters className="relative mx-auto mt-16 grid max-w-[1600px] px-5 pb-28 sm:px-8 lg:mt-8 lg:grid-cols-12 lg:px-12 lg:pb-44">
        {/* Sticky plate stage (desktop) */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-0 flex h-[100svh] items-center justify-center">
            <div className="relative aspect-square w-[min(40vw,72vh)]">
              <svg data-ring viewBox="0 0 200 200" className="absolute -inset-[9%] h-[118%] w-[118%] text-cinnamon/60" aria-hidden>
                <defs>
                  <path id="ring-path" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
                </defs>
                <text fontSize="6.2" letterSpacing="3.1" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="600">
                  <textPath href="#ring-path">
                    HAMEEDIYAH · LEBUH CAMPBELL · EST. 1907 · RECIPES CARRIED THROUGH GENERATIONS ·
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 rounded-full bg-[#f8f2e6] shadow-[0_50px_90px_-40px_rgb(60_35_15/0.7),inset_0_0_0_10px_#efe4cf]" />
              {signatureDishes.map((d, i) => (
                <div key={d.id} data-plate className="absolute inset-[5%] overflow-hidden rounded-full" style={i ? { clipPath: "circle(0% at 50% 50%)" } : undefined}>
                  <Image src={d.image} alt={d.imageAlt} fill sizes="40vw" className="food-grade scale-[1.12] object-cover" />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgb(40_20_10/0.45)]" />
                </div>
              ))}
              <div className="pointer-events-none absolute -bottom-[24%] left-0 right-0 h-12 overflow-hidden text-center">
                {signatureDishes.map((d, i) => (
                  <p
                    key={d.id}
                    data-plate-name
                    aria-hidden
                    className="absolute inset-x-0 font-display text-2xl italic text-ink/70"
                    style={i ? { opacity: 0 } : undefined}
                  >
                    {d.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <ol className="lg:col-span-5 lg:col-start-8">
          {signatureDishes.map((d, i) => (
            <li key={d.id} data-chapter className="flex flex-col justify-center border-t border-ink/10 py-16 lg:min-h-[100svh] lg:border-t-0 lg:py-24">
              <div className="relative mx-auto mb-10 aspect-square w-[78%] max-w-sm overflow-hidden rounded-full shadow-[0_40px_70px_-35px_rgb(60_35_15/0.7)] ring-[8px] ring-[#f3e9d8] lg:hidden">
                <Image src={d.image} alt={d.imageAlt} fill sizes="80vw" className="food-grade scale-[1.12] object-cover" />
              </div>
              <Reveal>
                <p className="eyebrow text-cinnamon">
                  <span className="mr-3 font-display normal-case tracking-normal italic text-ink/45">No. {String(i + 1).padStart(2, "0")}</span>
                  Signature
                </p>
              </Reveal>
              <RevealText
                as="h3"
                className="mt-5 font-display text-[clamp(2.6rem,5.4vw,5.2rem)] font-[350] leading-[0.95] tracking-[-0.03em]"
                lines={[d.name]}
              />
              <Reveal className="mt-6">
                <p className="font-display text-xl italic text-ink/75">{d.note}</p>
                <p className="mt-4 max-w-md leading-relaxed text-ink/70">{d.detail}</p>
              </Reveal>
              {d.board && (
                <Reveal className="mt-8 max-w-md border border-ink/15 bg-[#f7f1e4] px-5 py-4" variant="fade">
                  <p className="eyebrow text-[0.56rem] text-ink/45">On the old menu board</p>
                  <p className="mt-2 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.12em] [font-stretch:80%] text-[#2b2a5c]">{d.board}</p>
                </Reveal>
              )}
              {/* {d.illustrative && <p className="caption mt-4 text-ink/45">Photograph is illustrative of the dish, not taken at Hameediyah.</p>} */}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
