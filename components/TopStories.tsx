"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Article } from "@/lib/types";
import { relativeTime } from "@/lib/insights";
import { categoryColor, categoryIcon, categoryLabel } from "@/lib/categories";

function openArticle(article: Article) {
  window.dispatchEvent(new CustomEvent("orion:article-open", { detail: article }));
}

function googleSearchHref(title: string, source: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(title + " " + source)}`;
}

export default function TopStories({ stories }: { stories: Article[] }) {
  if (stories.length === 0) return null;
  const [featured, ...rest] = stories;

  return (
    <div className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        {/* Section header */}
        <div className="flex items-baseline gap-3 mb-8">
          <span className="section-title">// Top Stories</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            Ranked by excitement
          </span>
        </div>

        {/* Featured — full-width banner */}
        <FeaturedCard story={featured} />

        {/* Support cards — 2×2 on tablet, 4-col on desktop */}
        {rest.length > 0 && (
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {rest.map((s, i) => (
              <SupportCard key={s.url || i} story={s} rank={i + 2} delay={i * 0.08} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Featured card — large 50/50 banner ─────────────────── */
function FeaturedCard({ story }: { story: Article }) {
  const [imgError, setImgError] = useState(false);
  const hasUrl = !!story.imageUrl;
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };
  const tint = categoryColor(story.category);
  const icon = categoryIcon(story.category);
  const label = categoryLabel(story.category);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => openArticle(story)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(story); }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="card group overflow-hidden cursor-pointer select-none"
    >
      <div className={`grid ${hasUrl ? "md:grid-cols-[1fr_44%]" : ""} min-h-[260px] md:min-h-[320px]`}>

        {/* Image column — always render when URL exists; placeholder shows if img fails */}
        {hasUrl && (
          <div className="relative overflow-hidden aspect-[16/10] md:aspect-auto">
            {/* Space-gradient placeholder always visible behind the image */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #060b18 0%, #0d1a2e 45%, #130d24 100%)"
              }}
            >
              <span className="text-5xl opacity-20 select-none">🌌</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {!imgError && (
              <img
                src={story.imageUrl}
                alt=""
                onError={() => setImgError(true)}
                onLoad={onImgLoad}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            {/* Rank badge */}
            <span
              className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold backdrop-blur"
              style={{
                background: "rgb(0 0 0 / 0.6)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              1
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {!hasUrl && (
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold mb-4"
                style={{ background: "rgb(var(--bg-border))", color: "rgb(var(--ink))" }}
              >
                1
              </span>
            )}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide border"
                style={{
                  color: tint,
                  borderColor: tint,
                  background: categoryColor(story.category, 0.08)
                }}
              >
                <span aria-hidden>{icon}</span>
                {label}
              </span>
              {story.source && (
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-dim">
                  {story.source}
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-ink group-hover:text-neon-cyan transition-colors line-clamp-3">
              {story.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed line-clamp-4">
              {story.aiSummary}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-bg-border flex items-center justify-between text-[11px] font-mono text-ink-dim">
            <div className="flex items-center gap-3">
              <ExcitementPill score={story.excitementScore ?? 5} />
              <span>{story.readingTime ?? 1} min read</span>
              <span>{relativeTime(story.timestamp || story.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {story.url && (
                <a
                  href={googleSearchHref(story.title, story.source)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Search on Google"
                  className="px-2 py-1 rounded text-[10px] transition-colors hover:text-neon-cyan"
                  style={{ border: "1px solid rgb(var(--bg-border))" }}
                >
                  🔍 Google
                </a>
              )}
              {story.url && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Try original source"
                  className="px-2 py-1 rounded text-[10px] transition-colors hover:text-ink"
                  style={{ border: "1px solid rgb(var(--bg-border))" }}
                >
                  ↗
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

/* ─── Support card — compact tile ────────────────────────── */
function SupportCard({
  story,
  rank,
  delay
}: {
  story: Article;
  rank: number;
  delay: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasUrl = !!story.imageUrl;
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };
  const tint = categoryColor(story.category);
  const icon = categoryIcon(story.category);
  const label = categoryLabel(story.category);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => openArticle(story)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openArticle(story); }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="card group overflow-hidden flex flex-col cursor-pointer select-none"
    >
      {/* Image — always render when URL exists; placeholder shows if img fails */}
      {hasUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
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
              src={story.imageUrl}
              alt=""
              onError={() => setImgError(true)}
              onLoad={onImgLoad}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          )}
          {/* Rank badge */}
          <span
            className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold backdrop-blur"
            style={{
              background: "rgb(0 0 0 / 0.6)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            {rank}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {!hasUrl && (
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold mb-2.5 shrink-0"
            style={{ background: "rgb(var(--bg-border))", color: "rgb(var(--ink))" }}
          >
            {rank}
          </span>
        )}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide border"
            style={{
              color: tint,
              borderColor: tint,
              background: categoryColor(story.category, 0.08)
            }}
          >
            <span aria-hidden>{icon}</span>
            {label}
          </span>
        </div>
        <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors line-clamp-3 flex-1">
          {story.title}
        </h3>
        <div className="mt-3 pt-2.5 border-t border-bg-border flex items-center justify-between text-[10px] font-mono text-ink-dim">
          <ExcitementPill score={story.excitementScore ?? 5} />
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {story.url && (
              <a
                href={googleSearchHref(story.title, story.source)}
                target="_blank"
                rel="noopener noreferrer"
                title="Search on Google"
                className="px-1.5 py-0.5 rounded text-[9px] transition-colors hover:text-neon-cyan"
                style={{ border: "1px solid rgb(var(--bg-border))" }}
              >
                🔍
              </a>
            )}
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Original source"
                className="px-1.5 py-0.5 rounded text-[9px] transition-colors hover:text-ink"
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

/* ─── Excitement score pill ───────────────────────────────── */
function ExcitementPill({ score }: { score: number }) {
  const color =
    score >= 8
      ? "rgb(var(--neon-pink))"
      : score >= 6
      ? "rgb(var(--neon-cyan))"
      : "rgb(var(--neon-amber))";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px]"
      style={{ color, border: `1px solid ${color}`, background: "transparent" }}
    >
      <span aria-hidden>●</span>
      <span className="tabular-nums">{score.toFixed(1)}</span>
    </span>
  );
}
