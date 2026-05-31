"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

function extractLunar(text: string): number | null {
  const m = text.match(/(\d+(?:\.\d+)?)\s*lunar/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

export default function AsteroidCard({ asteroids }: { asteroids: Article[] }) {
  if (!asteroids || asteroids.length === 0) return null;
  const closest = [...asteroids].sort((a, b) => {
    const la = extractLunar(a.aiSummary + " " + a.title) ?? 999;
    const lb = extractLunar(b.aiSummary + " " + b.title) ?? 999;
    return la - lb;
  })[0];
  const lunar = extractLunar(closest.aiSummary + " " + closest.title);

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// Asteroid Watch</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-amber/40 to-transparent" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="card p-7 sm:p-9 grid md:grid-cols-2 gap-8 items-center"
        >
          <div className="relative h-64 sm:h-80 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-[0_0_60px_rgba(96,165,250,0.4)]" />
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="-150 -150 300 300" aria-hidden>
              <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(251,191,36,0.18)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="0" cy="0" r="80" fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="1" />
            </svg>

            <motion.div
              className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <div className="w-3 h-3 rounded-full bg-neon-amber shadow-[0_0_18px_rgba(251,191,36,0.7)]"
                   style={{ transform: "translateX(120px)" }} />
            </motion.div>
          </div>

          <div>
            <span className="chip mb-4 w-fit">☄️ Near-Earth Object</span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-ink">
              {closest.title}
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">{closest.aiSummary}</p>

            {lunar !== null && (
              <div className="mt-5 inline-flex items-baseline gap-2 px-4 py-2 rounded-lg bg-neon-amber/10 border border-neon-amber/30">
                <span className="font-mono text-2xl text-neon-amber">{lunar.toFixed(1)}</span>
                <span className="text-xs text-neon-amber/80 uppercase tracking-wider">lunar distances</span>
              </div>
            )}

            {closest.localNote && (
              <div className="mt-4 text-xs text-neon-cyan/80 leading-relaxed">
                ✦ {closest.localNote}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
