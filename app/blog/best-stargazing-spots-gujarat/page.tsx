import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "10 Best Stargazing Spots Near Ahmedabad & Gujarat for Dark Skies",
  description:
    "Best dark sky stargazing locations near Ahmedabad and across Gujarat. From Polo Forest to Rann of Kutch — distance, directions, and tips by Invincible Project Orion.",
  keywords: [
    "best stargazing spots Gujarat", "dark sky sites near Ahmedabad", "stargazing Ahmedabad",
    "astronomy locations Gujarat", "dark sky Gujarat", "telescope observation Gujarat",
    "Rann of Kutch stargazing", "Polo Forest stargazing", "Nalsarovar stargazing",
    "astrophotography Gujarat", "Milky Way Gujarat", "night sky photography Ahmedabad",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/blog/best-stargazing-spots-gujarat" },
  openGraph: {
    title: "10 Best Stargazing Spots Near Ahmedabad & Gujarat",
    description: "Dark sky locations within driving distance of Ahmedabad — complete guide by Invincible Project Orion.",
    url: "https://orion-space-digest.vercel.app/blog/best-stargazing-spots-gujarat",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "10 Best Stargazing Spots Near Ahmedabad & Gujarat for Dark Skies",
  "author": { "@type": "Organization", "name": "Invincible Project Orion" },
  "publisher": { "@type": "Organization", "name": "Invincible Project Orion", "url": "https://orion-space-digest.vercel.app" },
  "datePublished": "2026-06-15",
  "url": "https://orion-space-digest.vercel.app/blog/best-stargazing-spots-gujarat",
};

const SPOTS = [
  { rank: 1, name: "Rann of Kutch (White Desert)", dist: "330 km from Ahmedabad", darkness: "Excellent", rating: 5, desc: "The vast salt desert of Kutch offers some of India's darkest skies. With zero vertical obstructions and almost no artificial light, the Milky Way is clearly visible overhead. Best visited October–February during Rann Utsav season when accommodation is available nearby." },
  { rank: 2, name: "Polo Forest, Sabarkantha", dist: "150 km NE of Ahmedabad", darkness: "Very Good", rating: 5, desc: "A forested archaeological site with a dark sky overhead and basic forest accommodation. The ruins of medieval temples make for a unique foreground in astrophotography. Avoid weekends — crowds increase light pollution from parked vehicles." },
  { rank: 3, name: "Nalsarovar Bird Sanctuary", dist: "60 km SW of Ahmedabad", darkness: "Good", rating: 4, desc: "One of the closest proper dark sky sites to Ahmedabad. The flat terrain gives an unobstructed 360° horizon — ideal for watching meteor showers from horizon to zenith. The lake also creates beautiful reflections of star fields." },
  { rank: 4, name: "Aarav Farm / Rural areas near Viramgam", dist: "55 km W of Ahmedabad", darkness: "Moderate–Good", rating: 3, desc: "Several private farms around Viramgam offer stargazing stays. The Milky Way core is visible on new moon nights. Best for beginners who want comfort with dark skies." },
  { rank: 5, name: "Girnar Hills foothills, Junagadh", dist: "320 km from Ahmedabad", darkness: "Very Good", rating: 4, desc: "Away from city lights with hills providing a dramatic backdrop. The region's religious significance means few commercial developments, keeping the skies relatively dark. Jupiter and Saturn are spectacular through a telescope from here." },
  { rank: 6, name: "Velavadar Blackbuck Reserve", dist: "135 km S of Ahmedabad", darkness: "Good", rating: 4, desc: "A national park with minimal artificial light. The flat grasslands give an open sky view and the absence of trees makes finding constellations easy. Combined with wildlife watching, this makes for a full night out." },
  { rank: 7, name: "Shoolpaneshwar Sanctuary, Narmada", dist: "185 km SE of Ahmedabad", darkness: "Very Good", rating: 4, desc: "Dense forest reserve bordering Madhya Pradesh. Very dark skies with forest sounds adding to the experience. Requires a nature permit — plan in advance." },
  { rank: 8, name: "Outskirts of Gandhinagar (Indroda)", dist: "25 km from Ahmedabad", darkness: "Moderate", rating: 3, desc: "The easiest quick escape from Ahmedabad city lights. Indroda Nature Park's outskirts offer enough darkness to see 3rd magnitude stars and bright planets clearly. Good for a weeknight moon and planet observing session." },
  { rank: 9, name: "Dasada, Little Rann of Kutch", dist: "130 km NW of Ahmedabad", darkness: "Good", rating: 4, desc: "Gateway to the Wild Ass Sanctuary — the flat salt marsh gives open skies in all directions. Several eco-resorts here cater to stargazers. The horizon is completely flat — perfect for watching planets rise and set." },
  { rank: 10, name: "Champaner-Pavagadh, Panchmahal", dist: "145 km SE of Ahmedabad", darkness: "Good", rating: 4, desc: "A UNESCO heritage site with hilltop fortifications providing an elevated dark sky position. The hill rises 830m above sea level, reducing atmospheric haze and giving cleaner views of stars near the horizon." },
];

export default function StargazingSpotsPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-2xl mx-auto px-5 py-24 sm:py-32">
        <Link href="/blog" className="text-xs font-mono text-[rgb(var(--neon-cyan))] hover:underline">← Blog</Link>

        <div className="mt-6 mb-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full text-[rgb(var(--neon-violet))] bg-[rgba(var(--neon-violet),0.08)]">Guides</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-4 leading-tight">
            10 Best Stargazing Spots Near Ahmedabad & Gujarat for Dark Skies
          </h1>
          <p className="text-ink-dim text-sm font-mono mt-3">June 15, 2026 · Invincible Project Orion</p>
        </div>

        <div className="space-y-6 text-ink-muted leading-relaxed">
          <p className="text-lg">
            Ahmedabad is a beautiful city — but its light pollution drowns out all but the brightest stars.
            The good news: Gujarat has some spectacular dark sky sites within a few hours' drive.
            Here are the <strong className="text-ink">10 best stargazing locations in Gujarat</strong>, ranked by
            sky darkness and ease of access from Ahmedabad.
          </p>

          <div className="space-y-5 mt-8">
            {SPOTS.map(spot => (
              <div key={spot.rank} className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-[rgb(var(--neon-cyan))] opacity-40">#{spot.rank}</span>
                      <h2 className="font-display text-lg font-semibold text-ink">{spot.name}</h2>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-ink-dim font-mono">
                      <span>📍 {spot.dist}</span>
                      <span>🌑 {spot.darkness}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < spot.rating ? "text-[rgb(var(--neon-amber))]" : "text-ink-dim opacity-30"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-3 leading-relaxed">{spot.desc}</p>
              </div>
            ))}
          </div>

          <section className="p-5 rounded-2xl bg-[rgb(var(--bg-card))] border border-[rgb(var(--bg-border))] mt-8">
            <h2 className="font-display text-base font-semibold text-ink mb-2">Plan Your Trip with Orion Space Digest</h2>
            <p className="text-sm">
              Before heading out, check our <Link href="/" className="text-[rgb(var(--neon-cyan))] hover:underline">live homepage</Link> for
              tonight's sky quality score, moon phase, and Gujarat sky visibility. We update every 6 hours so you always
              know what to expect before you drive out.
            </p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
