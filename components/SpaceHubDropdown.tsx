"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type HubItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  section: string;
  href?: string; // if set → navigate to page, not section scroll
};

const HUB_ITEMS: HubItem[] = [
  { id: "sky",      label: "Sky Tonight",  description: "Visible from Gujarat",       icon: "🌙", section: "top"  },
  { id: "apod",     label: "NASA APOD",    description: "Picture of the day",         icon: "📸", section: "apod" },
  { id: "feed",     label: "Latest News",  description: "Full news feed",             icon: "🗄", section: "feed" },
  { id: "pastnews", label: "Past News",    description: "Historical articles archive", icon: "📰", section: "pastnews", href: "/timeline" },
];

export const HUB_SECTIONS = HUB_ITEMS.map((i) => i.section);
export const HUB_ITEMS_EXPORT = HUB_ITEMS;

export default function SpaceHubDropdown({
  isActive,
  activeSection,
  onSelect
}: {
  isActive: boolean;
  activeSection: string;
  onSelect: (sectionId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleOpen = () => {
    clearTimer();
    if (!open) {
      timerRef.current = window.setTimeout(() => setOpen(true), 80);
    }
  };

  const scheduleClose = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => setOpen(false), 150);
  };

  // outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        onClick={() => {
          clearTimer();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative px-3 py-2 text-[13.5px] font-medium tracking-[0.01em] inline-flex items-center gap-1 transition-colors duration-200"
        style={{
          color: isActive || open ? "rgb(var(--ink))" : "rgb(var(--ink-muted))"
        }}
      >
        <span className="relative z-10">Space Hub</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="w-3 h-3"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>

        {/* hover wash */}
        <span
          aria-hidden
          className="absolute inset-1 rounded-md transition-opacity duration-200 pointer-events-none"
          style={{
            opacity: open && !isActive ? 1 : 0,
            background: "rgb(var(--ink) / 0.04)"
          }}
        />

        {/* shared underline */}
        {isActive && (
          <motion.span
            aria-hidden
            layoutId="nav-underline"
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-2.5 right-6 -bottom-0.5 h-[1.5px] rounded-full"
            style={{
              background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
              boxShadow: "0 0 8px rgb(var(--neon-cyan) / 0.5)"
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Space Hub navigation"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[300px] origin-top z-50"
          >
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: "rgb(var(--bg-card) / 0.96)",
                border: "1px solid rgb(var(--bg-border))",
                backdropFilter: "blur(24px) saturate(140%)",
                WebkitBackdropFilter: "blur(24px) saturate(140%)",
                boxShadow:
                  "0 24px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgb(var(--neon-cyan) / 0.06)"
              }}
            >
              {/* HUD top accent */}
              <div
                aria-hidden
                className="absolute top-0 left-6 right-6 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(var(--neon-cyan) / 0.6), transparent)"
                }}
              />

              <div className="px-4 pt-4 pb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-dim">
                  Explore
                </span>
              </div>

              <div className="p-1.5 pb-2">
                {HUB_ITEMS.map((item, i) => {
                  const itemActive = activeSection === item.section;
                  const sharedStyle = itemActive
                    ? { background: "rgb(var(--neon-cyan) / 0.08)", boxShadow: "inset 0 0 0 1px rgb(var(--neon-cyan) / 0.2)" }
                    : undefined;
                  const sharedClass = "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 group transition-colors";

                  const inner = (
                    <>
                      <span
                        className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-base transition-colors group-hover:bg-bg-border/50"
                        style={itemActive ? { background: "rgb(var(--neon-cyan) / 0.12)" } : { background: "rgb(var(--bg-border) / 0.45)" }}
                        aria-hidden
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <div className={`font-medium text-sm leading-tight ${itemActive ? "text-neon-cyan" : "text-ink"}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5">{item.description}</div>
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-3 h-3 shrink-0 transition-all ${
                          itemActive ? "text-neon-cyan opacity-100" : "text-ink-dim opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                        }`}
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </>
                  );

                  return item.href ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.03, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className={sharedClass}
                        style={sharedStyle}
                      >
                        {inner}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={item.id}
                      role="menuitem"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.03, duration: 0.25 }}
                      onClick={() => { onSelect(item.section); setOpen(false); }}
                      className={sharedClass}
                      style={sharedStyle}
                    >
                      {inner}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
