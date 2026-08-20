"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, Loader2 } from "lucide-react";
import { playlist, CATEGORIES, type Song, type Category } from "@/lib/playlistData";

// ─── Category Filter ──────────────────────────────────────────────────────────
function CategoryFilter({ active, onChange }: { active: Category | "All"; onChange: (c: Category | "All") => void }) {
  return (
    <div className="flex gap-2 flex-wrap px-4 py-3">
      {(["All", ...CATEGORIES] as const).map((cat) => {
        const isActive = active === cat;
        return (
          <button key={cat} onClick={() => onChange(cat as Category | "All")}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide transition-all duration-200 border whitespace-nowrap ${
              isActive
                ? "border-[rgb(var(--neon-cyan))] text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.1)] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                : "border-[rgb(var(--bg-border))] text-ink-dim hover:text-ink hover:border-[rgba(var(--neon-cyan),0.4)]"
            }`}>
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ─── Playlist ─────────────────────────────────────────────────────────────────
function PlayList({ songs, currentSong, isPlaying, loading, onSelect }: {
  songs: Song[]; currentSong: Song | null; isPlaying: boolean; loading: boolean; onSelect: (s: Song) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-ink-dim">
          <Music2 size={40} className="mb-3 opacity-30" />
          <p className="font-mono text-sm">No tracks in this category</p>
        </div>
      )}
      {songs.map((song, idx) => {
        const isCurrent = currentSong?.id === song.id;
        const isUnavailable = song.saavnId === "TODO";
        return (
          <button key={song.id} onClick={() => !isUnavailable && onSelect(song)} disabled={isUnavailable}
            className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 group border-b border-[rgb(var(--bg-border))] last:border-0 ${
              isUnavailable ? "opacity-40 cursor-not-allowed" :
              isCurrent ? "bg-[rgba(var(--neon-cyan),0.06)]" : "hover:bg-[rgba(var(--ink),0.03)]"
            }`}>

            {/* Number / bars / loader */}
            <div className="w-7 h-7 shrink-0 flex items-center justify-center">
              {isCurrent && loading ? (
                <Loader2 size={14} className="text-[rgb(var(--neon-cyan))] animate-spin" />
              ) : isCurrent && isPlaying ? (
                <span className="flex gap-[3px] items-end h-4">
                  {[1, 2, 3].map((b) => (
                    <span key={b} className="w-[3px] rounded-full bg-[rgb(var(--neon-cyan))]"
                      style={{ height: `${40 + b * 20}%`, animation: `bounce-bar ${0.6 + b * 0.1}s ease-in-out infinite alternate` }} />
                  ))}
                </span>
              ) : (
                <span className={`text-xs font-mono ${isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink-dim group-hover:text-ink"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Cover */}
            <div className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ${isCurrent ? "shadow-[0_0_15px_rgba(34,211,238,0.4)]" : ""}`}>
              <Image src={song.coverArt} alt={song.title} fill className="object-cover" unoptimized />
              {isCurrent && <div className="absolute inset-0 bg-[rgba(var(--neon-cyan),0.15)]" />}
            </div>

            {/* Title + artist */}
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink"}`}>{song.title}</p>
              <p className="text-xs text-ink-dim truncate mt-0.5 font-mono">
                {song.artist}
                {isUnavailable && <span className="ml-2 text-[10px] text-ink-dim opacity-50">· add saavnId</span>}
              </p>
            </div>

            {/* Category pill */}
            <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full border border-[rgb(var(--bg-border))] text-ink-dim shrink-0 max-w-[120px] truncate">
              {song.category.split(" & ")[0]}
            </span>

            {/* Play icon on hover */}
            {!isUnavailable && (
              <div className={`shrink-0 transition-opacity ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {isCurrent && isPlaying ? <Pause size={15} className="text-[rgb(var(--neon-cyan))]" /> : <Play size={15} className="text-ink-dim" />}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress, duration, onSeek }: { progress: number; duration: number; onSeek: (pct: number) => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] font-mono text-ink-dim w-8 text-right shrink-0">{fmt(progress)}</span>
      <div ref={barRef} onClick={(e) => { const r = barRef.current!.getBoundingClientRect(); onSeek((e.clientX - r.left) / r.width); }}
        className="relative flex-1 h-1.5 rounded-full bg-[rgb(var(--bg-border))] cursor-pointer group">
        <div className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--neon-cyan))] to-[rgb(var(--neon-violet))] transition-all duration-100" style={{ width: `${pct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_6px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${pct}% - 6px)` }} />
      </div>
      <span className="text-[10px] font-mono text-ink-dim w-8 shrink-0">{fmt(duration)}</span>
    </div>
  );
}

// ─── Player Controls ──────────────────────────────────────────────────────────
function PlayerControls({ currentSong, isPlaying, loading, progress, duration, volume, onPlayPause, onPrev, onNext, onSeek, onVolume }: {
  currentSong: Song | null; isPlaying: boolean; loading: boolean; progress: number; duration: number; volume: number;
  onPlayPause: () => void; onPrev: () => void; onNext: () => void; onSeek: (pct: number) => void; onVolume: (v: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgb(var(--bg-border))]"
      style={{ background: "rgba(5,6,15,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 -1px 40px rgba(34,211,238,0.08)" }}>
      <div className="max-w-3xl mx-auto px-4 py-3 space-y-2">
        <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentSong ? (
              <>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <Image src={currentSong.coverArt} alt={currentSong.title} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[rgb(var(--neon-cyan))] truncate">{currentSong.title}</p>
                  <p className="text-[10px] font-mono text-ink-dim truncate">{currentSong.artist}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-ink-dim">
                <Music2 size={18} />
                <span className="text-xs font-mono">Select a track</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button onClick={onPrev} className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors"><SkipBack size={18} /></button>
            <button onClick={onPlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgb(var(--neon-cyan))] text-slate-950 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
            </button>
            <button onClick={onNext} className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors"><SkipForward size={18} /></button>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
            <button onClick={() => onVolume(volume === 0 ? 0.8 : 0)} className="p-1.5 text-ink-dim hover:text-ink transition-colors">
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input type="range" min={0} max={100} step={1} value={Math.round(volume * 100)}
              onChange={(e) => onVolume(parseInt(e.target.value) / 100)}
              className="w-20 accent-[rgb(var(--neon-cyan))] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Player ──────────────────────────────────────────────────────────────
export default function AstroMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredPlaylist = activeCategory === "All" ? playlist : playlist.filter((s) => s.category === activeCategory);

  // Fetch stream URL from our proxy API, then play
  const playSong = useCallback(async (song: Song) => {
    if (song.saavnId === "TODO") return;
    setCurrentSong(song);
    setIsPlaying(false);
    setLoading(true);
    setProgress(0);
    setDuration(0);
    setStreamUrl(null);
    try {
      const res = await fetch(`/api/stream?id=${song.saavnId}`);
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "No URL");
      setStreamUrl(data.url);
      // Use image from JioSaavn if available (richer cover art)
    } catch (err) {
      console.error("Stream fetch failed:", err);
      setLoading(false);
    }
  }, []);

  // Play audio when streamUrl is set
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;
    audio.src = streamUrl;
    audio.volume = volume;
    audio.play()
      .then(() => { setIsPlaying(true); setLoading(false); })
      .catch(() => { setIsPlaying(false); setLoading(false); });
  }, [streamUrl]);

  // Sync volume
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) { audio.pause(); } else { audio.play().catch(() => {}); }
  };

  const handleNext = useCallback(() => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const available = filteredPlaylist.filter((s) => s.saavnId !== "TODO");
    if (!available.length) return;
    const idx = available.findIndex((s) => s.id === currentSong.id);
    playSong(available[(idx + 1) % available.length]);
  }, [currentSong, filteredPlaylist, playSong]);

  const handlePrev = useCallback(() => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const available = filteredPlaylist.filter((s) => s.saavnId !== "TODO");
    if (!available.length) return;
    const idx = available.findIndex((s) => s.id === currentSong.id);
    playSong(available[(idx - 1 + available.length) % available.length]);
  }, [currentSong, filteredPlaylist, playSong]);

  const handleSeek = (pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = pct * audio.duration;
  };

  const handleSelect = useCallback((song: Song) => {
    if (currentSong?.id === song.id) togglePlay();
    else playSong(song);
  }, [currentSong, playSong]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)]">
      <audio ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleNext}
      />

      {/* Header */}
      <div className="px-4 pt-8 pb-4 border-b border-[rgb(var(--bg-border))]">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          <div>
            <span className="text-xs font-mono text-[rgb(var(--neon-violet))] tracking-widest uppercase">Invincible Project Orion</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1"
              style={{ background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Astro Music
            </h1>
            <p className="text-sm text-ink-dim font-mono mt-1">
              {playlist.filter(s => s.saavnId !== "TODO").length} / {playlist.length} tracks ready · dark-sky sessions · JioSaavn
            </p>
          </div>
          <div className="ml-auto pb-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15),rgba(139,92,246,0.15))", border: "1px solid rgba(34,211,238,0.2)" }}>
              <Music2 size={22} className="text-[rgb(var(--neon-cyan))]" />
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-3xl mx-auto w-full border-b border-[rgb(var(--bg-border))]">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 py-2">
        <p className="text-xs font-mono text-ink-dim">
          {filteredPlaylist.length} tracks{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full flex-1">
        <PlayList songs={filteredPlaylist} currentSong={currentSong} isPlaying={isPlaying} loading={loading} onSelect={handleSelect} />
      </div>

      <PlayerControls
        currentSong={currentSong} isPlaying={isPlaying} loading={loading}
        progress={progress} duration={duration} volume={volume}
        onPlayPause={togglePlay} onPrev={handlePrev} onNext={handleNext}
        onSeek={handleSeek} onVolume={setVolume}
      />

      <style>{`@keyframes bounce-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1.0); } }`}</style>
    </div>
  );
}
