export function RuneCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`animate-rune-spin ${className}`}
      aria-hidden
    >
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="oklch(0.82 0.16 220 / 0.4)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="none" stroke="oklch(0.82 0.16 220 / 0.4)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="oklch(0.82 0.16 220 / 0.6)" strokeWidth="0.8" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="oklch(0.82 0.16 220 / 0.3)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="98" fill="url(#rg)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 100 + Math.cos(angle) * 88;
        const y = 100 + Math.sin(angle) * 88;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.82 0.16 220 / 0.8)"
            fontSize="8"
            fontFamily="Cinzel"
          >
            {["ᚠ", "ᚱ", "ᛟ", "ᛊ", "ᛏ", "ᛗ", "ᛟ", "ᚢ", "ᚱ", "ᚾ", "ᛖ", "ᛞ"][i]}
          </text>
        );
      })}
    </svg>
  );
}
