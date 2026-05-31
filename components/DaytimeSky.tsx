"use client";

import { useEffect, useState } from "react";

function useIsLightTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const update = () =>
      setLight(document.documentElement.getAttribute("data-theme") === "light");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);
  return light;
}

function Sun() {
  const rays = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div
      className="absolute top-10 right-8 sm:top-12 sm:right-14 w-40 h-40 sm:w-56 sm:h-56 pointer-events-none"
      aria-hidden
    >
      {/* outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(254, 215, 170, 0.85), rgba(254, 240, 138, 0.35) 35%, transparent 70%)"
        }}
      />
      {/* spinning rays */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ animation: "orion-sun-spin 80s linear infinite", transformOrigin: "center" }}
      >
        {rays.map((i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const inner = 56;
          const outer = 86;
          const x1 = 100 + Math.cos(angle) * inner;
          const y1 = 100 + Math.sin(angle) * inner;
          const x2 = 100 + Math.cos(angle) * outer;
          const y2 = 100 + Math.sin(angle) * outer;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#f59e0b"
              strokeOpacity={i % 2 === 0 ? 0.85 : 0.55}
              strokeWidth={i % 2 === 0 ? 4 : 2.4}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {/* core */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] h-[42%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #fef9c3, #fde047 35%, #f59e0b 80%)",
          boxShadow:
            "0 0 36px rgba(251, 191, 36, 0.7), 0 0 70px rgba(251, 191, 36, 0.4)"
        }}
      />
    </div>
  );
}

type CloudDef = {
  top: string;
  scale: number;
  opacity: number;
  duration: number;
  delay: number;
  reverse?: boolean;
};

const CLOUDS: CloudDef[] = [
  { top: "12%", scale: 0.9, opacity: 0.7, duration: 95, delay: 0 },
  { top: "32%", scale: 1.3, opacity: 0.55, duration: 130, delay: -40, reverse: true },
  { top: "55%", scale: 0.75, opacity: 0.6, duration: 110, delay: -70 },
  { top: "72%", scale: 1.05, opacity: 0.45, duration: 150, delay: -20, reverse: true },
  { top: "88%", scale: 0.8, opacity: 0.55, duration: 120, delay: -90 }
];

function Cloud({ scale, opacity }: { scale: number; opacity: number }) {
  return (
    <svg
      viewBox="0 0 220 90"
      style={{ width: `${220 * scale}px`, opacity }}
      aria-hidden
    >
      <defs>
        <radialGradient id="cloudGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <g fill="url(#cloudGrad)">
        <ellipse cx="40" cy="55" rx="36" ry="22" />
        <ellipse cx="80" cy="42" rx="48" ry="32" />
        <ellipse cx="135" cy="50" rx="42" ry="26" />
        <ellipse cx="178" cy="58" rx="32" ry="20" />
      </g>
    </svg>
  );
}

export default function DaytimeSky() {
  const light = useIsLightTheme();
  if (!light) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <Sun />
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: 0,
            animation: `${
              c.reverse ? "orion-cloud-drift-rev" : "orion-cloud-drift"
            } ${c.duration}s linear infinite`,
            animationDelay: `${c.delay}s`
          }}
        >
          <Cloud scale={c.scale} opacity={c.opacity} />
        </div>
      ))}

      {/* warm horizon glow at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(254, 215, 170, 0.55), transparent)"
        }}
      />
    </div>
  );
}
