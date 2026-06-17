"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import type { MoonPhase, SpacePulse } from "@/lib/insights";
import { relativeTime } from "@/lib/insights";

const PLANET_GLYPH: Record<string, string> = {
  Sun: "☉", Moon: "☾", Mercury: "☿", Venus: "♀",
  Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆"
};

export default function HeroSection({
  storyCount,
  lastUpdated,
  pulse,
  moon,
  observationQuality,
  visiblePlanets,
  viewingTime,
  issCrewCount,
  apod,
}: {
  storyCount: number;
  lastUpdated: string;
  pulse: SpacePulse;
  moon: MoonPhase;
  observationQuality: { score: number; reason: string };
  visiblePlanets: { name: string; altitude: number }[];
  viewingTime: string | null;
  issCrewCount: number;
  apod: Article | null;
}) {
  const [now, setNow] = useState({ date: "", dateShort: "", time: "" });

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow({
        date: d.toLocaleDateString("en-IN", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
          timeZone: "Asia/Kolkata"
        }),
        dateShort: d.toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
          timeZone: "Asia/Kolkata"
        }),
        time: d.toLocaleTimeString("en-IN", {
          hour: "2-digit", minute: "2-digit",
          timeZone: "Asia/Kolkata", hour12: false
        }) + " IST"
      });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-10 pt-20 pb-10 sm:pt-28 sm:pb-16">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 lg:items-stretch">

          {/* ── LEFT: Brand + Editorial ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Briefing eyebrow */}
            <div
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] mb-5 whitespace-nowrap"
              style={{ color: "rgb(var(--neon-cyan))" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "rgb(var(--neon-cyan))" }}
              />
              <span className="sm:hidden">Briefing · {now.dateShort || "—"}</span>
              <span className="hidden sm:inline">Briefing · {now.date || "—"}</span>
            </div>

            <h1 className="font-display text-[34px] sm:text-5xl md:text-[56px] font-bold leading-[1.02] tracking-tight">
              <span className="text-ink">Your daily window </span>
              <span className="neon-text">into the universe.</span>
            </h1>

            <p className="mt-4 sm:mt-5 max-w-lg text-base text-ink-muted leading-relaxed">
              Space news, NASA APOD, and tonight&apos;s Gujarat sky — curated,
              scored, and waiting every morning.
            </p>

            {/* Stats grid */}
            <dl className="mt-7 grid grid-cols-2 gap-3 max-w-sm">
              <Stat label="Stories today" value={String(storyCount)} token="--neon-cyan" />
              <Stat label="Last updated" value={relativeTime(lastUpdated)} token="--neon-violet" />
              <Stat label="Local time" value={now.time || "—"} token="--neon-pink" />
              <Stat label="Space Pulse" value={`${pulse.score.toFixed(1)} / 10`} token="--neon-amber" />
            </dl>

            {/* CTA */}
            <div className="mt-7 flex items-center gap-3 flex-wrap">
              <motion.a
                href="#stories"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer"
                style={{
                  background: "rgb(var(--neon-cyan) / 0.12)",
                  border: "1px solid rgb(var(--neon-cyan) / 0.3)",
                  color: "rgb(var(--neon-cyan))",
                  boxShadow: "0 0 20px rgb(var(--neon-cyan) / 0.08)"
                }}
              >
                Explore Today&apos;s News
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </motion.a>
            </div>

            {/* Pulse activity indicator — below fold on mobile, fills height on desktop */}
            <div className="mt-auto pt-8 hidden lg:flex items-center gap-3">
              <PulseActivityBar score={pulse.score} storyCount={storyCount} />
            </div>
          </motion.div>

          {/* ── RIGHT: APOD image + compact Sky Tonight ────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* APOD image card */}
            {apod?.imageUrl ? (
              <div
                className="card card-glow overflow-hidden relative group"
                style={{ aspectRatio: "4/3" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apod.imageUrl}
                  alt={apod.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
                {/* gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(2,6,23,0.90) 0%, rgba(2,6,23,0.35) 45%, transparent 75%)"
                  }}
                />
                {/* top label */}
                <div className="absolute top-4 left-4">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(2,6,23,0.65)",
                      backdropFilter: "blur(8px)",
                      color: "rgb(var(--cat-apod))",
                      border: "1px solid rgb(var(--cat-apod) / 0.3)"
                    }}
                  >
                    // NASA · Picture of the Day
                  </span>
                </div>
                {/* bottom title */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-display text-base sm:text-lg font-semibold text-white leading-snug line-clamp-2">
                    {apod.title.replace(/^NASA Picture of the Day:\s*/i, "")}
                  </p>
                  {apod.date && (
                    <p className="text-[11px] font-mono text-white/55 mt-1 uppercase tracking-[0.15em]">
                      {apod.date}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Fallback placeholder when no APOD */
              <div
                className="card card-glow flex items-center justify-center"
                style={{ aspectRatio: "4/3" }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🌌</div>
                  <p className="text-xs font-mono text-ink-dim uppercase tracking-widest">APOD loading…</p>
                </div>
              </div>
            )}

            {/* Compact Sky Tonight strip */}
            <div className="card p-4" id="sky">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.25em]"
                  style={{ color: "rgb(var(--cat-sky))" }}
                >
                  // Sky Tonight
                </span>
                <span className="text-[10px] font-mono text-ink-dim">
                  22°N · 71°E · Gujarat
                </span>
              </div>
              <div className="flex items-center gap-4">
                <CompactMoonViz moon={moon} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base font-semibold text-ink leading-tight">
                    {moon.name}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5 tabular-nums">
                    {moon.illumination}% illuminated · {moon.age}d old
                  </div>
                  <div className="mt-2">
                    <MiniQuality score={observationQuality.score} />
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 text-right">
                  {visiblePlanets.slice(0, 3).map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <span className="font-mono" style={{ color: "rgb(var(--neon-cyan) / 0.7)" }}>
                        {PLANET_GLYPH[p.name] || "✦"}
                      </span>
                      <span>{p.name}</span>
                      <span className="font-mono text-ink-dim tabular-nums">{p.altitude}°</span>
                    </div>
                  ))}
                  {viewingTime && (
                    <span className="chip chip-active text-[10px]">⏱ {viewingTime}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* ─── Stat pill ─────────────────────────────────────────── */
function Stat({ label, value, token }: { label: string; value: string; token: string }) {
  return (
    <div className="relative">
      <div
        className="absolute left-0 top-0.5 bottom-0.5 w-px"
        style={{ background: `rgb(var(${token}))` }}
      />
      <div className="pl-3">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">{label}</div>
        <div className="font-display text-lg sm:text-xl font-semibold text-ink tabular-nums mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ─── Compact moon visualisation ─────────────────────────── */
function CompactMoonViz({ moon }: { moon: MoonPhase }) {
  const illumPct = moon.illumination / 100;
  const r = 30;
  const shadowOffset = (1 - illumPct) * 2 * r * (moon.waxing ? -1 : 1);

  return (
    <div className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] shrink-0">
      <svg viewBox="-40 -40 80 80" className="w-full h-full">
        <defs>
          <radialGradient id="cmoon-sky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="65%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id="cmoon-surface" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fafaf9" />
            <stop offset="55%" stopColor="#d4d4d8" />
            <stop offset="100%" stopColor="#52525b" />
          </radialGradient>
        </defs>
        {/* Medallion */}
        <circle cx="0" cy="0" r="36"
          fill="url(#cmoon-sky)"
          stroke="rgb(var(--bg-border))"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        {/* Stars */}
        <circle cx="-24" cy="-16" r="0.7" fill="#fff" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="22" cy="-26" r="0.5" fill="#fff" opacity="0.55" />
        <circle cx="28" cy="12" r="0.6" fill="#fff" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="-26" cy="18" r="0.4" fill="#fff" opacity="0.45" />
        {/* Clip */}
        <clipPath id="cmoon-clip">
          <circle cx="0" cy="0" r="36" />
        </clipPath>
        <g clipPath="url(#cmoon-clip)">
          <circle cx="0" cy="0" r={r} fill="url(#cmoon-surface)" />
          <ellipse cx={shadowOffset} cy="0" rx={r * 0.98} ry={r} fill="#0a0e1f" opacity="0.94" />
          <circle cx="-9" cy="-5" r="3.2" fill="rgba(82,82,91,0.4)" />
          <circle cx="5" cy="7" r="2.2" fill="rgba(82,82,91,0.32)" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Mini observation-quality bar ───────────────────────── */
function MiniQuality({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-2xl font-bold text-ink tabular-nums leading-none">
        {score}
      </span>
      <span className="text-[10px] font-mono text-ink-dim">/10</span>
      <div className="flex-1 h-1.5 bg-bg-border rounded-full overflow-hidden ml-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))"
          }}
        />
      </div>
    </div>
  );
}

/* ─── Desktop pulse activity bar (bottom of left col) ────── */
function PulseActivityBar({ score, storyCount }: { score: number; storyCount: number }) {
  const label =
    score >= 8 ? "Surging" : score >= 6 ? "Active" : score >= 4 ? "Steady" : "Quiet";
  const color =
    score >= 8 ? "rgb(var(--neon-cyan))"
    : score >= 6 ? "rgb(var(--neon-violet))"
    : score >= 4 ? "rgb(var(--neon-amber))"
    : "rgb(var(--ink-muted))";
  const segments = 10;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-[10px] font-mono uppercase tracking-[0.2em]">
        <span className="text-ink-dim">Space Pulse</span>
        <span style={{ color }}>● {label} · {storyCount} stories</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.04 }}
            className="flex-1 h-1.5 rounded-full origin-bottom"
            style={{
              background: i < score
                ? `linear-gradient(180deg, ${color}, ${color}99)`
                : "rgb(var(--bg-border))"
            }}
          />
        ))}
      </div>
    </div>
  );
}
