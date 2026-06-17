"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import type { Article, Category } from "@/lib/types";
import type { DateGroup } from "@/lib/archive-sheets";
import { relativeTime } from "@/lib/insights";
import { categoryColor, categoryIcon, categoryLabel } from "@/lib/categories";

const PAGE_SIZE = 30;

const FILTERS: { id: Category | "All"; label: string; icon: string }[] = [
  { id: "All",     label: "All",      icon: "🌐" },
  { id: "Launch",  label: "Launch",   icon: "🚀" },
  { id: "Asteroid",label: "Asteroid", icon: "☄️" },
  { id: "ISS",     label: "ISS",      icon: "🛸" },
  { id: "APOD",    label: "APOD",     icon: "📸" },
  { id: "General", label: "General",  icon: "📰" },
];

function openArticle(article: Article) {
  window.dispatchEvent(new CustomEvent("orion:article-open", { detail: article }));
}

function googleSearchHref(title: string, source: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(title + " " + source)}`;
}

export default function ArchiveFeed({
  articles,
  dateGroups,
  total,
  sources,
}: {
  articles: Article[];
  dateGroups: DateGroup[];
  total: number;
  sources: string[];
}) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");
  const [shownCount, setShownCount] = useState(PAGE_SIZE);

  // Filter + search
  const filtered = useMemo(() => {
    let list = articles;
    if (filter !== "All") list = list.filter((a) => a.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.aiSummary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, filter, search]);

  // Regroup filtered articles by date
  const visibleGroups = useMemo(() => {
    const shown = filtered.slice(0, shownCount);
    const groupMap = new Map<string, { label: string; articles: Article[] }>();
    for (const a of shown) {
      const date = (a.publishedAt || a.timestamp || "").slice(0, 10);
      const group = dateGroups.find((g) => g.date === date);
      const label = group?.label ?? date;
      if (!groupMap.has(date)) groupMap.set(date, { label, articles: [] });
      groupMap.get(date)!.articles.push(a);
    }
    return Array.from(groupMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, { label, articles }]) => ({ date, label, articles }));
  }, [filtered, shownCount, dateGroups]);

  const hasMore = shownCount < filtered.length;

  return (
    <div className="relative z-10 pt-28 pb-16">
      <div className="container mx-auto px-5 max-w-5xl">

        {/* ── Page header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-title">// Past News Archive</span>
            <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/30 to-transparent" />
          </div>
          <p className="text-sm text-ink-dim font-mono">
            {total.toLocaleString()} articles from {sources.length} sources — one-time historical import
          </p>
        </motion.div>

        {/* ── Search + filter bar ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div
            className="relative flex-1"
            style={{
              maxWidth: "340px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-dim pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search archive…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShownCount(PAGE_SIZE); }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-colors"
              style={{
                background: "rgb(var(--bg-card) / 0.6)",
                border: "1px solid rgb(var(--bg-border))",
                color: "rgb(var(--ink))",
              }}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => { setFilter(f.id); setShownCount(PAGE_SIZE); }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
                  style={
                    active
                      ? {
                          background: "rgb(var(--neon-cyan) / 0.12)",
                          border: "1px solid rgb(var(--neon-cyan) / 0.4)",
                          color: "rgb(var(--neon-cyan))",
                        }
                      : {
                          background: "rgb(var(--bg-card) / 0.5)",
                          border: "1px solid rgb(var(--bg-border))",
                          color: "rgb(var(--ink-muted))",
                        }
                  }
                >
                  <span aria-hidden>{f.icon}</span>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Result count ────────────────────────────────── */}
        {(filter !== "All" || search) && (
          <p className="text-xs font-mono text-ink-dim mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {filter !== "All" ? ` in ${filter}` : ""}
            {search ? ` for "${search}"` : ""}
          </p>
        )}

        {/* ── Empty state ─────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="text-center py-24 text-ink-dim">
            <div className="text-5xl mb-4">🔭</div>
            <p className="font-mono text-sm">No articles match your query.</p>
          </div>
        )}

        {/* ── Date-grouped article list ────────────────────── */}
        <AnimatePresence mode="popLayout">
          {visibleGroups.map((group) => (
            <motion.div
              key={group.date}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-dim shrink-0">
                  {group.label}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ background: "rgb(var(--bg-border))" }}
                />
                <span className="text-[10px] font-mono text-ink-dim shrink-0">
                  {group.articles.length} article{group.articles.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.articles.map((article, i) => (
                  <ArchiveCard key={article.url || i} article={article} delay={i * 0.03} />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Load More ───────────────────────────────────── */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShownCount((n) => n + PAGE_SIZE)}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "rgb(var(--bg-card) / 0.6)",
                border: "1px solid rgb(var(--bg-border))",
                color: "rgb(var(--ink-muted))",
              }}
            >
              Load {Math.min(PAGE_SIZE, filtered.length - shownCount)} more
              <span className="ml-2 text-ink-dim font-mono text-[10px]">
                ({filtered.length - shownCount} remaining)
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Archive card ──────────────────────────────────────────── */
function ArchiveCard({ article, delay }: { article: Article; delay: number }) {
  const [imgError, setImgError] = useState(false);
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };
  const tint = categoryColor(article.category);

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      onClick={() => openArticle(article)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(article); }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="card overflow-hidden group cursor-pointer select-none flex flex-col"
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative aspect-video overflow-hidden">
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

      <div className="p-4 flex flex-col flex-1">
        {/* Category + source */}
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide border"
            style={{
              color: tint,
              borderColor: tint,
              background: categoryColor(article.category, 0.08),
            }}
          >
            <span aria-hidden>{categoryIcon(article.category)}</span>
            {categoryLabel(article.category)}
          </span>
          {article.source && (
            <span className="text-[10px] font-mono text-ink-dim uppercase tracking-wide truncate max-w-[100px]">
              {article.source}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors line-clamp-3 flex-1">
          {article.title}
        </h3>

        {/* Summary snippet */}
        {article.aiSummary && (
          <p className="mt-1.5 text-[11px] text-ink-dim leading-relaxed line-clamp-2">
            {article.aiSummary}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 pt-2.5 border-t border-bg-border flex items-center justify-between text-[10px] font-mono text-ink-dim">
          <span>{relativeTime(article.publishedAt || article.timestamp)}</span>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {article.url && (
              <a
                href={googleSearchHref(article.title, article.source)}
                target="_blank"
                rel="noopener noreferrer"
                title="Search on Google"
                className="px-1.5 py-0.5 rounded hover:text-neon-cyan transition-colors"
                style={{ border: "1px solid rgb(var(--bg-border))" }}
              >
                🔍
              </a>
            )}
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Original source"
                className="px-1.5 py-0.5 rounded hover:text-ink transition-colors"
                style={{ border: "1px solid rgb(var(--bg-border))" }}
              >
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
