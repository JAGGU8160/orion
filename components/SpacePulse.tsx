"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { SpacePulse } from "@/lib/insights";

function tone(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 8) return { label: "Surging", color: "rgb(var(--neon-cyan))", description: "Very active day in space" };
  if (score >= 6) return { label: "Active", color: "rgb(var(--neon-violet))", description: "Plenty happening across the cosmos" };
  if (score >= 4) return { label: "Steady", color: "rgb(var(--neon-amber))", description: "A regular day in orbit" };
  return { label: "Quiet", color: "rgb(var(--ink-muted))", description: "Calm skies — perfect for observing" };
}

export default function SpacePulseSection({ pulse }: { pulse: SpacePulse }) {
  const animated = useMotionValue(0);
  const display = useTransform(animated, (v) => v.toFixed(1));
  const [t, setT] = useState(tone(pulse.score));

  useEffect(() => {
    setT(tone(pulse.score));
    const controls = animate(animated, pulse.score, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1]
    });
    return controls.stop;
  }, [pulse.score, animated]);

  const pct = Math.max(0, Math.min(1, pulse.score / 10));
  const dash = 2 * Math.PI * 64;

  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">// Space Pulse</span>
          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            Updated {pulse.windowHours}h window
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card relative overflow-hidden p-7 sm:p-10"
        >
          {/* aurora wash */}
          <div
            aria-hidden
            className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--neon-cyan) / 0.18), transparent 70%)"
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 w-[22rem] h-[22rem] rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--neon-violet) / 0.16), transparent 70%)"
            }}
          />

          <div className="relative grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
            {/* GAUGE */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto md:mx-0">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(var(--neon-cyan))" />
                    <stop offset="50%" stopColor="rgb(var(--neon-violet))" />
                    <stop offset="100%" stopColor="rgb(var(--neon-pink))" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80" cy="80" r="64"
                  fill="none"
                  stroke="rgb(var(--bg-border))"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="80" cy="80" r="64"
                  fill="none"
                  stroke="url(#pulse-grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={dash}
                  initial={{ strokeDashoffset: dash }}
                  whileInView={{ strokeDashoffset: dash * (1 - pct) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="font-display text-5xl sm:text-6xl font-bold leading-none tabular-nums neon-text">
                  {display}
                </motion.span>
                <span className="text-xs font-mono text-ink-dim mt-1">/ 10</span>
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="chip text-[10px] py-0.5"
                  style={{
                    color: t.color,
                    borderColor: t.color,
                    background: "transparent"
                  }}
                >
                  ● {t.label}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
                  {pulse.storyCount} stories
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-ink">
                Today the cosmos is{" "}
                <span style={{ color: t.color }}>{t.label.toLowerCase()}.</span>
              </h2>
              <p className="text-ink-muted mt-2 text-sm sm:text-base leading-relaxed max-w-xl">
                {t.description}. Pulse score is computed from the volume and
                weight of space news, launches, and observable events in the
                last {pulse.windowHours} hours.
              </p>

              {/* Contributors */}
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {pulse.contributors.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-2.5 text-sm text-ink"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgb(var(--neon-cyan) / 0.15)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-neon-cyan" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </span>
                    <span aria-hidden>{c.icon}</span>
                    {c.label}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
