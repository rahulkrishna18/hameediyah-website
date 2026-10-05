"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SpiceScene } from "@/components/three/lazy";
import { HeritageButton } from "@/components/ui/HeritageButton";
import { RevealText } from "@/components/ui/RevealText";
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
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    let idle = 0;
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
      idle = ric(() => setShow3d(true), { timeout: 2000 }) as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.cancelIdleCallback?.(idle);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set("[data-reveal]", { opacity: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo("[data-hero-chart]", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.04, duration: 3.2, ease: "power2.out" }, 0)
          .from("[data-hero-digit]", { yPercent: 110, duration: 2.2, stagger: 0.12 }, 0.2)
          .fromTo("[data-hero-arch]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "expo.inOut" }, 0.35)
          .from("[data-hero-arch-img]", { scale: 1.35, duration: 2.6 }, 0.35)
          .from("[data-hero-print]", { y: 120, rotate: -14, opacity: 0, duration: 2 }, 1.0)
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
          .to("[data-hero-print]", { yPercent: -40, rotate: -9, ease: "none" }, 0)
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
          <p data-reveal className="eyebrow mb-7 flex items-center gap-3 text-gold">
            <span className="inline-block h-px w-10 bg-gold/70" aria-hidden />
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

        {/* Photographic composition */}
        <div data-hero-visual data-reveal className="relative mx-auto w-full max-w-[30rem] lg:col-span-5 lg:max-w-none">
          <div className="relative ml-auto aspect-[3/4] w-[78%] sm:w-[70%] lg:w-[86%]">
            <div
              data-hero-arch
              className="absolute inset-0 overflow-hidden rounded-t-full shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-gold/30"
            >
              <div data-hero-arch-img className="absolute inset-0">
                <Image
                  src="/images/hameediyah-facade.jpg"
                  alt="The yellow and green façade of Hameediyah Restaurant on Campbell Street, its sign reading No. 164A"
                  fill
                  preload
                  sizes="(min-width: 1024px) 34vw, 70vw"
                  className="object-cover object-[50%_30%] saturate-[0.9]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/60 via-transparent to-transparent" />
            </div>
            <span className="eyebrow absolute -right-1 top-[12%] origin-top-right translate-x-full rotate-90 text-[0.58rem] text-gold/80 max-sm:hidden">
              No. 164A Campbell Street
            </span>
          </div>

          <figure
            data-hero-print
            className="absolute -bottom-6 left-0 w-[52%] rotate-[-5deg] bg-[#f6efe2] p-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] sm:w-[46%] sm:p-2.5 lg:-bottom-10 lg:-left-6 lg:w-[54%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/weld-quay-1910.jpg"
                alt="Weld Quay, Penang, photographed around 1910"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="archival object-cover"
              />
            </div>
            <figcaption className="caption px-1 pb-0.5 pt-2 text-[0.68rem] text-ink/70 sm:text-[0.74rem]">Weld Quay, Penang, c. 1910</figcaption>
          </figure>
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
