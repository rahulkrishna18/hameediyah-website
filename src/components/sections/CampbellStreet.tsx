"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArchivalPrint } from "@/components/ui/ArchivalPrint";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { quotes, sellingRoutes } from "@/lib/content";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function CampbellStreet() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-canopy]",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          "[data-year-1907] span",
          { yPercent: 105 },
          { yPercent: 0, duration: 1.8, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: "[data-year-1907]", start: "top 80%", once: true } },
        );
        gsap.fromTo(
          "[data-walk-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-walk]", start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((stop) => {
          gsap.from(stop, { x: -20, opacity: 0.15, duration: 1, scrollTrigger: { trigger: stop, start: "top 72%", toggleActions: "play none none reverse" } });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="campbell" data-theme="dark" aria-labelledby="campbell-title" className="relative overflow-hidden bg-green-deep text-ivory">
      {/* Atmosphere: the canopy, moving slowly, with light falling through it */}
      <div aria-hidden className="absolute inset-0">
        <div data-canopy className="absolute -inset-y-[10%] inset-x-0">
          <div className="absolute inset-0 motion-safe:animate-[drift_26s_ease-in-out_infinite]">
            <Image src="/images/angsana-canopy.jpg" alt="" fill sizes="100vw" className="object-cover object-top opacity-40 grayscale" />
          </div>
        </div>
        <div className="absolute inset-0 bg-green-deep/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-deep via-green-deep/60 to-green-deep" />
        <div className="absolute inset-0 opacity-60 mix-blend-soft-light motion-safe:animate-[dapple_14s_ease-in-out_infinite] bg-[radial-gradient(20%_14%_at_30%_30%,rgb(232_168_62/0.7),transparent),radial-gradient(14%_10%_at_70%_20%,rgb(232_168_62/0.6),transparent),radial-gradient(18%_12%_at_60%_60%,rgb(232_168_62/0.5),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="04" tone="light">
              Campbell Street
            </SectionLabel>
            <RevealText
              id="campbell-title"
              className="mt-8 font-display text-[clamp(2.6rem,7vw,7rem)] font-[330] leading-[0.95] tracking-[-0.035em]"
              lines={["Under the", [{ t: "Angsana tree.", c: "italic text-saffron" }]]}
            />
            <Reveal className="mt-10 max-w-xl space-y-5 text-lg leading-relaxed text-ivory/75">
              <p>
                In front of the family&rsquo;s spice shop on Lebuh Campbell lay a field, and on it stood a large, shady Angsana tree.
                Beneath it, Mohamed Thamby began to sell nasi kandar.
              </p>
              <p>
                It was a place where adults gathered between working hours and children ran around. The field is gone now 
                replaced by shoplots. The street remains.
              </p>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5" data-journey="campbell">
            <ArchivalPrint
              src="/images/beach-street-1910.jpg"
              alt="Shophouses, rickshaws and pedestrians on Beach Street, George Town, around 1910"
              caption="Beach Street, George Town, c. 1910  the city the family knew. C.J. Kleingrothe."
              label="Fig. 1"
              sizes="(min-width: 1024px) 34vw, 90vw"
              rotate={2}
              tone="archival-strong"
              className="lg:mt-24"
              tape
            />
          </div>
        </div>

        {/* 1907 */}
        <div className="mt-28 grid items-end gap-10 border-t border-ivory/10 pt-16 lg:mt-40 lg:grid-cols-12" data-journey="1907">
          <div className="lg:col-span-7">
            <p
              data-year-1907
              aria-label="1907"
              className="flex font-display text-[clamp(7rem,26vw,24rem)] font-[300] leading-[0.8] tracking-[-0.06em] text-gold"
            >
              {"1907".split("").map((d, i) => (
                <span key={i} aria-hidden className="inline-block overflow-hidden">
                  <span className="inline-block">{d}</span>
                </span>
              ))}
            </p>
          </div>
          <Reveal className="lg:col-span-5 lg:pb-6">
            <p className="eyebrow text-gold">The first plates</p>
            <p className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-snug">
              Curries cooked behind the shop, carried out on the kandar, rice cooked on the spot.
            </p>
            <p className="mt-5 text-ivory/65">
              Business did not start well  people were not yet familiar with nasi kandar. Eventually it gained momentum, with
              customers queuing up for a plate.
            </p>
          </Reveal>
        </div>

        <Reveal as="blockquote" className="mx-auto mt-28 max-w-4xl text-center lg:mt-36">
          <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-[330] italic leading-[1.2]">“{quotes.share.text}”</p>
          <footer className="eyebrow mt-6 text-[0.62rem] text-ivory/45"> {quotes.share.by}</footer>
        </Reveal>

        {/* The walking routes */}
        <div className="mt-28 grid gap-14 lg:mt-40 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <p className="eyebrow text-gold">As business grew</p>
              <h3 className="mt-5 font-display text-[clamp(2.2rem,4.4vw,4rem)] font-[350] leading-[1] tracking-[-0.025em]">
                They walked <span className="italic text-saffron">for miles.</span>
              </h3>
              <p className="mt-6 max-w-md text-ivory/65">
                The men carried their nasi kandar far beyond the field  from the docks at the nearby jetty right up to Tanjung Tokong.
              </p>
              <p className="mt-8 max-w-md font-display text-xl italic text-ivory/80">“{quotes.ambitious.text}”</p>
              <div className="mt-10 hidden lg:block">
                <ArchivalPrint
                  src="/images/hameediyah-queue-c.jpg"
                  alt="A long queue of people outside Hameediyah on Campbell Street today"
                  caption="The queue on Campbell Street today. Photograph: Slleong (CC0)."
                  sizes="30vw"
                  tone="none"
                  rotate={-2}
                  dark
                />
              </div>
            </div>
          </div>
          <ol data-walk className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden className="absolute bottom-3 left-[0.6rem] top-3 w-px bg-ivory/10" />
            <span aria-hidden data-walk-line className="absolute bottom-3 left-[0.6rem] top-3 w-px origin-top bg-gold motion-reduce:scale-y-100" />
            {sellingRoutes.map((r, i) => (
              <li key={r.name} data-stop className="relative flex gap-8 py-7 pl-0 sm:py-9">
                <span aria-hidden className="relative z-10 mt-2.5 h-[1.2rem] w-[1.2rem] shrink-0 rounded-full border border-gold bg-green-deep">
                  <span className="absolute inset-[4px] rounded-full bg-gold" />
                </span>
                <div>
                  <p className="font-display text-sm italic text-gold/70">Stop {String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em]">{r.name}</p>
                  {"now" in r && r.now && <p className="caption mt-2 text-ivory/55">{r.now}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
