"use client";
import { ASSETS } from "@/lib/assets";
import { PriceData } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TickerBarProps {
  prices: Record<string, PriceData>;
  mockPrices: Record<string, PriceData>;
}

export function TickerBar({ prices, mockPrices }: TickerBarProps) {
  const items = ASSETS.map((asset) => {
    const p = asset.binanceSymbol
      ? prices[asset.binanceSymbol]
      : mockPrices[asset.symbol];
    if (!p) return null;
    const isPos = p.changePercent24h >= 0;
    return { asset, p, isPos };
  }).filter(Boolean) as Array<{
    asset: (typeof ASSETS)[0];
    p: PriceData;
    isPos: boolean;
  }>;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-b h-8 group"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--surface), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, var(--surface), transparent)",
        }}
      />
      <div className="ticker-scroll flex items-center h-full gap-6 whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={`${item.asset.id}-${i}`} className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wide"
              style={{ color: item.asset.color }}
            >
              {item.asset.symbol}
            </span>
            <span
              className="text-[10px] font-semibold tabular"
              style={{ color: "var(--text-primary)" }}
            >
              {formatPrice(item.p.price, item.asset.symbol)}
            </span>
            <span
              className={cn(
                "text-[10px] font-medium tabular",
                item.isPos ? "text-accent-green" : "text-accent-red"
              )}
            >
              {item.isPos ? "+" : ""}
              {item.p.changePercent24h.toFixed(2)}%
            </span>
            <span className="text-[--border]">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
