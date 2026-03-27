"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { Asset, PriceData } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { MagicBorder } from "./ui/MagicBorder";

interface AssetSelectorProps {
  selected: Asset;
  prices: Record<string, PriceData>;
  onSelect: (asset: Asset) => void;
}

const TYPE_LABELS: Record<string, string> = {
  crypto: "Crypto",
  stock: "Stocks",
  commodity: "Commodities",
};

export function AssetSelector({ selected, prices, onSelect }: AssetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = ASSETS.filter(
    (a) =>
      a.symbol.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Asset[]>>((acc, asset) => {
    const type = asset.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(asset);
    return acc;
  }, {});

  const price = selected.binanceSymbol
    ? prices[selected.binanceSymbol]
    : null;

  const currentPrice = price?.price;
  const isPositive = (price?.changePercent24h ?? 0) >= 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 relative",
          "glass hover:border-white/[0.12] active:scale-[0.98]",
          "min-w-[200px]"
        )}
      >
        {open && <MagicBorder borderRadius="0.75rem" />}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: `${selected.color}20`, color: selected.color }}
        >
          {selected.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {selected.symbol}
            </span>
            {currentPrice && (
              <span
                className={cn(
                  "text-xs font-medium tabular",
                  isPositive ? "text-accent-green" : "text-accent-red"
                )}
              >
                {isPositive ? "+" : ""}
                {price?.changePercent24h?.toFixed(2)}%
              </span>
            )}
          </div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {selected.name}
          </div>
        </div>
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--text-secondary)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => { setOpen(false); setQuery(""); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute top-full mt-2 left-0 z-50 w-72 rounded-2xl overflow-hidden glass shadow-2xl"
            >
              {/* Search */}
              <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--surface-tertiary)" }}>
                  <Search size={13} style={{ color: "var(--text-tertiary)" }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search assets..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-[--text-tertiary]"
                    style={{ color: "var(--text-primary)" }}
                  />
                </div>
              </div>

              {/* Asset list */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(grouped).map(([type, assets]) => (
                  <div key={type} className="mb-2">
                    <div className="px-2 py-1 text-xs font-medium tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>
                      {TYPE_LABELS[type]}
                    </div>
                    {assets.map((asset) => {
                      const p = asset.binanceSymbol ? prices[asset.binanceSymbol] : null;
                      const isPos = (p?.changePercent24h ?? 0) >= 0;
                      const isSelected = asset.id === selected.id;
                      return (
                        <button
                          key={asset.id}
                          onClick={() => {
                            onSelect(asset);
                            setOpen(false);
                            setQuery("");
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-100",
                            isSelected
                              ? "bg-white/[0.06]"
                              : "hover:bg-white/[0.04]"
                          )}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: `${asset.color}18`, color: asset.color }}
                          >
                            {asset.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {asset.symbol}
                            </div>
                            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                              {asset.name}
                            </div>
                          </div>
                          <div className="text-right">
                            {p ? (
                              <>
                                <div className="text-sm font-semibold tabular" style={{ color: "var(--text-primary)" }}>
                                  {formatPrice(p.price, asset.symbol)}
                                </div>
                                <div className={cn("text-xs tabular font-medium", isPos ? "text-accent-green" : "text-accent-red")}>
                                  {isPos ? "+" : ""}{p.changePercent24h?.toFixed(2)}%
                                </div>
                              </>
                            ) : (
                              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Mock</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
