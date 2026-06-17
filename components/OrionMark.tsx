"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function ConstellationSVG() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full text-neon-cyan" aria-hidden>
      <defs>
        <radialGradient id="orion-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="6.5" y1="22" x2="25.5" y2="10" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="9" fill="url(#orion-glow)" />
      <circle cx="7" cy="21.5" r="1.8" fill="currentColor" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      <circle cx="25" cy="10.5" r="1.8" fill="currentColor" />
      <line x1="16" y1="12" x2="16" y2="20" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.4" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.4" />
    </svg>
  );
}

type Theme = "dark" | "light";

export default function OrionMark({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const update = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
      setImgFailed(false); // give the new src a chance to load
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);

  const src = theme === "light" ? "/blacklogo.png" : "/whitelogo.png";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      {/* SVG fallback only shows if both PNGs fail */}
      {imgFailed && (
        <div className="absolute inset-0 flex items-center justify-center p-1">
          <ConstellationSVG />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt="Project Orion"
        onError={() => setImgFailed(true)}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </motion.div>
  );
}
