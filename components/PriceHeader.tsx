"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset, PriceData } from "@/lib/types";
import { formatPrice, formatVolume } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CurrencyConverter } from "./CurrencyConverter";
import { NumberTicker } from "./ui/NumberTicker";

interface PriceHeaderProps {
  asset: Asset;
  priceData: PriceData | null;
  isConnected: boolean;
}

export function PriceHeader({ asset, priceData, isConnected }: PriceHeaderProps) {
  const prevPrice = useRef<number | null>(null);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (!priceData) return;
    if (prevPrice.current !== null && prevPrice.current !== priceData.price) {
      const cls =
        priceData.price > prevPrice.current ? "flash-green" : "flash-red";
      setFlashClass(cls);
      const t = setTimeout(() => setFlashClass(""), 650);
      return () => clearTimeout(t);
    }
    prevPrice.current = priceData.price;
  }, [priceData?.price]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPositive = (priceData?.changePercent24h ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-1">
      {/* Asset name */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: `${asset.color}20`, color: asset.color }}
        >
          {asset.icon}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {asset.name}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-md font-medium"
              style={{
                background: "var(--surface-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {asset.type === "crypto"
                ? "USDT"
                : asset.type === "commodity"
                ? "SPOT"
                : "NASDAQ"}
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {asset.symbol} / {asset.type === "crypto" ? "USD" : "USD"}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className={cn("flex items-baseline gap-3 rounded-xl px-1 -mx-1 transition-all duration-150", flashClass)}>
        <div
          className="font-bold tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text-primary)", lineHeight: 1 }}
        >
          {priceData ? (
            <NumberTicker value={formatPrice(priceData.price, asset.symbol)} />
          ) : (
            "—"
          )}
        </div>

        {priceData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex items-center gap-1 text-sm font-semibold tabular",
              isPositive ? "text-accent-green" : "text-accent-red"
            )}
          >
            <span>{isPositive ? "▲" : "▼"}</span>
            <span>
              {Math.abs(priceData.changePercent24h).toFixed(2)}%
            </span>
            <span className="font-normal opacity-70 text-xs">
              ({isPositive ? "+" : ""}{priceData.change24h.toFixed(2)})
            </span>
          </motion.div>
        )}
      </div>

      {/* Currency Converter */}
      {priceData && <CurrencyConverter livePrice={priceData.price} />}

      {/* Stats row */}
      {priceData && (
        <div className="flex items-center gap-4 mt-1">
          {[
            { label: "Peak", value: formatPrice(priceData.high24h, asset.symbol), positive: true },
            { label: "Lowest", value: formatPrice(priceData.low24h, asset.symbol), negative: true },
            { label: "Vol", value: formatVolume(priceData.volume24h) },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </span>
              <span
                className="text-xs font-semibold tabular"
                style={{
                  color: stat.positive
                    ? "var(--positive)"
                    : stat.negative
                    ? "var(--negative)"
                    : "var(--text-secondary)",
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
