"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import OrionMark from "./OrionMark";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import MobileNav, { type NavItem } from "./MobileNav";
import SpaceHubDropdown, {
  HUB_ITEMS_EXPORT,
  HUB_SECTIONS
} from "./SpaceHubDropdown";

// Top-level desktop items (4 only)
const MAIN_ITEMS: NavItem[] = [
  { id: "home", label: "Home", description: "Back to the top", section: "top" },
  { id: "stories", label: "Top Stories", description: "Editorial picks", section: "stories" },
  { id: "feed", label: "Latest News", description: "Full news feed", section: "feed" }
];

// All items for mobile drawer (flat with grouping hint)
const ALL_ITEMS: NavItem[] = [
  ...MAIN_ITEMS,
  ...HUB_ITEMS_EXPORT.map((h) => ({
    id: h.id,
    label: h.label,
    description: h.description,
    section: h.section,
    group: "hub" as const
  }))
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("top");

  // scroll-aware glass density
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section observer — watch every section that maps to a nav item
  useEffect(() => {
    const ids = ["stories", "apod", "feed"];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
          setActiveSection(top.target.id);
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

  const handleSelect = (sectionOrItem: NavItem | string) => {
    const section =
      typeof sectionOrItem === "string" ? sectionOrItem : sectionOrItem.section;
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("orion:category", { detail: null }));
    } else {
      window.dispatchEvent(new CustomEvent("orion:category", { detail: null }));
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Active id resolution
  const activeId = (() => {
    if (activeSection === "top") return "home";
    if (activeSection === "stories") return "stories";
    if (activeSection === "feed") return "feed";
    if (HUB_SECTIONS.includes(activeSection)) return "spaceHub";
    return "home";
  })();

  // For mobile drawer: granular active id including hub sub-items
  const activeMobileId = (() => {
    if (activeSection === "top") return "home";
    if (activeSection === "stories") return "stories";
    if (activeSection === "feed") return "feed";
    const hubItem = HUB_ITEMS_EXPORT.find((h) => h.section === activeSection);
    if (hubItem) return hubItem.id;
    return "home";
  })();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-[background,border,backdrop-filter] duration-300"
      style={{
        background: scrolled
          ? "rgb(var(--bg) / 0.78)"
          : "rgb(var(--bg) / 0.28)",
        backdropFilter: scrolled
          ? "blur(20px) saturate(180%)"
          : "blur(8px) saturate(140%)",
        WebkitBackdropFilter: scrolled
          ? "blur(20px) saturate(180%)"
          : "blur(8px) saturate(140%)",
        borderBottom: scrolled
          ? "1px solid rgb(var(--bg-border) / 0.7)"
          : "1px solid transparent"
      }}
    >
      {/* HUD top scanline */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgb(var(--neon-cyan) / 0.5) 50%, transparent 100%)",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.4s ease"
        }}
      />

      <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[68px] gap-4 lg:gap-6">
          {/* LEFT — Orion brand */}
          <button
            onClick={() => handleSelect("top")}
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            aria-label="Orion home"
          >
            <div className="relative w-9 h-9 text-neon-cyan group-hover:scale-105 transition-transform duration-300">
              <OrionMark className="w-full h-full" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: 1.1,
                }}
              >
                PROJECT ORION
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-muted -mt-0.5">
                Explore the universe daily
              </span>
            </div>
          </button>

          {/* CENTER — desktop nav (4 items) */}
          <nav className="hidden lg:flex flex-1 items-center justify-center" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {MAIN_ITEMS.map((item) => {
                const isActive = item.id === activeId;
                const isHover = hovered === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="relative px-3 py-2 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-200"
                      style={{
                        color: isActive
                          ? "rgb(var(--ink))"
                          : isHover
                          ? "rgb(var(--ink))"
                          : "rgb(var(--ink-muted))"
                      }}
                    >
                      <span className="relative z-10">{item.label}</span>

                      <span
                        aria-hidden
                        className="absolute inset-1 rounded-md transition-opacity duration-200 pointer-events-none"
                        style={{
                          opacity: isHover && !isActive ? 1 : 0,
                          background: "rgb(var(--ink) / 0.04)"
                        }}
                      />

                      {isActive && (
                        <motion.span
                          aria-hidden
                          layoutId="nav-underline"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          className="absolute left-2.5 right-2.5 -bottom-0.5 h-[1.5px] rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
                            boxShadow: "0 0 8px rgb(var(--neon-cyan) / 0.5)"
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}

              {/* Space Hub dropdown */}
              <li>
                <SpaceHubDropdown
                  isActive={activeId === "spaceHub"}
                  activeSection={activeSection}
                  onSelect={(s) => handleSelect(s)}
                />
              </li>
            </ul>
          </nav>

          <div className="flex-1 lg:hidden" />

          {/* RIGHT — actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SearchBar />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <MobileNav
              items={ALL_ITEMS}
              activeId={activeMobileId}
              onSelect={(it) => handleSelect(it)}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
