import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Jupiter & Saturn Visible from Gujarat 2026 — Viewing Guide",
  description:
    "Jupiter and Saturn are well-placed for observation from Ahmedabad and Gujarat in 2026. Opposition dates, best viewing times in IST, telescope tips, and what to see. By Invincible Project Orion.",
  keywords: [
    "Jupiter visible Gujarat 2026", "Saturn visible Ahmedabad 2026", "planet viewing Gujarat",
    "Jupiter opposition 2026 India", "Saturn opposition 2026 Gujarat",
    "see Jupiter telescope Ahmedabad", "Saturn rings visible India 2026",
    "planets tonight Gujarat", "Jupiter Saturn conjunction India",
    "astrophotography planets Gujarat", "bright planets tonight Ahmedabad",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog/jupiter-saturn-visible-gujarat-2026" },
  openGraph: {
    title: "Jupiter & Saturn Visible from Gujarat 2026 — Complete Viewing Guide",
    description: "Opposition dates, best viewing times, and telescope tips for Jupiter and Saturn from Ahmedabad and Gujarat in 2026.",
    url: "https://orion-space-digest.vercel.app/blog/jupiter-saturn-visible-gujarat-2026",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Jupiter & Saturn Visible from Gujarat 2026 — Complete Viewing Guide",
  "author": { "@type": "Organization", "name": "Invincible Project Orion" },
  "publisher": { "@type": "Organization", "name": "Invincible Project Orion", "url": "https://orion-space-digest.vercel.app" },
  "datePublished": "2026-05-15",
  "url": "https://orion-space-digest.vercel.app/blog/jupiter-saturn-visible-gujarat-2026",
};

export default function PlanetsPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-2xl mx-auto px-5 py-24 sm:py-32">
        <Link href="/blog" className="text-xs font-mono text-[rgb(var(--neon-cyan))] hover:underline">← Blog</Link>

        <div className="mt-6 mb-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-[rgb(var(--neon-violet))] bg-[rgba(var(--neon-violet),0.08)]">Planets</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-4 leading-tight">
            Jupiter & Saturn Visible from Gujarat in 2026 — Complete Viewing Guide
          </h1>
          <p className="text-ink-dim text-sm font-mono mt-3">May 15, 2026 · Invincible Project Orion</p>
        </div>

        <div className="space-y-8 text-ink-muted leading-relaxed">
          <p className="text-lg">
            2026 is an excellent year to observe the solar system's two gas giants from Gujarat.
            Both <strong className="text-ink">Jupiter</strong> and <strong className="text-ink">Saturn</strong> reach
            opposition (closest approach to Earth) in 2026, making them brighter and larger in a telescope
            than at any other time of year.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Jupiter in 2026</h2>
            <div className="p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))] mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Opposition Date", "January 10, 2026"],
                  ["Magnitude at Opposition", "–2.9 (extremely bright)"],
                  ["Angular Diameter", "46.9 arcseconds"],
                  ["Constellation", "Gemini"],
                  ["Rise Time (Gujarat, Jan)", "~5:30 PM IST"],
                  ["Best Viewing Window", "Nov 2025 – Mar 2026"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-xs text-ink-dim font-mono">{label}</div>
                    <div className="text-ink font-semibold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <p>
              Jupiter is the <strong className="text-ink">easiest planet to observe through a telescope</strong>.
              Even a 60mm refractor shows the four Galilean moons (Io, Europa, Ganymede, Callisto) as bright dots
              on either side of the planet, changing position night to night. A 4-inch telescope reveals the
              <strong className="text-ink"> North and South Equatorial Belts</strong> — the dark brown bands across
              Jupiter's disc — and the <strong className="text-ink">Great Red Spot</strong> (when facing Earth).
            </p>
            <p className="mt-3">
              From Ahmedabad in January 2026, Jupiter rises in the east at sunset and is well-placed for
              observation from <strong className="text-ink">8 PM to 2 AM IST</strong>. At opposition it reaches
              about 60° altitude above the southern horizon — excellent for Gujarat's latitude.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Saturn in 2026</h2>
            <div className="p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))] mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Opposition Date", "September 21, 2026"],
                  ["Magnitude at Opposition", "+0.4"],
                  ["Ring Tilt", "3.2° (nearly edge-on)"],
                  ["Constellation", "Aquarius"],
                  ["Rise Time (Gujarat, Sep)", "~6:15 PM IST"],
                  ["Best Viewing Window", "Jul – Nov 2026"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-xs text-ink-dim font-mono">{label}</div>
                    <div className="text-ink font-semibold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <p>
              Saturn's rings are nearly edge-on in 2026 — they appear as a thin line through the planet,
              which is a rare sight compared to when they are fully tilted. Despite this, Saturn remains
              spectacular: even small telescopes show the ring system, the planet's yellowish disc,
              and its largest moon <strong className="text-ink">Titan</strong> as an orange dot.
            </p>
            <p className="mt-3">
              From Ahmedabad in September 2026, Saturn rises before sunset and is ideally placed at
              <strong className="text-ink"> 35–40° altitude in the south</strong> by 9–10 PM IST — perfect for
              telescope viewing from Gujarat rooftops or dark sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">What Telescope Do I Need?</h2>
            <div className="space-y-3">
              {[
                { scope: "Naked eye", what: "Both planets easily visible as bright non-twinkling stars. Jupiter is the brightest object in the sky (after Moon and Venus)." },
                { scope: "Binoculars (7×50 or 10×50)", what: "Jupiter's Galilean moons visible. Saturn's oval shape (rings not resolved). Excellent starting point." },
                { scope: "60–80mm refractor", what: "Jupiter's cloud bands and 4 moons. Saturn's rings as a distinct oval. Titan visible." },
                { scope: "4–6 inch reflector/refractor", what: "Jupiter's Great Red Spot. Saturn's Cassini Division in rings. Multiple moons. Best all-round choice for Gujarat observers." },
                { scope: "8 inch+", what: "Incredible detail on both planets. Jupiter's festoons, ovals, and colour variations. Saturn's ring shadow on the planet disc." },
              ].map(item => (
                <div key={item.scope} className="flex gap-3 p-3 rounded-lg bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                  <span className="text-lg shrink-0">🔭</span>
                  <div>
                    <div className="font-semibold text-ink text-sm">{item.scope}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{item.what}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Observing from Ahmedabad</h2>
            <p>
              Ahmedabad's sky is affected by light pollution, but both Jupiter and Saturn are bright enough to
              observe from city rooftops. For the best views, head to dark sites — see our
              <Link href="/blog/best-stargazing-spots-gujarat" className="text-[rgb(var(--neon-cyan))] hover:underline"> guide to dark sky spots near Ahmedabad</Link>.
              At a dark site, you can see more cloud detail on Jupiter and the subtle colour difference between
              Saturn's rings and its disc.
            </p>
            <p className="mt-3">
              Invincible Project Orion regularly organises telescope viewing sessions for Jupiter and Saturn
              around opposition dates. Check our Telegram channel for event announcements in Ahmedabad and Gujarat.
            </p>
          </section>

          <div className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
            <p className="text-sm">
              <strong className="text-ink">Tonight's planets:</strong> The <Link href="/" className="text-[rgb(var(--neon-cyan))] hover:underline">Orion Space Digest homepage</Link> shows
              which planets are currently visible from Gujarat — updated every 6 hours with altitude and visibility data.
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
