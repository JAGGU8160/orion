"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [count, setCount] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const m = hash.match(/#q=([^&]+)/);
    if (m) {
      const initial = decodeURIComponent(m[1]);
      setValue(initial);
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setValue("");
        publish("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onResults = (e: Event) => {
      const ev = e as CustomEvent<{ count: number; query: string }>;
      setCount(ev.detail.count);
      setCurrentIdx(0);
      requestAnimationFrame(() => {
        clearMatchHighlight();
        if (ev.detail.count > 0 && ev.detail.query) applyMatchHighlight(0);
      });
    };
    window.addEventListener("orion:search-results", onResults);
    return () => window.removeEventListener("orion:search-results", onResults);
  }, []);

  const publish = (q: string) => {
    if (q) {
      history.replaceState(null, "", `#q=${encodeURIComponent(q)}`);
    } else {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.dispatchEvent(new CustomEvent("orion:search", { detail: q }));
  };

  const onChange = (v: string) => {
    setValue(v);
    publish(v);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && count > 0) {
      focusMatch(currentIdx);
    }
  };

  const clearMatchHighlight = () => {
    document
      .querySelectorAll<HTMLElement>("[data-match-id].match-current")
      .forEach((el) => el.classList.remove("match-current"));
  };

  const applyMatchHighlight = (idx: number) => {
    const el = document.querySelector<HTMLElement>(`[data-match-id="${idx}"]`);
    if (!el) return;
    el.classList.add("match-current");
  };

  const focusMatch = (idx: number) => {
    const el = document.querySelector<HTMLElement>(`[data-match-id="${idx}"]`);
    if (!el) return;
    clearMatchHighlight();
    el.classList.add("match-current");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const step = (dir: 1 | -1) => {
    if (count === 0) return;
    const next = (currentIdx + dir + count) % count;
    setCurrentIdx(next);
    focusMatch(next);
  };

  const hasMatches = value.trim().length > 0 && count > 0;

  return (
    <div className="relative flex items-center gap-1.5">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.form
            key="input"
            initial={{ width: 36, opacity: 0 }}
            animate={{ width: hasMatches ? 320 : 240, opacity: 1 }}
            exit={{ width: 36, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={onSubmit}
            className="relative overflow-hidden"
          >
            <input
              ref={inputRef}
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => {
                if (!value) setOpen(false);
              }}
              placeholder="Search the cosmos…"
              className="w-full h-9 pl-9 pr-9 rounded-full text-sm bg-bg-card/70 border border-bg-border focus:border-neon-cyan/60 focus:outline-none focus:ring-2 focus:ring-neon-cyan/30 transition-all placeholder:text-ink-dim"
              style={{ paddingRight: hasMatches ? 110 : 36 }}
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>

            <AnimatePresence>
              {hasMatches && (
                <motion.div
                  key="nav"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center gap-1"
                >
                  <span className="text-[10px] font-mono tracking-wide text-neon-cyan/90 tabular-nums px-1">
                    {currentIdx + 1}<span className="text-ink-dim">/</span>{count}
                  </span>
                  <ArrowButton dir="prev" onClick={() => step(-1)} />
                  <ArrowButton dir="next" onClick={() => step(1)} />
                </motion.div>
              )}
            </AnimatePresence>

            {value && !hasMatches && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-ink-dim hover:text-ink hover:bg-bg-border/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
            {value && hasMatches && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-ink-dim hover:text-ink hover:bg-bg-border/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </motion.form>
        ) : (
          <motion.button
            key="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            aria-label="Open search"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-bg-border hover:border-neon-cyan/50 text-ink-muted hover:text-neon-cyan transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const label = dir === "prev" ? "Previous match" : "Next match";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className="relative w-6 h-6 rounded-full flex items-center justify-center border text-neon-cyan transition-colors"
      style={{
        borderColor: "rgb(var(--neon-cyan) / 0.4)",
        background: "rgb(var(--neon-cyan) / 0.08)",
        boxShadow: "0 0 10px rgb(var(--neon-cyan) / 0.18)"
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "rotate(0deg)" : "rotate(180deg)" }}
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgb(var(--neon-cyan) / 0.35), transparent 70%)"
        }}
      />
    </motion.button>
  );
}
