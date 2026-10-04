"use client";

import Image from "next/image";
import { useRef } from "react";
import { KandarScene } from "@/components/three/lazy";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInViewport } from "@/hooks/useInViewport";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    n: "i",
    title: "Cooked behind the spice shop",
    body: "In those early years the British government did not allow food to be sold in shops. So the curries were cooked at the back of the family's spice shop.",
  },
  {
    n: "ii",
    title: "Two baskets, one pole",
    body: "Two basketfuls of food were balanced on a bamboo pole across the shoulders  a kandar, in Malay.",
  },
  {
    n: "iii",
    title: "Out to the field",
    body: "On the field in front of the shop, the rice was cooked on the spot and served with an array of curries, kurmas, chicken and beef dishes, and vegetables.",
  },
  {
    n: "iv",
    title: "And so, a name",
    body: "“It was this method of carrying the food that gave nasi kandar its name.” Nasi  rice. Kandar  the pole that carried it.",
  },
] as const;

export function Kandar() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const near = useInViewport(stage, { rootMargin: "120% 0px", once: true });
  const visible = useInViewport(stage, { rootMargin: "10% 0px" });
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const lists = gsap.utils.toArray<HTMLElement>("[data-ksteps]");
        gsap.set(lists, { opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            pin: "[data-kpin]",
            start: "top top",
            end: () => `+=${window.innerHeight * 3}`,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => (progress.current = self.progress),
          },
        });
        lists.forEach((list) => {
          const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-kstep]"));
          gsap.set(steps, { autoAlpha: 0, y: 40 });
          gsap.set(steps[0], { autoAlpha: 1, y: 0 });
          steps.forEach((step, i) => {
            if (i === 0) return;
            // Fade out fully before the next step fades in, so captions never overlap mid-scroll
            tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.25 }, i - 0.35).to(step, { autoAlpha: 1, y: 0, duration: 0.3 }, i - 0.05);
          });
        });
        const count = STEPS.length;
        tl.to("[data-kword]", { xPercent: -30, duration: count }, 0)
          .to("[data-kbar]", { scaleY: 1, duration: count }, 0)
          .fromTo("[data-kphoto]", { y: 60, rotate: 6 }, { y: -40, rotate: 1, duration: count }, 0);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="kandar" data-theme="light" aria-labelledby="kandar-title" className="relative bg-paper text-ink">
      <div data-kpin className="paper relative overflow-hidden motion-safe:h-[100dvh]">
        <p
          aria-hidden
          data-kword
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[42vw] font-[300] italic leading-none tracking-[-0.05em] text-turmeric/[0.12] lg:text-[30vw]"
        >
          kandar kandar
        </p>

        <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[auto_1fr_auto] gap-4 px-5 pb-8 pt-[calc(var(--nav-h)+1.25rem)] sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-12 lg:pb-12">
          <div className="lg:col-span-4">
            <SectionLabel index="03">The Kandar</SectionLabel>
            <h2 id="kandar-title" className="mt-4 font-display text-[clamp(2rem,4.4vw,4.2rem)] font-[350] leading-[0.98] tracking-[-0.03em]">
              A meal on <span className="italic text-cinnamon">a shoulder pole</span>
            </h2>

            <div className="relative mt-8 hidden gap-6 lg:flex">
              <div className="relative w-px shrink-0 bg-ink/15">
                <div data-kbar className="absolute inset-0 origin-top scale-y-0 bg-turmeric motion-reduce:scale-y-100" />
              </div>
              <ol data-ksteps data-reveal className="relative min-h-[15rem] flex-1 motion-reduce:min-h-0 motion-reduce:space-y-8">
                {STEPS.map((s) => (
                  <li key={s.n} data-kstep className="motion-safe:absolute motion-safe:inset-0">
                    <p className="font-display text-sm italic text-cinnamon">{s.n}.</p>
                    <h3 className="mt-2 font-display text-[1.9rem] leading-tight">{s.title}</h3>
                    <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-ink/70">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 3D kandar */}
          <div ref={stage} data-journey="kandar" className="relative min-h-[18rem] lg:col-span-5 lg:h-[72vh]">
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(217_154_30/0.28),transparent)]" />
            {near && <KandarScene active={visible} progress={progress} reduced={reduced} className="!absolute inset-0" />}
            {/* <p className="eyebrow absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.58rem] text-ink/45">
              Illustration · bamboo pole, two baskets
            </p> */}
          </div>

          {/* Mobile steps */}
          <ol data-ksteps data-reveal className="relative min-h-[10.5rem] lg:hidden motion-reduce:min-h-0 motion-reduce:space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} data-kstep className="motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-0">
                <p className="font-display text-sm italic text-cinnamon">{s.n}.</p>
                <h3 className="mt-1 font-display text-[1.55rem] leading-tight">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="hidden lg:col-span-3 lg:block">
            <figure data-kphoto className="bg-[#f8f2e6] p-2.5 shadow-[0_30px_60px_-30px_rgb(18_16_14/0.6)]">
              <div className="relative aspect-[480/374] overflow-hidden">
                <Image
                  src="/images/nasi-kandar-1950s.jpg"
                  alt="Two nasi kandar sellers in the 1950s, each with baskets hung from a pole across the shoulders"
                  fill
                  sizes="22vw"
                  className="archival object-cover"
                />
              </div>
              <figcaption className="caption px-1 pt-2.5 text-ink/65">
                Nasi kandar sellers with the shoulder pole, 1950s. Photographer unknown  shown for the tradition, not of Hameediyah.
              </figcaption>
            </figure>
            <p className="mt-8 font-display text-lg italic leading-snug text-ink/70">
              Today, the family&rsquo;s own heritage nasi kandar carrier is proudly displayed inside the restaurant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
