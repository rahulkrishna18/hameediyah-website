import { Footer } from "@/components/Footer";
import { JourneyRail } from "@/components/JourneyRail";
import { Nav } from "@/components/Nav";
import { Beginning } from "@/components/sections/Beginning";
import { CampbellStreet } from "@/components/sections/CampbellStreet";
import { Hero } from "@/components/sections/Hero";
import { Kandar } from "@/components/sections/Kandar";
import { Menu } from "@/components/sections/Menu";
import { Numbers } from "@/components/sections/Numbers";
import { SignatureFood } from "@/components/sections/SignatureFood";
import { Spices } from "@/components/sections/Spices";
import { ThenNow } from "@/components/sections/ThenNow";
import { Timeline } from "@/components/sections/Timeline";
import { Visit } from "@/components/sections/Visit";
import { Voyage } from "@/components/sections/Voyage";

export default function Home() {
  return (
    <>
      <Nav />
      <JourneyRail />
      <main id="main">
        <Hero />
        <Beginning />
        <Voyage />
        <Kandar />
        <CampbellStreet />
        <Timeline />
        <Spices />
        <SignatureFood />
        <Menu />
        <Numbers />
        <ThenNow />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
