"use client";

export default function Footer({ lastUpdated, count }: { lastUpdated: string; count: number }) {
  const updated = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false })
    : "";

  return (
    <footer className="relative z-10 mt-16 pt-12 pb-10 border-t border-bg-border">
      <div className="container mx-auto px-5 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-display text-xl font-semibold neon-text">Orion Invincible</div>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-xs">
              An NGO bringing astronomy down to Gujarat — moon-gazing nights, school
              stargazing sessions, and a sky everyone can see.
            </p>
          </div>

          <div>
            <div className="section-title mb-3">Data sources</div>
            <ul className="space-y-1.5 text-sm text-ink-muted">
              <li>NASA APOD &amp; Near-Earth Objects</li>
              <li>Spaceflight News API</li>
              <li>Visible Planets API · Open Notify</li>
              <li>Groq · Llama 3.3 (summaries)</li>
            </ul>
          </div>

          <div>
            <div className="section-title mb-3">Pipeline</div>
            <ul className="space-y-1.5 text-sm text-ink-muted">
              <li>{count} articles in this feed</li>
              <li>Refreshes every 6 hours</li>
              {updated && <li className="font-mono text-xs text-ink-dim">Last: {updated} IST</li>}
            </ul>
          </div>
        </div>

        <div className="text-xs font-mono text-ink-dim text-center">
          22.2587°N · 71.1924°E — built with stardust and n8n
        </div>
      </div>
    </footer>
  );
}
