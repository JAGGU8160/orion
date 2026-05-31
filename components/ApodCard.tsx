"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Article } from "@/lib/types";

export default function ApodCard({ apod }: { apod: Article | null }) {
  const [imgError, setImgError] = useState(false);
  if (!apod) return null;
  const cleanTitle = apod.title.replace(/^NASA Picture of the Day:\s*/i, "");

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// NASA Picture of the Day</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-violet/40 to-transparent" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="card overflow-hidden group"
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-3 relative aspect-video md:aspect-auto md:min-h-[420px] overflow-hidden bg-bg-deep">
              {apod.imageUrl && !imgError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={apod.imageUrl}
                  alt={cleanTitle}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink-dim">
                  <span className="text-6xl">🔭</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent md:bg-gradient-to-l md:from-bg-card/70" />
            </div>

            <div className="md:col-span-2 p-7 sm:p-9 flex flex-col justify-center">
              <span className="chip mb-4 w-fit">🔭 NASA APOD</span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-ink">
                {cleanTitle}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                {apod.aiSummary}
              </p>
              {apod.localNote && (
                <div className="mt-4 text-xs text-neon-cyan/80 leading-relaxed">
                  ✦ {apod.localNote}
                </div>
              )}
              {apod.url && (
                <a
                  href={apod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-neon-violet transition-colors w-fit"
                >
                  View full resolution →
                </a>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
