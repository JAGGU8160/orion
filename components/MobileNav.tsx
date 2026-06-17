"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";

export type NavItem = {
  id: string;
  label: string;
  description: string;
  section: string;
  category?: string;
  group?: "main" | "hub";
};

export default function MobileNav({
  items,
  activeId,
  onSelect
}: {
  items: NavItem[];
  activeId: string;
  onSelect: (item: NavItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Split into main and hub
  const mainItems = items.filter((i) => i.group !== "hub");
  const hubItems = items.filter((i) => i.group === "hub");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden relative w-10 h-10 -mr-1 rounded-lg flex items-center justify-center border transition-colors"
        style={{
          borderColor: "rgb(var(--bg-border))",
          background: "rgb(var(--bg-card) / 0.6)"
        }}
      >
        <span className="flex flex-col gap-[5px] items-center justify-center">
          <span className="block w-4 h-[2px] rounded-full bg-neon-cyan" />
          <span className="block w-4 h-[2px] rounded-full bg-neon-violet" />
          <span className="block w-4 h-[2px] rounded-full bg-neon-pink" />
        </span>
      </button>

      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] backdrop-blur-md"
              style={{ background: "rgb(var(--bg) / 0.7)" }}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-sm z-[70] overflow-y-auto"
              style={{
                background: "rgb(var(--bg-deep) / 0.96)",
                borderLeft: "1px solid rgb(var(--bg-border))",
                backdropFilter: "blur(20px)"
              }}
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgb(var(--neon-cyan) / 0.5), transparent)"
                }}
              />

              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-dim">
                  Navigate
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-bg-border hover:border-neon-cyan/40 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav className="px-3 pt-2">
                {mainItems.map((it, i) => (
                  <DrawerItem
                    key={it.id}
                    item={it}
                    active={it.id === activeId}
                    delay={0.06 + i * 0.04}
                    onClick={() => {
                      onSelect(it);
                      setOpen(false);
                    }}
                  />
                ))}

                {hubItems.length > 0 && (
                  <>
                    <div className="px-4 pt-6 pb-2 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-dim">
                        Space Hub
                      </span>
                      <span
                        aria-hidden
                        className="h-px flex-1"
                        style={{ background: "rgb(var(--bg-border))" }}
                      />
                    </div>
                    {hubItems.map((it, i) => (
                      <DrawerItem
                        key={it.id}
                        item={it}
                        active={it.id === activeId}
                        delay={0.06 + (mainItems.length + i) * 0.04}
                        onClick={() => {
                          onSelect(it);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </>
                )}
              </nav>

              <div className="px-6 mt-6">
                <div className="h-px bg-bg-border" />
              </div>

              <div className="px-6 mt-5 mb-8 flex items-center gap-3">
                <span className="text-xs text-ink-muted">Theme</span>
                <ThemeToggle />
              </div>

              <div className="px-6 pb-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
                  Orion Invincible NGO · Gujarat
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}

function DrawerItem({
  item,
  active,
  delay,
  onClick
}: {
  item: NavItem;
  active: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 rounded-xl flex items-center justify-between group transition-colors"
      style={{
        background: active ? "rgb(var(--neon-cyan) / 0.08)" : "transparent",
        border: active
          ? "1px solid rgb(var(--neon-cyan) / 0.3)"
          : "1px solid transparent"
      }}
    >
      <div className="min-w-0">
        <div
          className={`font-display text-lg font-semibold leading-tight ${
            active ? "text-neon-cyan" : "text-ink group-hover:text-neon-cyan transition-colors"
          }`}
        >
          {item.label}
        </div>
        <div className="text-xs text-ink-muted mt-0.5">{item.description}</div>
      </div>
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 shrink-0 ml-3 transition-transform ${
          active
            ? "text-neon-cyan"
            : "text-ink-dim group-hover:text-neon-cyan group-hover:translate-x-0.5"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </motion.button>
  );
}
