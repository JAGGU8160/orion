import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Moon Phase Calendar Gujarat — July 2026 Dates & Times (IST)",
  description:
    "Full moon, new moon, and quarter moon dates and exact times for July 2026 in Indian Standard Time (IST) for Ahmedabad and Gujarat. Best nights for stargazing by Invincible Project Orion.",
  keywords: [
    "moon phase July 2026 Gujarat", "full moon July 2026 India", "new moon July 2026 Ahmedabad",
    "moon calendar July 2026 IST", "Purnima July 2026", "Amavasya July 2026",
    "moon rise time Ahmedabad July 2026", "stargazing July 2026 Gujarat",
    "best nights stargazing July Gujarat", "moon phase calendar India 2026",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog/moon-phases-july-2026-gujarat" },
  openGraph: {
    title: "Moon Phase Calendar July 2026 — Gujarat & Ahmedabad (IST)",
    description: "Full moon (Purnima), new moon (Amavasya), and quarter moon times for July 2026 in IST — with best stargazing nights for Gujarat.",
    url: "https://orion-space-digest.vercel.app/blog/moon-phases-july-2026-gujarat",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Moon Phase Calendar Gujarat — July 2026 Dates & Times (IST)",
  "author": { "@type": "Organization", "name": "Invincible Project Orion" },
  "publisher": { "@type": "Organization", "name": "Invincible Project Orion", "url": "https://orion-space-digest.vercel.app" },
  "datePublished": "2026-07-01",
  "url": "https://orion-space-digest.vercel.app/blog/moon-phases-july-2026-gujarat",
};

const PHASES = [
  { date: "July 2, 2026", phase: "Last Quarter", emoji: "🌗", time: "3:41 AM IST", darkness: "Moderate", stargazing: "Good — moon rises after midnight" },
  { date: "July 10, 2026", phase: "New Moon (Amavasya)", emoji: "🌑", time: "2:15 PM IST", darkness: "Darkest", stargazing: "Excellent — no moonlight all night" },
  { date: "July 17, 2026", phase: "First Quarter", emoji: "🌓", time: "11:26 PM IST", darkness: "Good", stargazing: "Good — moon sets by midnight" },
  { date: "July 25, 2026", phase: "Full Moon (Purnima / Guru Purnima)", emoji: "🌕", time: "12:42 PM IST", darkness: "Bright", stargazing: "Poor for deep-sky, great for moon gazing" },
];

const BEST_NIGHTS = [
  { dates: "July 7–13", quality: "Excellent", reason: "Dark sky window around new moon — Milky Way visible from dark sites" },
  { dates: "July 14–17", quality: "Good", reason: "Crescent moon sets early — good window after 11 PM" },
  { dates: "July 1–4", quality: "Moderate", reason: "Last quarter moon — decent after 1 AM" },
  { dates: "July 22–31", quality: "Poor", reason: "Bright full moon washes out faint objects" },
];

export default function MoonPhasesPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-2xl mx-auto px-5 py-24 sm:py-32">
        <Link href="/blog" className="text-xs font-mono text-[rgb(var(--neon-cyan))] hover:underline">← Blog</Link>

        <div className="mt-6 mb-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-[rgb(var(--neon-amber))] bg-[rgba(var(--neon-amber),0.08)]">Moon</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-4 leading-tight">
            Moon Phase Calendar — July 2026 Gujarat & Ahmedabad (IST)
          </h1>
          <p className="text-ink-dim text-sm font-mono mt-3">July 1, 2026 · Invincible Project Orion</p>
        </div>

        <div className="space-y-8 text-ink-muted leading-relaxed">
          <p className="text-lg">
            Planning a stargazing night in Ahmedabad or Gujarat this July? The moon's phase is the single
            biggest factor in sky darkness. Here are all four major moon phases for July 2026
            in <strong className="text-ink">Indian Standard Time (IST)</strong>, plus the best nights to observe from Gujarat.
          </p>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">July 2026 Moon Phases (IST)</h2>
            <div className="space-y-3">
              {PHASES.map(p => (
                <div key={p.date} className="flex gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                  <span className="text-3xl shrink-0">{p.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{p.phase}</span>
                      <span className="text-xs font-mono text-ink-dim">{p.date} · {p.time}</span>
                    </div>
                    <div className="text-sm mt-1">Sky darkness: <span className="text-[rgb(var(--neon-cyan))]">{p.darkness}</span></div>
                    <div className="text-xs mt-0.5 text-ink-dim">{p.stargazing}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Best Stargazing Nights in July 2026</h2>
            <div className="rounded-xl overflow-hidden border border-[rgb(var(--bg-border))]">
              <table className="w-full text-sm">
                <thead className="bg-[rgb(var(--bg-card))]">
                  <tr>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Dates</th>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Quality</th>
                    <th className="text-left px-4 py-3 text-ink font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--bg-border))]">
                  {BEST_NIGHTS.map(n => (
                    <tr key={n.dates} className="bg-[rgba(var(--bg-card),0.5)]">
                      <td className="px-4 py-3 text-ink font-mono text-xs">{n.dates}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          n.quality === "Excellent" ? "text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.1)]" :
                          n.quality === "Good" ? "text-[rgb(var(--neon-amber))] bg-[rgba(var(--neon-amber),0.1)]" :
                          "text-ink-dim bg-[rgb(var(--bg-card))]"
                        }`}>{n.quality}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-muted">{n.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Guru Purnima 2026 — July 25</h2>
            <p>
              The July full moon coincides with <strong className="text-ink">Guru Purnima</strong> this year.
              While the bright moon makes it a poor night for deep-sky observation, it is ideal for naked-eye
              moon gazing and lunar photography. The full moon rises at approximately
              <strong className="text-ink"> 6:48 PM IST from Ahmedabad</strong> — almost exactly at sunset,
              creating a dramatic "moonrise" on the eastern horizon.
            </p>
            <p className="mt-3">
              Invincible Project Orion typically organises a public moon gazing event on Guru Purnima.
              Join our Telegram for event details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Moon Rise & Set Times — Ahmedabad, July 2026</h2>
            <p className="text-sm">
              Approximate moon rise times for Ahmedabad (23.03°N, 72.58°E):
            </p>
            <ul className="mt-3 space-y-1 text-sm font-mono">
              {[
                ["July 10 (New Moon)", "Rises with sun — not visible"],
                ["July 13", "Rises ~7:30 PM, sets ~10:15 PM"],
                ["July 17 (First Quarter)", "Rises ~12:00 PM, sets ~12:30 AM"],
                ["July 25 (Full Moon)", "Rises ~6:48 PM, sets ~6:52 AM"],
              ].map(([date, time]) => (
                <li key={date} className="flex gap-3">
                  <span className="text-[rgb(var(--neon-amber))] shrink-0">🌙</span>
                  <span><strong className="text-ink">{date}</strong> — {time}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
            <p className="text-sm">
              <strong className="text-ink">Live moon phase:</strong> Check the <Link href="/" className="text-[rgb(var(--neon-cyan))] hover:underline">Orion Space Digest homepage</Link> for
              tonight's real-time moon phase, illumination percentage, and sky quality score for Gujarat — updated every 6 hours.
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
