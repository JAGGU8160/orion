"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

export default function SubscribeButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("orion-subscribed") === "true") {
      setState("success");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("submitting");
    await new Promise((r) => setTimeout(r, 700));
    localStorage.setItem("orion-subscribed", "true");
    localStorage.setItem("orion-subscriber-email", email);
    setState("success");
    setTimeout(() => setOpen(false), 1400);
  };

  const subscribed = state === "success";

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`group relative inline-flex items-center gap-1.5 rounded-full font-medium overflow-hidden ${
          compact ? "px-3.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
          color: "white",
          boxShadow:
            "0 6px 24px rgb(var(--neon-violet) / 0.32), 0 1px 0 rgba(255,255,255,0.18) inset"
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--neon-violet)), rgb(var(--neon-pink)))"
          }}
        />
        <span className="relative flex items-center gap-1.5">
          {subscribed ? (
            <>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
              Subscribed
            </>
          ) : (
            <>
              Subscribe
              <motion.svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </motion.svg>
            </>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-80 rounded-2xl p-5 z-50 origin-top-right"
            style={{
              background: "rgb(var(--bg-card) / 0.95)",
              border: "1px solid rgb(var(--bg-border))",
              backdropFilter: "blur(24px) saturate(140%)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgb(var(--neon-cyan) / 0.06)"
            }}
          >
            <div className="absolute -top-px left-6 right-6 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, rgb(var(--neon-cyan) / 0.6), transparent)" }} />

            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--neon-cyan) / 0.18), rgb(var(--neon-violet) / 0.18))",
                  border: "1px solid rgb(var(--neon-cyan) / 0.3)"
                }}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-display text-base font-semibold leading-tight text-ink">
                  The Orion Briefing
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Tonight&apos;s sky and the week&apos;s biggest space news — in your inbox, every Sunday.
                </p>
              </div>
            </div>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-neon-cyan font-medium"
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgb(var(--neon-cyan) / 0.2)" }}>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                You&apos;re in. See you Sunday.
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    className="w-full h-10 px-3.5 rounded-lg text-sm bg-bg/40 border border-bg-border focus:border-neon-cyan/60 focus:outline-none focus:ring-2 focus:ring-neon-cyan/25 transition-all placeholder:text-ink-dim"
                  />
                </div>
                {state === "error" && (
                  <p className="text-xs text-neon-pink">Please enter a valid email.</p>
                )}
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="w-full h-10 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))"
                  }}
                >
                  {state === "submitting" ? "Sending…" : "Subscribe — it's free"}
                </button>
                <p className="text-[10px] text-ink-dim text-center leading-relaxed pt-1">
                  No spam. Unsubscribe in one click.
                </p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
