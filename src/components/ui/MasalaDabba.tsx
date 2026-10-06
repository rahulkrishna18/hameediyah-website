"use client";

import { useState } from "react";
import { masala } from "@/lib/content";

/**
 * Top-down brass masala dabba: the five named ingredients of the family masala
 * around a centre cup of the ground blend, with the lid resting behind the tin.
 * Drawn on a 600×600 grid; animation hooks are the data-hero-* attributes.
 */

type Id = (typeof masala)[number]["id"];
type Piece = { x: number; y: number; r: number; s: number; c: string };

const C = 300;
const CUP_R = 80;
const CUP_D = 172;
const CENTRE_R = 70;

// Deterministic scatter so server and client markup match
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function scatter(seed: number, count: number, radius: number, colors: string[], scale: [number, number]): Piece[] {
  const rand = rng(seed);
  return Array.from({ length: count }, () => {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * radius;
    return {
      x: r2(d * Math.cos(a)),
      y: r2(d * Math.sin(a)),
      r: Math.round(rand() * 360),
      s: r2(scale[0] + rand() * (scale[1] - scale[0])),
      c: colors[Math.floor(rand() * colors.length)],
    };
  });
}

const SHAPES: Record<Id, { d?: string; circle?: number; count: number; colors: string[]; scale: [number, number]; base: string; vein?: boolean }> = {
  fennel: { d: "M-7 0 C-4 -3 4 -3 7 0 C4 3 -4 3 -7 0Z", count: 260, base: "#5d6233", colors: ["#a3a65e", "#b9b46c", "#868b4a", "#c6c07a"], scale: [0.9, 1.2], vein: true },
  cumin: { d: "M-6.5 0 C-3.5 -2.4 3.5 -2.4 6.5 0 C3.5 2.4 -3.5 2.4 -6.5 0Z", count: 300, base: "#4a321a", colors: ["#7c5631", "#946b3e", "#5f4122", "#a27a4a"], scale: [0.9, 1.15], vein: true },
  "white-pepper": { circle: 3.6, count: 420, base: "#a8956c", colors: ["#ebdfc4", "#d9c9a5", "#cbb88e", "#f2e8d2"], scale: [0.85, 1.15] },
  almond: { d: "M-13 0 C-9 -7.5 5 -7.5 13 0 C5 7.5 -9 7.5 -13 0Z", count: 48, base: "#5a3018", colors: ["#9c5d35", "#874d2a", "#ad6c3e", "#7a4223"], scale: [0.95, 1.1], vein: true },
  cashew: {
    d: "M-11 -1 C-11 -10 6 -12 11 -3 C13 4 8 10 3 7 C1 3 -1 1 -5 2 C-8 3 -11 2 -11 -1Z",
    count: 46,
    base: "#b89a64",
    colors: ["#f0ddb4", "#e6cf9e", "#dcc28a", "#f5e6c6"],
    scale: [0.95, 1.1],
  },
};

const cups = masala.map((m, i) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  const shape = SHAPES[m.id];
  return { ...m, x: r2(C + CUP_D * Math.cos(a)), y: r2(C + CUP_D * Math.sin(a)), shape, pieces: scatter(i + 11, shape.count, CUP_R - 6, shape.colors, shape.scale) };
});

const powder = scatter(99, 420, CENTRE_R - 6, ["#8f3d1b", "#a5481f", "#7a3217", "#b85a26", "#6b2a13", "#c46a2c"], [0.6, 1.4]);

function Cup({ cup, active, onEnter, onLeave }: { cup: (typeof cups)[number]; active: boolean; onEnter: () => void; onLeave: () => void }) {
  const { shape } = cup;
  return (
    <g data-hero-cup transform={`translate(${cup.x} ${cup.y})`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <g
        className="transition-transform duration-500 ease-[var(--ease-heritage)]"
        style={{ transform: active ? "scale(1.05)" : undefined }}
      >
        <circle r={CUP_R + 6} fill="url(#dabba-rim)" />
        <circle r={CUP_R} fill="url(#dabba-cup)" />
        <circle r={CUP_R - 4} fill={shape.base} />
        <g clipPath="url(#dabba-cup-clip)">
          {cup.pieces.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})`}>
              {shape.circle ? (
                <>
                  <circle r={shape.circle} fill={p.c} stroke="#5a4426" strokeOpacity={0.35} strokeWidth={0.6} />
                  <circle cx={-1} cy={-1} r={1} fill="#fff" fillOpacity={0.35} />
                </>
              ) : (
                <>
                  <path d={shape.d} fill={p.c} stroke="#2a1a0c" strokeOpacity={0.35} strokeWidth={0.6} />
                  {shape.vein && <path d="M-5 0 L5 0" stroke="#2a1a0c" strokeOpacity={0.3} strokeWidth={0.6} />}
                </>
              )}
            </g>
          ))}
          <circle r={CUP_R} fill="url(#dabba-shade)" />
        </g>
        <circle r={CUP_R} fill="none" stroke="#3a2812" strokeOpacity={0.5} strokeWidth={1.5} />
        {active && <circle r={CUP_R + 6} fill="none" stroke="var(--color-saffron)" strokeWidth={2} />}
      </g>
    </g>
  );
}

export function MasalaDabba({ className }: { className?: string }) {
  const [active, setActive] = useState<Id | null>(null);

  return (
    <figure className={className}>
      <div className="relative mr-auto aspect-square w-[80%]">
        {/* Lid, resting behind the tin */}
        <svg
          aria-hidden
          data-hero-lid
          viewBox="0 0 600 600"
          className="absolute left-[19%] top-[-15%] h-full w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)]"
        >
          <defs>
            <radialGradient id="dabba-lid" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#f3d98f" />
              <stop offset="45%" stopColor="#c99c4d" />
              <stop offset="100%" stopColor="#7d5a2a" />
            </radialGradient>
            <path id="dabba-lid-text" d="M 300,300 m -236,0 a 236,236 0 1,1 472,0 a 236,236 0 1,1 -472,0" />
          </defs>
          <circle cx={C} cy={C} r={290} fill="url(#dabba-lid)" />
          {[278, 258, 214, 120, 104].map((r) => (
            <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#5a3f1a" strokeOpacity={0.45} strokeWidth={1.2} />
          ))}
          <text className="font-sans text-[15px] font-semibold uppercase" fill="#5a3f1a" fillOpacity={0.7} letterSpacing="0.3em">
            <textPath href="#dabba-lid-text" startOffset="62%">
              Hameediyah ✦ Est. 1907 ✦ Penang
            </textPath>
          </text>
        </svg>

        {/* Tin */}
        <svg
          aria-hidden
          data-hero-tin
          viewBox="0 0 600 600"
          className="absolute inset-0 h-full w-full drop-shadow-[0_40px_50px_rgb(0_0_0/0.6)]"
        >
          <defs>
            <linearGradient id="dabba-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f2d68d" />
              <stop offset="35%" stopColor="#c79a4a" />
              <stop offset="70%" stopColor="#86612f" />
              <stop offset="100%" stopColor="#d6ad63" />
            </linearGradient>
            <radialGradient id="dabba-tray" cx="40%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#bf914a" />
              <stop offset="100%" stopColor="#5f4320" />
            </radialGradient>
            <linearGradient id="dabba-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6e2a6" />
              <stop offset="55%" stopColor="#b58642" />
              <stop offset="100%" stopColor="#6e4f25" />
            </linearGradient>
            <radialGradient id="dabba-cup" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6a4b22" />
              <stop offset="100%" stopColor="#2e200e" />
            </radialGradient>
            <radialGradient id="dabba-shade" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#fff6dc" stopOpacity={0.18} />
              <stop offset="60%" stopColor="#000" stopOpacity={0} />
              <stop offset="100%" stopColor="#1a0f05" stopOpacity={0.6} />
            </radialGradient>
            <linearGradient id="dabba-spoon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a6430" />
              <stop offset="50%" stopColor="#f3dc9a" />
              <stop offset="100%" stopColor="#8a6430" />
            </linearGradient>
            <clipPath id="dabba-cup-clip">
              <circle r={CUP_R} />
            </clipPath>
            <clipPath id="dabba-centre-clip">
              <circle r={CENTRE_R} />
            </clipPath>
          </defs>

          <circle cx={C} cy={C} r={292} fill="url(#dabba-body)" />
          <circle cx={C} cy={C} r={278} fill="none" stroke="#fff3cf" strokeOpacity={0.35} strokeWidth={1.5} />
          <circle cx={C} cy={C} r={268} fill="url(#dabba-tray)" />
          <circle cx={C} cy={C} r={268} fill="none" stroke="#3a2812" strokeOpacity={0.45} strokeWidth={2} />
          {[200, 120].map((r) => (
            <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#3a2812" strokeOpacity={0.12} />
          ))}

          {cups.map((cup) => (
            <Cup
              key={cup.id}
              cup={cup}
              active={active === cup.id}
              onEnter={() => setActive(cup.id)}
              onLeave={() => setActive(null)}
            />
          ))}

          {/* Centre cup: the ground masala, with a brass spoon */}
          <g data-hero-cup transform={`translate(${C} ${C})`}>
            <circle r={CENTRE_R + 6} fill="url(#dabba-rim)" />
            <g clipPath="url(#dabba-centre-clip)">
              <circle r={CENTRE_R} fill="#8a3a1a" />
              {powder.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={p.s * 1.6} fill={p.c} />
              ))}
              <circle r={CENTRE_R} fill="url(#dabba-shade)" />
            </g>
            <circle r={CENTRE_R} fill="none" stroke="#3a2812" strokeOpacity={0.5} strokeWidth={1.5} />
            <g transform="rotate(118)">
              <path d="M18 -3.5 L150 -5 Q156 0 150 5 L18 3.5 Z" fill="url(#dabba-spoon)" stroke="#5a3f1a" strokeOpacity={0.5} strokeWidth={0.8} />
              <ellipse cx={-6} cy={0} rx={28} ry={18} fill="url(#dabba-spoon)" stroke="#5a3f1a" strokeOpacity={0.5} strokeWidth={0.8} />
              <ellipse cx={-6} cy={0} rx={21} ry={12.5} fill="#7e3418" />
              <ellipse cx={-10} cy={-3} rx={10} ry={5} fill="#c46a2c" fillOpacity={0.6} />
            </g>
          </g>
        </svg>
      </div>

      <figcaption className="mt-8 lg:mt-10">
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {cups.map((cup, i) => (
            <li key={cup.id} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="text-gold/40">
                  ·
                </span>
              )}
              <span
                className={`eyebrow text-[0.62rem] transition-colors duration-500 ${active === cup.id ? "text-saffron" : "text-ivory/60"}`}
              >
                {cup.name}
              </span>
            </li>
          ))}
        </ul>
        <p className="caption mt-2.5 text-ivory/45">The family masala, still bought whole, roasted and ground in-house.</p>
      </figcaption>
    </figure>
  );
}
