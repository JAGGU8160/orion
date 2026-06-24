"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import OrionMark from "./OrionMark";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const PAGE_LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/timeline", label: "Timeline" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect current page path on the client — avoids usePathname hook issues
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

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
          : "1px solid transparent",
      }}
    >
      {/* HUD scanline */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgb(var(--neon-cyan) / 0.5) 50%, transparent 100%)",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      <div className="container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[68px] gap-4 lg:gap-6">

          {/* LEFT — brand */}
          <Link
            href="/"
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
                  background:
                    "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
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
          </Link>

          {/* CENTER — page links (desktop only) */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-center"
            aria-label="Primary"
          >
            <ul className="flex items-center gap-1">
              {PAGE_LINKS.map((link) => {
                const isActive = activePath === link.href;
                const isHover = hovered === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      onMouseLeave={() => setHovered(null)}
                      className="relative px-3 py-2 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-200 inline-block"
                      style={{
                        color:
                          isActive || isHover
                            ? "rgb(var(--ink))"
                            : "rgb(var(--ink-muted))",
                      }}
                    >
                      <span className="relative z-10">{link.label}</span>

                      {/* hover wash */}
                      <span
                        aria-hidden
                        className="absolute inset-1 rounded-md transition-opacity duration-200 pointer-events-none"
                        style={{
                          opacity: isHover && !isActive ? 1 : 0,
                          background: "rgb(var(--ink) / 0.04)",
                        }}
                      />

                      {/* active underline */}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          layoutId="nav-underline"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                          }}
                          className="absolute left-2.5 right-2.5 -bottom-0.5 h-[1.5px] rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
                            boxShadow: "0 0 8px rgb(var(--neon-cyan) / 0.5)",
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex-1 lg:hidden" />

          {/* RIGHT — actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SearchBar />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
