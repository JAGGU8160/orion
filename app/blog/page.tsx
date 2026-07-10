import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Astronomy Blog — Gujarat Sky Guides & Space Events",
  description:
    "Stargazing guides, moon phase calendars, meteor shower alerts, and astronomy events for Ahmedabad and Gujarat. Written by Invincible Project Orion.",
  keywords: [
    "astronomy blog Gujarat", "stargazing guide Ahmedabad", "meteor shower India 2026",
    "moon phase calendar Gujarat", "astronomy events Ahmedabad 2026",
    "ISS pass Ahmedabad", "planet viewing Gujarat", "eclipse India 2026",
    "best telescope for beginners India", "dark sky sites Gujarat",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog" },
  openGraph: {
    title: "Astronomy Blog — Gujarat Sky Guides & Space Events | Orion",
    description: "Stargazing guides, meteor shower alerts, and astronomy events for Ahmedabad and Gujarat.",
    url: "https://orion-space-digest.vercel.app/blog",
  },
};

const ARTICLES = [
  {
    slug: "meteor-shower-perseid-2026-gujarat",
    title: "Perseid Meteor Shower 2026 — How to Watch from Ahmedabad & Gujarat",
    date: "2026-07-01",
    category: "Sky Events",
    excerpt: "The Perseid meteor shower peaks in August 2026. Here is everything you need to know to watch up to 100 meteors per hour from Gujarat — best viewing times, locations, and tips.",
  },
  {
    slug: "best-stargazing-spots-gujarat",
    title: "10 Best Stargazing Spots Near Ahmedabad for Dark Skies",
    date: "2026-06-15",
    category: "Guides",
    excerpt: "City lights wash out the Milky Way, but within 60 km of Ahmedabad there are several dark-sky sites perfect for telescope observation and naked-eye stargazing.",
  },
  {
    slug: "moon-phases-july-2026-gujarat",
    title: "Moon Phase Calendar for Gujarat — July 2026",
    date: "2026-07-01",
    category: "Moon",
    excerpt: "Full moon, new moon, and quarter moon dates and times for July 2026 in Indian Standard Time (IST) — with best nights for stargazing in Ahmedabad.",
  },
  {
    slug: "iss-visible-ahmedabad-2026",
    title: "When is the ISS Visible from Ahmedabad? — Pass Times 2026",
    date: "2026-06-01",
    category: "ISS",
    excerpt: "The International Space Station passes over Ahmedabad several times a week and is easily visible with the naked eye. Here is how to find the next pass over Gujarat.",
  },
  {
    slug: "jupiter-saturn-visible-gujarat-2026",
    title: "Jupiter & Saturn Visible from Gujarat — Best Viewing Dates 2026",
    date: "2026-05-15",
    category: "Planets",
    excerpt: "Both Jupiter and Saturn are well-placed for observation from Ahmedabad in 2026. This guide covers opposition dates, best viewing times, and what to look for through a telescope.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Sky Events": "text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.08)]",
  "Guides":     "text-[rgb(var(--neon-violet))] bg-[rgba(var(--neon-violet),0.08)]",
  "Moon":       "text-[rgb(var(--neon-amber))] bg-[rgba(var(--neon-amber),0.08)]",
  "ISS":        "text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.08)]",
  "Planets":    "text-[rgb(var(--neon-violet))] bg-[rgba(var(--neon-violet),0.08)]",
};

export default function BlogPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 py-24 sm:py-32">
        <div className="mb-12">
          <span className="text-xs font-mono tracking-widest text-[rgb(var(--neon-cyan))] uppercase">Articles</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mt-3 leading-tight">
            Astronomy Blog
          </h1>
          <p className="text-ink-muted mt-4 text-lg">
            Sky guides, meteor shower alerts, and stargazing tips for Gujarat & Ahmedabad — by Invincible Project Orion.
          </p>
        </div>

        <div className="space-y-5">
          {ARTICLES.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))] hover:border-[rgb(var(--neon-cyan))] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] ?? ""}`}>
                  {article.category}
                </span>
                <span className="text-xs text-ink-dim font-mono">
                  {new Date(article.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="font-display text-lg font-semibold text-ink group-hover:text-[rgb(var(--neon-cyan))] transition-colors leading-snug">
                {article.title}
              </h2>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
