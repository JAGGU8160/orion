"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/insights";

export default function HeroBriefing({
  storyCount,
  lastUpdated
}: {
  storyCount: number;
  lastUpdated: string;
}) {
  const [now, setNow] = useState<{ date: string; dateShort: string; time: string }>({
    date: "",
    dateShort: "",
    time: ""
  });

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow({
        date: d.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata"
        }),
        dateShort: d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata"
        }),
        time:
          d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
            hour12: false
          }) + " IST"
      });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-10 pt-20 pb-8 sm:pt-28 sm:pb-14">
      <div className="container mx-auto px-4 sm:px-5 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] sm:tracking-[0.3em] mb-5 whitespace-nowrap"
          style={{ color: "rgb(var(--neon-cyan))" }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "rgb(var(--neon-cyan))" }}
          />
          <span className="sm:hidden">Briefing · {now.dateShort || "—"}</span>
          <span className="hidden sm:inline">Briefing · {now.date || "—"}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[34px] sm:text-5xl md:text-6xl font-bold leading-[1.02] sm:leading-[0.98] tracking-tight max-w-4xl"
        >
          <span className="text-ink">Your daily window </span>
          <span className="neon-text">into the universe.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-5 max-w-xl text-base text-ink-muted leading-relaxed"
        >
          The sky over Gujarat, the news from orbit, and the universe&apos;s
          biggest stories — curated, scored, and waiting every morning.
        </motion.p>

        <motion.dl
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-2xl"
        >
          <Stat label="Stories analysed" value={String(storyCount)} token="--neon-cyan" />
          <Stat label="Last updated" value={relativeTime(lastUpdated)} token="--neon-violet" />
          <Stat label="Local time" value={now.time || "—"} token="--neon-pink" />
          <Stat label="Sources" value="6 feeds" token="--neon-amber" />
        </motion.dl>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  token
}: {
  label: string;
  value: string;
  token: string;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-0 top-0.5 bottom-0.5 w-px"
        style={{ background: `rgb(var(${token}))` }}
      />
      <div className="pl-3">
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
          {label}
        </div>
        <div className="font-display text-lg sm:text-xl font-semibold text-ink tabular-nums mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}
