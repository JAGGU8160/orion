import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About — Invincible Project Orion",
  description:
    "Invincible Project Orion is an astronomy outreach NGO based in Ahmedabad, Gujarat. We bring space science to students and communities through stargazing events, moon gazing camps, and live space news.",
  keywords: [
    "Invincible Project Orion", "astronomy NGO Ahmedabad", "space education Gujarat",
    "stargazing events Ahmedabad", "moon gazing Gujarat", "astronomy club Gujarat",
    "Project Orion astronomy India", "science outreach Ahmedabad",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/about" },
  openGraph: {
    title: "About Invincible Project Orion — Astronomy NGO, Ahmedabad Gujarat",
    description: "Making space science accessible to every student in Gujarat through stargazing, moon gazing events, and live astronomy news.",
    url: "https://orion-space-digest.vercel.app/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Invincible Project Orion",
  "url": "https://orion-space-digest.vercel.app/about",
  "description": "Astronomy outreach NGO based in Ahmedabad, Gujarat making space science accessible.",
  "mainEntity": {
    "@type": "NGO",
    "name": "Invincible Project Orion",
    "url": "https://orion-space-digest.vercel.app",
    "description": "Astronomy outreach NGO based in Ahmedabad, Gujarat, India.",
    "foundingLocation": { "@type": "Place", "name": "Ahmedabad, Gujarat, India" },
    "areaServed": ["Ahmedabad", "Gujarat", "India"],
    "knowsAbout": ["Astronomy", "Stargazing", "Moon Phases", "Space Science", "Telescope Observation"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-5 py-24 sm:py-32">

        <div className="mb-12">
          <span className="text-xs font-mono tracking-widest text-[rgb(var(--neon-cyan))] uppercase">About</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mt-3 leading-tight">
            Invincible Project Orion
          </h1>
          <p className="text-ink-muted mt-4 text-lg leading-relaxed">
            Astronomy outreach NGO based in Ahmedabad, Gujarat — making space science accessible to every student and community.
          </p>
        </div>

        <div className="space-y-10 text-ink-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Our Mission</h2>
            <p>
              Invincible Project Orion was founded with one goal: to bring the wonder of the universe to the people of Gujarat.
              From the streets of Ahmedabad to villages across the state, we organise stargazing sessions, moon gazing camps,
              and telescope observation events so that every person — student, teacher, or curious citizen — can look up
              and understand what they see.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">What We Do</h2>
            <ul className="space-y-3 list-none">
              {[
                { icon: "🌙", title: "Moon Gazing Events", desc: "Monthly public events around full moon and lunar eclipses in Ahmedabad and nearby cities." },
                { icon: "🔭", title: "Telescope Sessions", desc: "Hands-on stargazing with telescopes for schools, colleges, and community groups across Gujarat." },
                { icon: "🛸", title: "Live Space Digest", desc: "This website — updated every 6 hours with NASA news, asteroid alerts, ISS crew, and tonight's Gujarat sky." },
                { icon: "🎓", title: "School Outreach", desc: "Astronomy workshops in government and private schools across Ahmedabad, Surat, Rajkot, and Vadodara." },
              ].map(item => (
                <li key={item.title} className="flex gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-ink">{item.title}</div>
                    <div className="text-sm mt-0.5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">Why Gujarat?</h2>
            <p>
              Gujarat sits at latitude 22°N — a sweet spot for observing both northern and southern sky objects.
              Ahmedabad's urban growth has reduced dark skies in the city, but within 50 km you can find excellent
              viewing conditions. We partner with local farms, resorts, and open grounds to bring people to dark skies
              and bring dark skies to people through education.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">About This Website</h2>
            <p>
              Orion Space Digest is our live astronomy news platform, updated automatically every 6 hours by our AI agent.
              It fetches data from NASA, SpaceNews, asteroid tracking systems, and real-time Gujarat sky visibility data —
              then curates the most relevant stories for our audience in Gujarat and Ahmedabad.
            </p>
            <p className="mt-3">
              All sky data is calculated for coordinates <strong className="text-ink">22°N 71°E (Gujarat)</strong> —
              so when we say "visible tonight," we mean visible from your rooftop in Gujarat.
            </p>
          </section>

          <section className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
            <h2 className="font-display text-lg font-semibold text-ink mb-2">Get Involved</h2>
            <p className="text-sm">
              Join our Telegram channel for daily space digests, event announcements, and sky alerts for Gujarat.
              Events are free and open to all — no telescope or prior knowledge needed.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
