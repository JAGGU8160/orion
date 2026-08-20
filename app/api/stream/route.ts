import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No song ID" }, { status: 400 });

  try {
    const res = await fetch(`https://saavn.dev/api/songs?id=${id}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`saavn.dev status ${res.status}`);
    const data = await res.json();

    const song = data.data?.[0];
    if (!song) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    const urls: { quality: string; url: string }[] = song.downloadUrl ?? [];
    const best =
      urls.find((u) => u.quality === "320kbps") ??
      urls.find((u) => u.quality === "160kbps") ??
      urls.find((u) => u.quality === "96kbps") ??
      urls[urls.length - 1];

    if (!best?.url) return NextResponse.json({ error: "No stream URL" }, { status: 404 });

    return NextResponse.json({
      url: best.url,
      quality: best.quality,
      title: song.name,
      artist: song.artists?.primary?.[0]?.name,
      duration: song.duration,
      image: song.image?.[2]?.url ?? song.image?.[1]?.url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
