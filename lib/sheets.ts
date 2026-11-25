import type { Article, Category, DigestBuckets } from "./types";
import { fetchLive } from "./live";
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

const SHEET_ID = "1qwWGdWZefnEYRPtPYcfC3X6glageOwwXnF2LH42r1x8";
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

  // Drop articles older than 30 days and funding/industry noise
  const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const FUNDING_NOISE_KW = [
    'funding', 'raises', 'raised', 'valuation', 'investor', 'ipo',
    'acquisition', 'acquires', 'merger', 'ceo appointed', 'executive',
    'contract awarded', 'satellite internet', 'broadband',
  ];
  function isFundingNoise(title: string) {
    const t = title.toLowerCase();
    return FUNDING_NOISE_KW.some(kw => t.includes(kw));
  }

  // Supplement the sheet with live data so the page stays fresh even if the pipeline stalls
  const live = await fetchLive();
  const sheetNewest = Math.max(0, ...articles.map((a) => Date.parse(a.timestamp) || 0));
  const liveItems = live.filter((l) => {
    if (l.category === "Asteroid" || l.category === "ISS") return true;
    return (Date.parse(l.timestamp) || 0) > sheetNewest - 24 * 60 * 60 * 1000;
  });
  // Live asteroid/ISS data replaces stale sheet entries of the same kind
  const hasLiveAst = liveItems.some((l) => l.category === "Asteroid");
  const hasLiveIss = liveItems.some((l) => l.category === "ISS");
  const base = articles.filter(
    (a) => !(hasLiveAst && a.category === "Asteroid") && !(hasLiveIss && a.category === "ISS")
  );
  const merged = [...liveItems, ...base];

  const fresh = merged.filter(a => {
    const ts = Date.parse(a.timestamp) || 0;
    return ts >= THIRTY_DAYS_AGO && !isFundingNoise(a.title);
  });

  // Deduplicate
  const seen = new Set<string>();
  const deduped: Article[] = [];
  for (const a of fresh) {
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
  let apod: Article | null = deduped.find((a) => a.category === "APOD" || a.type === "apod") || null;

  // If sheet has no APOD, fetch directly from NASA API as fallback
  if (!apod) {
    try {
      const nasaKey = process.env.NASA_API_KEY || "DEMO_KEY";
      const apodRes = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`,
        { next: { revalidate: 21600 } } // cache 6 hours
      );
      if (apodRes.ok) {
        const d = await apodRes.json();
        if (d?.title && d?.explanation) {
          apod = {
            timestamp: new Date().toISOString(),
            type: "apod",
            source: "NASA APOD",
            title: "NASA Picture of the Day: " + d.title,
            aiSummary: d.explanation.slice(0, 400),
            tweet: "",
            localNote: "",
            category: "APOD",
            localRelevance: "medium",
            url: d.hdurl || d.url || "",
            imageUrl: d.url || "",
            publishedAt: d.date || new Date().toISOString(),
          };
        }
      }
    } catch {
      // silently skip — APOD stays null
    }
  }
  const asteroids = deduped.filter(
    (a) => a.category === "Asteroid" || a.type === "asteroid"
  );
  const iss = deduped.find((a) => a.category === "ISS" || a.type === "iss_crew") || null;
  const launches = deduped.filter((a) => a.category === "Launch");
  const generalNews = deduped.filter((a) => a.category === "General");

  // Top 5 — most exciting non-APOD stories from last 14 days with a URL or image
  const FOURTEEN_DAYS_AGO = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const topStoryCandidates = deduped.filter((a) => {
    const ts = Date.parse(a.timestamp) || 0;
    return a.category !== "APOD" && (a.url || a.imageUrl) && a.title && ts >= FOURTEEN_DAYS_AGO;
  });
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
