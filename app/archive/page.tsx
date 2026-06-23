import Starfield from "@/components/Starfield";
import ArchiveNav from "@/components/ArchiveNav";
import AstroArchive from "@/components/AstroArchive";

export const dynamic = "force-static";

export default function ArchivePage() {
  return (
    // overflow-x:hidden keeps clipping; does NOT break position:sticky
    <main className="relative min-h-screen overflow-x-hidden">
      <Starfield />
      <div className="a-nebula" aria-hidden />
      <ArchiveNav />
      <AstroArchive />
    </main>
  );
}
