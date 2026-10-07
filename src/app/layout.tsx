import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, Noto_Naskh_Arabic, Noto_Serif_Tamil } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { FOUNDED, visit } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const tamil = Noto_Serif_Tamil({
  variable: "--font-tamil-serif",
  subsets: ["tamil"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["500"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hameediyah.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hameediyah  From a spice route to a Penang icon · Est. 1907",
    template: "%s · Hameediyah, Penang",
  },
  description:
    "Since 1907, Hameediyah has served nasi kandar on Lebuh Campbell, George Town  a story that begins with a spice trader from Tamil Nadu and an Angsana tree.",
  keywords: ["Hameediyah", "nasi kandar", "Penang", "George Town", "Lebuh Campbell", "Campbell Street", "1907", "heritage restaurant"],
  openGraph: {
    title: "Hameediyah  From a spice route to a Penang icon",
    description: "Penang's oldest nasi kandar restaurant. Lebuh Campbell, George Town. Est. 1907.",
    type: "website",
    locale: "en_MY",
    images: [{ url: "/images/hameediyah-facade.jpg", width: 1600, height: 2133, alt: "Hameediyah Restaurant on Campbell Street" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#12100e",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: visit.name,
  foundingDate: String(FOUNDED),
  logo: `${siteUrl}/brand/hameediyah-logo.png`,
  image: `${siteUrl}/brand/hameediyah-logo.png`,
  servesCuisine: ["Nasi Kandar", "Malaysian", "Indian Muslim"],
  telephone: "+60 4-261 1095",
  address: {
    "@type": "PostalAddress",
    streetAddress: visit.street,
    postalCode: visit.postcode,
    addressLocality: visit.city,
    addressRegion: visit.state,
    addressCountry: "MY",
  },
  geo: { "@type": "GeoCoordinates", latitude: visit.lat, longitude: visit.lng },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "23:00",
    },
  ],
};

// Runs before first paint: elements marked [data-reveal] start hidden only when motion is allowed.
const motionScript = `(function(){try{var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');setTimeout(function(){if(!window.__hameediyahReady)d.classList.remove('js-motion')},5000)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${tamil.variable} ${naskh.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
