// Resizes and crops source photographs into /public/images.
// Sources: Wikimedia Commons (see src/lib/credits.ts) and the reference material supplied with the brief.
// Usage: node scripts/process-images.mjs <commons-raw-dir> <reference-dir>
import sharp from 'sharp';
import path from 'node:path';

const [raw = '/tmp/raw', ref = '/tmp/refimg'] = process.argv.slice(2);
const out = path.resolve('public/images');

// crop: fractions of the source [left, top, width, height]
const jobs = [
  { src: `${raw}/hameediyah-facade.jpg`, name: 'hameediyah-facade', width: 1600 },
  { src: `${raw}/hameediyah-queue-a.jpg`, name: 'hameediyah-queue-a', width: 2000 },
  { src: `${raw}/hameediyah-queue-b.jpg`, name: 'hameediyah-queue-b', width: 2000 },
  { src: `${raw}/hameediyah-queue-c.jpg`, name: 'hameediyah-queue-c', width: 1800 },
  { src: `${raw}/weld-quay-1910.jpg`, name: 'weld-quay-1910', width: 2000 },
  { src: `${raw}/quay-1910.jpg`, name: 'quay-1910', width: 2000 },
  { src: `${raw}/pier-1910.jpg`, name: 'pier-1910', width: 2000 },
  { src: `${raw}/beach-street-1910.jpg`, name: 'beach-street-1910', width: 2000 },
  { src: `${raw}/beach-street-1910-b.jpg`, name: 'beach-street-1910-b', width: 2000 },
  { src: `${raw}/harbour-ships.jpg`, name: 'harbour-ships', width: 1500 },
  { src: `${raw}/admiralty-chart-1909.jpg`, name: 'admiralty-chart-1909', width: 1800, quality: 72 },
  { src: `${raw}/admiralty-chart-1909.jpg`, name: 'chart-george-town', crop: [0.2, 0.27, 0.49, 0.31], width: 1900, quality: 76 },
  { src: `${raw}/nasi-kandar-1950s.jpg`, name: 'nasi-kandar-1950s' },
  { src: `${raw}/campbell-street-2026.jpg`, name: 'campbell-street-2026', width: 1500 },
  { src: `${raw}/angsana.jpg`, name: 'angsana', width: 2000 },
  { src: `${raw}/angsana-b.jpg`, name: 'angsana-canopy', crop: [0, 0, 1, 0.62], width: 1600 },
  { src: `${raw}/weld-quay-2023.jpg`, name: 'weld-quay-2023', width: 1600 },
  // Food — square crops centred on the plate
  { src: `${raw}/biryani.jpg`, name: 'dish-briyani', crop: [0.24, 0.02, 0.73, 0.97], width: 1400 },
  { src: `${raw}/korma.jpg`, name: 'dish-kurmah', crop: [0.13, 0.02, 0.73, 0.97], width: 1400 },
  { src: `${raw}/rendang.jpg`, name: 'dish-rendang', crop: [0.11, 0.02, 0.73, 0.97], width: 1400 },
  { src: `${raw}/mee-goreng.jpg`, name: 'dish-mee-goreng', crop: [0.12, 0, 0.75, 1], width: 1400 },
  { src: `${raw}/murtabak.jpg`, name: 'dish-murtabak', crop: [0.12, 0, 0.75, 1], width: 1400 },
  { src: `${raw}/murtabak-b.jpg`, name: 'dish-murtabak-b', width: 1600 },
  { src: `${raw}/nasi-kandar-plate.jpg`, name: 'dish-nasi-kandar', crop: [0.12, 0, 0.75, 1], width: 1400 },
  { src: `${raw}/nasi-kandar-plate-b.jpg`, name: 'dish-nasi-kandar-b', crop: [0.12, 0, 0.75, 1], width: 1400 },
  { src: `${raw}/nasi-kandar-kayu.jpg`, name: 'dish-nasi-kandar-kayu', width: 1600 },
  { src: `${raw}/fennel.jpg`, name: 'spice-fennel', width: 1200 },
  { src: `${raw}/cumin.jpg`, name: 'spice-cumin', width: 1200 },
  { src: `${raw}/white-pepper.jpg`, name: 'spice-white-pepper', width: 1200 },
  // Reference material supplied with the brief (NST, 2019; PenangToday Community, 2025)
  { src: `${ref}/nst1.jpg`, name: 'ref-shopfront-2019' },
  { src: `${ref}/nst2.jpg`, name: 'ref-family-dishes-2019' },
  { src: `${ref}/fb1.jpg`, name: 'ref-counter-archive' },
  { src: `${ref}/fb2.jpg`, name: 'ref-counter-archive-b' },
  { src: `${ref}/fb3.jpg`, name: 'ref-golden-moments' },
  { src: `${ref}/fb4.jpg`, name: 'ref-menu-board' },
  { src: `${ref}/fb5.jpg`, name: 'ref-queue' },
];

for (const job of jobs) {
  let img = sharp(job.src).rotate();
  const meta = await img.metadata();
  if (job.crop) {
    const [l, t, w, h] = job.crop;
    img = img.extract({
      left: Math.round(l * meta.width),
      top: Math.round(t * meta.height),
      width: Math.round(w * meta.width),
      height: Math.round(h * meta.height),
    });
  }
  if (job.width) img = img.resize({ width: job.width, withoutEnlargement: true });
  const file = path.join(out, `${job.name}.jpg`);
  const info = await img.jpeg({ quality: job.quality ?? 80, mozjpeg: true, progressive: true }).toFile(file);
  console.log(job.name.padEnd(26), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
