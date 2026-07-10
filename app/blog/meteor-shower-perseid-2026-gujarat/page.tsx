import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Perseid Meteor Shower 2026 — Watch from Ahmedabad & Gujarat",
  description:
    "Perseid meteor shower 2026 peaks on August 11–13. Watch up to 100 meteors per hour from Ahmedabad and Gujarat. Best viewing times in IST, dark sky locations, and tips by Invincible Project Orion.",
  keywords: [
    "Perseid meteor shower 2026 Gujarat", "meteor shower Ahmedabad August 2026",
    "Perseid 2026 India", "meteor shower tonight Gujarat", "shooting stars Ahmedabad",
    "August meteor shower India 2026", "Perseid peak time IST 2026",
    "stargazing meteor shower Gujarat", "Invincible Project Orion meteor",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog/meteor-shower-perseid-2026-gujarat" },
  openGraph: {
    title: "Perseid Meteor Shower 2026 — How to Watch from Ahmedabad & Gujarat",
    description: "Up to 100 meteors per hour on August 11–13. Best viewing times, locations, and tips for Gujarat.",
    url: "https://orion-space-digest.vercel.app/blog/meteor-shower-perseid-2026-gujarat",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Perseid Meteor Shower 2026 — How to Watch from Ahmedabad & Gujarat",
  "description": "Complete guide to watching the Perseid meteor shower from Gujarat in 2026.",
  "author": { "@type": "Organization", "name": "Invincible Project Orion" },
  "publisher": { "@type": "Organization", "name": "Invincible Project Orion", "url": "https://orion-space-digest.vercel.app" },
  "datePublished": "2026-07-01",
  "dateModified": "2026-07-01",
  "url": "https://orion-space-digest.vercel.app/blog/meteor-shower-perseid-2026-gujarat",
  "about": { "@type": "Event", "name": "Perseid Meteor Shower 2026", "startDate": "2026-08-11", "endDate": "2026-08-13", "location": { "@type": "Place", "name": "Gujarat, India" } },
};

export default function PerseidsPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-2xl mx-auto px-5 py-24 sm:py-32">
        <Link href="/blog" className="text-xs font-mono text-[rgb(var(--neon-cyan))] hover:underline">← Blog</Link>

        <div className="mt-6 mb-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.08)]">Sky Events</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-4 leading-tight">
            Perseid Meteor Shower 2026 — How to Watch from Ahmedabad & Gujarat
          </h1>
          <p className="text-ink-dim text-sm font-mono mt-3">July 1, 2026 · Invincible Project Orion</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-ink-muted leading-relaxed">

          <p className="text-lg text-ink-muted">
            Every August, Earth passes through the debris trail left by Comet Swift-Tuttle, producing one of the most
            reliable meteor showers of the year — the <strong className="text-ink">Perseids</strong>. In 2026, the
            shower peaks on the night of <strong className="text-ink">August 11–13</strong>, offering up to
            <strong className="text-ink"> 80–100 meteors per hour</strong> under dark skies.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Peak Dates & Times for Gujarat (IST)</h2>
            <div className="rounded-xl overflow-hidden border border-[rgb(var(--bg-border))]">
              <table className="w-full text-sm">
                <thead className="bg-[rgb(var(--bg-card))]">
                  <tr>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Date</th>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Best Viewing (IST)</th>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Expected Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--bg-border))]">
                  {[
                    ["August 11 night", "11:00 PM – 4:00 AM", "40–60 per hour"],
                    ["August 12 night", "11:00 PM – 4:00 AM", "80–100 per hour (peak)"],
                    ["August 13 night", "11:00 PM – 3:00 AM", "50–70 per hour"],
                  ].map(([date, time, rate]) => (
                    <tr key={date} className="bg-[rgba(var(--bg-card),0.5)]">
                      <td className="px-4 py-3 text-ink">{date}</td>
                      <td className="px-4 py-3">{time}</td>
                      <td className="px-4 py-3 text-[rgb(var(--neon-cyan))]">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3">
              The radiant point (Perseus constellation) rises in the northeast after 10:30 PM IST from Gujarat. Rates
              increase significantly after midnight when Perseus climbs higher in the sky.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Where to Look</h2>
            <p>
              No telescope needed — Perseids are best seen with the naked eye. Look toward the
              <strong className="text-ink"> northeast sky</strong>, roughly in the direction of the distinctive
              W-shape of Cassiopeia. The meteors appear to radiate from the Perseus constellation, but you will see
              them streak across the entire sky. Avoid staring directly at the radiant — meteors look longest when
              spotted away from it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Best Dark Sky Locations Near Ahmedabad</h2>
            <ul className="space-y-3">
              {[
                { place: "Nalsarovar Bird Sanctuary", dist: "60 km SW of Ahmedabad", note: "Flat horizon, minimal light pollution" },
                { place: "Indroda Nature Park outskirts, Gandhinagar", dist: "25 km from Ahmedabad", note: "Easy access, partial dark skies" },
                { place: "Rann of Kutch edge (Bhuj area)", dist: "250 km", note: "Some of India's darkest skies — worth the drive for a serious observer" },
                { place: "Polo Forest, Sabarkantha", dist: "150 km NE", note: "Forest area with excellent dark skies and camping" },
              ].map(loc => (
                <li key={loc.place} className="flex gap-3 p-3 rounded-lg bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                  <span className="text-xl">📍</span>
                  <div>
                    <div className="font-semibold text-ink text-sm">{loc.place}</div>
                    <div className="text-xs text-ink-dim mt-0.5">{loc.dist} · {loc.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Tips for Watching</h2>
            <ul className="space-y-2 text-sm">
              {[
                "Give your eyes 20 minutes to dark-adapt after turning off your phone screen.",
                "Bring a reclining chair or blanket — looking up for hours is uncomfortable standing.",
                "Check the moon phase: a bright moon washes out fainter meteors. In 2026 the moon sets before midnight on peak night.",
                "No telescope or binoculars — the naked eye takes in more sky area.",
                "Dress for the weather: August nights in Gujarat can be humid; mosquito repellent is essential.",
                "Use Orion Space Digest to check cloud cover and sky quality for your area before you go.",
              ].map(tip => (
                <li key={tip} className="flex gap-2">
                  <span className="text-[rgb(var(--neon-cyan))] shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))] mt-8">
            <h2 className="font-display text-base font-semibold text-ink mb-2">Join Our Perseid Event</h2>
            <p className="text-sm">
              Invincible Project Orion organises a public meteor watching event every Perseid season.
              Join our Telegram channel for event announcements, real-time sky updates, and Gujarat-specific
              meteor rate reports.
            </p>
          </section>

        </div>
      </article>
      <Footer />
    </main>
  );
}
