"use client";

import { motion } from "framer-motion";
import type { Article } from "@/lib/types";
import { relativeTime } from "@/lib/insights";

const PROVIDERS = [
  "SpaceX",
  "NASA",
  "ULA",
  "Blue Origin",
  "Rocket Lab",
  "Arianespace",
  "Roscosmos",
  "ISRO",
  "CASC",
  "JAXA"
];

const LOCATION_PATTERNS = [
  { rx: /Cape Canaveral/i, label: "Cape Canaveral, FL" },
  { rx: /Vandenberg/i, label: "Vandenberg SFB, CA" },
  { rx: /Kennedy(?:\s+Space\s+Center)?/i, label: "Kennedy Space Center, FL" },
  { rx: /Boca\s+Chica|Starbase/i, label: "Starbase, TX" },
  { rx: /Wallops/i, label: "Wallops, VA" },
  { rx: /Kourou|French\s+Guiana/i, label: "Kourou, French Guiana" },
  { rx: /Baikonur/i, label: "Baikonur, Kazakhstan" },
  { rx: /Sriharikota|Satish\s+Dhawan/i, label: "Sriharikota, India" },
  { rx: /Wenchang|Jiuquan|Xichang/i, label: "China launch facility" },
  { rx: /Mahia/i, label: "Mahia, New Zealand" }
];

function findProvider(text: string): string | null {
  for (const p of PROVIDERS) {
    if (new RegExp(`\\b${p}\\b`, "i").test(text)) return p;
  }
  return null;
}

function findLocation(text: string): string | null {
  for (const l of LOCATION_PATTERNS) {
    if (l.rx.test(text)) return l.label;
  }
  return null;
}

export default function LaunchTimeline({ launches }: { launches: Article[] }) {
  if (launches.length === 0) return null;
  const items = launches.slice(0, 6);

  return (
    <section className="relative z-10 py-10 md:py-14">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="section-title" style={{ color: "rgb(var(--cat-launch))" }}>// Launch Briefing</span>
          <span
            className="h-px flex-1"
            style={{ background: "linear-gradient(90deg, rgb(var(--cat-launch) / 0.4), transparent)" }}
          />
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            Most recent missions
          </span>
        </div>

        <ol className="relative pl-5 sm:pl-7">
          {/* vertical line */}
          <span
            aria-hidden
            className="absolute left-[7px] sm:left-[9px] top-1 bottom-1 w-px"
            style={{
              background:
                "linear-gradient(180deg, rgb(var(--cat-launch) / 0.7), rgb(var(--cat-launch) / 0.35), transparent)"
            }}
          />

          {items.map((l, i) => {
            const text = l.title + " " + l.aiSummary;
            const provider = findProvider(text);
            const location = findLocation(text);
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative pb-8 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute -left-[14px] sm:-left-[18px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-bg-deep"
                  style={{ background: "rgb(var(--cat-launch))" }}
                />

                <a
                  href={l.url || "#"}
                  target={l.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block card p-4 sm:p-5 group transition-colors"
                  style={{ borderColor: "rgb(var(--bg-border))" }}
                >
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span
                      className="text-[10px] font-mono uppercase tracking-[0.18em]"
                      style={{ color: "rgb(var(--cat-launch))" }}
                    >
                      Mission · {relativeTime(l.publishedAt || l.timestamp)}
                    </span>
                    {provider && (
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-dim">
                        · {provider}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-semibold leading-snug text-ink group-hover:text-neon-cyan transition-colors">
                    {l.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed line-clamp-2">
                    {l.aiSummary}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-ink-dim flex-wrap">
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden>📍</span>
                        {location}
                      </span>
                    )}
                    {l.source && (
                      <span className="uppercase tracking-[0.15em]">
                        via {l.source}
                      </span>
                    )}
                  </div>
                </a>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
