import { fetchDigest } from "@/lib/sheets";
import Starfield from "@/components/Starfield";
import DaytimeSky from "@/components/DaytimeSky";
import Navbar from "@/components/Navbar";
import HomeSidebar from "@/components/HomeSidebar";
import HeroSection from "@/components/HeroSection";
import TopStories from "@/components/TopStories";
import LatestNews from "@/components/LatestNews";
import Footer from "@/components/Footer";

export const revalidate = 300;

export default async function Home() {
  let data;
  try {
    data = await fetchDigest();
  } catch (e) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="card p-8 max-w-md text-center">
          <h1 className="font-display text-2xl mb-3">Sky is cloudy ☁️</h1>
          <p className="text-ink-muted text-sm">
            Couldn&apos;t load the digest from Google Sheets. Make sure the sheet is shared as
            &ldquo;Anyone with the link can view.&rdquo;
          </p>
          <p className="text-xs text-ink-dim mt-4 font-mono">
            {e instanceof Error ? e.message : "Unknown error"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      <DaytimeSky />
      <Navbar />
      <HomeSidebar />

      {/* Content — offset right on desktop to clear the sidebar */}
      <div className="lg:pl-[200px]">
        {/* 1 — Hero (50/50): headline + APOD / Sky Tonight */}
        <section id="top">
          <HeroSection
            storyCount={data.pulse.storyCount}
            lastUpdated={data.lastUpdated}
            pulse={data.pulse}
            moon={data.moon}
            observationQuality={data.observationQuality}
            visiblePlanets={data.visiblePlanets}
            viewingTime={data.viewingTime}
            issCrewCount={data.issCrewCount}
            apod={data.apod}
          />
        </section>

        {/* 2 — Top Stories (featured banner + 4 tiles) */}
        <section id="stories" className="section-stripe">
          <TopStories stories={data.topStories} />
        </section>

        {/* 3 — Latest News feed */}
        <section id="feed" className="section-stripe py-10 md:py-14">
          <LatestNews articles={data.all} />
        </section>

        <Footer lastUpdated={data.lastUpdated} count={data.all.length} />
      </div>
    </main>
  );
}
