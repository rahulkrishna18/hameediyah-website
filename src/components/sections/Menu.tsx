"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { menu } from "@/lib/content";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function Menu() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const cat = menu[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + menu.length) % menu.length;
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <section id="menu" data-theme="dark" aria-labelledby="menu-title" className="relative overflow-hidden bg-green text-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/textures/paper.svg')] bg-[length:480px] opacity-50 mix-blend-soft-light" />
      {/* Tile band — a nod to the restaurant's green and yellow tiles */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,#d99a1e_0_24px,#2f5d45_24px_48px)] opacity-80"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="08" tone="light">
              The Menu
            </SectionLabel>
            <h2 id="menu-title" className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] font-[330] leading-[0.95] tracking-[-0.035em]">
              From the <span className="italic text-saffron">old menu board.</span>
            </h2>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-ivory/70">
              Every dish below is transcribed from Hameediyah&rsquo;s historic printed menu board. Prices are left out on purpose —
              what&rsquo;s cooking and what it costs today may differ, so ask at the counter.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Category tabs */}
          <div
            role="tablist"
            aria-label="Menu categories"
            aria-orientation="vertical"
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {menu.map((c, i) => {
              const selected = i === active;
              return (
                <button
                  key={c.id}
                  id={`${uid}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className={cn(
                    "group relative flex shrink-0 snap-start items-baseline gap-3 rounded-full border px-5 py-3 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-ivory/12 lg:px-0 lg:py-5",
                    selected ? "border-gold bg-gold/10 text-ivory lg:bg-transparent" : "border-ivory/20 text-ivory/55 hover:text-ivory",
                  )}
                >
                  <span className="hidden font-display text-sm italic text-gold/70 lg:inline">0{i + 1}</span>
                  <span className="whitespace-nowrap font-display text-lg lg:text-[1.7rem] lg:leading-tight">{c.label}</span>
                  <span lang="ta" className="ml-auto hidden font-tamil text-xs text-gold/70 lg:inline">
                    {c.tamil}
                  </span>
                  {selected && (
                    <motion.span
                      layoutId={`${uid}-indicator`}
                      aria-hidden
                      className="absolute -left-4 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-gold lg:block"
                      transition={{ duration: 0.6, ease }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Items */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="min-h-[24rem] lg:col-span-5 lg:col-start-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cat.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
              >
                <div className="flex items-baseline justify-between border-b border-gold/40 pb-4">
                  <p className="font-display text-3xl italic text-saffron">{cat.label}</p>
                  <p className="eyebrow text-[0.58rem] text-ivory/45">{cat.items.length} dishes</p>
                </div>
                <ul>
                  {cat.items.map((item, i) => (
                    <motion.li
                      key={item.name}
                      className="group flex items-baseline gap-4 border-b border-ivory/10 py-5"
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease, delay: 0.05 + i * 0.05 }}
                    >
                      <span className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight transition-colors duration-500 group-hover:text-saffron">
                        {item.name}
                      </span>
                      <span aria-hidden className="mb-1.5 flex-1 border-b border-dotted border-ivory/25" />
                      {item.note && <span className="max-w-[45%] text-right text-sm text-ivory/55">{item.note}</span>}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image */}
          <div className="relative lg:col-span-3 lg:col-start-10">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full ring-1 ring-gold/30 lg:max-w-none">
              <AnimatePresence initial={false}>
                <motion.div
                  key={cat.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { clipPath: "circle(0% at 50% 50%)", rotate: -20 }}
                  animate={{ clipPath: "circle(70% at 50% 50%)", rotate: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.4 } }}
                  transition={{ duration: 1.1, ease }}
                >
                  <Image src={cat.image} alt={cat.imageAlt} fill sizes="(min-width: 1024px) 24vw, 80vw" className="food-grade scale-[1.12] object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="caption mt-4 text-center text-ivory/45">Illustrative photograph.</p>

            <figure className="mx-auto mt-10 max-w-xs rotate-[-2deg] bg-[#f6efe2] p-2 shadow-[0_30px_50px_-20px_rgb(0_0_0/0.6)]">
              <div className="relative aspect-[720/560] overflow-hidden">
                <Image
                  src="/images/ref-menu-board.jpg"
                  alt="Photograph of Hameediyah's historic menu board listing briyani, curries, kurmah, martabak and noodles"
                  fill
                  sizes="20rem"
                  className="object-cover"
                />
              </div>
              <figcaption className="caption px-1 pt-2 text-[0.72rem] text-ink/65">The source: Hameediyah&rsquo;s historic menu board.</figcaption>
            </figure>
          </div>
        </div>

        <p className="mt-16 max-w-2xl text-sm text-ivory/50">
          Next door but one: <span className="text-ivory/80">Hameediyah Tandoori House</span>, the family&rsquo;s extended outlet,
          is just two doors away on Lebuh Campbell.
        </p>
      </div>
    </section>
  );
}
