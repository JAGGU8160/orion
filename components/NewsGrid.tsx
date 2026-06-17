"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Article, Category } from "@/lib/types";
import Highlight from "./Highlight";

const FILTERS: { key: "All" | Category; label: string; emoji: string }[] = [
  { key: "All", label: "All", emoji: "✦" },
  { key: "Launch", label: "Launches", emoji: "🚀" },
  { key: "APOD", label: "APOD", emoji: "🔭" },
  { key: "Asteroid", label: "Asteroids", emoji: "☄️" },
  { key: "ISS", label: "ISS", emoji: "🛰️" },
  { key: "LocalSky", label: "Sky", emoji: "🌙" },
  { key: "General", label: "General", emoji: "📡" }
];

function relativeTime(iso: string): string {
  const t = Date.parse(iso);
  if (!t) return "";
  const diff = Date.now() - t;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(t).toLocaleDateString();
}

export default function NewsGrid({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.hash.match(/#q=([^&]+)/);
    if (m) setQuery(decodeURIComponent(m[1]));
    const onSearch = (e: Event) => {
      const ev = e as CustomEvent<string>;
      setQuery(ev.detail || "");
    };
    const onCategory = (e: Event) => {
      const ev = e as CustomEvent<string | null>;
      const c = ev.detail;
      if (!c) {
        setActive("All");
      } else if (
        c === "Launch" ||
        c === "APOD" ||
        c === "Asteroid" ||
        c === "ISS" ||
        c === "LocalSky" ||
        c === "General"
      ) {
        setActive(c as Category);
      }
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
    if (active !== "All") {
      result = result.filter((a) => a.category === active);
    }
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
      new CustomEvent("orion:search-results", { detail: { count: matchCount, query } })
    );
  }, [matchCount, query]);

  if (articles.length === 0) return null;

  const showEmpty = filtered.length === 0;

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// Space News Feed</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
          {query && (
            <span className="chip chip-active text-[10px]">
              ✦ &ldquo;{query}&rdquo; · {filtered.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {available.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setActive(f.key);
                window.dispatchEvent(
                  new CustomEvent("orion:category", { detail: f.key === "All" ? null : f.key })
                );
              }}
              className={`chip ${active === f.key ? "chip-active" : "hover:border-neon-cyan/40 hover:text-ink"}`}
            >
              <span aria-hidden>{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>

        {showEmpty ? (
          <EmptyState query={query} />
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((a, idx) => (
                <motion.a
                  key={(a.url || a.title) + idx}
                  layout
                  data-match-id={query.trim() ? idx : undefined}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                  href={a.url || "#"}
                  target={a.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="card p-5 group hover:border-neon-cyan/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  {a.imageUrl ? (
                    <div className="relative aspect-video -m-5 mb-4 overflow-hidden rounded-t-2xl bg-bg-deep">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.imageUrl}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card/70 via-transparent to-transparent" />
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="chip text-[10px] py-0.5">
                      {FILTERS.find((f) => f.key === a.category)?.emoji} {a.category}
                    </span>
                    {a.source && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">
                        <Highlight text={a.source} query={query} />
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors line-clamp-3">
                    <Highlight text={a.title || a.aiSummary.slice(0, 90)} query={query} />
                  </h3>

                  <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-4 flex-1">
                    <Highlight text={a.aiSummary} query={query} />
                  </p>

                  <div className="mt-4 pt-3 border-t border-bg-border flex items-center justify-between text-xs text-ink-dim">
                    <span>{relativeTime(a.publishedAt || a.timestamp)}</span>
                    {a.url && (
                      <span className="text-neon-cyan/70 group-hover:text-neon-cyan transition-colors">
                        Read →
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ query }: { query: string }) {
  const suggestions = ["Asteroid", "Jupiter", "Gujarat", "ISS", "Moon"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-12 text-center relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-neon-violet/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-neon-cyan/10 blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-24 h-24 mx-auto mb-6"
        animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-neon-cyan/70">
          <circle cx="50" cy="55" r="14" fill="currentColor" opacity="0.85" />
          <rect x="38" y="48" width="24" height="14" rx="2" fill="rgb(var(--bg-deep))" />
          <line x1="20" y1="40" x2="38" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="80" y1="40" x2="62" y2="50" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="36" width="10" height="8" rx="1.5" fill="currentColor" />
          <rect x="76" y="36" width="10" height="8" rx="1.5" fill="currentColor" />
          <motion.circle
            cx="50" cy="55" r="3" fill="rgb(var(--neon-pink))"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.g
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path d="M50 55 Q 70 30 90 25" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 3" />
            <path d="M50 55 Q 30 30 10 25" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 3" />
          </motion.g>
        </svg>
      </motion.div>

      <h3 className="font-display text-2xl font-semibold text-ink mb-2">
        No signals found
      </h3>
      <p className="text-ink-muted max-w-md mx-auto leading-relaxed">
        {query.trim() ? (
          <>
            Nothing in this corner of the sky matches{" "}
            <span className="font-mono text-neon-cyan">&ldquo;{query}&rdquo;</span>.
            Try a broader term.
          </>
        ) : (
          <>The feed is quiet right now — check back after the next refresh.</>
        )}
      </p>

      {query.trim() && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
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
