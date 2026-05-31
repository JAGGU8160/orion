function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function Highlight({
  text,
  query
}: {
  text: string;
  query: string;
}) {
  const q = query.trim();
  if (!q || !text) return <>{text}</>;

  const pattern = new RegExp(`(${escapeRegex(q)})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded px-0.5 py-px font-semibold"
            style={{
              background: "rgb(var(--neon-cyan) / 0.22)",
              color: "rgb(var(--neon-cyan))",
              boxShadow: "0 0 0 1px rgb(var(--neon-cyan) / 0.4)"
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
