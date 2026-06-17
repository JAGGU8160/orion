import type { Article, Category, DigestBuckets } from "./types";
import {
  computeMoonPhase,
  computeObservationQuality,
  computeSpacePulse,
  extractViewingTime,
  extractVisiblePlanets,
  parseAsteroid,
  readingTime,
  storyExcitement,
  trendingTopics
} from "./insights";

const SHEET_ID = "1hqV9_Y7k6ja3buGTMIpY9DV-D4dpPPe1jSfsxHFOIs4";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=0&headers=1`;

const VALID_CATEGORIES: Category[] = [
  "LocalSky",
  "Launch",
  "Asteroid",
  "APOD",
  "ISS",
  "General"
];

interface GvizCell {
  v: string | number | null;
}
interface GvizRow {
  c: (GvizCell | null)[];
}
interface GvizResponse {
  table: { cols: { id: string; label: string }[]; rows: GvizRow[] };
}

function cell(row: GvizRow, idx: number): string {
  const c = row.c[idx];
  if (!c || c.v === null || c.v === undefined) return "";
  return String(c.v).trim();
}

function normalizeCategory(raw: string): Category {
  const v = raw.trim();
  if (VALID_CATEGORIES.includes(v as Category)) return v as Category;
  return "General";
}

function inferIssCount(text: string): number {
  const m =
    text.match(/(\d+)\s+humans?\s+are\s+in\s+space/i) ||
    text.match(/ISS crew\s*\((\d+)\)/i) ||
    text.match(/crew\s+of\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

export async function fetchDigest(): Promise<DigestBuckets> {
  const res = await fetch(GVIZ_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid gviz response");
  const json: GvizResponse = JSON.parse(text.slice(start, end + 1));

  const rows = json.table.rows || [];
  const articles: Article[] = rows
    .map(
      (r): Article => ({
        timestamp: cell(r, 0),
        type: cell(r, 1),
        source: cell(r, 2),
        title: cell(r, 3),
        aiSummary: cell(r, 4),
        tweet: cell(r, 5),
        localNote: cell(r, 6),
        category: normalizeCategory(cell(r, 7)),
        localRelevance: cell(r, 8),
        url: cell(r, 9),
        imageUrl: cell(r, 10),
        publishedAt: cell(r, 11)
      })
    )
    .filter((a) => a.aiSummary || a.title);

  // Deduplicate
  const seen = new Set<string>();
  const deduped: Article[] = [];
  for (const a of articles) {
    const key = (a.url || a.title || a.aiSummary).slice(0, 200);
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }

  // Annotate
  for (const a of deduped) {
    a.excitementScore = storyExcitement(a);
    a.readingTime = readingTime(a.aiSummary);
  }

  deduped.sort((a, b) => {
    const ta = Date.parse(a.timestamp) || 0;
    const tb = Date.parse(b.timestamp) || 0;
    return tb - ta;
  });

  const localSky = deduped.filter(
    (a) => a.category === "LocalSky" || a.type === "local_sky"
  );
  const apod = deduped.find((a) => a.category === "APOD" || a.type === "apod") || null;
  const asteroids = deduped.filter(
    (a) => a.category === "Asteroid" || a.type === "asteroid"
  );
  const iss = deduped.find((a) => a.category === "ISS" || a.type === "iss_crew") || null;
  const launches = deduped.filter((a) => a.category === "Launch");
  const generalNews = deduped.filter((a) => a.category === "General");

  // Top 5 — most exciting non-APOD stories with a URL or image
  const topStoryCandidates = deduped.filter(
    (a) => a.category !== "APOD" && (a.url || a.imageUrl) && a.title
  );
  topStoryCandidates.sort(
    (a, b) => (b.excitementScore || 0) - (a.excitementScore || 0)
  );
  const topStories = topStoryCandidates.slice(0, 5);

  // Insights
  const moon = computeMoonPhase();
  const hasLocalSky = localSky.length > 0;
  const observationQuality = computeObservationQuality(moon, hasLocalSky);
  const featuredLocalSky = localSky[0];
  const visiblePlanets = featuredLocalSky
    ? extractVisiblePlanets(featuredLocalSky.aiSummary + " " + featuredLocalSky.localNote)
    : [];
  const viewingTime = featuredLocalSky
    ? extractViewingTime(featuredLocalSky.localNote + " " + featuredLocalSky.aiSummary)
    : null;
  const issCrewCount = iss ? inferIssCount(iss.aiSummary + " " + iss.title) : 0;
  const pulse = computeSpacePulse(deduped);
  const trending = trendingTopics(deduped, 5);
  const asteroidInsights = asteroids.map(parseAsteroid);

  const lastUpdated = deduped[0]?.timestamp || new Date().toISOString();

  return {
    all: deduped,
    localSky,
    apod,
    asteroids,
    iss,
    launches,
    generalNews,
    topStories,
    lastUpdated,
    pulse,
    moon,
    observationQuality,
    visiblePlanets,
    viewingTime,
    issCrewCount,
    trending,
    asteroidInsights
  };
}
