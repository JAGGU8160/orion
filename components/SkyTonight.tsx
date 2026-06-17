"use client";

import { motion } from "framer-motion";
import type { MoonPhase } from "@/lib/insights";

const PLANET_GLYPH: Record<string, string> = {
  Sun: "☉",
  Moon: "☾",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆"
};

export default function SkyTonight({
  moon,
  observationQuality,
  visiblePlanets,
  viewingTime,
  issCrewCount
}: {
  moon: MoonPhase;
  observationQuality: { score: number; reason: string };
  visiblePlanets: { name: string; altitude: number }[];
  viewingTime: string | null;
  issCrewCount: number;
}) {
  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title" style={{ color: "rgb(var(--cat-sky))" }}>// Sky Tonight</span>
          <span
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgb(var(--cat-sky) / 0.4), transparent)" }}
          />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            22°N · 71°E · Gujarat
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="card card-glow p-6 sm:p-8 grid md:grid-cols-12 gap-6 sm:gap-8"
        >
          {/* MOON */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim mb-3">
              Moon
            </span>
            <MoonViz moon={moon} />
            <div className="mt-3 text-center md:text-left">
              <div className="font-display text-xl font-semibold text-ink leading-tight">
                {moon.name}
              </div>
              <div className="text-sm text-ink-muted mt-1 tabular-nums">
                {moon.illumination}% illuminated · {moon.age}d old
              </div>
            </div>
          </div>

          {/* OBSERVATION QUALITY */}
          <div className="md:col-span-3 md:border-l md:border-bg-border md:pl-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim mb-3 block">
              Observation Quality
            </span>
            <QualityGauge score={observationQuality.score} />
            <div className="text-xs text-ink-muted mt-3 leading-relaxed">
              {observationQuality.reason}
            </div>
          </div>

          {/* VISIBLE PLANETS */}
          <div className="md:col-span-5 md:border-l md:border-bg-border md:pl-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
                Visible Now
              </span>
              {viewingTime && (
                <span className="chip text-[10px] py-0.5 chip-active">
                  ⏱ Best: {viewingTime}
                </span>
              )}
            </div>

            {visiblePlanets.length === 0 ? (
              <div className="text-sm text-ink-muted">
                No planetary data for tonight yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {visiblePlanets.slice(0, 7).map((p, i) => (
                  <motion.li
                    key={p.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="font-mono text-neon-cyan/80 text-base w-5 text-center" aria-hidden>
                      {PLANET_GLYPH[p.name] || "✦"}
                    </span>
                    <span className="text-sm font-medium text-ink min-w-[70px]">
                      {p.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (p.altitude / 90) * 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))"
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-ink-muted tabular-nums w-12 text-right">
                      {p.altitude}°
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}

            {issCrewCount > 0 && (
              <div className="mt-4 pt-4 border-t border-bg-border">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span aria-hidden>🛰</span>
                  <span className="font-medium text-ink">{issCrewCount} humans</span>
                  <span>overhead on the ISS — orbiting at 408 km</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MoonViz({ moon }: { moon: MoonPhase }) {
  const illumPct = moon.illumination / 100;
  const r = 48;
  const shadowOffset = (1 - illumPct) * 2 * r * (moon.waxing ? -1 : 1);

  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36">
      <svg viewBox="-70 -70 140 140" className="w-full h-full">
        <defs>
          {/* Dark "night sky" backdrop — independent of page theme */}
          <radialGradient id="moon-sky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="65%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          {/* Soft outer halo so the medallion blends gently with the card */}
          <radialGradient id="moon-medallion-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--neon-cyan))" stopOpacity="0" />
            <stop offset="80%" stopColor="rgb(var(--neon-cyan))" stopOpacity="0" />
            <stop offset="100%" stopColor="rgb(var(--neon-cyan))" stopOpacity="0.22" />
          </radialGradient>
          {/* Moon surface */}
          <radialGradient id="moon-surface" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fafaf9" />
            <stop offset="55%" stopColor="#d4d4d8" />
            <stop offset="100%" stopColor="#52525b" />
          </radialGradient>
        </defs>

        {/* Halo ring (extends beyond medallion edge) */}
        <circle cx="0" cy="0" r="66" fill="url(#moon-medallion-glow)" />

        {/* Dark medallion / "night sky window" */}
        <circle
          cx="0" cy="0" r="60"
          fill="url(#moon-sky)"
          stroke="rgb(var(--bg-border))"
          strokeWidth="1"
          strokeOpacity="0.7"
        />

        {/* Sprinkled stars inside the medallion */}
        <circle cx="-42" cy="-28" r="0.8" fill="#fff" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="-44" r="0.6" fill="#fff" opacity="0.55" />
        <circle cx="46" cy="22" r="0.7" fill="#fff" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="-48" cy="30" r="0.5" fill="#fff" opacity="0.45" />
        <circle cx="-28" cy="48" r="0.6" fill="#fff" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="3.6s" begin="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="-12" r="0.5" fill="#fff" opacity="0.55" />

        {/* Clip the moon + shadow to the medallion so they never escape */}
        <clipPath id="moon-clip">
          <circle cx="0" cy="0" r="60" />
        </clipPath>

        <g clipPath="url(#moon-clip)">
          {/* Moon body */}
          <circle cx="0" cy="0" r={r} fill="url(#moon-surface)" />
          {/* Terminator shadow */}
          <ellipse
            cx={shadowOffset}
            cy="0"
            rx={r * 0.98}
            ry={r}
            fill="#0a0e1f"
            opacity="0.94"
          />
          {/* Maria — only show on illuminated side */}
          <circle cx="-16" cy="-8" r="5.5" fill="rgba(82, 82, 91, 0.4)" />
          <circle cx="7" cy="12" r="4" fill="rgba(82, 82, 91, 0.32)" />
          <circle cx="20" cy="-18" r="2.6" fill="rgba(82, 82, 91, 0.3)" />
          <circle cx="-22" cy="18" r="2" fill="rgba(82, 82, 91, 0.28)" />
        </g>
      </svg>
    </div>
  );
}

function QualityGauge({ score }: { score: number }) {
  const segments = 10;
  return (
    <div>
      <div className="flex items-end gap-1.5 mb-2">
        <span className="font-display text-4xl font-bold text-ink tabular-nums leading-none">
          {score}
        </span>
        <span className="text-xs font-mono text-ink-dim mb-1">/ 10</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => {
          const filled = i < score;
          return (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="flex-1 h-3 rounded-sm origin-bottom"
              style={{
                background: filled
                  ? `linear-gradient(180deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))`
                  : "rgb(var(--bg-border))"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
