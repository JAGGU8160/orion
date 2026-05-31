import { fetchDigest } from "@/lib/sheets";
import Starfield from "@/components/Starfield";
import DaytimeSky from "@/components/DaytimeSky";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GujaratSky from "@/components/GujaratSky";
import ApodCard from "@/components/ApodCard";
import AsteroidCard from "@/components/AsteroidCard";
import IssCard from "@/components/IssCard";
import NewsGrid from "@/components/NewsGrid";
import Footer from "@/components/Footer";

export const revalidate = 300;

function inferIssCount(text: string): number {
  const m =
    text.match(/(\d+)\s+humans?\s+are\s+in\s+space/i) ||
    text.match(/ISS crew\s*\((\d+)\)/i);
  return m ? parseInt(m[1], 10) : 0;
}

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
            Couldn&apos;t load the digest from Google Sheets. Make sure the sheet is shared
            as &ldquo;Anyone with the link can view.&rdquo;
          </p>
          <p className="text-xs text-ink-dim mt-4 font-mono">
            {e instanceof Error ? e.message : "Unknown error"}
          </p>
        </div>
      </main>
    );
  }

  const issCount = data.iss
    ? inferIssCount(data.iss.aiSummary + " " + data.iss.title)
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      <DaytimeSky />
      <Navbar />

      <section id="top">
        <Hero issCount={issCount} />
      </section>

      <section id="sky">
        <GujaratSky items={data.localSky} />
      </section>

      <section id="apod">
        <ApodCard apod={data.apod} />
      </section>

      <section id="asteroids">
        <AsteroidCard asteroids={data.asteroids} />
      </section>

      <section id="iss">
        <IssCard iss={data.iss} />
      </section>

      <section id="feed">
        <NewsGrid articles={data.all} />
      </section>

      <Footer lastUpdated={data.lastUpdated} count={data.all.length} />
    </main>
  );
}
