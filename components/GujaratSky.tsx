"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

export default function GujaratSky({ items }: { items: Article[] }) {
  if (!items || items.length === 0) return null;
  const featured = items[0];
  const more = items.slice(1, 3);

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// Featured</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="card card-glow p-7 sm:p-10 overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-neon-cyan/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-neon-violet/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="chip chip-active">🌙 Gujarat Sky Tonight</span>
              <span className="chip">22°N · 71°E</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-semibold leading-tight text-ink">
              {featured.title}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-3xl">
              {featured.aiSummary}
            </p>

            {featured.localNote && (
              <div className="mt-5 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                <div className="text-xs font-mono uppercase tracking-widest text-neon-cyan mb-1.5">
                  Observation Notes
                </div>
                <p className="text-sm text-ink leading-relaxed">{featured.localNote}</p>
              </div>
            )}

            {more.length > 0 && (
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {more.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="p-4 rounded-xl bg-bg/40 border border-bg-border"
                  >
                    <div className="text-sm text-ink-muted line-clamp-3">
                      {m.aiSummary || m.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
