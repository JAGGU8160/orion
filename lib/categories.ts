import type { Category } from "./types";

// Per-category CSS variable tokens. Defined per-theme in globals.css.
const CAT_TOKEN: Record<Category, string> = {
  Launch: "--cat-launch",
  General: "--cat-discoveries",
  Asteroid: "--cat-asteroid",
  LocalSky: "--cat-sky",
  APOD: "--cat-apod",
  ISS: "--cat-iss"
};

const CAT_ICON: Record<Category, string> = {
  Launch: "🚀",
  General: "🌌",
  Asteroid: "☄️",
  LocalSky: "🌙",
  APOD: "📸",
  ISS: "🛰"
};

const CAT_LABEL: Record<Category, string> = {
  Launch: "Launch",
  General: "Discovery",
  Asteroid: "Asteroid",
  LocalSky: "Sky Tonight",
  APOD: "APOD",
  ISS: "Mission"
};

export function categoryToken(cat: Category): string {
  return CAT_TOKEN[cat] || "--neon-cyan";
}

export function categoryColor(cat: Category, alpha = 1): string {
  return `rgb(var(${categoryToken(cat)}) / ${alpha})`;
}

export function categoryIcon(cat: Category): string {
  return CAT_ICON[cat] || "✦";
}

export function categoryLabel(cat: Category): string {
  return CAT_LABEL[cat] || cat;
}
