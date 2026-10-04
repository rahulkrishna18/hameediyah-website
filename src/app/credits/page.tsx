import type { Metadata } from "next";
import Link from "next/link";
import { dataCredits, imageCredits } from "@/lib/credits";
import { sources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sources & image credits",
  description: "The sources behind the Hameediyah story, and credits and licences for every photograph and dataset used on the site.",
};

export default function CreditsPage() {
  return (
    <main id="main" className="paper min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        <Link href="/" className="eyebrow link-line text-cinnamon">
          ← Back to the story
        </Link>
        <h1 className="mt-10 font-display text-[clamp(2.6rem,6vw,5rem)] font-[330] leading-[0.95] tracking-[-0.035em]">
          Sources <span className="italic text-cinnamon">&amp; credits</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Every date, name and figure on this site is drawn from the sources below. Photographs that are not of Hameediyah are marked
          as illustrative where they appear.
        </p>

        <section className="mt-16" aria-labelledby="sources-h">
          <h2 id="sources-h" className="eyebrow text-cinnamon">
            Written sources
          </h2>
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {[sources.nst, sources.ptc].map((s) => (
              <li key={s.url} className="py-5">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-display text-xl link-line">
                  {s.title}
                </a>
                <p className="mt-1 text-sm text-ink/60">
                  {s.publication} · {s.date}
                  {"author" in s ? ` · ${s.author}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="images-h">
          <h2 id="images-h" className="eyebrow text-cinnamon">
            Photographs &amp; charts
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-ink/20 text-ink/50">
                <tr>
                  <th className="py-3 pr-4 font-medium">Image</th>
                  <th className="py-3 pr-4 font-medium">Author</th>
                  <th className="py-3 pr-4 font-medium">Licence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {imageCredits.map((c) => (
                  <tr key={c.file} className="align-top">
                    <td className="py-4 pr-4">
                      <a href={c.source} target="_blank" rel="noopener noreferrer" className="link-line font-medium">
                        {c.title}
                      </a>
                      {c.note && <p className="mt-1 text-ink/50">{c.note}</p>}
                    </td>
                    <td className="py-4 pr-4 text-ink/70">{c.author}</td>
                    <td className="py-4 pr-4 text-ink/70">
                      {c.licenseUrl ? (
                        <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                          {c.license}
                        </a>
                      ) : (
                        c.license
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mt-4 text-ink/55">
            Images licensed CC BY-SA have been resized and cropped; those adaptations are shared under the same licence.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="data-h">
          <h2 id="data-h" className="eyebrow text-cinnamon">
            Map data
          </h2>
          <ul className="mt-6 space-y-3 text-sm">
            {dataCredits.map((d) => (
              <li key={d.title}>
                <span className="font-medium">{d.title}</span>  {d.author} ·{" "}
                <a href={d.source} target="_blank" rel="noopener noreferrer" className="link-line text-cinnamon">
                  {d.license}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink/60">The route drawn between Tamil Nadu and Penang is illustrative; the family&rsquo;s exact passage is not recorded.</p>
        </section>
      </div>
    </main>
  );
}
