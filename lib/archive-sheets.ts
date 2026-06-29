import type { Article, Category } from "./types";
import { storyExcitement, readingTime } from "./insights";

const SHEET_ID = "1qwWGdWZefnEYRPtPYcfC3X6glageOwwXnF2LH42r1x8";
// explicit limit 2000 forces gviz to return all rows (default truncates large sheets)
const ARCHIVE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=1043900561&headers=1&tq=select%20*%20limit%202000`;

const VALID_CATEGORIES: Category[] = [
  "LocalSky", "Launch", "Asteroid", "APOD", "ISS", "General"
];

interface GvizCell { v: string | number | null }
interface GvizRow { c: (GvizCell | null)[] }
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

export interface DateGroup {
  date: string;   // ISO date "YYYY-MM-DD"
  label: string;  // "Today" / "Yesterday" / "12 June 2025"
  articles: Article[];
}

export interface ArchiveResult {
  articles: Article[];
  total: number;
  dateGroups: DateGroup[];
  sources: string[];
}

function dateLabel(dateStr: string): string {
  if (!dateStr) return "Unknown date";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const today = new Date();
  const diffDays = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) /
      86_400_000
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export async function fetchArchive(): Promise<ArchiveResult> {
  const res = await fetch(ARCHIVE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Archive sheet fetch failed: ${res.status}`);

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
        publishedAt: cell(r, 11),
      })
    )
    .filter((a) => a.title || a.aiSummary);

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

  // Sort by publishedAt descending
  deduped.sort((a, b) => {
    const ta = Date.parse(a.publishedAt || a.timestamp) || 0;
    const tb = Date.parse(b.publishedAt || b.timestamp) || 0;
    return tb - ta;
  });

  // Group by date
  const groupMap = new Map<string, Article[]>();
  for (const a of deduped) {
    const raw = a.publishedAt || a.timestamp || "";
    const date = raw.slice(0, 10); // "YYYY-MM-DD"
    if (!groupMap.has(date)) groupMap.set(date, []);
    groupMap.get(date)!.push(a);
  }

  const dateGroups: DateGroup[] = Array.from(groupMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, articles]) => ({ date, label: dateLabel(date), articles }));

  // Unique sources
  const sources = [...new Set(deduped.map((a) => a.source).filter(Boolean))].sort();

  return { articles: deduped, total: deduped.length, dateGroups, sources };
}
