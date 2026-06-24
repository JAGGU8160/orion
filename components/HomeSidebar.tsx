"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SCROLL_ITEMS = [
  {
    id: "home",
    label: "Home",
    section: "top",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "stories",
    label: "Top Stories",
    section: "stories",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    id: "feed",
    label: "Latest News",
    section: "feed",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a9 9 0 019 9"/>
        <path d="M4 4a16 16 0 0116 16"/>
        <circle cx="5" cy="19" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];


const ARCHIVE_ICON = (
  <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

export default function HomeSidebar() {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const ids = ["stories", "feed"];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topEntry = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
          setActiveSection(topEntry.target.id);
        } else if (window.scrollY < 200) {
          setActiveSection("top");
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (section: string) => {
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeId = (() => {
    if (activeSection === "stories") return "stories";
    if (activeSection === "feed") return "feed";
    return "home";
  })();

  return (
    <>
      {/* ─── Desktop sidebar ────────────────────────────────────── */}
      <aside
        className="hidden lg:flex fixed left-0 top-[68px] flex-col z-40"
        style={{
          width: 200,
          height: "calc(100vh - 68px)",
          background: "rgb(var(--bg) / 0.55)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          borderRight: "1px solid rgb(var(--bg-border))",
        }}
      >
        {/* top scanline */}
        <div
          aria-hidden
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgb(var(--neon-cyan) / 0.3), transparent)",
          }}
        />

        <nav className="flex flex-col gap-0.5 px-3 pt-5 pb-4 overflow-y-auto flex-1">
          {SCROLL_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.section)}
                className="relative w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group overflow-hidden"
                style={{
                  background: isActive ? "rgb(var(--neon-cyan) / 0.08)" : "transparent",
                  color: isActive ? "rgb(var(--neon-cyan))" : "rgb(var(--ink-muted))",
                }}
              >
                {/* active left bar — CSS transition only */}
                <span
                  aria-hidden
                  className="absolute left-0 top-2 bottom-2 rounded-full transition-all duration-200"
                  style={{
                    width: isActive ? 3 : 0,
                    background: "rgb(var(--neon-cyan))",
                    opacity: isActive ? 1 : 0,
                  }}
                />
                <span className="shrink-0">{item.icon}</span>
                <span className="text-[13px] font-medium leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}

        </nav>

        {/* bottom label */}
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid rgb(var(--bg-border))" }}
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim leading-tight">
            Orion Space Digest
          </div>
          <div className="text-[10px] text-ink-dim mt-0.5 opacity-50">
            Gujarat · Daily
          </div>
        </div>
      </aside>

      {/* ─── Mobile bottom pill ─────────────────────────────────── */}
      <nav
        aria-label="Section navigation"
        className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 px-2 py-1.5 rounded-full"
        style={{
          background: "rgb(var(--bg-card) / 0.94)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgb(var(--bg-border))",
          boxShadow: "0 8px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {SCROLL_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.section)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex items-center justify-center w-12 h-10 rounded-full transition-all duration-200"
              style={{
                background: isActive ? "rgb(var(--neon-cyan) / 0.12)" : "transparent",
                color: isActive ? "rgb(var(--neon-cyan))" : "rgb(var(--ink-muted))",
                boxShadow: isActive ? "inset 0 0 0 1px rgb(var(--neon-cyan) / 0.25)" : "none",
              }}
            >
              {item.icon}
            </button>
          );
        })}

        {/* divider */}
        <span
          aria-hidden
          className="w-px h-5 mx-1"
          style={{ background: "rgb(var(--bg-border))" }}
        />

        {/* Archive link */}
        <Link
          href="/timeline"
          aria-label="Star Log"
          className="relative flex items-center justify-center w-12 h-10 rounded-full transition-colors duration-150"
          style={{ color: "rgb(var(--ink-muted))" }}
        >
          {ARCHIVE_ICON}
        </Link>
      </nav>
    </>
  );
}
