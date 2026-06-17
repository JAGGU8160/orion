"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { isDaytimeInGujarat, getGujaratSun, formatIST } from "@/lib/sun";

type Theme = "dark" | "light";
type Mode = "auto" | "dark" | "light";

const MODE_KEY = "orion-theme-mode";

function resolveTheme(mode: Mode): Theme {
  if (mode === "auto") return isDaytimeInGujarat() ? "light" : "dark";
  return mode;
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="5" y1="5" x2="6.8" y2="6.8" />
      <line x1="17.2" y1="17.2" x2="19" y2="19" />
      <line x1="5" y1="19" x2="6.8" y2="17.2" />
      <line x1="17.2" y1="6.8" x2="19" y2="5" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("auto");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const apply = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    setTheme(t);
  };

  // Mount: read stored mode (default auto), set theme accordingly.
  useEffect(() => {
    const stored = (localStorage.getItem(MODE_KEY) as Mode | null) ?? "auto";
    setMode(stored);
    apply(resolveTheme(stored));
    setMounted(true);
  }, []);

  // When mode changes, manage the auto-recheck interval.
  useEffect(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (mode === "auto") {
      apply(resolveTheme("auto"));
      intervalRef.current = window.setInterval(() => {
        apply(resolveTheme("auto"));
      }, 60_000);
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [mode]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(MODE_KEY, next);
    setMode(next);
    apply(next);
  };

  const resetToAuto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem(MODE_KEY);
    setMode("auto");
    apply(resolveTheme("auto"));
  };

  const isDark = theme === "dark";
  const isAuto = mode === "auto";

  // Tooltip with sunrise/sunset times
  const tooltip = (() => {
    if (!mounted) return "";
    if (isAuto) {
      const { sunrise, sunset } = getGujaratSun();
      return `Auto · Gujarat sunrise ${formatIST(sunrise)} · sunset ${formatIST(sunset)} IST. Click to override. Right-click to reset.`;
    }
    return `Manual · Click to switch theme. Right-click to restore auto-follow Gujarat sunrise.`;
  })();

  return (
    <div className="relative flex items-center gap-1.5">
      <button
        onClick={toggle}
        onContextMenu={resetToAuto}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        title={tooltip}
        className="group relative w-[68px] h-8 rounded-full border transition-colors duration-300 overflow-hidden shrink-0"
        style={{
          borderColor: "rgb(var(--bg-border))",
          background: isDark
            ? "linear-gradient(135deg, rgb(10 14 39), rgb(30 37 80 / 0.85))"
            : "linear-gradient(135deg, rgb(254 240 138 / 0.65), rgb(125 211 252 / 0.55))"
        }}
      >
        {mounted && (
          <>
            <MoonIcon
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-300 ${
                isDark ? "opacity-0" : "opacity-60"
              }`}
            />
            <SunIcon
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-300 ${
                isDark ? "opacity-70 text-amber-300" : "opacity-0"
              }`}
            />

            {isDark && (
              <>
                <span className="absolute top-1.5 left-9 w-[3px] h-[3px] rounded-full bg-white opacity-80 animate-twinkle" />
                <span className="absolute top-5 left-11 w-[2px] h-[2px] rounded-full bg-white opacity-60" />
                <span
                  className="absolute top-3 left-[3.2rem] w-[2px] h-[2px] rounded-full bg-white opacity-70 animate-twinkle"
                  style={{ animationDelay: "0.7s" }}
                />
              </>
            )}

            <motion.div
              layout
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              className="absolute top-0.5 w-7 h-7 rounded-full shadow-lg flex items-center justify-center"
              style={{
                left: isDark ? "2px" : "calc(100% - 30px)",
                background: isDark
                  ? "radial-gradient(circle at 30% 30%, #f1f5f9, #94a3b8)"
                  : "radial-gradient(circle at 30% 30%, #fde047, #f97316)",
                boxShadow: isDark
                  ? "0 0 10px rgba(226,232,240,0.35), inset 0 1px 0 rgba(255,255,255,0.5)"
                  : "0 0 14px rgba(251,191,36,0.6), inset 0 1px 0 rgba(255,255,255,0.55)"
              }}
            >
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {isDark ? (
                  <MoonIcon className="w-4 h-4 text-slate-800" />
                ) : (
                  <SunIcon className="w-[18px] h-[18px] text-white" />
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </button>

      {/* AUTO badge — visible only when in auto mode, hidden on smallest screens */}
      {mounted && isAuto && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.18em] px-1.5 py-0.5 rounded border select-none"
          style={{
            borderColor: "rgb(var(--neon-cyan) / 0.4)",
            color: "rgb(var(--neon-cyan))",
            background: "rgb(var(--neon-cyan) / 0.06)"
          }}
          title={tooltip}
        >
          <span className="w-1 h-1 rounded-full bg-current animate-pulse-glow" />
          AUTO
        </motion.span>
      )}
    </div>
  );
}
