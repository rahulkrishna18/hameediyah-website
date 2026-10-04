"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Shot = { src: string; alt: string; when: string; caption: string; archival?: boolean };
type Pair = { id: string; label: string; then: Shot; now: Shot; note: string };

const PAIRS: Pair[] = [
  {
    id: "waterfront",
    label: "The waterfront",
    note: "Where the men first carried nasi kandar to the docks. Viewpoints differ  the quay itself remains.",
    then: { src: "/images/weld-quay-1910.jpg", alt: "Weld Quay in Penang around 1910", when: "c. 1910", caption: "Weld Quay, Penang. C.J. Kleingrothe.", archival: true },
    now: { src: "/images/weld-quay-2023.jpg", alt: "Aerial view of Weld Quay, George Town, in 2023", when: "2023", caption: "Weld Quay from above. HundenvonPenang, CC BY-SA 4.0." },
  },
  {
    id: "counter",
    label: "Behind the counter",
    note: "The recipes passed from elders to the younger generation, who stuck to them precisely.",
    then: {
      src: "/images/ref-counter-archive.jpg",
      alt: "Three Hameediyah elders in white caps behind the counter, in an older family photograph",
      when: "Archive",
      caption: "A family photograph. Via PenangToday Community.",
      archival: true,
    },
    now: {
      src: "/images/ref-family-dishes-2019.jpg",
      alt: "Ahmed Seeni Pakir and Abdul Sukkor Syed Ibrahim presenting Hameediyah dishes",
      when: "2019",
      caption: "Ahmed Seeni Pakir (sixth generation) and Abdul Sukkor Syed Ibrahim (seventh). Shahnaz Fazlie Shahrizal / NST.",
    },
  },
  {
    id: "shopfront",
    label: "The shopfront",
    note: "The green and yellow façade has been kept  the signs have been renewed around it.",
    then: {
      src: "/images/ref-shopfront-2019.jpg",
      alt: "Hameediyah's entrance in 2019 under an older signboard reading Est. 1907 and 164A",
      when: "2019",
      caption: "The old signboard: “Estd 1907”. Shahnaz Fazlie Shahrizal / NST.",
      archival: true,
    },
    now: {
      src: "/images/hameediyah-facade.jpg",
      alt: "The repainted yellow and green façade of Hameediyah at No. 164A Campbell Street",
      when: "Recent",
      caption: "No. 164A Campbell Street. Slleong, CC0.",
    },
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function ThenNow() {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pos = useRef(72);
  const userControlled = useRef(false);
  const dragging = useRef(false);
  const [active, setActive] = useState(0);
  const pair = PAIRS[active];

  const apply = useCallback((value: number) => {
    const v = Math.max(0, Math.min(100, value));
    pos.current = v;
    frame.current?.style.setProperty("--pos", `${v}%`);
    handle.current?.setAttribute("aria-valuenow", String(Math.round(v)));
  }, []);

  useEffect(() => apply(pos.current), [apply, active]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const proxy = { v: 92 };
        gsap.to(proxy, {
          v: 18,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top 75%", end: "bottom 35%", scrub: 0.8 },
          onUpdate: () => {
            if (!userControlled.current) apply(proxy.v);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = frame.current!.getBoundingClientRect();
    apply(((e.clientX - r.left) / r.width) * 100);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    userControlled.current = true;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging.current && fromPointer(e);
  const onUp = () => (dragging.current = false);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") apply(pos.current - step);
    else if (e.key === "ArrowRight") apply(pos.current + step);
    else if (e.key === "Home") apply(0);
    else if (e.key === "End") apply(100);
    else return;
    e.preventDefault();
    userControlled.current = true;
  };

  return (
    <section ref={ref} id="then-now" data-theme="dark" aria-labelledby="thennow-title" className="paper-dark relative overflow-hidden text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="10" tone="light">
              Then &amp; Now
            </SectionLabel>
            <RevealText
              id="thennow-title"
              className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] font-[330] leading-[0.95] tracking-[-0.035em]"
              lines={["The same street,", [{ t: "a different century.", c: "italic text-saffron" }]]}
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ivory/65">Scroll to move through time  or drag the line to compare for yourself.</p>
          </Reveal>
        </div>

        <div role="tablist" aria-label="Comparisons" className="mt-14 flex flex-wrap gap-2">
          {PAIRS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "min-h-11 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-500",
                i === active ? "border-gold bg-gold text-charcoal" : "border-ivory/20 text-ivory/65 hover:border-ivory/50 hover:text-ivory",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div
          ref={frame}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="relative mt-8 aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden bg-soot shadow-[0_60px_120px_-50px_rgb(0_0_0/0.9)] sm:aspect-[16/10]"
          style={{ ["--pos" as string]: "72%" }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={pair.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              {/* Now */}
              <Image src={pair.now.src} alt={pair.now.alt} fill sizes="(min-width: 1600px) 1500px, 100vw" className="object-cover" />
              {/* Then, masked to the left of the line */}
              <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
                <Image
                  src={pair.then.src}
                  alt={pair.then.alt}
                  fill
                  sizes="(min-width: 1600px) 1500px, 100vw"
                  className={cn("object-cover", pair.then.archival && "archival-strong")}
                />
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgb(40_20_10/0.6)]" />
              </div>
            </motion.div>
          </AnimatePresence>

          <span className="eyebrow pointer-events-none absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1.5 text-[0.6rem] text-gold backdrop-blur sm:left-6 sm:top-6">
            Then · {pair.then.when}
          </span>
          <span className="eyebrow pointer-events-none absolute right-4 top-4 rounded-full bg-charcoal/70 px-3 py-1.5 text-[0.6rem] text-ivory backdrop-blur sm:right-6 sm:top-6">
            Now · {pair.now.when}
          </span>

          {/* Divider */}
          <div
            ref={handle}
            role="slider"
            tabIndex={0}
            aria-label={`Compare ${pair.label.toLowerCase()}: then and now`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={72}
            onKeyDown={onKey}
            className="absolute inset-y-0 z-10 w-12 -translate-x-1/2 focus-visible:outline-none"
            style={{ left: "var(--pos)" }}
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ivory/90 shadow-[0_0_20px_rgb(0_0_0/0.5)]" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/80 bg-charcoal/60 backdrop-blur-sm transition-transform duration-500 hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-ivory" strokeWidth="1.5" aria-hidden>
                <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pair.id}
            className="mt-6 grid gap-4 sm:grid-cols-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="font-display text-xl italic text-ivory/85 sm:col-span-6">{pair.note}</p>
            <div className="caption space-y-1 text-ivory/50 sm:col-span-5 sm:col-start-8">
              <p>
                <span className="eyebrow mr-2 not-italic text-[0.56rem] text-gold">Then</span>
                {pair.then.caption}
              </p>
              <p>
                <span className="eyebrow mr-2 not-italic text-[0.56rem] text-ivory/70">Now</span>
                {pair.now.caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
