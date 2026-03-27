"use client";

interface SparklineBarProps {
  prices: number[];
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Tiny SVG sparkline — renders a polyline from an array of price values.
 * Non-zero height uses preserveAspectRatio="none" for compact display.
 */
export function SparklineBar({ prices, color = "var(--accent)", width = 64, height = 24 }: SparklineBarProps) {
  if (prices.length < 2) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = 2;
  const W = 100;
  const H = 100;

  const points = prices
    .map((p, i) => {
      const x = pad + (i / (prices.length - 1)) * (W - pad * 2);
      const y = H - pad - ((p - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const isUp = prices[prices.length - 1] >= prices[0];
  const strokeColor = isUp ? "var(--positive)" : "var(--negative)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      {/* Gradient fill under line */}
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? "#00D084" : "#FF3B30"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isUp ? "#00D084" : "#FF3B30"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${H} ${points} ${W - pad},${H}`}
        fill="url(#spark-fill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
