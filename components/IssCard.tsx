"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";

function extractCrewNames(text: string): string[] {
  const m = text.match(/ISS crew \(\d+\):\s*([^.]+)/i);
  if (m) {
    return m[1].split(/[,]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export default function IssCard({ iss }: { iss: Article | null }) {
  if (!iss) return null;
  const crew = extractCrewNames(iss.aiSummary || iss.title);

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// In Space Right Now</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-pink/40 to-transparent" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="card p-7 sm:p-9 overflow-hidden relative"
        >
          <motion.div
            className="absolute -top-10 right-10 text-6xl opacity-20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            🛰️
          </motion.div>

          <span className="chip mb-4 w-fit">👨‍🚀 ISS Crew</span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-ink">
            {iss.title}
          </h2>
          <p className="mt-4 text-ink-muted leading-relaxed max-w-3xl">{iss.aiSummary}</p>

          {crew.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {crew.map((name, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="chip"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                  {name}
                </motion.span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-ink-dim">
            <span>ALT 408 km</span>
            <span className="w-1 h-1 rounded-full bg-ink-dim" />
            <span>ORBITAL PERIOD ~90 min</span>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
