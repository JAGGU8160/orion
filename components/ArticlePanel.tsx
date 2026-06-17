"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Article } from "@/lib/types";
import { relativeTime } from "@/lib/insights";
import { categoryColor, categoryIcon, categoryLabel } from "@/lib/categories";

export default function ArticlePanel() {
  const [article, setArticle] = useState<Article | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ev = e as CustomEvent<Article>;
      setArticle(ev.detail);
      document.body.style.overflow = "hidden";
    };
    window.addEventListener("orion:article-open", onOpen);
    return () => window.removeEventListener("orion:article-open", onOpen);
  }, []);

  const close = () => {
    setArticle(null);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  if (!mounted) return null;

  const googleUrl = article
    ? `https://www.google.com/search?q=${encodeURIComponent((article.title || "") + " " + (article.source || ""))}`
    : null;
  const archiveUrl = article?.url
    ? `https://web.archive.org/web/*/${article.url}`
    : null;

  const tint = article ? categoryColor(article.category) : "";

  return createPortal(
    <AnimatePresence>
      {article && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[80] backdrop-blur-sm"
            style={{ background: "rgb(var(--bg) / 0.65)" }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] lg:w-[520px] z-[90] overflow-y-auto flex flex-col"
            style={{
              background: "rgb(var(--bg-deep) / 0.98)",
              borderLeft: "1px solid rgb(var(--bg-border))",
              backdropFilter: "blur(24px)"
            }}
          >
            {/* Top accent */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgb(var(--neon-cyan) / 0.5), transparent)"
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-dim">
                Story Brief
              </span>
              <button
                onClick={close}
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
                style={{ borderColor: "rgb(var(--bg-border))" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="px-6 pb-10 flex-1">

              {/* Image */}
              {article.imageUrl && (
                <div className="relative aspect-video -mx-6 mb-6 overflow-hidden bg-bg-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
                    onLoad={(e) => {
                      if (e.currentTarget.naturalWidth === 0)
                        (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide border"
                  style={{ color: tint, borderColor: tint, background: categoryColor(article.category, 0.08) }}
                >
                  <span aria-hidden>{categoryIcon(article.category)}</span>
                  {categoryLabel(article.category)}
                </span>
                {article.source && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">
                    {article.source}
                  </span>
                )}
                <span className="text-[10px] font-mono text-ink-dim ml-auto">
                  {relativeTime(article.publishedAt || article.timestamp)}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug text-ink mb-5">
                {article.title}
              </h2>

              {/* Summary box */}
              <div
                className="rounded-xl p-4 sm:p-5 mb-4"
                style={{
                  background: "rgb(var(--bg-card) / 0.6)",
                  border: "1px solid rgb(var(--bg-border))"
                }}
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim mb-3">
                  AI Summary
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {article.aiSummary}
                </p>
              </div>

              {/* Local relevance */}
              {article.localNote && (
                <div
                  className="rounded-xl p-4 mb-4 flex gap-3"
                  style={{
                    background: "rgb(var(--neon-cyan) / 0.06)",
                    border: "1px solid rgb(var(--neon-cyan) / 0.2)"
                  }}
                >
                  <span className="text-neon-cyan shrink-0 mt-0.5 text-sm">✦</span>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neon-cyan/80 mb-1.5">
                      Gujarat Relevance
                    </div>
                    <p className="text-sm text-ink-muted leading-relaxed">{article.localNote}</p>
                  </div>
                </div>
              )}

              {/* Editorial score */}
              {article.excitementScore != null && (
                <div className="flex items-center gap-3 mb-5 text-xs font-mono text-ink-dim">
                  <span>Editorial score:</span>
                  <span
                    className="tabular-nums font-semibold"
                    style={{
                      color:
                        article.excitementScore >= 8
                          ? "rgb(var(--neon-pink))"
                          : article.excitementScore >= 6
                          ? "rgb(var(--neon-cyan))"
                          : "rgb(var(--neon-amber))"
                    }}
                  >
                    {article.excitementScore.toFixed(1)} / 10
                  </span>
                  <span className="text-bg-border">·</span>
                  <span>{article.readingTime ?? 1} min read</span>
                </div>
              )}

              {/* Divider */}
              <div className="h-px mb-5" style={{ background: "rgb(var(--bg-border))" }} />

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                {/* Primary: Google search — most reliable bypass */}
                {googleUrl && (
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl font-medium text-sm transition-all"
                    style={{
                      background: "rgb(var(--neon-cyan) / 0.1)",
                      border: "1px solid rgb(var(--neon-cyan) / 0.3)",
                      color: "rgb(var(--neon-cyan))"
                    }}
                  >
                    <span className="text-base">🔍</span>
                    <div className="flex-1 min-w-0">
                      <div>Find on Google</div>
                      <div className="text-[10px] opacity-60 font-normal">Open from Google results to bypass blocks</div>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 opacity-60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {/* Wayback Machine */}
                  {archiveUrl && (
                    <a
                      href={archiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all"
                      style={{
                        background: "rgb(var(--bg-card) / 0.5)",
                        border: "1px solid rgb(var(--bg-border))",
                        color: "rgb(var(--ink-muted))"
                      }}
                    >
                      <span>📦</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-ink">Wayback Machine</div>
                        <div className="text-[10px] text-ink-dim">Archive.org cache</div>
                      </div>
                    </a>
                  )}

                  {/* Try direct */}
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all"
                      style={{
                        background: "rgb(var(--bg-card) / 0.5)",
                        border: "1px solid rgb(var(--bg-border))",
                        color: "rgb(var(--ink-muted))"
                      }}
                    >
                      <span>🔗</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-ink">Try Direct</div>
                        <div className="text-[10px] text-ink-dim">May be blocked</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
