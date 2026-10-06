"use client";

import Image from "next/image";
import { useRef } from "react";
import { SpiceScene } from "@/components/three/lazy";
import { HeritageButton } from "@/components/ui/HeritageButton";
import { MasalaDabba } from "@/components/ui/MasalaDabba";
import { RevealText } from "@/components/ui/RevealText";
import { useIdleAfterLoad } from "@/hooks/useIdleAfterLoad";
import { useInViewport } from "@/hooks/useInViewport";
import { useIsDesktop, useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const visible = useInViewport(ref);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  // Defer the WebGL chunk until the page has loaded and the main thread is idle,
  // so the headline and photographs paint first.
  const show3d = useIdleAfterLoad();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set("[data-reveal]", { opacity: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo("[data-hero-chart]", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.04, duration: 3.2, ease: "power2.out" }, 0)
          .from("[data-hero-digit]", { yPercent: 110, duration: 2.2, stagger: 0.12 }, 0.2)
          .from("[data-hero-tin]", { scale: 0.85, rotate: -30, opacity: 0, duration: 2.2 }, 0.35)
          .from("[data-hero-cup]", { scale: 0, transformOrigin: "50% 50%", duration: 1.4, stagger: 0.08 }, 0.6)
          // The lid starts closed over the tin, slides off, then settles behind it
          .fromTo("[data-hero-lid]", { xPercent: -24, yPercent: 19, zIndex: 2 }, { xPercent: 70, yPercent: -12, rotate: 30, duration: 1.1, ease: "power3.in" }, 0.35)
          .set("[data-hero-lid]", { zIndex: 0 }, 1.45)
          .to("[data-hero-lid]", { xPercent: 0, yPercent: 0, rotate: 0, duration: 1.6 }, 1.45)
          .from("[data-hero-copy] > *", { y: 30, opacity: 0, duration: 1.4, stagger: 0.1 }, 1.1)
          .from("[data-hero-bar] > *", { y: 20, opacity: 0, duration: 1.2, stagger: 0.08 }, 1.4);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => (progress.current = self.progress),
            },
          })
          .to("[data-hero-year]", { yPercent: -28, ease: "none" }, 0)
          .to("[data-hero-content]", { yPercent: 12, opacity: 0.15, ease: "none" }, 0)
          .to("[data-hero-visual]", { yPercent: -10, ease: "none" }, 0)
          .to("[data-hero-tin]", { rotate: 24, ease: "none" }, 0)
          .to("[data-hero-lid]", { rotate: -12, ease: "none" }, 0)
          .to("[data-hero-chart]", { scale: 1.16, ease: "none" }, 0);
      });
      mm.add(MQ.reduce, () => gsap.set("[data-reveal]", { opacity: 1 }));
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      data-theme="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-green-deep text-ivory"
    >
      {/* Layer 0  the 1909 Admiralty chart of Penang Harbour */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <div data-hero-chart className="absolute inset-0 opacity-0">
          <Image
            src="/images/admiralty-chart-1909.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[50%_38%] opacity-[0.13] mix-blend-luminosity invert sepia"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_72%_40%,rgb(217_154_30/0.20),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_90%,rgb(139_74_43/0.35),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/80 to-transparent" />
      </div>

      {/* Layer 1  oversized founding year */}
      <div
        aria-hidden
        data-hero-year
        data-reveal
        className="pointer-events-none absolute -z-10 select-none font-display leading-[0.78] tracking-[-0.06em] text-gold/25 max-lg:left-1/2 max-lg:top-[54%] max-lg:-translate-x-1/2 lg:-right-[2vw] lg:bottom-[-3vw]"
      >
        <span className="flex text-outline text-[44vw] lg:text-[30vw]">
          {"1907".split("").map((d, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span data-hero-digit className="inline-block">
                {d}
              </span>
            </span>
          ))}
        </span>
      </div>

      {/* Layer 2  floating masala, rendered only while the hero is on screen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] transition-opacity duration-[2500ms] ease-out"
        style={{ opacity: show3d ? 1 : 0 }}
      >
        {show3d && (
          <SpiceScene
            active={visible}
            layout="hero"
            perKind={desktop ? 7 : 4}
            progress={progress}
            reduced={reduced}
            interactive={desktop}
          />
        )}
      </div>

      <div className="relative mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-10 px-5 pb-28 pt-[calc(var(--nav-h)+2.5rem)] sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pb-32">
        <div data-hero-content className="relative lg:col-span-7">
          <p data-reveal className="eyebrow mb-7 text-gold">
            Lebuh Campbell · George Town · Penang
          </p>
          <RevealText
            as="h1"
            id="hero-title"
            immediate
            delay={0.15}
            stagger={0.07}
            className="font-display text-[clamp(3rem,8.4vw,8.6rem)] font-[350] leading-[0.92] tracking-[-0.035em]"
            lines={[
              "From a",
              [{ t: "spice route", c: "italic text-saffron font-[300]" }],
              "to a Penang icon.",
            ]}
          />
          <div data-hero-copy data-reveal className="mt-9 max-w-xl">
            <p className="text-[1.02rem] leading-relaxed text-ivory/75 sm:text-lg">
              In <strong className="font-semibold text-ivory">1907</strong>, under an Angsana tree on Lebuh Campbell, a spice
              trader from Tamil Nadu and his sons began serving nasi kandar. Seven generations on, the family still cooks with his
              masala.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <HeritageButton href="#story">Begin the journey</HeritageButton>
              <HeritageButton href="#visit" variant="ghost-light" icon="pin">
                Find Hameediyah
              </HeritageButton>
            </div>
          </div>
        </div>

        {/* Masala dabba */}
        <div data-hero-visual data-reveal className="relative mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-[36rem]">
          <MasalaDabba />
        </div>
      </div>

      {/* Signage band  as written on the restaurant's own sign */}
      <div className="relative border-t border-ivory/10 bg-charcoal/40 backdrop-blur-[2px]">
        <div
          data-hero-bar
          data-reveal
          className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 text-ivory/60 sm:px-8 lg:px-12"
        >
          <p className="eyebrow text-[0.62rem] text-gold">Est. 1907</p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span lang="zh-Hans" className="font-han tracking-[0.25em]">
              哈密里也餐室
            </span>
            <span aria-hidden className="text-gold/50">
              ✦
            </span>
            <span lang="ta" className="font-tamil">
              ஹமீதியா உணவகம்
            </span>
            <span aria-hidden className="text-gold/50 max-xs:hidden">
              ✦
            </span>
            <span lang="ms-Arab" dir="rtl" className="font-jawi text-base max-xs:hidden">
              حميدية
            </span>
          </p>
          <a href="#story" className="group hidden items-center gap-3 sm:flex" aria-label="Scroll to the story">
            <span className="eyebrow text-[0.6rem]">Scroll</span>
            <span className="relative block h-9 w-px overflow-hidden bg-ivory/15">
              <span className="absolute inset-0 bg-gold motion-safe:animate-[scroll-cue_2.4s_var(--ease-slow)_infinite]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
