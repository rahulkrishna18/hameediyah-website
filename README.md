# Hameediyah — From a spice route to a Penang icon

A single-page heritage site for Hameediyah Restaurant, 164A Lebuh Campbell, George Town, Penang (est. 1907).
It is built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger,
Lenis, Motion, and React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes are static)
npm run lint
```

You need Node.js 20.9 or later. To deploy, import the repo into Vercel; no configuration is needed. Optionally, set
`NEXT_PUBLIC_SITE_URL` to the production URL so Open Graph image URLs resolve correctly.

## Structure

| Path | What it is |
| --- | --- |
| `src/lib/content.ts` | **All facts on the site**, each traced to a source (see header comment) |
| `src/lib/credits.ts` | Image and data credits, rendered at `/credits` |
| `src/lib/mapData.ts` | Generated SVG coastlines for the voyage map (`scripts/build-map.py`) |
| `src/components/sections/*` | One file per story chapter, in page order (see `src/app/page.tsx`) |
| `src/components/three/*` | WebGL scenes (procedural spices, kandar), lazy-loaded client chunks |
| `src/components/ui/*` | Reveal text, print frames, odometer, buttons |
| `scripts/process-images.mjs` | Crops and resizes source photographs into `public/images` |

## Content rules

Everything comes from three places:
- *Hameediyah, Penang's oldest nasi kandar restaurant still going strong* (New Straits Times, 20 Aug 2019).
- The PenangToday Community post that republishes it.
- The restaurant's own signage and historic menu board, as seen in those photographs.

Do not add dates, prices, opening hours or statistics that cannot be traced to a source.

Decisions made against the brief:
- **Ayam Bawang** and **Crab Curry** are not shown, because neither reference mentions them. Mutton Kurmah is
  shown, because it is on the historic menu board.
- **Opening hours** (Monday – Sunday, 10am – 11pm) were supplied by the client and live in `content.ts`.
- **Prices** are omitted from the menu. The board's prices are historical.
- The **Tamil Nadu → Penang route** is drawn as an illustration and is labelled as such. The sources say only that
  the family arrived "in the 1900s".
- The source places the early selling at "the docks at the nearby jetty". The Weld Quay photographs are captioned
  as Weld Quay c. 1910, without claiming it was where the family landed.
- The phrase "Penang's oldest" follows the NST headline. The restaurant's own sign says "Oldest Nasi Kandar in
  Malaysia".

## Images: action needed before public launch

- **Openly licensed**: Wikimedia Commons, either CC0, public domain, or CC BY-SA with attribution on `/credits`.
- **Reference material**: every file starting with `public/images/ref-` comes from the NST article (© New Straits
  Times) or the PenangToday Facebook post. These need a licence from the rights holders, or replacement with the
  restaurant's own photographs.
- **Illustrative food photos**: the dish photographs are not of Hameediyah's food. They are marked as illustrative on
  the page. Swap in real photography by replacing the files under `public/images/dish-*.jpg`, or by editing the
  paths in `content.ts`.

## Motion and performance notes

- The WebGL canvases mount only near the viewport and stop rendering off-screen. The hero scene waits for the load
  event and browser idle.
- `prefers-reduced-motion` turns off smooth scrolling, pinning, and scrubbed animations. Every section then renders
  as static, fully readable content.
- Elements marked `data-reveal` are hidden before hydration only when motion is allowed. A 5-second failsafe
  un-hides them if JavaScript fails.
