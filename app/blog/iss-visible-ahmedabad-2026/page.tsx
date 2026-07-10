import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "ISS Visible from Ahmedabad 2026 — How to Track the Space Station",
  description:
    "How to see the International Space Station (ISS) from Ahmedabad and Gujarat. Naked-eye visibility, pass prediction tools, and what to look for. Guide by Invincible Project Orion.",
  keywords: [
    "ISS visible Ahmedabad 2026", "International Space Station Gujarat", "ISS pass Ahmedabad",
    "see ISS from India", "space station visible tonight Ahmedabad", "ISS track Gujarat",
    "how to see ISS India", "ISS brightness magnitude Ahmedabad", "ISS orbit India",
    "Heavens Above Ahmedabad", "NASA Spot the Station Ahmedabad",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog/iss-visible-ahmedabad-2026" },
  openGraph: {
    title: "ISS Visible from Ahmedabad 2026 — Track the Space Station",
    description: "The ISS passes over Ahmedabad several times a week and is easily visible with the naked eye. Here's how to find it.",
    url: "https://orion-space-digest.vercel.app/blog/iss-visible-ahmedabad-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ISS Visible from Ahmedabad 2026 — How to Track the Space Station",
  "author": { "@type": "Organization", "name": "Invincible Project Orion" },
  "publisher": { "@type": "Organization", "name": "Invincible Project Orion", "url": "https://orion-space-digest.vercel.app" },
  "datePublished": "2026-06-01",
  "url": "https://orion-space-digest.vercel.app/blog/iss-visible-ahmedabad-2026",
};

export default function ISSPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-2xl mx-auto px-5 py-24 sm:py-32">
        <Link href="/blog" className="text-xs font-mono text-[rgb(var(--neon-cyan))] hover:underline">← Blog</Link>

        <div className="mt-6 mb-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.08)]">ISS</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-4 leading-tight">
            ISS Visible from Ahmedabad — How to Track the Space Station (2026)
          </h1>
          <p className="text-ink-dim text-sm font-mono mt-3">June 1, 2026 · Invincible Project Orion</p>
        </div>

        <div className="space-y-8 text-ink-muted leading-relaxed">
          <p className="text-lg">
            The <strong className="text-ink">International Space Station</strong> is the brightest object in the night sky
            after the moon and Venus — and it passes directly over Ahmedabad several times a week.
            You do not need a telescope. Here is everything you need to know to spot it.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">What Does the ISS Look Like?</h2>
            <p>
              The ISS appears as a <strong className="text-ink">very bright, steady white dot</strong> moving steadily
              across the sky — much faster than a plane, with no blinking lights. At its brightest, it reaches
              magnitude <strong className="text-ink">–3.8</strong> (brighter than any star, comparable to Venus).
              A typical pass lasts 2–6 minutes from horizon to horizon.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "No blinking — planes blink, the ISS does not",
                "Moves west to east or northwest to southeast depending on the orbit",
                "Fades and disappears as it enters Earth's shadow mid-pass",
                "Visible only at dawn and dusk when the ISS is sunlit but your sky is dark",
              ].map(f => (
                <li key={f} className="flex gap-2">
                  <span className="text-[rgb(var(--neon-cyan))] shrink-0">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">When is the ISS Visible from Ahmedabad?</h2>
            <p>
              The ISS is visible from Ahmedabad (23.03°N, 72.58°E) on average <strong className="text-ink">10–15 times per two-week window</strong>.
              Visibility comes in clusters — you may get 5–6 passes in a week, then nothing for 4–5 days as the orbit geometry shifts.
              The best passes are those with a high maximum elevation (above 40°) and long duration.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
              <p className="text-sm font-semibold text-ink mb-2">ISS Coordinates for Ahmedabad (use in tracking apps)</p>
              <div className="font-mono text-sm space-y-1">
                <div>Latitude: <span className="text-[rgb(var(--neon-cyan))]">23.0225° N</span></div>
                <div>Longitude: <span className="text-[rgb(var(--neon-cyan))]">72.5714° E</span></div>
                <div>Elevation: <span className="text-[rgb(var(--neon-cyan))]">53 m</span></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Best Apps & Websites to Track ISS Passes</h2>
            <div className="space-y-3">
              {[
                { name: "NASA Spot the Station", url: "spotthestation.nasa.gov", desc: "Official NASA tool. Enter Ahmedabad to get email/SMS alerts before each visible pass. Free." },
                { name: "Heavens-Above.com", url: "heavens-above.com", desc: "Most detailed pass predictions. Shows exact sky path, magnitude, and direction. Set location to Ahmedabad (23.03N 72.57E)." },
                { name: "ISS Detector (Android/iOS)", url: "App Store / Play Store", desc: "App with notifications 10 minutes before each visible pass over your location." },
                { name: "Orion Space Digest", url: "orion-space-digest.vercel.app", desc: "Our homepage shows real-time ISS crew count and live crew data, updated every 6 hours." },
              ].map(tool => (
                <div key={tool.name} className="p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                  <div className="font-semibold text-ink text-sm">{tool.name}</div>
                  <div className="text-xs text-[rgb(var(--neon-cyan))] font-mono mt-0.5">{tool.url}</div>
                  <div className="text-sm text-ink-muted mt-1">{tool.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Step-by-Step: Spotting the ISS from Ahmedabad</h2>
            <ol className="space-y-3 text-sm">
              {[
                "Check spotthestation.nasa.gov or Heavens-Above for the next visible pass over Ahmedabad.",
                "Note the direction (azimuth) where the ISS will appear — NW, W, SW, etc.",
                "Go outside 2–3 minutes before the predicted time. Find an open area with a clear view of the sky.",
                "Face the direction where the ISS will appear. Watch for a moving bright dot.",
                "The pass lasts 2–6 minutes. Track it across the sky until it fades (enters Earth's shadow) or drops below the horizon.",
                "For photography: use a DSLR on a tripod, ISO 800–3200, aperture f/2.8–4, shutter 15–20 seconds. You will capture a bright streak across the stars.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[rgba(var(--neon-cyan),0.1)] text-[rgb(var(--neon-cyan))] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Who is on the ISS Right Now?</h2>
            <p>
              The ISS typically carries 7 crew members from NASA, Roscosmos, ESA, JAXA, and CSA.
              Check the <Link href="/" className="text-[rgb(var(--neon-cyan))] hover:underline">Orion Space Digest homepage</Link> for
              the current crew count and names — updated live every 6 hours from our space data feed.
            </p>
          </section>

        </div>
      </article>
      <Footer />
    </main>
  );
}
