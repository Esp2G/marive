"use client";
import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  isLive: boolean;
  className?: string;
}

export function LiveIndicator({ isLive, className }: LiveIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative flex items-center justify-center w-2 h-2">
        {isLive && (
          <span className="absolute inline-flex w-full h-full rounded-full bg-accent-green opacity-60 radar-ping" />
        )}
        <span
          className={cn(
            "relative inline-flex w-2 h-2 rounded-full",
            isLive ? "bg-accent-green" : "bg-text-tertiary"
          )}
        />
      </div>
      <span className="text-xs font-medium tracking-wide" style={{ color: isLive ? "var(--positive)" : "var(--text-tertiary)" }}>
        {isLive ? "LIVE" : "OFFLINE"}
      </span>
    </div>
  );
}
