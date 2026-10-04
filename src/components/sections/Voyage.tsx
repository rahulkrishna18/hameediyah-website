"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { mapData } from "@/lib/mapData";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Same Mercator projection as scripts/build-map.py
const LON0 = 73;
const LON1 = 104.5;
const LAT1 = 21;
const W = mapData.width;
const H = mapData.height;
const ym = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const K = W / (((LON1 - LON0) * Math.PI) / 180);
const r1 = (n: number) => Math.round(n * 10) / 10; // stable across server and client
const proj = (lon: number, lat: number) => ({ x: r1(((lon - LON0) / (LON1 - LON0)) * W), y: r1((ym(LAT1) - ym(lat)) * K) });

const O = mapData.points.chittarkottai;
const D = mapData.points.georgetown;
// Deliberately stylised arc — the family's actual passage is not documented.
const ROUTE = `M${O.x},${O.y} C${O.x + 300},${O.y - 230} ${D.x - 330},${D.y - 330} ${D.x},${D.y}`;

const STEPS = [
  {
    kicker: "Tamil Nadu",
    title: "Chittarkottai, Ramanathapuram",
    body: "A spice trader's village on the coast of Tamil Nadu — and the beginning of the Hameediyah story.",
  },
  {
    kicker: "The crossing · 1900s",
    title: "Across the Bay of Bengal",
    body: "M. Mohamed Thamby Rawther set out for Penang with his three sons, carrying a merchant's knowledge of whole spices.",
  },
  {
    kicker: "Penang",
    title: "A house on Lebuh Campbell",
    body: "Rented from a Chinese landowner, it became a shop selling spices from India — in the heart of George Town.",
  },
  {
    kicker: "The waterfront",
    title: "Food for the docks",
    body: "As nasi kandar caught on, the men walked for miles to sell it — starting with the docks at the nearby jetty.",
  },
] as const;

const graticule = {
  lons: [75, 80, 85, 90, 95, 100],
  lats: [0, 5, 10, 15, 20],
};

const seaLabels = [
  { text: "Bay of Bengal", ...proj(87.5, 14.2), size: 30, rotate: 0, spacing: 0.5 },
  { text: "Andaman Sea", ...proj(95.6, 11.2), size: 18, rotate: -8, spacing: 0.4 },
  { text: "Strait of Malacca", ...proj(98.6, 3.2), size: 15, rotate: -48, spacing: 0.35 },
  { text: "Indian Ocean", ...proj(84, 2.5), size: 22, rotate: 0, spacing: 0.6 },
];

const landLabels = [
  { text: "INDIA", ...proj(78.4, 17.6), size: 26 },
  { text: "TAMIL NADU", ...proj(77.2, 11.4), size: 11 },
  { text: "CEYLON", ...proj(80.7, 7.6), size: 11 },
  { text: "SUMATRA", ...proj(100.5, 0.4), size: 14 },
  { text: "MALAYA", ...proj(102.1, 4.6), size: 14 },
  { text: "SIAM", ...proj(101.2, 15.5), size: 14 },
  { text: "BURMA", ...proj(96, 19.6), size: 14 },
];

export function Voyage() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const route = ref.current?.querySelector<SVGPathElement>("[data-route]");
      const ship = ref.current?.querySelector<SVGGElement>("[data-ship]");
      if (!route || !ship) return;
      const len = route.getTotalLength();
      const moveShip = (p: number) => {
        const pt = route.getPointAtLength(len * p);
        ship.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      };

      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        gsap.set("[data-steps]", { opacity: 1 });
        gsap.set("[data-step]", { autoAlpha: 0, y: 30 });
        gsap.set("[data-step='0']", { autoAlpha: 1, y: 0 });
        gsap.set(route, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set("[data-dest]", { scale: 0, transformOrigin: "center", opacity: 0 });
        gsap.set("[data-quay]", { autoAlpha: 0, y: 140, rotateX: 40, rotate: 8 });
        moveShip(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            pin: "[data-pin]",
            start: "top top",
            end: () => `+=${window.innerHeight * (desktop ? 3.2 : 2.8)}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          "[data-map]",
          desktop
            ? { rotateX: 36, rotateZ: -7, scale: 0.86, yPercent: 6 }
            : { rotateX: 30, rotateZ: -4, scale: 0.95, xPercent: 24 },
          desktop
            ? { rotateX: 20, rotateZ: -2, scale: 1, yPercent: 0, duration: 1.2 }
            : { rotateX: 16, rotateZ: -1, scale: 1, xPercent: 20, duration: 1.2 },
          0,
        )
          .to("[data-origin-label]", { opacity: 1, duration: 0.4 }, 0.4)
          .to("[data-step='0']", { autoAlpha: 0, y: -30, duration: 0.4 }, 1.4)
          .to("[data-step='1']", { autoAlpha: 1, y: 0, duration: 0.4 }, 1.85)
          .to(route, { strokeDashoffset: 0, duration: 2.2 }, 1.4)
          .to({ p: 0 }, { p: 1, duration: 2.2, onUpdate() { moveShip(this.targets()[0].p); } }, 1.4)
          .to("[data-map]", desktop ? { rotateZ: 0, duration: 2.2 } : { xPercent: -22, rotateZ: 0, duration: 2.2 }, 1.4)
          .to("[data-step='1']", { autoAlpha: 0, y: -30, duration: 0.4 }, 3.3)
          .to("[data-dest]", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 3.5)
          .to("[data-step='2']", { autoAlpha: 1, y: 0, duration: 0.4 }, 3.75)
          .to("[data-step='2']", { autoAlpha: 0, y: -30, duration: 0.4 }, 4.6)
          .to(
            "[data-map]",
            desktop
              ? { scale: 1.55, rotateX: 12, xPercent: -24, yPercent: -14, duration: 1.4, ease: "power2.inOut" }
              : { scale: 1.5, rotateX: 10, xPercent: -36, yPercent: -10, duration: 1.4, ease: "power2.inOut" },
            4.5,
          )
          .to("[data-step='3']", { autoAlpha: 1, y: 0, duration: 0.4 }, 5.05)
          .to("[data-quay]", { autoAlpha: 1, y: 0, rotateX: 0, rotate: 3, duration: 1, ease: "power3.out" }, 4.9)
          .to("[data-progress]", { scaleX: 1, duration: 5.9 }, 0);
      });

      mm.add(MQ.reduce, () => {
        gsap.set("[data-steps]", { opacity: 1 });
        gsap.set(route, { strokeDasharray: "none", strokeDashoffset: 0 });
        moveShip(1);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="journey" data-theme="dark" aria-labelledby="journey-title" className="relative bg-charcoal text-ivory">
      <div data-pin className="relative overflow-hidden motion-safe:h-[100svh]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_60%_55%,rgb(217_154_30/0.14),transparent_70%)]" />

        <header className="relative z-20 w-full bg-gradient-to-b from-charcoal via-charcoal/80 to-transparent pb-14 pt-[calc(var(--nav-h)+1.25rem)] motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-0">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <SectionLabel index="02" tone="light">
            The Journey
          </SectionLabel>
          <h2 id="journey-title" className="mt-4 font-display text-[clamp(2rem,4.6vw,4.4rem)] font-[350] leading-[0.98] tracking-[-0.03em]">
            Tamil Nadu <span className="italic text-saffron">to</span> Penang
          </h2>
          </div>
        </header>

        {/* The chart */}
        <div className="pointer-events-none relative z-0 flex items-center justify-center py-10 [perspective:1800px] motion-safe:absolute motion-safe:inset-0 motion-safe:py-0">
          <div
            data-map
            className="relative aspect-[1600/1168] w-[200vw] shrink-0 [transform-style:preserve-3d] motion-reduce:w-[92vw] sm:w-[150vw] lg:w-[min(124vh,90vw)]"
            style={{ transformOrigin: "86.8% 69.9%" }}
          >
            <div className="absolute inset-0 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)]" />
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-labelledby="map-desc">
              <desc id="map-desc">
                A stylised chart of the Bay of Bengal showing Chittarkottai in Tamil Nadu and George Town, Penang, joined by an
                illustrative route.
              </desc>
              <defs>
                <pattern id="sea-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <line x1="0" y1="0" x2="0" y2="9" stroke="#8b4a2b" strokeOpacity="0.07" strokeWidth="1" />
                </pattern>
                <radialGradient id="paper-burn" cx="50%" cy="50%" r="75%">
                  <stop offset="60%" stopColor="#000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#5c2e1a" stopOpacity="0.5" />
                </radialGradient>
                <filter id="ink" x="-2%" y="-2%" width="104%" height="104%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" />
                  <feDisplacementMap in="SourceGraphic" scale="1.6" />
                </filter>
              </defs>

              <rect width={W} height={H} fill="#e9dcc2" />
              <rect width={W} height={H} fill="url(#sea-hatch)" />

              {/* Graticule */}
              <g stroke="#5c2e1a" strokeOpacity="0.22" strokeWidth="0.8">
                {graticule.lons.map((lon) => {
                  const { x } = proj(lon, 0);
                  return <line key={lon} x1={x} y1={0} x2={x} y2={H} />;
                })}
                {graticule.lats.map((lat) => {
                  const { y } = proj(LON0, lat);
                  return <line key={lat} x1={0} y1={y} x2={W} y2={y} />;
                })}
              </g>
              <g fill="#5c2e1a" fillOpacity="0.55" fontSize="13" fontFamily="var(--font-display)" fontStyle="italic">
                {graticule.lons.map((lon) => (
                  <text key={lon} x={proj(lon, 0).x + 6} y={22}>
                    {lon}°E
                  </text>
                ))}
                {graticule.lats.map((lat) => (
                  <text key={lat} x={10} y={proj(LON0, lat).y - 6}>
                    {lat === 0 ? "Equator" : `${lat}°N`}
                  </text>
                ))}
              </g>

              {/* Land */}
              <g filter="url(#ink)">
                {mapData.shapes.map((s) => (
                  <path
                    key={s.name}
                    d={s.d}
                    fill={s.role === "land" ? "#d8c49c" : "#cfae6c"}
                    stroke="#3d2a1a"
                    strokeOpacity={s.role === "land" ? 0.45 : 0.75}
                    strokeWidth={s.role === "land" ? 0.9 : 1.3}
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Labels */}
              <g fill="#5c2e1a" fontFamily="var(--font-display)" fontStyle="italic" textAnchor="middle">
                {seaLabels.map((l) => (
                  <text
                    key={l.text}
                    x={l.x}
                    y={l.y}
                    fontSize={l.size}
                    fillOpacity="0.55"
                    letterSpacing={`${l.spacing}em`}
                    transform={`rotate(${l.rotate} ${l.x} ${l.y})`}
                  >
                    {l.text}
                  </text>
                ))}
              </g>
              <g fill="#2b1d12" fontFamily="var(--font-sans)" fontWeight="600" textAnchor="middle" fillOpacity="0.6">
                {landLabels.map((l) => (
                  <text key={l.text} x={l.x} y={l.y} fontSize={l.size} letterSpacing="0.35em">
                    {l.text}
                  </text>
                ))}
              </g>

              {/* Compass rose */}
              <g transform={`translate(${W - 150} 150)`} stroke="#5c2e1a" fill="none" strokeOpacity="0.6">
                <circle r="62" strokeWidth="0.8" />
                <circle r="54" strokeWidth="0.5" strokeDasharray="2 4" />
                <path d="M0 -78 L9 0 L0 78 L-9 0 Z" fill="#5c2e1a" fillOpacity="0.35" strokeWidth="0.8" />
                <path d="M-78 0 L0 9 L78 0 L0 -9 Z" fill="#5c2e1a" fillOpacity="0.15" strokeWidth="0.8" />
                <text y="-88" textAnchor="middle" fill="#5c2e1a" stroke="none" fontSize="16" fontFamily="var(--font-display)">
                  N
                </text>
              </g>

              {/* Cartouche */}
              <g transform={`translate(70 ${H - 190})`}>
                <rect width="330" height="120" fill="#efe4cf" stroke="#5c2e1a" strokeOpacity="0.5" />
                <rect x="6" y="6" width="318" height="108" fill="none" stroke="#5c2e1a" strokeOpacity="0.3" />
                <text x="165" y="44" textAnchor="middle" fontFamily="var(--font-display)" fontSize="24" fill="#2b1d12">
                  The Spice Route
                </text>
                <text x="165" y="72" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontSize="15" fill="#5c2e1a">
                  Tamil Nadu — Penang · 1900s
                </text>
                <text x="165" y="98" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9" letterSpacing="2.5" fill="#5c2e1a" fillOpacity="0.7">
                  ROUTE ILLUSTRATIVE
                </text>
              </g>

              {/* Route */}
              <path d={ROUTE} fill="none" stroke="#5c2e1a" strokeOpacity="0.3" strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round" />
              <path data-route d={ROUTE} fill="none" stroke="#c8861a" strokeWidth="3.2" strokeLinecap="round" />

              {/* Origin */}
              <g transform={`translate(${O.x} ${O.y})`}>
                <circle r="22" fill="none" stroke="#c8861a" strokeWidth="1.5" className="origin-pulse" />
                <circle r="9" fill="#c8861a" stroke="#2b1d12" strokeWidth="1.5" />
                <g data-origin-label opacity="0">
                  <line x1="0" y1="-12" x2="0" y2="-64" stroke="#2b1d12" strokeWidth="1" />
                  <text y="-74" textAnchor="middle" fontFamily="var(--font-display)" fontSize="22" fill="#2b1d12">
                    Chittarkottai
                  </text>
                </g>
              </g>

              {/* Destination */}
              <g transform={`translate(${D.x} ${D.y})`}>
                <g data-dest>
                  <circle r="26" fill="#1f3b2c" fillOpacity="0.15" stroke="#1f3b2c" strokeWidth="1.5" />
                  <circle r="9" fill="#1f3b2c" stroke="#efe4cf" strokeWidth="2" />
                  <line x1="-12" y1="0" x2="-70" y2="-40" stroke="#2b1d12" strokeWidth="1" />
                  <text x="-78" y="-46" textAnchor="end" fontFamily="var(--font-display)" fontSize="22" fill="#2b1d12">
                    Penang
                  </text>
                  <text x="-78" y="-24" textAnchor="end" fontFamily="var(--font-display)" fontStyle="italic" fontSize="14" fill="#5c2e1a">
                    George Town · Lebuh Campbell
                  </text>
                </g>
              </g>

              {/* Travelling marker */}
              <g data-ship transform={`translate(${O.x} ${O.y})`}>
                <circle r="16" fill="#e8a83e" fillOpacity="0.25" />
                <circle r="6" fill="#e8a83e" stroke="#2b1d12" strokeWidth="1.5" />
              </g>

              <rect width={W} height={H} fill="url(#paper-burn)" style={{ mixBlendMode: "multiply" }} />
            </svg>

            {/* Weld Quay, lifting off the chart */}
            <figure
              data-quay
              className="absolute bottom-[4%] right-[1%] w-[22%] bg-[#f6efe2] p-[0.5%] shadow-[0_40px_60px_-20px_rgb(0_0_0/0.75)] motion-reduce:hidden"
              style={{ transform: "translateZ(80px)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/quay-1910.jpg" alt="Boats along the quay at Penang, around 1910" fill sizes="30vw" className="archival object-cover" />
              </div>
              <figcaption className="caption px-1 pt-1 text-[clamp(0.45rem,0.7vw,0.72rem)] text-ink/70">The quay at Penang, c. 1910</figcaption>
            </figure>
          </div>
        </div>

        {/* Narrative captions */}
        <div className="relative z-20 w-full pb-8 pt-24 motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-0 lg:pb-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/85 to-transparent lg:via-charcoal/60" />
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <ol data-steps data-reveal className="relative min-h-[11.5rem] lg:col-span-5 motion-reduce:min-h-0 motion-reduce:space-y-8">
              {STEPS.map((s, i) => (
                <li key={s.title} data-step={i} className="motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-0">
                  <p className="eyebrow text-gold">
                    <span className="mr-3 font-display normal-case tracking-normal italic text-ivory/50">0{i + 1} / 04</span>
                    {s.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-tight">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ivory/70">{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="lg:col-span-4 lg:col-start-9">
              <div className="h-px w-full bg-ivory/15">
                <div data-progress className="h-px origin-left scale-x-0 bg-gold motion-reduce:scale-x-100" />
              </div>
              <p className="caption mt-3 text-ivory/45">
                The route is drawn for illustration. Records say only that the family arrived in Penang in the 1900s — not the
                passage they took.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
      <span data-journey="voyage" className="absolute left-0 top-[30%] h-px w-px" aria-hidden />
      <span data-journey="waterfront" className="absolute left-0 top-[80%] h-px w-px" aria-hidden />
    </section>
  );
}
