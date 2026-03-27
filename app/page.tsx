"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Eye } from "lucide-react";

import { ASSETS, getAssetById } from "@/lib/assets";
import { Asset, CandleData, PriceAlert, PriceData, TabType, TimeframeType, WatchlistItem } from "@/lib/types";
import { generateMockCandles, getMockPriceData, tickMockPrice } from "@/lib/mockData";
import { cn } from "@/lib/utils";

import { useBinanceWS, fetchBinanceKlines } from "@/hooks/useBinanceWS";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";

import { Navbar } from "@/components/Navbar";
import { TickerBar } from "@/components/TickerBar";
import { AssetSelector } from "@/components/AssetSelector";
import { PriceHeader } from "@/components/PriceHeader";
import { CandlestickChart } from "@/components/CandlestickChart";
import { OverviewTab } from "@/components/OverviewTab";
import { Watchlist } from "@/components/Watchlist";
import { PriceAlerts } from "@/components/PriceAlerts";
import { AlertToast } from "@/components/AlertToast";
import { DotBackground } from "@/components/ui/DotBackground";

// All crypto binance symbols
const CRYPTO_ASSETS = ASSETS.filter((a) => a.binanceSymbol);
const CRYPTO_SYMBOLS = CRYPTO_ASSETS.map((a) => a.binanceSymbol!);
const MOCK_ASSETS = ASSETS.filter((a) => !a.binanceSymbol);

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { assetId: "btc", addedAt: 0 },
  { assetId: "eth", addedAt: 0 },
  { assetId: "sol", addedAt: 0 },
  { assetId: "gold", addedAt: 0 },
];

const TF_INTERVAL_MAP: Record<TimeframeType, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
};

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  // Selected asset
  const [selectedAssetId, setSelectedAssetId] = useState("btc");
  const selectedAsset: Asset = getAssetById(selectedAssetId) || ASSETS[0];

  // Tab
  const [activeTab, setActiveTab] = useState<TabType>("chart");

  // Timeframe
  const [timeframe, setTimeframe] = useState<TimeframeType>("1h");

  // Candle data
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Watchlist
  const [watchlist, setWatchlist, watchlistHydrated] = useLocalStorage<WatchlistItem[]>(
    "ml-watchlist",
    DEFAULT_WATCHLIST
  );

  // Alerts
  const [alerts, setAlerts, alertsHydrated] = useLocalStorage<PriceAlert[]>(
    "ml-alerts",
    []
  );
  const [triggeredAlert, setTriggeredAlert] = useState<PriceAlert | null>(null);

  // Mock prices state
  const [mockPrices, setMockPrices] = useState<Record<string, PriceData>>({});

  // Live crypto prices via WebSocket
  const { prices: livePrices, isConnected } = useBinanceWS(CRYPTO_SYMBOLS);

  // Initialize mock prices
  useEffect(() => {
    const initial: Record<string, PriceData> = {};
    MOCK_ASSETS.forEach((asset) => {
      initial[asset.symbol] = getMockPriceData(asset.symbol);
    });
    setMockPrices(initial);
  }, []);

  // Tick mock prices every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setMockPrices((prev) => {
        const updated = { ...prev };
        MOCK_ASSETS.forEach((asset) => {
          if (updated[asset.symbol]) {
            updated[asset.symbol] = tickMockPrice(updated[asset.symbol]);
          }
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Get current price for selected asset
  const getCurrentPriceData = useCallback((): PriceData | null => {
    if (selectedAsset.binanceSymbol) {
      return livePrices[selectedAsset.binanceSymbol] || null;
    }
    return mockPrices[selectedAsset.symbol] || null;
  }, [selectedAsset, livePrices, mockPrices]);

  const currentPriceData = getCurrentPriceData();

  // Load candle data
  useEffect(() => {
    let cancelled = false;
    setIsChartLoading(true);
    setCandles([]);

    async function load() {
      if (selectedAsset.binanceSymbol) {
        const data = await fetchBinanceKlines(
          selectedAsset.binanceSymbol,
          TF_INTERVAL_MAP[timeframe],
          200
        );
        if (!cancelled) {
          if (data.length > 0) {
            setCandles(data);
          } else {
            // Fallback to mock if API fails
            setCandles(generateMockCandles(selectedAsset.symbol, 200));
          }
          setIsChartLoading(false);
        }
      } else {
        // Mock assets
        const intervalMs =
          timeframe === "1m"
            ? 60_000
            : timeframe === "5m"
            ? 300_000
            : timeframe === "15m"
            ? 900_000
            : timeframe === "1h"
            ? 3_600_000
            : timeframe === "4h"
            ? 14_400_000
            : 86_400_000;
        if (!cancelled) {
          setCandles(generateMockCandles(selectedAsset.symbol, 200, intervalMs));
          setIsChartLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [selectedAsset.id, timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  // Alert checking
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  useEffect(() => {
    if (!currentPriceData) return;
    const price = currentPriceData.price;

    let anyTriggered = false;
    const updated = alertsRef.current.map((alert) => {
      if (alert.triggered || alert.assetId !== selectedAsset.id) return alert;
      const triggered =
        (alert.condition === "above" && price >= alert.targetPrice) ||
        (alert.condition === "below" && price <= alert.targetPrice);
      if (triggered && !anyTriggered) {
        anyTriggered = true;
        setTriggeredAlert({ ...alert, triggered: true });
      }
      return triggered ? { ...alert, triggered: true } : alert;
    });

    if (anyTriggered) {
      setAlerts(updated);
    }
  }, [currentPriceData?.price, selectedAsset.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watchlist handlers
  const addToWatchlist = (assetId: string) => {
    setWatchlist((prev) => {
      if (prev.find((i) => i.assetId === assetId)) return prev;
      return [...prev, { assetId, addedAt: Date.now() }];
    });
  };

  const removeFromWatchlist = (assetId: string) => {
    setWatchlist((prev) => prev.filter((i) => i.assetId !== assetId));
  };

  // Alert handlers
  const addAlert = (alert: PriceAlert) => {
    setAlerts((prev) => [...prev, alert]);
  };
  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{ background: "var(--surface)" }}
    >
      {/* Dot pattern background */}
      <DotBackground />

      {/* Alert Toast */}
      <AlertToast
        alert={triggeredAlert}
        symbol={selectedAsset.symbol}
        onDismiss={() => setTriggeredAlert(null)}
      />

      {/* Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isConnected={isConnected}
      />

      {/* Ticker bar */}
      <TickerBar prices={livePrices} mockPrices={mockPrices} />

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — Watchlist */}
        <div
          className="w-64 shrink-0 border-r flex flex-col overflow-hidden hidden lg:flex"
          style={{ borderColor: "var(--border)" }}
        >
          <Watchlist
            items={watchlist}
            prices={livePrices}
            mockPrices={mockPrices}
            selectedAsset={selectedAsset}
            onSelect={(a) => setSelectedAssetId(a.id)}
            onAdd={addToWatchlist}
            onRemove={removeFromWatchlist}
            isLoading={!watchlistHydrated}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar: asset selector + price + alerts */}
          <div
            className="flex items-start justify-between gap-3 px-4 py-3 border-b shrink-0 flex-wrap gap-y-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-start gap-3 flex-wrap">
              <AssetSelector
                selected={selectedAsset}
                prices={livePrices}
                onSelect={(a) => setSelectedAssetId(a.id)}
              />
              <PriceHeader
                asset={selectedAsset}
                priceData={currentPriceData}
                isConnected={isConnected}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <PriceAlerts
                alerts={alertsHydrated ? alerts : []}
                asset={selectedAsset}
                currentPrice={currentPriceData?.price ?? null}
                onAdd={addAlert}
                onRemove={removeAlert}
              />
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-0 px-4 border-b shrink-0"
            style={{ borderColor: "var(--border)" }}
          >
            {(
              [
                { id: "chart", label: "Chart", icon: BarChart2 },
                { id: "overview", label: "Overview", icon: Eye },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all duration-150 relative",
                  activeTab === tab.id
                    ? "text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--accent)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon size={13} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "chart" ? (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <CandlestickChart
                    candles={candles}
                    asset={selectedAsset}
                    isLoading={isChartLoading}
                    theme={theme}
                    livePrice={
                      selectedAsset.binanceSymbol
                        ? livePrices[selectedAsset.binanceSymbol]?.price
                        : mockPrices[selectedAsset.symbol]?.price
                    }
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto"
                >
                  <OverviewTab
                    asset={selectedAsset}
                    priceData={currentPriceData}
                    candles={candles}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
