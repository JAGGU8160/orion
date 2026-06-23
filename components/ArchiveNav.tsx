"use client";

import { useEffect, useRef, useState } from "react";
import OrionMark from "./OrionMark";
import ThemeToggle from "./ThemeToggle";
import { ASTRO_NEWS, ASTRO_CATEGORIES, type AstroCategoryKey } from "@/lib/astro-data";

const MILESTONES = ASTRO_NEWS.filter(e => e.milestone);
const catInfo = (k: AstroCategoryKey) => ASTRO_CATEGORIES[k];

export default function ArchiveNav() {
  const [scrolled, setScrolled] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleSurprise = () => {
    const entry = MILESTONES[Math.floor(Math.random() * MILESTONES.length)];
    window.dispatchEvent(new CustomEvent("orion:archive:surprise", { detail: { entryId: entry.id } }));
  };

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="an-wrap">
      {/* floating glass nav */}
      <nav
        className="an-nav"
        style={{
          background: scrolled
            ? "rgb(var(--bg-card) / 0.88)"
            : "rgb(var(--bg-card) / 0.55)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          border: `1px solid rgb(var(--bg-border))`,
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,.38)" : "none",
          transition: "background .3s, box-shadow .3s",
        }}
      >
        {/* Brand */}
        <a
          href="/"
          className="an-brand"
          style={{ textDecoration: "none" }}
        >
          <div style={{ width: 30, height: 30, color: "rgb(var(--neon-cyan))", flexShrink: 0 }}>
            <OrionMark className="w-full h-full" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.1em",
              background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
              WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            }}>
              PROJECT ORION
            </span>
            <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: ".12em", color: "rgb(var(--ink-dim))", textTransform: "uppercase" }}>
              Archive
            </span>
          </div>
        </a>

        {/* Center links */}
        <ul className="an-links">
          {[
            { label: "Timeline",   id: "an-hero"    },
            { label: "Milestones", id: "an-grid"     },
            { label: "Categories", id: "an-grid"     },
            { label: "About",      id: "an-footer"   },
          ].map(l => (
            <li key={l.label}>
              <button
                onClick={() => scrollToSection(l.id)}
                className="an-link"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right — theme toggle + random */}
        <div className="an-right">
          <ThemeToggle />
          <button onClick={handleSurprise} className="an-surprise">
            <span className="an-surprise-text">Random discovery</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </nav>

      {/* Telemetry ticker */}
      <div className="an-telemetry">
        <span className="an-dot" />
        <span className="an-live-label">Live Sky</span>
        <div className="an-ticker-mask">
          <div className="an-ticker-track" ref={trackRef}>
            {[...MILESTONES.slice(0, 20), ...MILESTONES.slice(0, 20)].map((m, i) => (
              <span key={i} className="an-ticker-item">
                <b style={{ color: "rgb(var(--ink))" }}>{m.year}</b>
                {" "}{m.title.split("—")[0].split(":")[0].trim()}
                <span style={{ color: "rgb(var(--neon-violet))" }}>
                  {" "}{catInfo(m.category).glyph}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
