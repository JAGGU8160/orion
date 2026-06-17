import Starfield from "@/components/Starfield";
import DaytimeSky from "@/components/DaytimeSky";
import Navbar from "@/components/Navbar";
import AstroArchive from "@/components/AstroArchive";

export const dynamic = "force-static";

export default function ArchivePage() {
  return (
    // overflow-x-hidden keeps horizontal clipping but does NOT break position:sticky
    <main className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <DaytimeSky />
      <Navbar />
      <AstroArchive />
    </main>
  );
}
