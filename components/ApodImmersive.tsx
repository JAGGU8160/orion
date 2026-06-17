"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Article } from "@/lib/types";
import ImageLightbox from "./ImageLightbox";

export default function ApodImmersive({ apod }: { apod: Article | null }) {
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth === 0) setImgError(true);
  };
  if (!apod) return null;
  const cleanTitle = apod.title.replace(/^NASA Picture of the Day:\s*/i, "");
  const fullRes = apod.url || apod.imageUrl;

  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title" style={{ color: "rgb(var(--cat-apod))" }}>// NASA Picture of the Day</span>
          <span
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgb(var(--cat-apod) / 0.4), transparent)" }}
          />
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="card overflow-hidden group"
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-bg-deep">
            {apod.imageUrl && !imgError ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apod.imageUrl}
                  alt={cleanTitle}
                  onError={() => setImgError(true)}
                  onLoad={onImgLoad}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(2, 6, 23, 0.85) 0%, rgba(2, 6, 23, 0.45) 35%, transparent 70%)"
                  }}
                />
                {/* zoom + download actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-colors"
                    style={{
                      background: "rgb(0 0 0 / 0.45)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "white"
                    }}
                    aria-label="Expand image"
                    title="Expand"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>
                  {fullRes && (
                    <a
                      href={fullRes}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-colors"
                      style={{
                        background: "rgb(0 0 0 / 0.45)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        color: "white"
                      }}
                      aria-label="Download full-resolution"
                      title="Full resolution"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v14M5 12l7 7 7-7M5 21h14" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* overlay title */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <span className="chip mb-3 w-fit" style={{ background: "rgb(0 0 0 / 0.4)" }}>
                    🔭 NASA APOD
                  </span>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold leading-[1.05] text-white max-w-3xl drop-shadow-lg">
                    {cleanTitle}
                  </h2>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🔭</div>
            )}
          </div>

          <figcaption className="p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-start">
            <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
              {apod.aiSummary}
            </p>
            <div className="text-xs font-mono text-ink-dim md:text-right space-y-1">
              {apod.publishedAt && (
                <div>
                  <span className="text-ink-dim">DATE · </span>
                  <span className="text-ink">{apod.publishedAt.slice(0, 10)}</span>
                </div>
              )}
              {apod.localNote && (
                <div className="max-w-xs text-neon-cyan/90 leading-relaxed normal-case tracking-normal font-sans text-xs">
                  ✦ {apod.localNote}
                </div>
              )}
            </div>
          </figcaption>
        </motion.figure>

        {apod.imageUrl && (
          <ImageLightbox src={apod.imageUrl} alt={cleanTitle} open={open} onClose={() => setOpen(false)} />
        )}
      </div>
    </section>
  );
}
