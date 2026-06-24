"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  ASTRO_NEWS, ASTRO_CATEGORIES, ASTRO_ERAS,
  type AstroEntry, type AstroCategoryKey,
} from "@/lib/astro-data";

const Y_MIN = 1801, Y_MAX = 2026, PAGE = 36;
const MILESTONES = ASTRO_NEWS.filter(e => e.milestone);
const ALL_SOURCES = [...new Set(ASTRO_NEWS.map(e => e.source))].sort();
const DECADES = Array.from({ length: 23 }, (_, i) => 1800 + i * 10);
const QUICK_CHIPS = ["Black holes","Voyager","Mars","Exoplanet","Comet","Eclipse","Hubble","LIGO"];
const SORTED_ENTRIES = [...ASTRO_NEWS].sort((a, b) => a.year - b.year);

const catInfo = (k: AstroCategoryKey) => ASTRO_CATEGORIES[k];
const hue     = (k: AstroCategoryKey) => catInfo(k).hue;
const cc      = (h: number, l = 60, a = 1) => `hsl(${h} 70% ${l}% / ${a})`;
const eraOf   = (y: number) => ASTRO_ERAS.find(e => y >= e.from && y <= e.to)?.label ?? "";
const decOf   = (y: number) => Math.floor(y / 10) * 10;

const S = {
  surface : "rgb(var(--bg-card))",
  surfaceA: "rgb(var(--bg-card) / 0.88)",
  surface2: "rgb(var(--bg-deep))",
  border  : "rgb(var(--bg-border))",
  border2 : "rgb(var(--bg-border2))",
  ink     : "rgb(var(--ink))",
  muted   : "rgb(var(--ink-muted))",
  dim     : "rgb(var(--ink-dim))",
  accent  : "rgb(var(--neon-cyan))",
  accent2 : "rgb(var(--neon-violet))",
  gold    : "rgb(var(--neon-amber))",
  shadow  : "0 18px 50px -22px rgba(0,0,0,.85),0 2px 8px rgba(0,0,0,.5)",
} as const;

const panel: React.CSSProperties = {
  background: "rgb(var(--bg-card) / 0.88)", border: "1px solid rgb(var(--bg-border))",
  borderRadius: 14, padding: 16, backdropFilter: "blur(8px)",
};

interface Filters {
  text: string; heroEra: string; heroCat: string;
  cats: Set<AstroCategoryKey>; yMin: number; yMax: number;
  source: string; milestoneOnly: boolean; imageOnly: boolean;
  sort: "asc" | "desc";
}
const INIT: Filters = {
  text: "", heroEra: "", heroCat: "",
  cats: new Set(), yMin: Y_MIN, yMax: Y_MAX,
  source: "", milestoneOnly: false, imageOnly: false, sort: "asc",
};

export default function AstroArchive() {
  const [f, setF]               = useState<Filters>(INIT);
  const [shown, setShown]       = useState(PAGE);
  const [detail, setDetail]     = useState<number | null>(null);
  const [detailEntry, setDetailEntry] = useState<{ entry: AstroEntry; idx: number } | null>(null);
  const [showTop, setShowTop]   = useState(false);
  const [statVis, setStatVis]   = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [activeDec, setActiveDec] = useState<number>(1800);
  const [progPct, setProgPct]   = useState(0);
  const [isDark, setIsDark]     = useState(true);
  const [queuedDetail, setQueuedDetail] = useState<number | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const feedRef     = useRef<HTMLDivElement>(null);
  const archiveRef  = useRef<HTMLDivElement>(null);
  const scrimRef    = useRef<HTMLDivElement>(null);
  const detailRef   = useRef<HTMLElement>(null);
  const totopRef    = useRef<HTMLButtonElement>(null);

  // Theme detection
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme !== "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const filtered = useMemo(() => {
    let r = ASTRO_NEWS;
    if (f.text.trim()) {
      const q = f.text.toLowerCase();
      r = r.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        catInfo(e.category).label.toLowerCase().includes(q)
      );
    }
    if (f.cats.size > 0) r = r.filter(e => f.cats.has(e.category));
    r = r.filter(e => e.year >= f.yMin && e.year <= f.yMax);
    if (f.source)        r = r.filter(e => e.source === f.source);
    if (f.milestoneOnly) r = r.filter(e => e.milestone);
    if (f.imageOnly)     r = r.filter(e => e.img);
    return [...r].sort((a, b) => f.sort === "asc" ? a.year - b.year : b.year - a.year);
  }, [f]);

  const decadeCounts = useMemo(() => {
    const m: Record<number, number> = {};
    filtered.forEach(e => { const d = decOf(e.year); m[d] = (m[d] || 0) + 1; });
    return m;
  }, [filtered]);

  const catCounts = useMemo(() => {
    const m: Partial<Record<AstroCategoryKey, number>> = {};
    ASTRO_NEWS.forEach(e => { m[e.category] = (m[e.category] || 0) + 1; });
    return m;
  }, []);

  const maxDC  = Math.max(...Object.values(decadeCounts), 1);
  const visible = filtered.slice(0, shown);
  const groups  = useMemo(() => {
    const gs: { decade: number; entries: AstroEntry[] }[] = [];
    let cur = -1;
    for (const e of visible) {
      const d = decOf(e.year);
      if (d !== cur) { cur = d; gs.push({ decade: d, entries: [] }); }
      gs[gs.length - 1].entries.push(e);
    }
    return gs;
  }, [visible]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([en]) => { if (en.isIntersecting) setShown(s => Math.min(s + PAGE, filtered.length)); },
      { rootMargin: "600px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  useEffect(() => { setShown(PAGE); }, [f]);

  // Entry reveal via CSS .show class (spec: rootMargin -8%)
  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    container.querySelectorAll(".a-entry").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [visible]);

  // Scroll tracking: back-to-top + active decade + progress
  useEffect(() => {
    const h = () => {
      setShowTop(window.scrollY > 700);
      for (let i = DECADES.length - 1; i >= 0; i--) {
        const el = document.getElementById(`dec-${DECADES[i]}`);
        if (el && el.getBoundingClientRect().top <= 220) { setActiveDec(DECADES[i]); break; }
      }
      const feed = feedRef.current;
      if (feed) {
        const rect  = feed.getBoundingClientRect();
        const total = feed.offsetHeight - window.innerHeight;
        setProgPct(Math.min(100, Math.max(0, (-rect.top / Math.max(1, total)) * 100)));
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Stats count-up
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([en]) => { if (en.isIntersecting) setStatVis(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Detail panel open/close via CSS class (transition: .36s cubic-bezier(.4,1,.3,1))
  useEffect(() => {
    if (detail !== null && filtered[detail]) {
      setDetailEntry({ entry: filtered[detail], idx: detail });
      scrimRef.current?.classList.add("open");
      detailRef.current?.classList.add("open");
      document.body.style.overflow = "hidden";
    } else {
      scrimRef.current?.classList.remove("open");
      detailRef.current?.classList.remove("open");
      document.body.style.overflow = "";
      const t = setTimeout(() => setDetailEntry(null), 400);
      return () => clearTimeout(t);
    }
  }, [detail, filtered]);

  // Keyboard navigation
  useEffect(() => {
    if (detail === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")       setDetail(null);
      if (e.key === "ArrowRight" && detail < filtered.length - 1) setDetail(d => d! + 1);
      if (e.key === "ArrowLeft"  && detail > 0)                   setDetail(d => d! - 1);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [detail, filtered.length]);

  // Back-to-top CSS class
  useEffect(() => { totopRef.current?.classList.toggle("show", showTop); }, [showTop]);

  // Random discovery event from ArchiveNav
  useEffect(() => {
    const handler = (e: Event) => {
      const entryId = (e as CustomEvent<{ entryId: string }>).detail?.entryId;
      if (!entryId) return;
      setF(INIT);
      const idx = SORTED_ENTRIES.findIndex(en => en.id === entryId);
      if (idx >= 0) { setShown(Math.max(PAGE, idx + 1)); setQueuedDetail(idx); }
    };
    window.addEventListener("orion:archive:surprise", handler);
    return () => window.removeEventListener("orion:archive:surprise", handler);
  }, []);

  // Apply queued detail after filters reset
  useEffect(() => {
    if (queuedDetail !== null && queuedDetail < filtered.length) {
      setDetail(queuedDetail);
      setQueuedDetail(null);
    }
  }, [filtered, queuedDetail]);

  const upd       = <K extends keyof Filters>(k: K, v: Filters[K]) => setF(s => ({ ...s, [k]: v }));
  const toggleCat = (k: AstroCategoryKey) =>
    setF(s => { const c = new Set(s.cats); c.has(k) ? c.delete(k) : c.add(k); return { ...s, cats: c }; });
  const applyHero = () =>
    setF(s => {
      const next = { ...s };
      if (s.heroEra) { const era = ASTRO_ERAS.find(e => e.id === s.heroEra); if (era) { next.yMin = era.from; next.yMax = era.to; } }
      if (s.heroCat) next.cats = new Set([s.heroCat as AstroCategoryKey]);
      return next;
    });
  const clearAll = () => { setF(INIT); setShown(PAGE); };
  // Sort + scroll to archive top (spec: offsetTop - 80)
  const setSort  = (s: "asc" | "desc") => {
    upd("sort", s);
    setTimeout(() => {
      const el = archiveRef.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 50);
  };

  const hardShadow  = isDark ? `6px 6px 0 0 ${S.accent}` : `6px 6px 0 0 ${S.ink}`;
  const chipColor   = (h: number) => isDark ? cc(h, 72) : cc(h, 35);
  const chipBg      = (h: number) => cc(h, 50, 0.14);
  const chipBord    = (h: number) => isDark ? cc(h, 55, 0.3) : cc(h, 45, 0.35);
  const activeCount = [f.text, f.cats.size > 0, f.yMin !== Y_MIN || f.yMax !== Y_MAX, f.source, f.milestoneOnly, f.imageOnly].filter(Boolean).length;

  return (
    <div className="relative z-10" id="an-hero">

      {/* Hero section */}
      <header style={{ maxWidth: 1080, margin: "80px auto 0", padding: "0 28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: "clamp(36px,5.4vw,64px)", lineHeight: 1.02, letterSpacing: "-.04em", fontWeight: 700, margin: "20px 0 16px", maxWidth: "17ch", color: S.ink }}>
          Two centuries of looking{" "}
          <em style={{ fontStyle: "normal", background: `linear-gradient(96deg,${S.accent},#9b7bff 45%,${S.accent2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>up</em>
          , in one scroll.
        </h1>
        <p style={{ fontSize: 16, color: S.muted, lineHeight: 1.55, maxWidth: "58ch", margin: "0 auto 28px" }}>
          From the first asteroid found on New Year&apos;s night, 1801, to the deepest galaxies seen by Webb — search, filter and travel the timeline of how we came to know the cosmos.
        </p>

        {/* Mega search box */}
        <div className="astro-qbox" style={{ width: "100%", maxWidth: 900, background: S.surface, border: `1.5px solid ${S.border}`, borderRadius: 18, padding: 6, boxShadow: hardShadow }}>
          <label style={{ textAlign: "left", padding: "11px 16px", display: "flex", flexDirection: "column", gap: 5, borderRadius: 12, cursor: "text" }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".14em", color: S.dim, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={S.accent} strokeWidth="2"/><path d="M21 21l-4-4" stroke={S.accent} strokeWidth="2" strokeLinecap="round"/></svg>
              Search
            </span>
            <input type="text" value={f.text} autoComplete="off"
              placeholder="black hole, Voyager, Mars, comet…"
              onChange={e => upd("text", e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyHero()}
              style={{ border: "none", background: "transparent", outline: "none", color: S.ink, fontSize: 15, fontWeight: 500, width: "100%" }} />
          </label>
          <div className="astro-qsep" style={{ background: S.border, width: 1, margin: "12px 0" }} />
          <label style={{ textAlign: "left", padding: "11px 16px", display: "flex", flexDirection: "column", gap: 5, cursor: "pointer" }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".14em", color: S.dim, textTransform: "uppercase" }}>Era</span>
            <select value={f.heroEra} onChange={e => upd("heroEra", e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", color: S.ink, fontSize: 15, fontWeight: 500, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
              <option value="">Any era</option>
              {ASTRO_ERAS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
          </label>
          <div className="astro-qsep" style={{ background: S.border, width: 1, margin: "12px 0" }} />
          <label style={{ textAlign: "left", padding: "11px 16px", display: "flex", flexDirection: "column", gap: 5, cursor: "pointer" }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".14em", color: S.dim, textTransform: "uppercase" }}>Category</span>
            <select value={f.heroCat} onChange={e => upd("heroCat", e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", color: S.ink, fontSize: 15, fontWeight: 500, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
              <option value="">All topics</option>
              {(Object.entries(ASTRO_CATEGORIES) as [AstroCategoryKey, (typeof ASTRO_CATEGORIES)[AstroCategoryKey]][]).map(([k, v]) =>
                <option key={k} value={k}>{v.glyph} {v.label}</option>
              )}
            </select>
          </label>
          <button onClick={applyHero}
            style={{ margin: 0, background: S.accent, color: "#fff", border: "none", borderRadius: 13, padding: "0 24px", fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "inset 0 1px 0 #ffffff2e", transition: "filter .15s" }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "")}>
            Explore
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Quick search chips */}
        <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {QUICK_CHIPS.map(q => (
            <button key={q} onClick={() => upd("text", q)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, letterSpacing: ".06em", color: S.muted, padding: "7px 12px", border: `1px solid ${S.border}`, borderRadius: 999, background: S.surfaceA, cursor: "pointer", textTransform: "uppercase", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = S.ink; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = S.muted; e.currentTarget.style.transform = ""; }}>
              <span style={{ color: S.accent2 }}>▶</span>{q}
            </button>
          ))}
        </div>

        {/* Animated stats */}
        <div ref={statsRef} className="astro-stats" style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4,1fr)", width: "100%", maxWidth: 760, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
          {[
            { n: 500,               unit: "",   label: "Logged moments"   },
            { n: MILESTONES.length, unit: "",   label: "Major milestones" },
            { n: 226,               unit: "yr", label: "Years covered"    },
            { n: 8,                 unit: "",   label: "Topics tracked"   },
          ].map((s, i) => <CountStat key={i} n={s.n} unit={s.unit} label={s.label} visible={statVis} idx={i} />)}
        </div>
      </header>

      {/* Archive grid */}
      <div ref={archiveRef} id="an-grid" className="astro-grid" style={{ maxWidth: 1480, margin: "40px auto 0", padding: "0 22px 120px" }}>

        {/* Sidebar — sticky top:92, fills full remaining viewport height */}
        <aside className="astro-sidebar" style={{ position: "sticky", top: 68, alignSelf: "start", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", paddingRight: 4 }}>

          {/* Toggles — compact 2-col at top */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {([
              { k: "milestoneOnly" as const, label: "Milestones", icon: "★" },
              { k: "imageOnly"     as const, label: "Imagery",    icon: "🖼" },
            ] as const).map((t) => {
              const on = f[t.k] as boolean;
              return (
                <div key={t.k} onClick={() => upd(t.k, !on)}
                  style={{ display: "flex", flexDirection: "column", gap: 7, padding: "9px 11px", borderRadius: 10, cursor: "pointer", background: on ? `${S.accent}18` : S.surface, border: `1px solid ${on ? S.accent : S.border}`, transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: on ? S.ink : S.muted, fontWeight: 500 }}>
                    <span style={{ color: S.gold }}>{t.icon}</span>
                    {t.label}
                  </div>
                  <div style={{ width: 32, height: 18, borderRadius: 99, background: on ? S.accent : S.border2, position: "relative", transition: "background .18s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 2, left: on ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : S.muted, transition: "left .18s, background .18s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile "More filters" toggle — hidden on desktop via CSS */}
          <button
            className="astro-mobile-filter-btn"
            onClick={() => setMobileFilters(v => !v)}
            style={{ display: "none", width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${S.border}`, background: S.surface, cursor: "pointer", fontSize: 13, fontWeight: 500, color: S.muted, textAlign: "left", alignItems: "center", gap: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            {mobileFilters ? "Hide filters" : "More filters"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={S.dim} strokeWidth="2" strokeLinecap="round" style={{ marginLeft: "auto", transform: mobileFilters ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <div className={`astro-sidebar-panel${mobileFilters ? " mobile-visible" : ""}`} style={panel}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={S.dim} strokeWidth="2"/><path d="M21 21l-4-4" stroke={S.dim} strokeWidth="2" strokeLinecap="round"/></svg>
              <input type="text" value={f.text} placeholder="Search 500 moments…"
                onChange={e => upd("text", e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", color: S.ink, fontSize: 13.5, width: "100%" }} />
            </div>
          </div>

          <div className={`astro-sidebar-panel${mobileFilters ? " mobile-visible" : ""}`} style={panel}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: S.dim }}>Era Range</span>
              {(f.yMin !== Y_MIN || f.yMax !== Y_MAX) && (
                <button onClick={() => setF(s => ({ ...s, yMin: Y_MIN, yMax: Y_MAX, heroEra: "" }))}
                  style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: S.accent, cursor: "pointer", background: "none", border: "none", padding: 0 }}>Reset</button>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13, color: S.ink, marginBottom: 12 }}>
              <b>{f.yMin}</b><b>{f.yMax}</b>
            </div>
            <DualRange yMin={f.yMin} yMax={f.yMax} onChange={(lo, hi) => setF(s => ({ ...s, yMin: lo, yMax: hi }))} />
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
              {ASTRO_ERAS.map((e, i) => (
                <div key={e.id} title={e.label}
                  onClick={() => setF(s => ({ ...s, yMin: e.from, yMax: e.to }))}
                  style={{ flex: 1, height: 5, borderRadius: 3, cursor: "pointer", transition: "opacity .15s",
                    background: [S.accent, "#7c4dff", "#ff6b6b", "#28dcc0", S.gold][i],
                    opacity: f.yMin === e.from && f.yMax === e.to ? 1 : 0.4 }} />
              ))}
            </div>
          </div>

          <div className={`astro-sidebar-panel${mobileFilters ? " mobile-visible" : ""}`} style={panel}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: S.dim }}>Categories</span>
              {f.cats.size > 0 && (
                <button onClick={() => setF(s => ({ ...s, cats: new Set() }))}
                  style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: S.accent, cursor: "pointer", background: "none", border: "none", padding: 0 }}>All</button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {(Object.entries(ASTRO_CATEGORIES) as [AstroCategoryKey, (typeof ASTRO_CATEGORIES)[AstroCategoryKey]][]).map(([k, v]) => {
                const on = f.cats.has(k); const h = v.hue;
                return (
                  <div key={k} onClick={() => toggleCat(k)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 9px", borderRadius: 9, cursor: "pointer", fontSize: 13.5, color: on ? S.ink : S.muted, background: on ? cc(h, 50, 0.1) : "transparent", transition: "background .12s,color .12s" }}>
                    <div style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${on ? cc(h, 60) : S.border2}`, background: on ? cc(h, 60) : "transparent", display: "grid", placeItems: "center", flexShrink: 0, transition: "all .12s" }}>
                      {on && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ color: chipColor(h), width: 15, textAlign: "center", fontSize: 13 }}>{v.glyph}</span>
                    <span style={{ flex: 1 }}>{v.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: S.dim }}>{catCounts[k] ?? 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`astro-sidebar-panel${mobileFilters ? " mobile-visible" : ""}`} style={panel}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: S.dim }}>Observatory / Source</span>
            </div>
            <select value={f.source} onChange={e => upd("source", e.target.value)}
              style={{ width: "100%", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 10, padding: "10px 12px", fontFamily: "inherit", fontSize: 13.5, color: S.ink, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
              <option value="">Any source</option>
              {ALL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </aside>

        {/* Feed column */}
        <div ref={feedRef} style={{ minWidth: 0 }}>

          {/* Scrubber */}
          <div style={{ position: "sticky", top: 68, zIndex: 30, marginBottom: 6, marginTop: 12, background: `${S.surface}cc`, border: `1px solid ${S.border}`, borderRadius: 14, padding: "12px 16px", backdropFilter: "blur(12px)", boxShadow: S.shadow }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, marginBottom: 11, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, color: S.muted }}>
                <b style={{ color: S.ink, fontWeight: 600 }}>{filtered.length.toLocaleString()}</b> moments · {filtered.filter(e => e.milestone).length} milestones
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, color: S.dim, letterSpacing: ".08em", textTransform: "uppercase" }}>
                Sort
                {(["asc", "desc"] as const).map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    style={{ fontFamily: "monospace", fontSize: 11, background: f.sort === s ? S.surface2 : "none", border: "none", color: f.sort === s ? S.ink : S.dim, cursor: "pointer", padding: "4px 7px", borderRadius: 6 }}>
                    {s === "asc" ? "Oldest" : "Newest"}
                  </button>
                ))}
              </div>
            </div>
            <div className="astro-scrubber-ticks" style={{ position: "relative", height: 36 }}>
              <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 2, background: S.surface2, borderRadius: 2 }} />
              <div style={{ position: "absolute", top: 22, left: 0, width: `${progPct}%`, height: 2, background: `linear-gradient(90deg,${S.accent},${S.accent2})`, borderRadius: 2, transition: "width .15s", zIndex: 1 }} />
              {DECADES.map(d => {
                const pct  = ((d - 1800) / (2030 - 1800)) * 100;
                const cnt  = decadeCounts[d] || 0;
                const barH = cnt > 0 ? Math.round(6 + (cnt / maxDC) * 16) : 2;
                const isAct = activeDec === d && cnt > 0;
                return (
                  <div key={d} title={`${d}s: ${cnt}`}
                    onClick={() => {
                      const head = document.getElementById(`dec-${d}`);
                      if (head) window.scrollTo({ top: head.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
                    }}
                    style={{ position: "absolute", left: `${pct}%`, top: 0, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: cnt > 0 ? "pointer" : "default", userSelect: "none" }}>
                    <div style={{ width: isAct ? 4 : 3, height: barH, background: isAct ? S.accent : cnt > 0 ? S.muted : S.border, borderRadius: 3, marginTop: 22 - barH, opacity: cnt > 0 ? (isAct ? 1 : 0.55) : 0.2, transition: "all .25s" }} />
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: isAct ? S.accent : S.dim, fontWeight: isAct ? 700 : 400, transition: "all .25s" }}>{String(d).slice(2)}s</span>
                  </div>
                );
              })}
            </div>
          </div>

          {activeCount > 0 && (
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
              {f.text && <FChip label={`"${f.text}"`} onX={() => upd("text", "")} />}
              {(f.yMin !== Y_MIN || f.yMax !== Y_MAX) && <FChip label={`${f.yMin}–${f.yMax}`} onX={() => setF(s => ({ ...s, yMin: Y_MIN, yMax: Y_MAX }))} />}
              {[...f.cats].map(c => <FChip key={c} label={`${catInfo(c).glyph} ${catInfo(c).label}`} onX={() => toggleCat(c)} />)}
              {f.source && <FChip label={f.source} onX={() => upd("source", "")} />}
              {f.milestoneOnly && <FChip label="★ Milestones" onX={() => upd("milestoneOnly", false)} />}
              {f.imageOnly    && <FChip label="Has imagery"   onX={() => upd("imageOnly", false)} />}
              {activeCount > 1 && (
                <button onClick={clearAll} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "monospace", fontSize: 11, padding: "5px 10px", borderRadius: 999, background: "transparent", border: `1px solid ${S.border}`, color: S.accent, cursor: "pointer" }}>Clear all</button>
              )}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "70px 20px", color: S.muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔭</div>
              <p style={{ fontSize: 22, fontWeight: 600, color: S.ink, margin: "0 0 8px" }}>No moments match.</p>
              <p style={{ fontSize: 14, margin: 0 }}>Try widening your filters or clearing the search.</p>
            </div>
          )}

          {/* Timeline groups */}
          {groups.map(({ decade, entries }, gi) => (
            <div key={decade} id={`dec-${decade}`}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, margin: `${gi === 0 ? "4px" : "30px"} 0 18px`, paddingLeft: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.03em", color: S.ink, fontVariantNumeric: "tabular-nums" }}>{decade}s</span>
                <span style={{ fontFamily: "monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, border: `1px solid ${S.border2}`, color: S.muted, whiteSpace: "nowrap" }}>{eraOf(decade)}</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${S.border2},transparent)` }} />
                <span style={{ fontFamily: "monospace", fontSize: 11, color: S.dim }}>{decadeCounts[decade]} moments</span>
              </div>
              {entries.map((entry, i) => (
                <EntryRow key={entry.id} entry={entry} isLast={i === entries.length - 1}
                  isDark={isDark} onOpen={() => setDetail(filtered.indexOf(entry))} />
              ))}
            </div>
          ))}

          <div ref={sentinelRef} style={{ height: 40, display: "grid", placeItems: "center" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: S.dim, letterSpacing: ".12em", textTransform: "uppercase" }}>
              {shown < filtered.length
                ? `Loading ${Math.min(PAGE, filtered.length - shown)} more…`
                : filtered.length > 0 ? `End of archive · ${filtered.length} moments` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Archive footer */}
      <footer id="an-footer" style={{ maxWidth: 1480, margin: "0 auto", padding: "40px 22px 60px", borderTop: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <p style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: S.dim }}>
          500 moments spanning 1801–2026, curated from astronomical records.
        </p>
        <a href="/" style={{ fontFamily: "monospace", fontSize: 12, color: S.accent, textDecoration: "none", letterSpacing: ".06em" }}>
          ← Back to Orion Space Digest
        </a>
      </footer>

      {/* Detail scrim — always in DOM, animated via CSS .open class */}
      <div ref={scrimRef} className="a-scrim" onClick={() => setDetail(null)} />

      {/* Detail panel — always in DOM, animated via CSS .open class */}
      <aside ref={detailRef} className="a-detail"
        style={{ background: S.surface, borderLeft: `1px solid ${S.border2}`, boxShadow: "-30px 0 80px -30px rgba(0,0,0,.8)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {detailEntry && (
          <DetailPanel
            entry={detailEntry.entry} idx={detailEntry.idx} total={filtered.length} filtered={filtered}
            onClose={() => setDetail(null)}
            onPrev={() => setDetail(d => Math.max(0, d! - 1))}
            onNext={() => setDetail(d => Math.min(filtered.length - 1, d! + 1))}
            onCat={c => { setF(s => ({ ...s, cats: new Set([c]) })); setDetail(null); }}
            isDark={isDark}
          />
        )}
      </aside>

      {/* Back-to-top — always in DOM, animated via CSS .show class */}
      <button ref={totopRef} className="a-totop"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 46, height: 46, borderRadius: "50%", background: S.accent, color: "#fff", border: "none", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: `0 10px 30px -10px ${S.accent}` }}
        aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

// ── CountStat ─────────────────────────────────────────────────────
function CountStat({ n, unit, label, visible, idx }: { n: number; unit: string; label: string; visible: boolean; idx: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = Date.now(), dur = 1100 + idx * 80;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * n));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, n, idx]);
  return (
    <div style={{ padding: "16px 12px", textAlign: "left", borderRight: `1px solid ${S.border}` }}>
      <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", color: S.ink }}>
        {v.toLocaleString()}
        {unit && <span style={{ color: S.accent2, fontSize: 14, marginLeft: 3, fontFamily: "monospace" }}>{unit}</span>}
      </div>
      <div style={{ marginTop: 2, fontFamily: "monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: S.dim }}>{label}</div>
    </div>
  );
}

// ── DualRange ─────────────────────────────────────────────────────
function DualRange({ yMin, yMax, onChange }: { yMin: number; yMax: number; onChange: (lo: number, hi: number) => void }) {
  const span = Y_MAX - Y_MIN;
  const pLo  = ((yMin - Y_MIN) / span) * 100;
  const pHi  = ((yMax - Y_MIN) / span) * 100;
  return (
    <div style={{ position: "relative", height: 30 }}>
      <div style={{ position: "absolute", top: 13, left: 0, right: 0, height: 4, background: S.surface2, borderRadius: 4 }} />
      <div style={{ position: "absolute", top: 13, left: `${pLo}%`, width: `${pHi - pLo}%`, height: 4, background: `linear-gradient(90deg,${S.accent},${S.accent2})`, borderRadius: 4 }} />
      <input type="range" min={Y_MIN} max={Y_MAX} value={yMin} className="astro-range"
        style={{ position: "absolute", top: 0, width: "100%", margin: 0, height: 30, zIndex: yMin > Y_MAX - 50 ? 5 : 3 }}
        onChange={e => onChange(Math.min(+e.target.value, yMax - 1), yMax)} />
      <input type="range" min={Y_MIN} max={Y_MAX} value={yMax} className="astro-range"
        style={{ position: "absolute", top: 0, width: "100%", margin: 0, height: 30, zIndex: 4 }}
        onChange={e => onChange(yMin, Math.max(+e.target.value, yMin + 1))} />
    </div>
  );
}

// ── FChip ─────────────────────────────────────────────────────────
function FChip({ label, onX }: { label: string; onX: () => void }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "monospace", fontSize: 11, letterSpacing: ".04em", padding: "5px 10px", borderRadius: 999, background: S.surface2, border: `1px solid ${S.border}`, color: S.muted }}>
      {label}
      <span onClick={e => { e.stopPropagation(); onX(); }} style={{ cursor: "pointer", color: S.dim, fontSize: 15, lineHeight: 1 }}>×</span>
    </div>
  );
}

// ── EntryRow — no Framer Motion, CSS .show class for reveal ──────
function EntryRow({ entry, isLast, isDark, onOpen }: {
  entry: AstroEntry; isLast: boolean; isDark: boolean; onOpen: () => void;
}) {
  return (
    <div className="a-entry" style={{ '--cat': hue(entry.category) } as React.CSSProperties}>
      {/* Rail */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        {!isLast && (
          <div style={{ position: "absolute", top: 0, bottom: -22, left: "50%", width: 2, background: `linear-gradient(180deg,${S.border2} 0%,${S.border2} 85%,transparent 100%)`, transform: "translateX(-50%)", zIndex: 0 }} />
        )}
        <div style={{ fontFamily: "monospace", fontSize: 11, color: S.dim, textAlign: "center", lineHeight: 1.3, position: "relative", zIndex: 1 }}>
          {entry.date || " "}
          <b style={{ display: "block", color: S.ink, fontSize: 15, fontWeight: 600 }}>{entry.year}</b>
        </div>
        <div className={entry.milestone ? "astro-milestone-node" : undefined}
          style={{ width: 14, height: 14, borderRadius: "50%", marginTop: 9, position: "relative", zIndex: 1,
            background: entry.milestone ? S.gold : S.surface,
            border: `2px solid ${entry.milestone ? S.gold : S.border2}`,
            ...(entry.milestone ? { boxShadow: `0 0 0 4px ${S.gold}33,0 0 14px ${S.gold}` } : {}) }} />
      </div>
      {/* Card */}
      <EntryCard entry={entry} isDark={isDark} onOpen={onOpen} />
    </div>
  );
}

// ── EntryCard — CSS ::before accent bar, no Framer Motion ────────
function EntryCard({ entry, isDark, onOpen }: {
  entry: AstroEntry; isDark: boolean; onOpen: () => void;
}) {
  const [hov, setHov] = useState(false);
  const h = hue(entry.category);
  const c = catInfo(entry.category);
  const chipColor = isDark ? cc(h, 72) : cc(h, 35);
  const chipBg    = cc(h, 50, 0.14);
  const chipBord  = isDark ? cc(h, 55, 0.3) : cc(h, 45, 0.35);
  return (
    <div className="a-card" onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        '--cat': h,
        background: S.surfaceA,
        border: `1px solid ${entry.milestone ? cc(h, 55, 0.4) : S.border}`,
        borderRadius: 14, padding: "16px 18px", marginBottom: 22, cursor: "pointer",
        position: "relative", overflow: "hidden",
        transform: hov ? "translateX(3px)" : "none",
        borderColor: hov ? S.border2 : (entry.milestone ? cc(h, 55, 0.4) : S.border),
        boxShadow: hov ? S.shadow : "0 1px 3px rgba(0,0,0,.05)",
        transition: "all .16s",
      } as React.CSSProperties}>
      {entry.img && (
        <div style={{ float: "right", width: 78, height: 78, borderRadius: 10, margin: "0 0 4px 16px", background: `radial-gradient(circle at 35% 30%,${cc(h, 60, 0.5)},${cc(h, 22, 0.35)})`, border: `1px solid ${S.border}`, display: "grid", placeItems: "center", color: cc(h, 78), fontSize: 26 }}>
          {c.glyph}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, color: chipColor, background: chipBg, border: `1px solid ${chipBord}` }}>
          {c.glyph} {c.label}
        </span>
        {entry.milestone && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, color: S.gold, background: `${S.gold}22`, border: `1px solid ${S.gold}5a` }}>★ Milestone</span>
        )}
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 11, color: S.dim }}>{entry.source}</span>
      </div>
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.25, color: S.ink }}>{entry.title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: S.muted, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{entry.summary}</p>
      <div style={{ marginTop: 11, fontFamily: "monospace", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: S.accent, display: "inline-flex", alignItems: "center", gap: 6 }}>
        Read more
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: hov ? "translateX(3px)" : "none", transition: "transform .18s" }}>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── DetailPanel ───────────────────────────────────────────────────
function DetailPanel({ entry, idx, total, filtered, onClose, onPrev, onNext, onCat, isDark }: {
  entry: AstroEntry; idx: number; total: number; filtered: AstroEntry[];
  onClose: () => void; onPrev: () => void; onNext: () => void;
  onCat: (c: AstroCategoryKey) => void; isDark: boolean;
}) {
  const h = hue(entry.category);
  const c = catInfo(entry.category);
  const prevYear = idx > 0 ? filtered[idx - 1].year : null;
  const nextYear = idx < total - 1 ? filtered[idx + 1].year : null;
  const chipColor = isDark ? cc(h, 72) : cc(h, 35);
  const chipBg    = cc(h, 50, 0.14);
  const chipBord  = isDark ? cc(h, 55, 0.3) : cc(h, 45, 0.35);
  return (
    <>
      <div style={{ position: "relative", padding: "26px 28px 22px", overflow: "hidden", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 100% at 80% 0%,${cc(h, 50, 0.28)},transparent 60%)` }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 9, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, color: chipColor, background: chipBg, border: `1px solid ${chipBord}` }}>{c.glyph} {c.label}</span>
          {entry.milestone && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, color: S.gold, background: `${S.gold}22`, border: `1px solid ${S.gold}5a` }}>★ Milestone</span>}
          <button onClick={onClose} style={{ marginLeft: "auto", width: 34, height: 34, borderRadius: 9, border: `1px solid ${S.border2}`, background: S.surface2, color: S.muted, cursor: "pointer", display: "grid", placeItems: "center", fontSize: 14 }}>✕</button>
        </div>
        <div style={{ position: "relative", fontSize: 60, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: S.ink }}>{entry.year}</div>
        <div style={{ position: "relative", fontFamily: "monospace", fontSize: 12, color: S.muted, letterSpacing: ".1em", textTransform: "uppercase", marginTop: 8 }}>
          {entry.date ? `${entry.date} · ` : ""}{eraOf(entry.year)}
        </div>
      </div>
      <div style={{ padding: "26px 28px", overflowY: "auto", flex: 1 }}>
        {entry.img && (
          <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, marginBottom: 20, background: `radial-gradient(circle at 30% 25%,${cc(h, 55, 0.55)},${cc(h, 18, 0.4)})`, border: `1px solid ${S.border}`, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
            <span style={{ fontSize: 64, opacity: .85 }}>{c.glyph}</span>
            <span style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: S.muted, background: "rgba(0,0,0,.4)", padding: "4px 8px", borderRadius: 6 }}>{entry.source}</span>
          </div>
        )}
        <h2 style={{ margin: "0 0 16px", fontSize: 26, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.18, color: S.ink }}>{entry.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: S.ink, margin: "0 0 20px" }}>{entry.summary}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          {[
            { l: "Date",     v: entry.date ? `${entry.date}, ${entry.year}` : String(entry.year) },
            { l: "Category", v: c.label },
            { l: "Source",   v: entry.source },
            { l: "Era",      v: eraOf(entry.year) },
          ].map(m => (
            <div key={m.l} style={{ background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: S.dim, marginBottom: 5 }}>{m.l}</div>
              <div style={{ fontSize: 14, color: S.ink, fontWeight: 500 }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onCat(entry.category)}
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: S.accent, color: "#fff", border: "none", borderRadius: 9, padding: "9px 15px", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            See {c.label} →
          </button>
          <button onClick={() => { const el = document.getElementById(`dec-${decOf(entry.year)}`); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" }); onClose(); }}
            style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: S.surface2, color: S.ink, border: `1px solid ${S.border2}`, borderRadius: 9, padding: "9px 15px", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Jump to {entry.year}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderTop: `1px solid ${S.border}`, background: S.surface2 }}>
        <button onClick={onPrev} disabled={idx === 0}
          style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: S.muted, background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.35 : 1, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 8 }}>
          ← {prevYear ?? ""}
        </button>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: S.dim }}>{idx + 1} / {total}</span>
        <button onClick={onNext} disabled={idx === total - 1}
          style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: S.muted, background: "none", border: "none", cursor: idx === total - 1 ? "default" : "pointer", opacity: idx === total - 1 ? 0.35 : 1, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 8 }}>
          {nextYear ?? ""} →
        </button>
      </div>
    </>
  );
}
