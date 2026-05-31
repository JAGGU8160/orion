import type { Article, Category, DigestBuckets } from "./types";

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
  table: {
    cols: { id: string; label: string }[];
    rows: GvizRow[];
  };
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

export async function fetchDigest(): Promise<DigestBuckets> {
  const res = await fetch(GVIZ_URL, {
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid gviz response");
  const json: GvizResponse = JSON.parse(text.slice(start, end + 1));

  const rows = json.table.rows || [];
  const articles: Article[] = rows
    .map((r): Article => ({
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
    }))
    .filter((a) => a.aiSummary || a.title);

  const seen = new Set<string>();
  const deduped: Article[] = [];
  for (const a of articles) {
    const key = (a.url || a.title || a.aiSummary).slice(0, 200);
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
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
  const news = deduped.filter(
    (a) => a.type === "global_news" || a.category === "Launch" || (a.category === "General" && a.url)
  );

  const lastUpdated = deduped[0]?.timestamp || new Date().toISOString();

  return { all: deduped, localSky, apod, asteroids, iss, news, lastUpdated };
}
