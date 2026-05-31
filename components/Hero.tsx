"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero({ issCount }: { issCount: number }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata"
        })
      );
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: false
        }) + " IST"
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="container mx-auto px-5 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-neon-cyan/80 mb-5"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
          <span>ORION INVINCIBLE NGO · GUJARAT</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95] tracking-tight"
        >
          <span className="neon-text">Orion</span>
          <br />
          <span className="text-ink">Space Digest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed"
        >
          Tonight&apos;s sky over Gujarat, NASA&apos;s picture of the day, near-Earth
          asteroids, the crew above us, and the latest from across the cosmos —
          curated every six hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 flex flex-wrap gap-3 items-center"
        >
          <div className="chip">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-violet" />
            {date}
          </div>
          <div className="chip">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
            {time}
          </div>
          {issCount > 0 && (
            <div className="chip chip-active">
              <span aria-hidden>🛰️</span>
              {issCount} humans in space right now
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
