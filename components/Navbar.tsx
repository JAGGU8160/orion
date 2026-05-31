"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PlanetIcon,
  StarIcon,
  NebulaIcon,
  CometIcon,
  OrbitIcon,
  SignalIcon
} from "./NavIcons";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

type NavItem = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ hovered: boolean }>;
};

const ITEMS: NavItem[] = [
  { id: "top", label: "Cosmos", Icon: PlanetIcon },
  { id: "sky", label: "Stars", Icon: StarIcon },
  { id: "apod", label: "Nebula", Icon: NebulaIcon },
  { id: "asteroids", label: "Comets", Icon: CometIcon },
  { id: "iss", label: "Orbit", Icon: OrbitIcon },
  { id: "feed", label: "Signals", Icon: SignalIcon }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ITEMS.filter((i) => i.id !== "top").map((i) => i.id);
    const observers: IntersectionObserver[] = [];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(top.target.id);
        } else if (window.scrollY < 200) {
          setActive("top");
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    observers.push(obs);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b border-bg-border/60"
          : "backdrop-blur-md border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? "rgb(var(--bg) / 0.78)"
          : "rgb(var(--bg) / 0.35)"
      }}
    >
      <div className="container mx-auto px-4 sm:px-5 max-w-7xl flex items-center gap-3 h-16">
        <a
          href="#top"
          onClick={handleClick("top")}
          className="flex items-center gap-2 group shrink-0 mr-2"
        >
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            🛸
          </motion.span>
          <span className="font-display font-bold text-base sm:text-lg neon-text hidden sm:inline">
            Orion
          </span>
        </a>

        <nav className="flex-1 hidden md:flex items-center justify-center gap-1">
          {ITEMS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            const isHover = hovered === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={handleClick(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <Icon hovered={isHover || isActive} />
                <span className="hidden lg:inline">{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: "rgb(var(--neon-cyan) / 0.1)",
                      border: "1px solid rgb(var(--neon-cyan) / 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <nav className="flex-1 md:hidden flex items-center justify-center gap-0.5 overflow-x-auto">
          {ITEMS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={handleClick(id)}
                aria-label={label}
                title={label}
                className={`nav-item px-2 ${isActive ? "nav-item-active" : ""}`}
              >
                <Icon hovered={isActive} />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
