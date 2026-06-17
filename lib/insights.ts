import type { Article, Category } from "./types";

// ── MOON PHASE ──────────────────────────────────────────────
// Computed from synodic month and a known new-moon reference.
const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC

function julianDay(d: Date): number {
  return d.getTime() / 86_400_000 + 2440587.5;
}

export type MoonPhase = {
  name: string;
  emoji: string;
  age: number; // days since new moon (0–29.53)
  illumination: number; // 0–100
  waxing: boolean;
};

export function computeMoonPhase(d: Date = new Date()): MoonPhase {
  let age = (julianDay(d) - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;

  const phases: { name: string; emoji: string; min: number; max: number }[] = [
    { name: "New Moon", emoji: "🌑", min: 0, max: 1.84 },
    { name: "Waxing Crescent", emoji: "🌒", min: 1.84, max: 5.53 },
    { name: "First Quarter", emoji: "🌓", min: 5.53, max: 9.22 },
    { name: "Waxing Gibbous", emoji: "🌔", min: 9.22, max: 12.91 },
    { name: "Full Moon", emoji: "🌕", min: 12.91, max: 16.61 },
    { name: "Waning Gibbous", emoji: "🌖", min: 16.61, max: 20.3 },
    { name: "Last Quarter", emoji: "🌗", min: 20.3, max: 23.99 },
    { name: "Waning Crescent", emoji: "🌘", min: 23.99, max: 27.69 }
  ];
  const phase =
    phases.find((p) => age >= p.min && age < p.max) ||
    phases[phases.length - 1];
  const illum = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) * 50;

  return {
    name: phase.name,
    emoji: phase.emoji,
    age: Math.round(age * 10) / 10,
    illumination: Math.round(illum),
    waxing: age < SYNODIC_MONTH / 2
  };
}

// ── OBSERVATION QUALITY ─────────────────────────────────────
export function computeObservationQuality(
  moon: MoonPhase,
  hasLocalSky: boolean
): { score: number; reason: string } {
  let q = 6;
  let reason = "Average sky conditions";
  if (moon.illumination > 85) {
    q = 3;
    reason = "Bright Moon — faint objects washed out";
  } else if (moon.illumination > 60) {
    q = 5;
    reason = "Moonlight will dim deep-sky objects";
  } else if (moon.illumination < 20) {
    q = 9;
    reason = "Dark sky — excellent for faint objects";
  } else {
    q = 7;
    reason = "Decent contrast for most targets";
  }
  if (hasLocalSky) q = Math.min(10, q + 1);
  return { score: q, reason };
}

// ── VISIBLE PLANETS (parsed from LocalSky AI summary) ────────
const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune"
];

export function extractVisiblePlanets(
  text: string
): { name: string; altitude: number }[] {
  const result: { name: string; altitude: number }[] = [];
  for (const p of PLANETS) {
    const re = new RegExp(
      `${p}\\s+(?:at\\s+)?(\\d+)\\s*(?:deg|degrees|°)`,
      "i"
    );
    const m = text.match(re);
    if (m) result.push({ name: p, altitude: parseInt(m[1], 10) });
  }
  return result.sort((a, b) => b.altitude - a.altitude);
}

export function extractViewingTime(text: string): string | null {
  const m = text.match(/(\d{1,2})(?::\d{2})?\s*(?:PM|AM)?\s+IST/i);
  return m ? m[0].replace(/\s+/g, " ") : null;
}

// ── READING TIME ─────────────────────────────────────────────
export function readingTime(text: string): number {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ── EXCITEMENT SCORE PER STORY ───────────────────────────────
export function storyExcitement(a: Article): number {
  let s = 5;
  if (a.category === "Launch") s += 2;
  else if (a.category === "Asteroid") s += 1.5;
  else if (a.category === "APOD") s += 1;
  else if (a.category === "ISS") s += 0.8;
  else if (a.category === "LocalSky") s += 0.6;

  if (a.imageUrl) s += 0.6;

  const t = Date.parse(a.timestamp || a.publishedAt);
  if (t) {
    const hrs = (Date.now() - t) / 3_600_000;
    if (hrs < 12) s += 1;
    else if (hrs < 24) s += 0.5;
  }

  // Hot keywords boost
  const lower = (a.title + " " + a.aiSummary).toLowerCase();
  if (/exclusive|breakthrough|historic|first|discovery/.test(lower)) s += 0.5;
  if (/explosion|failure|crash|disaster/.test(lower)) s += 0.7;

  return Math.min(10, Math.max(1, Math.round(s * 10) / 10));
}

// ── SPACE PULSE ──────────────────────────────────────────────
export type SpacePulse = {
  score: number;
  contributors: { icon: string; label: string }[];
  storyCount: number;
  windowHours: number;
};

const CONTRIB_MAP: Partial<Record<Category, { icon: string; label: string; weight: number }>> = {
  Launch: { icon: "🚀", label: "Active launches", weight: 1.2 },
  Asteroid: { icon: "☄️", label: "Asteroid flybys", weight: 0.9 },
  APOD: { icon: "🔭", label: "New APOD released", weight: 0.7 },
  ISS: { icon: "🛰️", label: "ISS updates", weight: 0.6 },
  LocalSky: { icon: "🌙", label: "Visible sky events", weight: 0.5 },
  General: { icon: "📡", label: "Space news", weight: 0.25 }
};

export function computeSpacePulse(articles: Article[]): SpacePulse {
  const now = Date.now();
  const windowHours = 36;
  const recent = articles.filter((a) => {
    const t = Date.parse(a.timestamp || a.publishedAt);
    return t && now - t < windowHours * 3_600_000;
  });

  const counts = new Map<Category, number>();
  for (const a of recent) counts.set(a.category, (counts.get(a.category) || 0) + 1);

  let score = 2;
  for (const [cat, n] of counts) {
    const c = CONTRIB_MAP[cat];
    if (c) score += c.weight * n;
  }
  score = Math.max(0, Math.min(10, score));

  const contributors: { icon: string; label: string }[] = [];
  // sort by contribution strength
  const byImpact = [...counts.entries()]
    .map(([cat, n]) => ({ cat, impact: (CONTRIB_MAP[cat]?.weight || 0) * n }))
    .sort((a, b) => b.impact - a.impact);
  for (const { cat } of byImpact) {
    const c = CONTRIB_MAP[cat];
    if (c) contributors.push({ icon: c.icon, label: c.label });
    if (contributors.length >= 4) break;
  }
  if (contributors.length === 0) {
    contributors.push({ icon: "🌌", label: "Quiet cosmos — no major events" });
  }

  return {
    score: Math.round(score * 10) / 10,
    contributors,
    storyCount: recent.length,
    windowHours
  };
}

// ── TRENDING TOPICS ──────────────────────────────────────────
const KNOWN_TERMS = [
  "NASA",
  "SpaceX",
  "Blue Origin",
  "ULA",
  "ESA",
  "JAXA",
  "Roscosmos",
  "ISRO",
  "ISS",
  "Webb",
  "Hubble",
  "Mars",
  "Moon",
  "Jupiter",
  "Saturn",
  "Venus",
  "Mercury",
  "Uranus",
  "Neptune",
  "Pluto",
  "Starship",
  "Falcon",
  "Crew Dragon",
  "Atlas",
  "Vulcan",
  "New Glenn",
  "Soyuz",
  "Artemis",
  "Apollo",
  "Voyager",
  "Cassini",
  "Roman",
  "Tiangong",
  "Shenzhou",
  "China",
  "India",
  "Gujarat",
  "asteroid",
  "comet",
  "eclipse",
  "supernova",
  "galaxy",
  "nebula",
  "pulsar",
  "quasar",
  "meteor",
  "exoplanet",
  "telescope"
];

export type TrendingTopic = {
  topic: string;
  count: number;
  category: Category | null;
};

export function trendingTopics(articles: Article[], n = 5): TrendingTopic[] {
  const counts = new Map<string, { count: number; category: Category | null }>();
  for (const a of articles) {
    const text = (a.title + " " + a.aiSummary + " " + a.tweet).toLowerCase();
    for (const term of KNOWN_TERMS) {
      const re = new RegExp(`\\b${term.toLowerCase()}\\b`, "g");
      const matches = text.match(re);
      if (matches) {
        const key = term;
        const cur = counts.get(key) || { count: 0, category: a.category };
        counts.set(key, { count: cur.count + matches.length, category: cur.category });
      }
    }
  }
  return [...counts.entries()]
    .filter(([, v]) => v.count > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, n)
    .map(([topic, v]) => ({ topic, count: v.count, category: v.category }));
}

// ── ASTEROID PARSER ──────────────────────────────────────────
export type AsteroidInsight = {
  name: string;
  sizeMeters: number | null;
  lunarDistance: number | null;
  approachDate: string | null;
  hazardous: boolean;
  riskLevel: "Low" | "Moderate" | "High";
  rawArticle: Article;
};

export function parseAsteroid(a: Article): AsteroidInsight {
  const text = a.title + " " + a.aiSummary;

  // Name: "Asteroid (2014 KG39)" or "Asteroid 2014 KG39"
  let name = "Unnamed";
  const nm =
    text.match(/Asteroid\s+\(([^)]+)\)/i) || text.match(/Asteroid\s+([A-Z0-9\-]+(?:\s+[A-Z0-9]+)?)/);
  if (nm) name = nm[1].trim();

  // Size: "~43 meters" or "approximately 43 meters" or "43m"
  let sizeMeters: number | null = null;
  const sm = text.match(/(?:~|approximately\s+)?(\d+)\s*(?:meters|m\b)/i);
  if (sm) sizeMeters = parseInt(sm[1], 10);

  // Lunar distance
  let lunarDistance: number | null = null;
  const lm = text.match(/(\d+(?:\.\d+)?)\s*lunar/i);
  if (lm) lunarDistance = parseFloat(lm[1]);

  // Approach date: ISO or "May 28, 2026" or "on YYYY-MM-DD"
  let approachDate: string | null = null;
  const dm =
    text.match(/(\d{4}-\d{2}-\d{2})/) ||
    text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i);
  if (dm) approachDate = dm[0];

  const hazardous = /hazardous|potentially\s+hazardous/i.test(text);

  let riskLevel: "Low" | "Moderate" | "High" = "Low";
  if (hazardous) riskLevel = "High";
  else if (lunarDistance !== null && lunarDistance < 5) riskLevel = "Moderate";

  return {
    name,
    sizeMeters,
    lunarDistance,
    approachDate,
    hazardous,
    riskLevel,
    rawArticle: a
  };
}

// ── SHARED ───────────────────────────────────────────────────
export function relativeTime(iso: string): string {
  const t = Date.parse(iso);
  if (!t) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(t).toLocaleDateString();
}
