"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { family, masala, quotes } from "@/lib/content";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function Beginning() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to("[data-watermark]", {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        // Family tree draws as it scrolls through
        gsap.utils.toArray<SVGPathElement>("[data-tree-line]").forEach((path) => {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: "[data-tree]", start: "top 80%", end: "bottom 55%", scrub: 0.6 },
            },
          );
        });
        gsap.from("[data-son]", {
          y: 24,
          opacity: 0,
          stagger: 0.15,
          duration: 1.2,
          scrollTrigger: { trigger: "[data-tree]", start: "top 60%", once: true },
        });
        gsap.from("[data-origin-stamp]", {
          scale: 1.6,
          rotate: -30,
          opacity: 0,
          duration: 1.1,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: "[data-origin-card]", start: "top 70%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="story" data-theme="light" aria-labelledby="story-title" className="paper relative overflow-hidden py-28 sm:py-36 lg:py-44">
      <p
        aria-hidden
        data-watermark
        lang="ta"
        className="pointer-events-none absolute left-0 top-24 whitespace-nowrap font-tamil text-[38vw] font-semibold leading-none text-cinnamon/[0.045] lg:text-[22vw]"
      >
        ஹமீதியா ஹமீதியா
      </p>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          <SectionLabel index="01">The Beginning</SectionLabel>
          <RevealText
            id="story-title"
            className="mt-8 font-display text-[clamp(2.5rem,6.4vw,6.2rem)] font-[350] leading-[0.98] tracking-[-0.03em] text-ink"
            lines={["Before the restaurant,", [{ t: "there was a spice trader.", c: "italic text-cinnamon" }]]}
          />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          {/* Origin card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <Reveal variant="up" className="relative">
                <article
                  data-origin-card
                  data-journey="tamil-nadu"
                  className="relative border border-ink/15 bg-[#f7f0e3] p-6 shadow-[0_30px_60px_-40px_rgb(60_35_15/0.5)] sm:p-8"
                >
                  <div className="flex items-start justify-between gap-6 border-b border-dashed border-ink/20 pb-5">
                    <div>
                      <p className="eyebrow text-[0.62rem] text-cinnamon">Place of origin</p>
                      <p className="mt-1 font-tamil text-sm text-ink/60" lang="ta">
                        பிறப்பிடம்
                      </p>
                    </div>
                    <p className="font-display text-sm italic text-ink/55">Folio I</p>
                  </div>
                  <h3 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none tracking-[-0.02em]">{family.origin}</h3>
                  <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.92rem]">
                    <dt className="text-ink/50">District</dt>
                    <dd>{family.district}</dd>
                    <dt className="text-ink/50">Region</dt>
                    <dd>{family.region}</dd>
                    <dt className="text-ink/50">Position</dt>
                    <dd className="tabular-nums">9.43° N · 78.90° E</dd>
                    <dt className="text-ink/50">Trade</dt>
                    <dd>Spices</dd>
                  </dl>
                  <div className="relative mt-7 aspect-[16/10] overflow-hidden">
                    <Image
                      src="/images/spice-cumin.jpg"
                      alt="Whole cumin seeds in a brass bowl"
                      fill
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      className="archival object-cover"
                    />
                    <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_50px_rgb(60_35_15/0.4)]" />
                  </div>
                  <p className="caption mt-3 text-ink/55">Whole cumin in a brass bowl — one of the five spices the family still names in its masala.</p>
                  <div
                    data-origin-stamp
                    aria-hidden
                    className="absolute -right-4 -top-6 flex h-24 w-24 rotate-[-12deg] items-center justify-center rounded-full border-2 border-cinnamon/60 text-center text-cinnamon/80 sm:-right-6"
                  >
                    <span className="eyebrow block text-[0.52rem] leading-tight tracking-[0.2em]">
                      Tamil Nadu
                      <span className="my-1 block font-display text-lg normal-case tracking-normal italic">to</span>
                      Penang
                    </span>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>

          {/* Story beats */}
          <div className="space-y-24 sm:space-y-32 lg:col-span-6 lg:col-start-7">
            <div>
              <Reveal>
                <p className="eyebrow text-cinnamon">The founder</p>
              </Reveal>
              <RevealText
                as="h3"
                className="mt-5 font-display text-[clamp(2.3rem,4.6vw,4.4rem)] font-[380] leading-[1] tracking-[-0.025em]"
                lines={["M. Mohamed", [{ t: "Thamby Rawther", c: "italic" }]]}
              />
              <Reveal className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75" delay={0.1}>
                <p>
                  A spice trader from Chittarkottai, in the district of Ramanathapuram, Tamil Nadu. He arrived in Penang in the
                  1900s — and he did not come alone.
                </p>
              </Reveal>
            </div>

            <div data-tree>
              <Reveal>
                <p className="eyebrow text-cinnamon">With his three sons</p>
              </Reveal>
              <div className="relative mt-8">
                <svg viewBox="0 0 600 120" className="h-auto w-full text-cinnamon" aria-hidden preserveAspectRatio="none">
                  <path data-tree-line d="M300 0 V48" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path data-tree-line d="M300 48 C300 70 100 60 100 92 V120" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path data-tree-line d="M300 48 V120" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path data-tree-line d="M300 48 C300 70 500 60 500 92 V120" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="300" cy="48" r="4" fill="currentColor" />
                </svg>
                <ul className="grid grid-cols-3 gap-2 text-center">
                  {family.sons.map((son) => (
                    <li key={son} data-son className="pt-4">
                      <span className="block font-display text-[clamp(1.05rem,2.2vw,1.75rem)] leading-tight">
                        {son.split(" ")[0]}
                        <br />
                        <span className="italic">{son.split(" ").slice(1).join(" ")}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Reveal className="mt-12 border-l-2 border-turmeric pl-6">
                <blockquote>
                  <p className="font-display text-xl italic leading-snug text-ink/80 sm:text-2xl">
                    “In those days, it was common for the men to travel abroad for business, leaving the women behind.”
                  </p>
                  <footer className="eyebrow mt-4 text-[0.62rem] text-ink/50">— Ahmed Seeni Pakir, sixth generation</footer>
                </blockquote>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <p className="eyebrow text-cinnamon">The knowledge</p>
              </Reveal>
              <Reveal as="blockquote" className="mt-6" variant="up">
                <p className="font-display text-[clamp(1.7rem,3.2vw,2.7rem)] font-[350] leading-[1.18] tracking-[-0.015em]">
                  <span className="text-turmeric">“</span>
                  {quotes.notAChef.text}
                  <span className="text-turmeric">”</span>
                </p>
                <footer className="eyebrow mt-6 text-[0.62rem] text-ink/50">— {quotes.notAChef.by}</footer>
              </Reveal>
            </div>

            <div data-journey="spices">
              <Reveal>
                <p className="eyebrow text-cinnamon">A masala of their own</p>
              </Reveal>
              <Reveal className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
                <p>
                  The family rented a house on Lebuh Campbell from a Chinese landowner and opened a shop selling spices from India.
                  With that knowledge of spices and tips from family members, Mohamed Thamby and his sons came up with a masala recipe of their own — still the base of every Hameediyah curry.
                </p>
              </Reveal>
              <Reveal as="ul" childrenStagger className="mt-10 flex flex-wrap gap-2.5" stagger={0.08}>
                {masala.map((m) => (
                  <li key={m.id} className="flex items-baseline gap-2 rounded-full border border-ink/15 bg-ivory/60 px-4 py-2">
                    <span className="font-display text-lg">{m.name}</span>
                    <span lang="ta" className="font-tamil text-xs text-cinnamon/80">
                      {m.tamil}
                    </span>
                  </li>
                ))}
              </Reveal>
              <Reveal className="mt-8">
                <p className="caption text-ink/60">
                  “We use the same masala, which includes fennel, cumin, white pepper, almond and cashew nuts that Mohamed Thamby had
                  come up with.” — Abdul Sukkor Syed Ibrahim, seventh generation
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
