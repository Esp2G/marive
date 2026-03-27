"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Star, Search } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { Asset, PriceData, WatchlistItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { PriceCardSkeleton } from "./SkeletonLoader";
import { MagicBorder } from "./ui/MagicBorder";

interface WatchlistProps {
  items: WatchlistItem[];
  prices: Record<string, PriceData>;
  mockPrices: Record<string, PriceData>;
  selectedAsset: Asset;
  onSelect: (asset: Asset) => void;
  onAdd: (assetId: string) => void;
  onRemove: (assetId: string) => void;
  isLoading: boolean;
}

export function Watchlist({
  items,
  prices,
  mockPrices,
  selectedAsset,
  onSelect,
  onAdd,
  onRemove,
  isLoading,
}: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const watchedAssets = items
    .map((item) => ASSETS.find((a) => a.id === item.assetId))
    .filter(Boolean) as Asset[];

  const unwatchedAssets = ASSETS.filter(
    (a) => !items.find((i) => i.assetId === a.id)
  ).filter((a) => 
    a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriceData = (asset: Asset): PriceData | undefined => {
    if (asset.binanceSymbol) return prices[asset.binanceSymbol];
    return mockPrices[asset.symbol];
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      <div className="flex flex-col gap-3 px-4 py-3 shrink-0 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={13} style={{ color: "var(--accent)" }} fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              Watchlist
            </span>
          </div>
          <span className="text-xs tabular" style={{ color: "var(--text-tertiary)" }}>
            {items.length} / {ASSETS.length}
          </span>
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface-secondary)] text-[var(--text-primary)] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Watched */}
        <AnimatePresence initial={false}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PriceCardSkeleton key={i} />
              ))
            : watchedAssets.map((asset) => {
                const p = getPriceData(asset);
                const isSelected = asset.id === selectedAsset.id;
                const isPos = (p?.changePercent24h ?? 0) >= 0;

                return (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-100 relative border-b border-[var(--border)]/30",
                      isSelected ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                    )}
                    onClick={() => onSelect(asset)}
                  >
                    {isSelected && <MagicBorder />}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm overflow-hidden relative z-10"
                      style={{ background: `${asset.color}18`, color: asset.color }}
                    >
                      {asset.icon}
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {asset.symbol}
                        </span>
                        <span
                          className="text-sm font-semibold tabular"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {p ? formatPrice(p.price, asset.symbol) : "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                          {asset.name}
                        </span>
                        {p && (
                          <span
                            className={cn(
                              "text-xs font-medium tabular",
                              isPos ? "text-accent-green" : "text-accent-red"
                            )}
                          >
                            {isPos ? "+" : ""}{p.changePercent24h?.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(asset.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/[0.08]"
                      title="Remove from watchlist"
                    >
                      <X size={13} style={{ color: "var(--text-tertiary)" }} />
                    </button>
                  </motion.div>
                );
              })}
        </AnimatePresence>

        {/* Add more */}
        {unwatchedAssets.length > 0 && (
          <div className="px-4 pb-2 mt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider py-2 pb-3" style={{ color: "var(--text-tertiary)" }}>
              {searchQuery ? "Search Results" : "Add to Watchlist"}
            </div>
            <div className="space-y-1">
              {unwatchedAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => onAdd(asset.id)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all hover:bg-white/[0.04] group border border-transparent hover:border-white/5 shadow-sm"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
                    style={{ background: `${asset.color}14`, color: asset.color }}
                  >
                    {asset.icon}
                  </div>
                  <span className="flex-1 text-left text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {asset.symbol}
                  </span>
                  <Plus
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
