"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2, ExternalLink,
} from "lucide-react";
import { playlist, CATEGORIES, type Song, type Category } from "@/lib/playlistData";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// ─── Category Filter ──────────────────────────────────────────────────────────
function CategoryFilter({ active, onChange }: { active: Category | "All"; onChange: (c: Category | "All") => void }) {
  const all = ["All", ...CATEGORIES] as const;
  return (
    <div className="flex gap-2 flex-wrap px-4 py-3">
      {all.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat as Category | "All")}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide transition-all duration-200 border whitespace-nowrap ${
              isActive
                ? "border-[rgb(var(--neon-cyan))] text-[rgb(var(--neon-cyan))] bg-[rgba(var(--neon-cyan),0.1)] shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                : "border-[rgb(var(--bg-border))] text-ink-dim hover:text-ink hover:border-[rgba(var(--neon-cyan),0.4)] bg-transparent"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ─── Playlist ─────────────────────────────────────────────────────────────────
function PlayList({ songs, currentSong, isPlaying, onSelect }: {
  songs: Song[]; currentSong: Song | null; isPlaying: boolean; onSelect: (song: Song) => void;
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
        return (
          <button
            key={song.id}
            onClick={() => onSelect(song)}
            className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 group border-b border-[rgb(var(--bg-border))] last:border-0 ${
              isCurrent
                ? "bg-[rgba(var(--neon-cyan),0.06)] shadow-[inset_0_0_20px_rgba(34,211,238,0.04)]"
                : "hover:bg-[rgba(var(--ink),0.03)]"
            }`}
          >
            {/* Track number / playing bars */}
            <div className="w-7 h-7 shrink-0 flex items-center justify-center">
              {isCurrent && isPlaying ? (
                <span className="flex gap-[3px] items-end h-4">
                  {[1, 2, 3].map((b) => (
                    <span
                      key={b}
                      className="w-[3px] rounded-full bg-[rgb(var(--neon-cyan))]"
                      style={{ height: `${40 + b * 20}%`, animation: `bounce-bar ${0.6 + b * 0.1}s ease-in-out infinite alternate` }}
                    />
                  ))}
                </span>
              ) : (
                <span className={`text-xs font-mono ${isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink-dim group-hover:text-ink"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Cover art */}
            <div className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ${isCurrent ? "shadow-[0_0_15px_rgba(34,211,238,0.4)]" : ""}`}>
              <Image src={song.coverArt} alt={song.title} fill className="object-cover" unoptimized />
              {isCurrent && <div className="absolute inset-0 bg-[rgba(var(--neon-cyan),0.15)]" />}
            </div>

            {/* Title + artist */}
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink"}`}>
                {song.title}
              </p>
              <p className="text-xs text-ink-dim truncate mt-0.5 font-mono">{song.artist}</p>
            </div>

            {/* Category pill */}
            <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full border border-[rgb(var(--bg-border))] text-ink-dim shrink-0 max-w-[120px] truncate">
              {song.category.split(" & ")[0]}
            </span>

            {/* YouTube link */}
            <a
              href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-1.5 text-ink-dim hover:text-[rgb(var(--neon-cyan))] opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Open on YouTube"
            >
              <ExternalLink size={13} />
            </a>
          </button>
        );
      })}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress, duration, onSeek }: { progress: number; duration: number; onSeek: (pct: number) => void }) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] font-mono text-ink-dim w-8 text-right shrink-0">{fmt(progress)}</span>
      <div ref={barRef} onClick={handleClick} className="relative flex-1 h-1.5 rounded-full bg-[rgb(var(--bg-border))] cursor-pointer group">
        <div className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--neon-cyan))] to-[rgb(var(--neon-violet))] transition-all duration-100" style={{ width: `${pct}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_6px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${pct}% - 6px)` }} />
      </div>
      <span className="text-[10px] font-mono text-ink-dim w-8 shrink-0">{fmt(duration)}</span>
    </div>
  );
}

// ─── Player Controls ──────────────────────────────────────────────────────────
function PlayerControls({ currentSong, isPlaying, progress, duration, volume, onPlayPause, onPrev, onNext, onSeek, onVolume }: {
  currentSong: Song | null; isPlaying: boolean; progress: number; duration: number; volume: number;
  onPlayPause: () => void; onPrev: () => void; onNext: () => void; onSeek: (pct: number) => void; onVolume: (v: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgb(var(--bg-border))]"
      style={{ background: "rgba(5,6,15,0.95)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", boxShadow: "0 -1px 40px rgba(34,211,238,0.08)" }}>
      <div className="max-w-3xl mx-auto px-4 py-3 space-y-2">
        <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
        <div className="flex items-center gap-3">
          {/* Song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentSong ? (
              <>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  <Image src={currentSong.coverArt} alt={currentSong.title} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[rgb(var(--neon-cyan))] truncate leading-tight">{currentSong.title}</p>
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

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button onClick={onPrev} className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors hover:bg-[rgba(var(--ink),0.05)]" aria-label="Previous">
              <SkipBack size={18} />
            </button>
            <button onClick={onPlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-[rgb(var(--neon-cyan))] text-slate-950 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
            </button>
            <button onClick={onNext} className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors hover:bg-[rgba(var(--ink),0.05)]" aria-label="Next">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-end min-w-0">
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
  const ytPlayerRef = useRef<any>(null);
  const ytReadyRef = useRef(false);
  const pendingSongRef = useRef<string | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredPlaylist = activeCategory === "All" ? playlist : playlist.filter((s) => s.category === activeCategory);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (document.getElementById("yt-api-script")) return;
    const tag = document.createElement("script");
    tag.id = "yt-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player("yt-hidden-player", {
        height: "1",
        width: "1",
        videoId: "",
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: () => {
            ytReadyRef.current = true;
            ytPlayerRef.current.setVolume(80);
            if (pendingSongRef.current) {
              ytPlayerRef.current.loadVideoById(pendingSongRef.current);
              pendingSongRef.current = null;
            }
          },
          onStateChange: (e: any) => {
            // YT.PlayerState: ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3
            if (e.data === 0) handleNextRef.current?.();
            setIsPlaying(e.data === 1);
          },
        },
      });
    };
  }, []);

  // Poll progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (!ytPlayerRef.current || !isPlaying) return;
      try {
        setProgress(ytPlayerRef.current.getCurrentTime() || 0);
        setDuration(ytPlayerRef.current.getDuration() || 0);
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync volume to YT player
  useEffect(() => {
    if (ytPlayerRef.current && ytReadyRef.current) {
      ytPlayerRef.current.setVolume(Math.round(volume * 100));
    }
  }, [volume]);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setProgress(0);
    if (ytReadyRef.current && ytPlayerRef.current) {
      ytPlayerRef.current.loadVideoById(song.youtubeId);
      setIsPlaying(true);
    } else {
      pendingSongRef.current = song.youtubeId;
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong || !ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  }, [currentSong, isPlaying]);

  const handlePrev = useCallback(() => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const idx = filteredPlaylist.findIndex((s) => s.id === currentSong.id);
    playSong(filteredPlaylist[(idx - 1 + filteredPlaylist.length) % filteredPlaylist.length]);
  }, [currentSong, filteredPlaylist, playSong]);

  const handleNext = useCallback(() => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const idx = filteredPlaylist.findIndex((s) => s.id === currentSong.id);
    playSong(filteredPlaylist[(idx + 1) % filteredPlaylist.length]);
  }, [currentSong, filteredPlaylist, playSong]);

  // Store handleNext in a ref so the YT onStateChange closure can call it
  const handleNextRef = useRef(handleNext);
  useEffect(() => { handleNextRef.current = handleNext; }, [handleNext]);

  const handleSeek = (pct: number) => {
    if (!ytPlayerRef.current || !ytReadyRef.current) return;
    const dur = ytPlayerRef.current.getDuration();
    if (dur) ytPlayerRef.current.seekTo(pct * dur, true);
  };

  const handleSelect = useCallback((song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  }, [currentSong, togglePlay, playSong]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)]">
      {/* Hidden YouTube player div */}
      <div id="yt-hidden-player" style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />

      {/* Page header */}
      <div className="px-4 pt-8 pb-4 border-b border-[rgb(var(--bg-border))]">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          <div>
            <span className="text-xs font-mono text-[rgb(var(--neon-violet))] tracking-widest uppercase">Invincible Project Orion</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1"
              style={{ background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Astro Music
            </h1>
            <p className="text-sm text-ink-dim font-mono mt-1">{playlist.length} tracks · curated for dark-sky sessions · powered by YouTube</p>
          </div>
          <div className="ml-auto pb-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(34,211,238,0.2)", boxShadow: "0 0 30px rgba(34,211,238,0.1)" }}>
              <Music2 size={22} className="text-[rgb(var(--neon-cyan))]" />
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-3xl mx-auto w-full border-b border-[rgb(var(--bg-border))]">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Track count */}
      <div className="max-w-3xl mx-auto w-full px-4 py-2">
        <p className="text-xs font-mono text-ink-dim">
          {filteredPlaylist.length} track{filteredPlaylist.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
        </p>
      </div>

      {/* Playlist */}
      <div className="max-w-3xl mx-auto w-full flex-1">
        <PlayList songs={filteredPlaylist} currentSong={currentSong} isPlaying={isPlaying} onSelect={handleSelect} />
      </div>

      {/* Sticky player */}
      <PlayerControls
        currentSong={currentSong} isPlaying={isPlaying} progress={progress} duration={duration} volume={volume}
        onPlayPause={togglePlay} onPrev={handlePrev} onNext={handleNext} onSeek={handleSeek} onVolume={setVolume}
      />

      <style>{`@keyframes bounce-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1.0); } }`}</style>
    </div>
  );
}
