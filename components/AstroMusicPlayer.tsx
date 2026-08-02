"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2,
} from "lucide-react";
import { playlist, CATEGORIES, type Song, type Category } from "@/lib/playlistData";

// ─── Category Filter ────────────────────────────────────────────────────────
function CategoryFilter({
  active,
  onChange,
}: {
  active: Category | "All";
  onChange: (c: Category | "All") => void;
}) {
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

// ─── Playlist ────────────────────────────────────────────────────────────────
function PlayList({
  songs,
  currentSong,
  isPlaying,
  onSelect,
}: {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSelect: (song: Song) => void;
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
            {/* Track number / playing indicator */}
            <div className="w-7 h-7 shrink-0 flex items-center justify-center">
              {isCurrent && isPlaying ? (
                <span className="flex gap-[3px] items-end h-4">
                  {[1, 2, 3].map((b) => (
                    <span
                      key={b}
                      className="w-[3px] rounded-full bg-[rgb(var(--neon-cyan))]"
                      style={{
                        height: `${40 + b * 20}%`,
                        animation: `bounce-bar ${0.6 + b * 0.1}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </span>
              ) : (
                <span
                  className={`text-xs font-mono ${isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink-dim group-hover:text-ink"}`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Cover art */}
            <div
              className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 ${
                isCurrent ? "shadow-[0_0_15px_rgba(34,211,238,0.4)]" : ""
              }`}
            >
              <Image src={song.coverArt} alt={song.title} fill className="object-cover" unoptimized />
              {isCurrent && (
                <div className="absolute inset-0 bg-[rgba(var(--neon-cyan),0.15)]" />
              )}
            </div>

            {/* Title + artist */}
            <div className="flex-1 text-left min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  isCurrent ? "text-[rgb(var(--neon-cyan))]" : "text-ink"
                }`}
              >
                {song.title}
              </p>
              <p className="text-xs text-ink-dim truncate mt-0.5 font-mono">{song.artist}</p>
            </div>

            {/* Category pill */}
            <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full border border-[rgb(var(--bg-border))] text-ink-dim shrink-0 max-w-[120px] truncate">
              {song.category.split(" & ")[0]}
            </span>

            {/* Play on hover */}
            <div
              className={`shrink-0 transition-opacity duration-200 ${
                isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {isCurrent && isPlaying ? (
                <Pause size={16} className="text-[rgb(var(--neon-cyan))]" />
              ) : (
                <Play size={16} className="text-ink-dim" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({
  progress,
  duration,
  onSeek,
}: {
  progress: number;
  duration: number;
  onSeek: (pct: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct);
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[10px] font-mono text-ink-dim w-8 text-right shrink-0">
        {fmt(progress)}
      </span>
      <div
        ref={barRef}
        onClick={handleClick}
        className="relative flex-1 h-1.5 rounded-full bg-[rgb(var(--bg-border))] cursor-pointer group"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--neon-cyan))] to-[rgb(var(--neon-violet))] transition-all duration-100"
          style={{ width: `${pct}%` }}
        />
        {/* Scrubber thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_6px_rgba(34,211,238,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
      <span className="text-[10px] font-mono text-ink-dim w-8 shrink-0">
        {fmt(duration)}
      </span>
    </div>
  );
}

// ─── Player Controls ──────────────────────────────────────────────────────────
function PlayerControls({
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolume,
}: {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (pct: number) => void;
  onVolume: (v: number) => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgb(var(--bg-border))]"
      style={{
        background: "rgba(5,6,15,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "0 -1px 40px rgba(34,211,238,0.08)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-3 space-y-2">
        {/* Progress */}
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
                  <p className="text-xs font-semibold text-[rgb(var(--neon-cyan))] truncate leading-tight">
                    {currentSong.title}
                  </p>
                  <p className="text-[10px] font-mono text-ink-dim truncate">{currentSong.artist}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-ink-dim">
                <Music2 size={18} />
                <span className="text-xs font-mono">No track selected</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onPrev}
              className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors duration-150 hover:bg-[rgba(var(--ink),0.05)]"
              aria-label="Previous"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-[rgb(var(--neon-cyan))] text-slate-950 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-lg text-ink-dim hover:text-ink transition-colors duration-150 hover:bg-[rgba(var(--ink),0.05)]"
              aria-label="Next"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-end min-w-0">
            <button
              onClick={() => onVolume(volume === 0 ? 0.8 : 0)}
              className="p-1.5 text-ink-dim hover:text-ink transition-colors"
              aria-label="Toggle mute"
            >
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolume(parseFloat(e.target.value))}
              className="w-20 accent-[rgb(var(--neon-cyan))] cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Player ─────────────────────────────────────────────────────────────
export default function AstroMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredPlaylist =
    activeCategory === "All"
      ? playlist
      : playlist.filter((s) => s.category === activeCategory);

  // Sync audio src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.url;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [currentSong]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleSelect = useCallback((song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  }, [currentSong]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const idx = filteredPlaylist.findIndex((s) => s.id === currentSong.id);
    const prev = filteredPlaylist[(idx - 1 + filteredPlaylist.length) % filteredPlaylist.length];
    setCurrentSong(prev);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!currentSong || filteredPlaylist.length === 0) return;
    const idx = filteredPlaylist.findIndex((s) => s.id === currentSong.id);
    const next = filteredPlaylist[(idx + 1) % filteredPlaylist.length];
    setCurrentSong(next);
    setIsPlaying(true);
  };

  const handleSeek = (pct: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = pct * audio.duration;
  };

  const handleCategoryChange = (cat: Category | "All") => {
    setActiveCategory(cat);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)]">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Page header */}
      <div className="px-4 pt-8 pb-4 border-b border-[rgb(var(--bg-border))]">
        <div className="max-w-3xl mx-auto flex items-end gap-4">
          <div>
            <span className="text-xs font-mono text-[rgb(var(--neon-violet))] tracking-widest uppercase">
              Invincible Project Orion
            </span>
            <h1
              className="font-display text-3xl sm:text-4xl font-bold mt-1"
              style={{
                background: "linear-gradient(90deg, rgb(var(--neon-cyan)), rgb(var(--neon-violet)))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Astro Music
            </h1>
            <p className="text-sm text-ink-dim font-mono mt-1">
              {playlist.length} tracks · curated for dark-sky sessions
            </p>
          </div>
          <div className="ml-auto pb-1">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.15))",
                border: "1px solid rgba(34,211,238,0.2)",
                boxShadow: "0 0 30px rgba(34,211,238,0.1)",
              }}
            >
              <Music2 size={22} className="text-[rgb(var(--neon-cyan))]" />
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-3xl mx-auto w-full border-b border-[rgb(var(--bg-border))]">
        <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
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
        <PlayList
          songs={filteredPlaylist}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onSelect={handleSelect}
        />
      </div>

      {/* Sticky player */}
      <PlayerControls
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        volume={volume}
        onPlayPause={togglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolume={setVolume}
      />

      {/* Bounce bar animation */}
      <style>{`
        @keyframes bounce-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}
