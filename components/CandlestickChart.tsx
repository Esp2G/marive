"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ColorType,
  CrosshairMode,
  Time,
  LineData,
} from "lightweight-charts";
import { motion } from "framer-motion";
import { CandleData, Asset, TimeframeType } from "@/lib/types";
import { ChartSkeleton } from "./SkeletonLoader";
import { cn } from "@/lib/utils";

interface CandlestickChartProps {
  candles: CandleData[];
  asset: Asset;
  isLoading: boolean;
  theme: "dark" | "light";
  livePrice?: number;
  timeframe: TimeframeType;
  onTimeframeChange: (tf: TimeframeType) => void;
}

const TIMEFRAMES: { label: string; value: TimeframeType }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1D", value: "1d" },
];

/** Pure helper — no React deps */
function getChartColors(isDark: boolean) {
  return {
    bg: isDark ? "#0a0a0b" : "#ffffff",
    grid: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    text: isDark ? "#86868b" : "#6e6e73",
    crosshair: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    crosshairLabel: isDark ? "#1c1c1e" : "#f2f2f7",
    up: isDark ? "#00D084" : "#00a65a",
    down: isDark ? "#FF3B30" : "#d93025",
    sma: isDark ? "rgba(41, 98, 255, 0.8)" : "rgba(41, 98, 255, 1)",
  };
}

export function CandlestickChart({
  candles,
  asset,
  isLoading,
  theme,
  livePrice,
  timeframe,
  onTimeframeChange,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const isDarkRef = useRef(theme === "dark");
  const hasFittedRef = useRef(false);

  const [showSMA, setShowSMA] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    x: number;
    y: number;
  } | null>(null);

  const isDark = theme === "dark";

  // Keep isDarkRef in sync without triggering chart reinit
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  // ── Init chart ONCE on mount ──────────────────────────────────────────────
  const initChart = useCallback(() => {
    if (!containerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const colors = getChartColors(isDarkRef.current);

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.bg },
        textColor: colors.text,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: colors.crosshair, width: 1, style: 3, labelBackgroundColor: colors.crosshairLabel },
        horzLine: { color: colors.crosshair, width: 1, style: 3, labelBackgroundColor: colors.crosshairLabel },
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: colors.up,
      downColor: colors.down,
      borderUpColor: colors.up,
      borderDownColor: colors.down,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });

    const smaSeries = chart.addLineSeries({
      color: colors.sma,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      visible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    smaSeriesRef.current = smaSeries;
    hasFittedRef.current = false;

    // Tooltip via crosshair subscription
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) { setTooltipData(null); return; }
      const data = param.seriesData.get(candleSeries) as {
        open: number; high: number; low: number; close: number; time: Time;
      } | undefined;
      if (!data) { setTooltipData(null); return; }
      const ts = typeof param.time === "number" ? param.time : 0;
      const date = new Date(ts * 1000);
      const timeStr = date.toLocaleString([], {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      setTooltipData({ time: timeStr, open: data.open, high: data.high, low: data.low, close: data.close, x: param.point.x, y: param.point.y });
    });

    // Robust resize observer — handles 0×0 initial paint
    const ro = new ResizeObserver((entries) => {
      if (containerRef.current && chartRef.current) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          chartRef.current.applyOptions({ width, height });
          if (!hasFittedRef.current) {
            chartRef.current.timeScale().fitContent();
            hasFittedRef.current = true;
          }
        }
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); };
  }, []); // ← no theme/showSMA deps: chart lives across theme/SMA changes

  useEffect(() => {
    const cleanup = initChart();
    return cleanup;
  }, [initChart]);

  // ── Apply theme colors WITHOUT reinitialising the chart ───────────────────
  useEffect(() => {
    if (!chartRef.current) return;
    const colors = getChartColors(isDark);

    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: colors.bg },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { color: colors.crosshair, labelBackgroundColor: colors.crosshairLabel },
        horzLine: { color: colors.crosshair, labelBackgroundColor: colors.crosshairLabel },
      },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border },
    });

    candleSeriesRef.current?.applyOptions({
      upColor: colors.up,
      downColor: colors.down,
      borderUpColor: colors.up,
      borderDownColor: colors.down,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });

    smaSeriesRef.current?.applyOptions({ color: colors.sma });
  }, [isDark]); // runs ONLY when theme changes — no chart rebuild

  // ── Toggle SMA visibility without chart rebuild ───────────────────────────
  useEffect(() => {
    smaSeriesRef.current?.applyOptions({ visible: showSMA });
  }, [showSMA]);

  // ── Set candle data whenever it changes ───────────────────────────────────
  useEffect(() => {
    if (!candleSeriesRef.current || !candles.length) return;

    const sorted = [...candles].sort((a, b) => a.time - b.time);
    candleSeriesRef.current.setData(
      sorted.map((c) => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close }))
    );

    // SMA 20
    if (smaSeriesRef.current) {
      const smaData: LineData[] = [];
      let sum = 0;
      for (let i = 0; i < sorted.length; i++) {
        sum += sorted[i].close;
        if (i >= 19) {
          smaData.push({ time: sorted[i].time as Time, value: sum / 20 });
          sum -= sorted[i - 19].close;
        }
      }
      smaSeriesRef.current.setData(smaData);
    }

    // Always fit after new data — use rAF so the container has final size
    requestAnimationFrame(() => {
      chartRef.current?.timeScale().fitContent();
      hasFittedRef.current = true;
    });
  }, [candles]);

  // ── Live price tick on the last candle ────────────────────────────────────
  useEffect(() => {
    if (!candleSeriesRef.current || !livePrice || !candles.length) return;
    const last = candles[candles.length - 1];
    candleSeriesRef.current.update({
      time: last.time as Time,
      open: last.open,
      high: Math.max(last.high, livePrice),
      low: Math.min(last.low, livePrice),
      close: livePrice,
    });
  }, [livePrice, candles]);

  const isPositive = tooltipData
    ? tooltipData.close >= tooltipData.open
    : candles.length > 1
    ? candles[candles.length - 1].close >= candles[candles.length - 2].close
    : true;

  return (
    <div className="flex flex-col h-full">
      {/* Timeframe selector */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2 shrink-0">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150",
              timeframe === tf.value ? "text-white" : "hover:bg-white/[0.06]"
            )}
            style={
              timeframe === tf.value
                ? { background: asset.color + "22", color: asset.color }
                : { color: "var(--text-secondary)" }
            }
          >
            {tf.label}
          </button>
        ))}

        <div className="w-px h-4 mx-2" style={{ background: "var(--border)" }} />

        <button
          onClick={() => setShowSMA(!showSMA)}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150",
            showSMA ? "text-white" : "hover:bg-white/[0.06]"
          )}
          style={
            showSMA
              ? { background: "rgba(41, 98, 255, 0.15)", color: "var(--accent)" }
              : { color: "var(--text-secondary)" }
          }
        >
          SMA 20
        </button>

        {/* OHLCV tooltip pill */}
        {tooltipData && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto flex items-center gap-2 text-xs tabular"
          >
            <span style={{ color: "var(--text-tertiary)" }}>O</span>
            <span style={{ color: "var(--text-secondary)" }}>{tooltipData.open.toFixed(2)}</span>
            <span style={{ color: "var(--text-tertiary)" }}>H</span>
            <span style={{ color: "var(--positive)" }}>{tooltipData.high.toFixed(2)}</span>
            <span style={{ color: "var(--text-tertiary)" }}>L</span>
            <span style={{ color: "var(--negative)" }}>{tooltipData.low.toFixed(2)}</span>
            <span style={{ color: "var(--text-tertiary)" }}>C</span>
            <span style={{ color: isPositive ? "var(--positive)" : "var(--negative)" }}>
              {tooltipData.close.toFixed(2)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Chart — container ALWAYS in DOM so ResizeObserver measures real size */}
      <div className="relative flex-1 min-h-0">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <ChartSkeleton />
          </div>
        )}
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ visibility: isLoading ? "hidden" : "visible" }}
        />
      </div>
    </div>
  );
}
