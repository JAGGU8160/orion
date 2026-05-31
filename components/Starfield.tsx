"use client";

import { useEffect, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  twinkle: number;
  twinklePhase: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sync = () => {
      setHidden(document.documentElement.getAttribute("data-theme") === "light");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStar: { x: number; y: number; life: number } | null = null;
    let raf = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const count = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 * window.devicePixelRatio + 0.3,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        twinkle: 0.4 + Math.random() * 0.6,
        twinklePhase: Math.random() * Math.PI * 2
      }));
    };

    const getThemeAlpha = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--starfield-alpha").trim();
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 1;
    };
    const getInkRgb = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
      const parts = (v || "226 232 240").split(/\s+/);
      return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
    };

    const draw = (t: number) => {
      const themeAlpha = getThemeAlpha();
      const ink = getInkRgb();
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const flicker = reduced ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 + s.twinklePhase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ink}, ${s.twinkle * flicker * themeAlpha})`;
        ctx.fill();

        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }
      }

      if (!reduced) {
        if (!shootingStar && Math.random() < 0.0015) {
          shootingStar = {
            x: Math.random() * width * 0.6,
            y: Math.random() * height * 0.4,
            life: 1
          };
        }
        if (shootingStar) {
          const len = 120 * window.devicePixelRatio;
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x + len,
            shootingStar.y + len
          );
          grad.addColorStop(0, `rgba(34, 211, 238, ${shootingStar.life * themeAlpha})`);
          grad.addColorStop(1, "rgba(34, 211, 238, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * window.devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x + len, shootingStar.y + len);
          ctx.stroke();
          shootingStar.x += 8 * window.devicePixelRatio;
          shootingStar.y += 8 * window.devicePixelRatio;
          shootingStar.life -= 0.02;
          if (shootingStar.life <= 0) shootingStar = null;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
