"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Article, Category } from "@/lib/types";
import Highlight from "./Highlight";
import { relativeTime } from "@/lib/insights";
import { categoryColor, categoryIcon, categoryLabel } from "@/lib/categories";

function openArticle(article: Article) {
  window.dispatchEvent(new CustomEvent("orion:article-open", { detail: article }));
}

function googleSearchHref(title: string, source: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(title + " " + source)}`;
}

const FILTERS: { key: "All" | Category; label: string; icon: string }[] = [
  { key: "All", label: "All", icon: "✦" },
  { key: "Launch", label: "Launches", icon: "🚀" },
  { key: "APOD", label: "APOD", icon: "📸" },
  { key: "Asteroid", label: "Asteroids", icon: "☄️" },
  { key: "ISS", label: "Missions", icon: "🛰" },
  { key: "LocalSky", label: "Sky Tonight", icon: "🌙" },
  { key: "General", label: "Discoveries", icon: "🌌" }
];

const STANDARD_PAGE = 6;

export default function LatestNews({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [extraPages, setExtraPages] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.hash.match(/#q=([^&]+)/);
    if (m) setQuery(decodeURIComponent(m[1]));
    const onSearch = (e: Event) => {
      const ev = e as CustomEvent<string>;
      setQuery(ev.detail || "");
      setExtraPages(1);
    };
    const onCategory = (e: Event) => {
      const ev = e as CustomEvent<string | null>;
      const c = ev.detail;
      setExtraPages(1);
      if (!c) setActive("All");
      else if (
        c === "Launch" || c === "APOD" || c === "Asteroid" ||
        c === "ISS" || c === "LocalSky" || c === "General"
      ) setActive(c as Category);
    };
    window.addEventListener("orion:search", onSearch);
    window.addEventListener("orion:category", onCategory);
    return () => {
      window.removeEventListener("orion:search", onSearch);
      window.removeEventListener("orion:category", onCategory);
    };
  }, []);

  const available = useMemo(() => {
    const set = new Set<string>(articles.map((a) => a.category));
    return FILTERS.filter((f) => f.key === "All" || set.has(f.key));
  }, [articles]);

  const filtered = useMemo(() => {
    let result = articles;
    if (active !== "All") result = result.filter((a) => a.category === active);
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((a) =>
        (a.title + " " + a.aiSummary + " " + a.source + " " + a.localNote)
          .toLowerCase()
          .includes(q)
      );
    }
    return result;
  }, [articles, active, query]);

  const matchCount = query.trim() ? filtered.length : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("orion:search-results", {
        detail: { count: matchCount, query }
      })
    );
  }, [matchCount, query]);

  if (articles.length === 0) return null;

  // Editorial split: 1 featured, 2 medium, rest standard
  const featured = filtered[0];
  const medium = filtered.slice(1, 3);
  const allStandard = filtered.slice(3);
  const standardVisible = allStandard.slice(0, extraPages * STANDARD_PAGE);
  const hasMore = standardVisible.length < allStandard.length;

  return (
    <div className="container mx-auto px-5 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="section-title">// Latest News</span>
        <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
        {query && (
          <span className="chip chip-active text-[10px]">
            ✦ &ldquo;{query}&rdquo; · {filtered.length}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 -mx-1 px-1 overflow-x-auto">
        {available.map((f) => {
          const isActive = active === f.key;
          const color =
            f.key === "All"
              ? "rgb(var(--neon-cyan))"
              : categoryColor(f.key as Category);
          return (
            <button
              key={f.key}
              onClick={() => {
                setActive(f.key);
                setExtraPages(1);
                window.dispatchEvent(
                  new CustomEvent("orion:category", {
                    detail: f.key === "All" ? null : f.key
                  })
                );
              }}
              className="chip"
              style={
                isActive
                  ? {
                      color,
                      borderColor: color,
                      background: `${color.replace(")", " / 0.1)").replace("rgb(", "rgb(")}`
                    }
                  : undefined
              }
            >
              <span aria-hidden>{f.icon}</span>
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="space-y-6">
          {/* Featured card */}
          {featured && (
            <FeaturedCard article={featured} query={query} matchId={query.trim() ? 0 : undefined} />
          )}

          {/* Medium cards */}
          {medium.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {medium.map((a, i) => (
                <MediumCard
                  key={(a.url || a.title) + i}
                  article={a}
                  query={query}
                  matchId={query.trim() ? 1 + i : undefined}
                />
              ))}
            </div>
          )}

          {/* Standard cards */}
          {standardVisible.length > 0 && (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              <AnimatePresence mode="popLayout">
                {standardVisible.map((a, idx) => (
                  <StandardCard
                    key={(a.url || a.title) + idx}
                    article={a}
                    query={query}
                    matchId={query.trim() ? 3 + idx : undefined}
                    delay={(idx % STANDARD_PAGE) * 0.03}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {hasMore && (
            <div className="pt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExtraPages((p) => p + 1)}
                className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors"
                style={{
                  borderColor: "rgb(var(--neon-cyan) / 0.4)",
                  background: "rgb(var(--neon-cyan) / 0.08)",
                  color: "rgb(var(--neon-cyan))"
                }}
              >
                Show more · {allStandard.length - standardVisible.length} remaining
              </motion.button>
            </div>
          )}
          {!hasMore && filtered.length > 3 + STANDARD_PAGE && (
            <div className="pt-4 text-center text-xs font-mono text-ink-dim">
              — end of feed —
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── CARD VARIANTS ─────────────────────────────────────────────

function CategoryBadge({ category }: { category: Category }) {
  const color = categoryColor(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide border"
      style={{
        color,
        borderColor: color,
        background: categoryColor(category, 0.08)
      }}
    >
      <span aria-hidden>{categoryIcon(category)}</span>
      {categoryLabel(category)}
    </span>
  );
}

function FeaturedCard({
  article,
  query,
  matchId
}: {
  article: Article;
  query: string;
  matchId?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasUrl = !!article.imageUrl;
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };

  return (
    <motion.div
      layout
      data-match-id={matchId}
      role="button"
      tabIndex={0}
      onClick={() => openArticle(article)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(article); }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card group grid gap-0 overflow-hidden hover:-translate-y-0.5 cursor-pointer select-none ${hasUrl ? "md:grid-cols-2" : ""}`}
    >
      {hasUrl && (
        <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #060b18 0%, #0d1a2e 45%, #130d24 100%)" }}
          >
            <span className="text-3xl opacity-20 select-none">🌌</span>
          </div>
          {!imgError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl!}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              onLoad={onImgLoad}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
        </div>
      )}
      <div className="p-6 sm:p-8 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <CategoryBadge category={article.category} />
          {article.source && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">
              {article.source}
            </span>
          )}
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors">
          <Highlight text={article.title || article.aiSummary.slice(0, 90)} query={query} />
        </h3>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-4 flex-1">
          <Highlight text={article.aiSummary} query={query} />
        </p>
        <div className="mt-5 pt-4 border-t border-bg-border flex items-center justify-between text-xs text-ink-dim">
          <span className="font-mono">{relativeTime(article.publishedAt || article.timestamp)}</span>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {article.url && (
              <a href={googleSearchHref(article.title, article.source)} target="_blank" rel="noopener noreferrer"
                 className="px-2 py-1 rounded text-[10px] hover:text-neon-cyan transition-colors"
                 style={{ border: "1px solid rgb(var(--bg-border))" }} title="Search on Google">
                🔍 Google
              </a>
            )}
            {article.url && (
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                 className="px-2 py-1 rounded text-[10px] hover:text-ink transition-colors"
                 style={{ border: "1px solid rgb(var(--bg-border))" }} title="Try original">
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MediumCard({
  article,
  query,
  matchId
}: {
  article: Article;
  query: string;
  matchId?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasUrl = !!article.imageUrl;
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };

  return (
    <motion.div
      layout
      data-match-id={matchId}
      role="button"
      tabIndex={0}
      onClick={() => openArticle(article)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(article); }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card group flex flex-col md:flex-row gap-0 overflow-hidden hover:-translate-y-0.5 cursor-pointer select-none"
    >
      {hasUrl && (
        <div className="relative md:w-44 shrink-0 aspect-[16/10] md:aspect-auto md:h-auto overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #060b18 0%, #0d1a2e 45%, #130d24 100%)" }}
          />
          {!imgError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl!}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              onLoad={onImgLoad}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <CategoryBadge category={article.category} />
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors line-clamp-3">
          <Highlight text={article.title || article.aiSummary.slice(0, 90)} query={query} />
        </h3>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-2 flex-1">
          <Highlight text={article.aiSummary} query={query} />
        </p>
        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-mono text-ink-dim">
          <span>{relativeTime(article.publishedAt || article.timestamp)}</span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {article.url && (
              <a href={googleSearchHref(article.title, article.source)} target="_blank" rel="noopener noreferrer"
                 className="px-1.5 py-0.5 rounded text-[9px] hover:text-neon-cyan transition-colors"
                 style={{ border: "1px solid rgb(var(--bg-border))" }} title="Search on Google">
                🔍
              </a>
            )}
            {article.url && (
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                 className="px-1.5 py-0.5 rounded text-[9px] hover:text-ink transition-colors"
                 style={{ border: "1px solid rgb(var(--bg-border))" }} title="Original">
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StandardCard({
  article,
  query,
  matchId,
  delay
}: {
  article: Article;
  query: string;
  matchId?: number;
  delay: number;
}) {
  const [imgError, setImgError] = useState(false);
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };

  return (
    <motion.div
      layout
      data-match-id={matchId}
      role="button"
      tabIndex={0}
      onClick={() => openArticle(article)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(article); }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay }}
      className="card p-5 group hover:-translate-y-0.5 flex flex-col cursor-pointer select-none"
    >
      {article.imageUrl && (
        <div className="relative aspect-video -m-5 mb-4 overflow-hidden rounded-t-[14px]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #060b18 0%, #0d1a2e 45%, #130d24 100%)" }}
          />
          {!imgError && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              onLoad={onImgLoad}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <CategoryBadge category={article.category} />
      </div>
      <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors line-clamp-3">
        <Highlight text={article.title || article.aiSummary.slice(0, 90)} query={query} />
      </h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-3 flex-1">
        <Highlight text={article.aiSummary} query={query} />
      </p>
      <div className="mt-3 pt-3 border-t border-bg-border flex items-center justify-between text-[11px] font-mono text-ink-dim">
        <span>{relativeTime(article.publishedAt || article.timestamp)}</span>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {article.url && (
            <a href={googleSearchHref(article.title, article.source)} target="_blank" rel="noopener noreferrer"
               className="px-1.5 py-0.5 rounded text-[9px] hover:text-neon-cyan transition-colors"
               style={{ border: "1px solid rgb(var(--bg-border))" }} title="Search on Google">
              🔍
            </a>
          )}
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
               className="px-1.5 py-0.5 rounded text-[9px] hover:text-ink transition-colors"
               style={{ border: "1px solid rgb(var(--bg-border))" }} title="Original">
              ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ query }: { query: string }) {
  const suggestions = ["Asteroid", "Jupiter", "Gujarat", "ISS", "Moon"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-12 text-center"
    >
      <motion.div
        className="relative w-20 h-20 mx-auto mb-5 text-neon-cyan/70"
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="55" r="14" fill="currentColor" opacity="0.85" />
          <rect x="38" y="48" width="24" height="14" rx="2" fill="rgb(var(--bg-deep))" />
          <line x1="20" y1="40" x2="38" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="80" y1="40" x2="62" y2="50" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="36" width="10" height="8" rx="1.5" fill="currentColor" />
          <rect x="76" y="36" width="10" height="8" rx="1.5" fill="currentColor" />
        </svg>
      </motion.div>
      <h3 className="font-display text-xl font-semibold text-ink mb-2">No signals found</h3>
      <p className="text-ink-muted max-w-md mx-auto text-sm leading-relaxed">
        {query.trim() ? (
          <>
            Nothing matches{" "}
            <span className="font-mono text-neon-cyan">&ldquo;{query}&rdquo;</span>. Try a broader term.
          </>
        ) : (
          <>The feed is quiet right now — check back after the next refresh.</>
        )}
      </p>
      {query.trim() && (
        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                history.replaceState(null, "", `#q=${encodeURIComponent(s)}`);
                window.dispatchEvent(new CustomEvent("orion:search", { detail: s }));
              }}
              className="chip hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
