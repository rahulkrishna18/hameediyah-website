"use client";

import Link from "next/link";
import { useRef } from "react";
import { Wordmark } from "@/components/Nav";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { mapsDirectionsUrl, nav, sources, visit } from "@/lib/content";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-motif]", start: "top 85%", once: true } })
          .from("[data-motif-year]", { yPercent: 100, duration: 1.6, ease: "expo.out", stagger: 0.15 })
          .from("[data-motif-line]", { scaleX: 0, duration: 1.8, ease: "expo.inOut" }, 0.2)
          .from("[data-motif-dot]", { scale: 0, duration: 0.8, ease: "back.out(2)" }, 1.6);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} data-theme="dark" className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        {/* 1907 → Today */}
        <div data-motif className="flex items-center gap-4 sm:gap-8" aria-label="1907 to today">
          {/* Masks are padded so the 7's overhang and the y's descender are not clipped; negative margins keep the layout */}
          <span className="-mb-[0.2em] -mr-[0.12em] overflow-hidden text-[clamp(3rem,11vw,11rem)]">
            <span data-motif-year className="block pb-[0.2em] pr-[0.12em] font-display font-[300] leading-[0.9] tracking-[-0.05em] text-gold">
              1907
            </span>
          </span>
          <span aria-hidden className="relative flex h-px min-w-8 flex-1 items-center">
            <span data-motif-line className="absolute inset-0 origin-left bg-gradient-to-r from-gold via-gold/60 to-ivory/40" />
            <span data-motif-dot className="absolute -right-1 h-2.5 w-2.5 rotate-45 border-r border-t border-ivory/70" />
          </span>
          <span className="-mb-[0.2em] -mr-[0.12em] overflow-hidden text-[clamp(3rem,11vw,11rem)]">
            <span data-motif-year className="block pb-[0.2em] pr-[0.2em] font-display font-[300] italic leading-[0.9] tracking-[-0.04em]">
              Today
            </span>
          </span>
        </div>

        <div className="mt-20 grid gap-12 border-t border-ivory/10 pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="h-16 sm:h-[4.5rem]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/55">
              Nasi kandar on Lebuh Campbell since 1907. A story carried from Tamil Nadu, seven generations deep.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ivory/40">
              <span lang="ta" className="font-tamil">ஹமீதியா உணவகம்</span>
              <span lang="zh-Hans" className="font-han tracking-[0.2em]">哈密里也餐室</span>
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <p className="eyebrow text-[0.6rem] text-gold">The story</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(n.href);
                    }}
                    className="link-line text-ivory/70 hover:text-ivory"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-8">
            <p className="eyebrow text-[0.6rem] text-gold">Visit</p>
            <address className="mt-5 text-sm not-italic leading-relaxed text-ivory/70">
              {visit.name}
              <br />
              {visit.street}, {visit.postcode} {visit.city}
              <br />
              {visit.state}, {visit.country}
            </address>
            <p className="mt-4 space-x-5 text-sm">
              <a href={visit.phoneHref} className="link-line text-ivory/70 hover:text-ivory">
                {visit.phoneDisplay}
              </a>
              <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="link-line text-gold">
                Directions ↗
              </a>
            </p>
          </div>

          {/* Sources are kept in the markup but hidden from the UI */}
          <div className="hidden">
            <p className="eyebrow text-[0.6rem] text-gold">Sources</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/55">
              <li>
                <a href={sources.nst.url} target="_blank" rel="noopener noreferrer" className="link-line hover:text-ivory">
                  {sources.nst.publication}, {sources.nst.date}
                </a>
              </li>
              <li>
                <a href={sources.ptc.url} target="_blank" rel="noopener noreferrer" className="link-line hover:text-ivory">
                  PenangToday Community, {sources.ptc.date}
                </a>
              </li>
              <li>
                <Link href="/credits" className="link-line text-ivory/75 hover:text-ivory">
                  Image credits &amp; licences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/35 sm:flex-row">
          <p>© {visit.name}, George Town, Penang.</p>
          <p>Lebuh Campbell · Est. 1907</p>
        </div>
      </div>
    </footer>
  );
}
