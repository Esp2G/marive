"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Clock } from "lucide-react";
import { Asset, PriceData } from "@/lib/types";
import { formatPrice, formatVolume } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "./SkeletonLoader";
import { GlowCard } from "./ui/GlowCard";
import { SparklineBar } from "./ui/SparklineBar";
import { AnimatedBadge } from "./ui/AnimatedBadge";

interface OverviewTabProps {
  asset: Asset;
  priceData: PriceData | null;
  candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  delay: number;
}) {
  return (
    <GlowCard glowColor={color ?? "var(--accent)"} className="glass rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay }}
        className="p-4 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-tertiary)" }}>
            {label}
          </span>
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: color ? `${color}18` : "var(--surface-tertiary)" }}
          >
            <Icon size={13} style={{ color: color ?? "var(--text-secondary)" }} />
          </div>
        </div>
        <div>
          <div className="text-lg font-bold tabular tracking-tight" style={{ color: color ?? "var(--text-primary)" }}>
            {value}
          </div>
          {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</div>}
        </div>
      </motion.div>
    </GlowCard>
  );
}

export function OverviewTab({ asset, priceData, candles }: OverviewTabProps) {
  // ── Localised 24H window label ────────────────────────────────────────────
  const rangeWindowLabel = useMemo(() => {
    const now = new Date();
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
    return `${fmt(since)} → ${fmt(now)}  (${tz})`;
  }, []); // computed once on mount — tz doesn't change mid-session

  // ── Sparkline data (last 20 candles close prices) ─────────────────────────
  const sparkPrices = useMemo(
    () => candles.slice(-20).map((c) => c.close),
    [candles]
  );

  if (!priceData) {
    return (
      <div className="p-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const isPositive = priceData.changePercent24h >= 0;
  const range = priceData.high24h - priceData.low24h;
  const currentPos = range > 0 ? ((priceData.price - priceData.low24h) / range) * 100 : 50;

  const recentCandles = candles.slice(-10);
  const greenCandles = recentCandles.filter((c) => c.close >= c.open).length;
  const momentum = recentCandles.length > 0 ? (greenCandles / recentCandles.length) * 100 : 50;
  const momentumLabel = momentum >= 60 ? "Bullish" : momentum <= 40 ? "Bearish" : "Neutral";
  const momentumColor = momentum >= 60 ? "var(--positive)" : momentum <= 40 ? "var(--negative)" : "var(--text-secondary)";

  const avgVol = candles.length > 0 ? candles.reduce((s, c) => s + c.volume, 0) / candles.length : 0;

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto">

      {/* ── 24H Range bar ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-tertiary)" }}>
            24H Range
          </span>
          <div className="flex items-center gap-1.5">
            <AnimatedBadge color="var(--text-tertiary)">
              <Clock size={9} style={{ display: "inline" }} className="mr-0.5" />
              {rangeWindowLabel}
            </AnimatedBadge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs tabular mb-2 mt-3">
          <span style={{ color: "var(--negative)" }}>{formatPrice(priceData.low24h, asset.symbol)}</span>
          <div className="flex-1 relative h-1.5 rounded-full" style={{ background: "var(--surface-tertiary)" }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${Math.max(2, Math.min(98, currentPos))}%`, background: "linear-gradient(90deg, var(--negative), var(--positive))" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 shadow-lg"
              style={{ left: `${Math.max(2, Math.min(96, currentPos))}%`, background: "var(--text-primary)", borderColor: "var(--surface)" }}
            />
          </div>
          <span style={{ color: "var(--positive)" }}>{formatPrice(priceData.high24h, asset.symbol)}</span>
        </div>
        <div className="text-center text-sm font-bold tabular" style={{ color: "var(--text-primary)" }}>
          {formatPrice(priceData.price, asset.symbol)}
        </div>
      </motion.div>

      {/* ── Sparkline ─────────────────────────────────────────────────────── */}
      {sparkPrices.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--text-tertiary)" }}>
              Price Trend (last {sparkPrices.length} candles)
            </span>
            <AnimatedBadge color={isPositive ? "var(--positive)" : "var(--negative)"} pulse>
              {isPositive ? "▲" : "▼"} {Math.abs(priceData.changePercent24h).toFixed(2)}%
            </AnimatedBadge>
          </div>
          <SparklineBar prices={sparkPrices} width={999} height={48} />
        </motion.div>
      )}

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={isPositive ? TrendingUp : TrendingDown} label="24H Change"
          value={`${isPositive ? "+" : ""}${priceData.changePercent24h.toFixed(2)}%`}
          sub={`${isPositive ? "+" : ""}${priceData.change24h.toFixed(2)} USD`}
          color={isPositive ? "var(--positive)" : "var(--negative)"} delay={0.05} />
        <StatCard icon={BarChart3} label="24H Volume"
          value={formatVolume(priceData.volume24h)} sub={asset.type === "crypto" ? asset.symbol : "USD"} delay={0.1} />
        <StatCard icon={Activity} label="Momentum"
          value={momentumLabel} sub={`${recentCandles.length} candle sample`}
          color={momentumColor} delay={0.15} />
        <StatCard icon={DollarSign} label="Avg Volume"
          value={formatVolume(avgVol)} sub={`${candles.length} candles`} delay={0.2} />
      </div>

      {/* ── Recent candles bar chart ──────────────────────────────────────── */}
      {candles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wider font-medium mb-3" style={{ color: "var(--text-tertiary)" }}>
            Recent Candles ({recentCandles.length})
          </div>
          <div className="flex items-end gap-1 h-12">
            {recentCandles.map((c, i) => {
              const isGreen = c.close >= c.open;
              const h = Math.abs(c.close - c.open);
              const maxH = Math.max(...recentCandles.map((x) => Math.abs(x.close - x.open)));
              const pct = maxH > 0 ? (h / maxH) * 100 : 50;
              return (
                <div key={i} className="flex-1 rounded-sm transition-all duration-150"
                  style={{ height: `${Math.max(8, pct)}%`, background: isGreen ? "var(--positive)" : "var(--negative)", opacity: 0.7 + (i / recentCandles.length) * 0.3 }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            <span>{greenCandles} green</span>
            <span>{recentCandles.length - greenCandles} red</span>
          </div>
        </motion.div>
      )}

      {/* ── Asset info ────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-4">
        <div className="text-xs uppercase tracking-wider font-medium mb-3" style={{ color: "var(--text-tertiary)" }}>
          Asset Info
        </div>
        {[
          { label: "Symbol",  value: asset.symbol },
          { label: "Type",    value: asset.type.charAt(0).toUpperCase() + asset.type.slice(1) },
          { label: "Market",  value: asset.type === "crypto" ? "Crypto" : asset.type === "stock" ? "Equities" : asset.type === "forex" ? "Forex" : "Commodities" },
          { label: "Pair",    value: asset.type === "crypto" ? `${asset.symbol}/USDT` : `${asset.symbol}/USD` },
          { label: "Source",  value: asset.binanceSymbol ? "Binance Live" : "Simulated" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{row.label}</span>
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{row.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
