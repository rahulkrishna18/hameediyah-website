"use client";

import { Odometer } from "@/components/ui/Odometer";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { heritageNumbers } from "@/lib/content";

export function Numbers() {
  return (
    <section id="numbers" data-theme="light" aria-labelledby="numbers-title" className="relative overflow-hidden bg-saffron text-charcoal">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/textures/paper.svg')] bg-[length:480px] opacity-70 mix-blend-multiply" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="09" className="!text-cinnamon-deep">
              In numbers
            </SectionLabel>
            <RevealText
              id="numbers-title"
              className="mt-8 font-display text-[clamp(2.6rem,6vw,6rem)] font-[330] leading-[0.95] tracking-[-0.035em]"
              lines={["A legacy,", [{ t: "counted honestly.", c: "italic" }]]}
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-charcoal/75">
              Only figures drawn from the family&rsquo;s own account, as reported by the New Straits Times in 2019, and from the
              restaurant&rsquo;s signage.
            </p>
          </Reveal>
        </div>

        <dl className="mt-20 grid gap-x-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-16">
          {heritageNumbers.map((n) => (
            <div
              key={n.label}
              className="flex flex-col justify-between gap-8 border-t border-charcoal/25 py-10 lg:min-h-[22rem] lg:py-12"
            >
              <dt className="order-2">
                <span className="block max-w-xs font-display text-xl leading-snug">{n.label}</span>
              </dt>
              <dd className="order-1 flex items-baseline gap-2 font-display font-[320] leading-[0.85] tracking-[-0.05em] text-cinnamon-deep">
                {n.prefix && <span className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] italic tracking-normal">{n.prefix}</span>}
                <Odometer value={n.value} group={n.value !== 1907} className="text-[clamp(5rem,10vw,9.5rem)]" />
                {n.suffix && <span className="text-[clamp(2rem,3.6vw,3.4rem)] italic">{n.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
