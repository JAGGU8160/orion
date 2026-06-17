"use client";

import { motion } from "framer-motion";
import type { TrendingTopic } from "@/lib/insights";

export default function TrendingTopics({ topics }: { topics: TrendingTopic[] }) {
  if (topics.length === 0) return null;

  const handleClick = (topic: string) => {
    history.replaceState(null, "", `#q=${encodeURIComponent(topic)}`);
    window.dispatchEvent(new CustomEvent("orion:search", { detail: topic }));
    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
  };

  const max = topics[0]?.count || 1;

  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title" style={{ color: "rgb(var(--cat-discoveries))" }}>// Trending Topics</span>
          <span
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgb(var(--cat-discoveries) / 0.4), transparent)" }}
          />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            Auto-detected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {topics.map((t, i) => (
            <motion.button
              key={t.topic}
              onClick={() => handleClick(t.topic)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="card text-left p-4 sm:p-5 group transition-colors hover:border-neon-cyan/40"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
                  #{i + 1}
                </span>
                <span className="text-[10px] font-mono text-neon-cyan tabular-nums">
                  {t.count} mentions
                </span>
              </div>
              <div className="font-display text-lg font-semibold text-ink group-hover:text-neon-cyan transition-colors truncate">
                {t.topic}
              </div>
              <div className="mt-3 h-1 bg-bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(t.count / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))"
                  }}
                />
              </div>
              <div className="mt-3 text-[11px] text-ink-dim flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                Search
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
