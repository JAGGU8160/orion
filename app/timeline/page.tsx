import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import AstroArchive from "@/components/AstroArchive";

export const dynamic = "force-static";

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
