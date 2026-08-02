import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import AstroMusicPlayer from "@/components/AstroMusicPlayer";

export const metadata: Metadata = {
  title: "Astro Music — Soundtracks for Dark-Sky Sessions",
  description:
    "Curated space music for astronomy nights — cinematic orchestral, ambient, synthwave, and Indian epics. Perfect for star parties and telescope sessions by Invincible Project Orion.",
  keywords: [
    "astronomy music", "stargazing music", "space ambient playlist",
    "dark sky music Gujarat", "telescope session music", "Hans Zimmer space",
    "Daft Punk space music", "A.R. Rahman astronomy", "astro music player",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/astro-music" },
};

export default function AstroMusicPage() {
  return (
    <main className="relative min-h-screen">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <div className="pt-[68px]">
        <AstroMusicPlayer />
      </div>
      <Footer />
    </main>
  );
}
