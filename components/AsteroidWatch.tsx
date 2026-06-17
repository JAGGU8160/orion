"use client";

import { motion } from "framer-motion";
import type { AsteroidInsight } from "@/lib/insights";

const RISK_COLORS: Record<string, string> = {
  Low: "rgb(var(--cat-asteroid))",
  Moderate: "rgb(var(--neon-amber))",
  High: "rgb(var(--neon-pink))"
};

export default function AsteroidWatch({
  asteroids
}: {
  asteroids: AsteroidInsight[];
}) {
  if (asteroids.length === 0) return null;
  // Sort by closeness — lowest lunar distance first
  const sorted = [...asteroids].sort((a, b) => {
    const la = a.lunarDistance ?? 999;
    const lb = b.lunarDistance ?? 999;
    return la - lb;
  });

  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title" style={{ color: "rgb(var(--cat-asteroid))" }}>// Asteroid Watch</span>
          <span
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgb(var(--cat-asteroid) / 0.4), transparent)" }}
          />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            Closest approaches
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.slice(0, 6).map((a, i) => (
            <AsteroidCard key={i} insight={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AsteroidCard({
  insight,
  index
}: {
  insight: AsteroidInsight;
  index: number;
}) {
  const ld = insight.lunarDistance;
  const distancePct = ld !== null ? Math.min(100, (ld / 40) * 100) : 50;
  const color = RISK_COLORS[insight.riskLevel];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mb-1">
            {insight.approachDate || "Recently"}
          </div>
          <div className="font-display text-lg font-semibold text-ink truncate">
            {insight.name}
          </div>
        </div>
        <span
          className="chip text-[10px] py-0.5 shrink-0"
          style={{
            color,
            borderColor: color,
            background: "transparent"
          }}
        >
          {insight.riskLevel}
        </span>
      </div>

      {ld !== null && (
        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-dim">
              Lunar distances
            </span>
            <span className="font-display font-semibold text-ink tabular-nums">
              {ld.toFixed(1)}×
            </span>
          </div>
          <div className="relative h-1.5 bg-bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${distancePct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 + index * 0.05 }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: color }}
            />
            {/* earth marker */}
            <span
              className="absolute top-1/2 left-0 w-2 h-2 -mt-1 -ml-1 rounded-full"
              style={{ background: "rgb(var(--neon-cyan))" }}
            />
          </div>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-ink-dim font-mono uppercase tracking-[0.15em] text-[10px]">Size</dt>
          <dd className="text-ink tabular-nums font-medium mt-0.5">
            {insight.sizeMeters !== null ? `~${insight.sizeMeters} m` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-dim font-mono uppercase tracking-[0.15em] text-[10px]">Visible</dt>
          <dd className="text-ink font-medium mt-0.5">
            {insight.hazardous ? "Telescope only" : "—"}
          </dd>
        </div>
      </dl>

      {insight.rawArticle.localNote && (
        <div className="mt-4 pt-3 border-t border-bg-border text-[11px] text-neon-cyan/85 leading-relaxed line-clamp-3">
          ✦ {insight.rawArticle.localNote}
        </div>
      )}
    </motion.article>
  );
}
