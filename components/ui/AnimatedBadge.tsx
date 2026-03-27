"use client";
import { ReactNode } from "react";

interface AnimatedBadgeProps {
  children: ReactNode;
  color?: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

/**
 * AnimatedBadge — a glowing pill badge with an optional breathing pulse dot.
 * Great for showing live status, asset type labels, or alert states.
 */
export function AnimatedBadge({ children, color = "var(--accent)", pulse = false, size = "sm" }: AnimatedBadgeProps) {
  const padding = size === "md" ? "px-3 py-1" : "px-2 py-0.5";
  const textSize = size === "md" ? "text-xs" : "text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${padding} ${textSize}`}
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: color, animation: "radar-ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ background: color }}
          />
        </span>
      )}
      {children}
    </span>
  );
}
