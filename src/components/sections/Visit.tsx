"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArchivalPrint } from "@/components/ui/ArchivalPrint";
import { HeritageButton } from "@/components/ui/HeritageButton";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInViewport } from "@/hooks/useInViewport";
import { mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl, visit } from "@/lib/content";

export function Visit() {
  const mapRef = useRef<HTMLDivElement>(null);
  const loadMap = useInViewport(mapRef, { rootMargin: "60% 0px", once: true });

  return (
    <section id="visit" data-theme="light" aria-labelledby="visit-title" className="paper relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image src="/images/chart-george-town.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[0.16] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/70 to-ivory" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44" data-journey="today">
        <SectionLabel index="11">Visit Hameediyah</SectionLabel>
        <RevealText
          id="visit-title"
          className="mt-8 max-w-6xl font-display text-[clamp(2.8rem,7.4vw,7.6rem)] font-[330] leading-[0.92] tracking-[-0.04em]"
          lines={["Some history is", [{ t: "better tasted.", c: "italic text-cinnamon" }]]}
        />

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-cinnamon">Find us</p>
              <address className="mt-5 not-italic">
                <span className="block font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.02] tracking-[-0.02em]">{visit.street}</span>
                <span className="mt-2 block font-display text-[clamp(1.3rem,2vw,1.8rem)] italic text-ink/70">
                  {visit.postcode} {visit.city}, {visit.state}
                </span>
                <span className="mt-1 block text-sm text-ink/50">Also known as {visit.streetAlt} · {visit.country}</span>
              </address>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap gap-3" delay={0.1}>
              <HeritageButton href={mapsDirectionsUrl} external icon="pin" variant="dark">
                Get directions
              </HeritageButton>
              <HeritageButton href={visit.phoneHref} variant="outline" icon="phone">
                {visit.phoneDisplay}
              </HeritageButton>
            </Reveal>

            <Reveal className="mt-14 space-y-8 border-t border-ink/15 pt-10" delay={0.15}>
              <div>
                <p className="eyebrow text-[0.62rem] text-ink/50">Opening hours</p>
                <p className="mt-3 max-w-sm leading-relaxed text-ink/75">
                  Hours aren&rsquo;t published here, so please check today&rsquo;s times before you travel.{" "}
                  <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="link-line font-semibold text-cinnamon">
                    See current hours on Google Maps
                  </a>
                  .
                </p>
              </div>
              <div>
                <p className="eyebrow text-[0.62rem] text-ink/50">Two doors away</p>
                <p className="mt-3 max-w-sm leading-relaxed text-ink/75">
                  <span className="font-semibold text-ink">Hameediyah Tandoori House</span>, the family&rsquo;s extended outlet on the
                  same street.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[0.62rem] text-ink/50">Look for</p>
                <p className="mt-3 max-w-sm leading-relaxed text-ink/75">
                  The yellow and green shophouse with the sign that reads <span className="italic">Established 1907</span> — and,
                  quite possibly, a queue outside.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <Reveal variant="clip" duration={1.6}>
              <div ref={mapRef} className="relative bg-[#f8f2e6] p-2.5 shadow-[0_40px_80px_-40px_rgb(60_35_15/0.6)] sm:p-3">
                <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
                  {loadMap ? (
                    <iframe
                      title="Map showing Hameediyah Restaurant on Lebuh Campbell, George Town"
                      src={mapsEmbedUrl}
                      className="absolute inset-0 h-full w-full border-0 sepia-[0.35] saturate-[0.8]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <Image src="/images/chart-george-town.jpg" alt="" fill sizes="50vw" className="object-cover opacity-70" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 px-1 pt-3">
                  <p className="caption text-ink/60">Lebuh Campbell, George Town</p>
                  <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="eyebrow link-line text-[0.6rem] text-cinnamon">
                    Open in Maps ↗
                  </a>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-8">
              <ArchivalPrint
                src="/images/hameediyah-queue-a.jpg"
                alt="A long queue of customers along Campbell Street outside Hameediyah"
                caption="Campbell Street. Slleong, CC0."
                sizes="(min-width: 1024px) 24vw, 45vw"
                tone="none"
                rotate={-2}
                aspect="1 / 1"
              />
              <ArchivalPrint
                src="/images/chart-george-town.jpg"
                alt="Detail of a 1909 Admiralty chart showing the streets of George Town"
                caption="George Town on the Admiralty chart of 1909."
                sizes="(min-width: 1024px) 24vw, 45vw"
                tone="none"
                rotate={2.5}
                aspect="1 / 1"
                className="mt-10"
                objectPosition="40% 45%"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
