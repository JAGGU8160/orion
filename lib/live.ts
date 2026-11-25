import type { Article, Category } from "./types";

// Live fallback sources (no API keys required) used to supplement the Google Sheet,
// which is only as fresh as the last n8n run.

const FUNDING_SKIP = /funding|raises|raised|valuation|investor|\bipo\b|acquisition|acquires|merger/i;

function mk(p: Partial<Article> & { title: string; category: Category }): Article {
  const now = new Date().toISOString();
  return {
    timestamp: now,
    type: p.category.toLowerCase(),
    source: "",
    aiSummary: "",
    tweet: "",
    localNote: "",
    localRelevance: "medium",
    url: "",
    imageUrl: "",
    publishedAt: now,
    ...p,
  } as Article;
}

async function liveNews(): Promise<Article[]> {
  try {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=40", {
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const d = await res.json();
    return (d.results || [])
      .filter((r: any) => r.title && !FUNDING_SKIP.test(r.title) && !/^APOD:/i.test(r.title))
      .map((r: any) => {
        const isLaunch = /launch|liftoff|rocket|falcon|starship|artemis|booster/i.test(r.title);
        const summary = String(r.summary || "").replace(/\s+/g, " ").trim();
        return mk({
          title: r.title,
          category: isLaunch ? "Launch" : "General",
          source: r.news_site || "Spaceflight News",
          aiSummary: summary.length > 300 ? summary.slice(0, 297) + "..." : summary,
          url: r.url,
          imageUrl: r.image_url || "",
          timestamp: r.published_at,
          publishedAt: r.published_at,
        });
      });
  } catch {
    return [];
  }
}

async function liveAsteroids(): Promise<Article[]> {
  try {
    const key = process.env.NASA_API_KEY || "DEMO_KEY";
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const d = await res.json();
    const list: any[] = Object.values(d.near_earth_objects || {}).flat() as any[];
    return list
      .map((a) => {
        const ca = a.close_approach_data?.[0];
        const lunar = ca ? parseFloat(ca.miss_distance?.lunar) : NaN;
        const size = Math.round(
          ((a.estimated_diameter?.meters?.estimated_diameter_min || 0) +
            (a.estimated_diameter?.meters?.estimated_diameter_max || 0)) / 2
        );
        return { a, lunar, size, ca };
      })
      .filter((x) => !isNaN(x.lunar))
      .sort((x, y) => x.lunar - y.lunar)
      .slice(0, 3)
      .map(({ a, lunar, size, ca }) => {
        const name = String(a.name).replace(/[()]/g, "").trim();
        return mk({
          title: `Asteroid (${name}) passes Earth`,
          category: "Asteroid",
          source: "NASA NeoWs",
          aiSummary: `Asteroid (${name}), ~${size} meters, passes ${lunar.toFixed(1)} lunar distances from Earth on ${today}.${
            a.is_potentially_hazardous_asteroid ? " Potentially hazardous." : ""
          }`,
          url: a.nasa_jpl_url || "",
        });
      });
  } catch {
    return [];
  }
}

async function liveIss(): Promise<Article | null> {
  try {
    const res = await fetch("http://api.open-notify.org/astros.json", { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const d = await res.json();
    const crew = (d.people || []).filter((p: any) => p.craft === "ISS");
    if (!crew.length) return null;
    return mk({
      title: `ISS crew (${crew.length})`,
      category: "ISS",
      type: "iss_crew",
      source: "Open Notify",
      aiSummary: `${crew.length} humans are in space aboard the ISS: ${crew.map((p: any) => p.name).join(", ")}.`,
    });
  } catch {
    return null;
  }
}

export async function fetchLive(): Promise<Article[]> {
  const [news, ast, iss] = await Promise.all([liveNews(), liveAsteroids(), liveIss()]);
  return [...news, ...ast, ...(iss ? [iss] : [])];
}
