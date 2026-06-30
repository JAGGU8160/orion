import type { Metadata } from "next";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import AstroArchive from "@/components/AstroArchive";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Space Timeline — Historic Astronomy Milestones",
  description:
    "Explore 500+ space milestones from 1801 to today — moon landings, Mars missions, telescope discoveries, and Gujarat's astronomical heritage. Curated by Invincible Project Orion.",
  keywords: [
    "space history timeline", "astronomy milestones India", "moon landing history",
    "Mars mission timeline", "ISRO history Gujarat", "space exploration milestones",
    "astronomy events Ahmedabad", "Hubble telescope discoveries", "JWST discoveries",
    "Invincible Project Orion timeline",
  ],
  alternates: { canonical: "https://orion-space-digest.vercel.app/timeline" },
  openGraph: {
    title: "Space Timeline — 500+ Astronomy Milestones | Orion Space Digest",
    description: "From 1801 to today — explore historic space missions, moon phases, and astronomical discoveries curated for Gujarat.",
    url: "https://orion-space-digest.vercel.app/timeline",
    type: "website",
  },
};

export default function TimelinePage() {
  return (
    <main className="relative min-h-screen" style={{ overflowX: "clip" }}>
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <Navbar />
      <AstroArchive />
    </main>
  );
}
