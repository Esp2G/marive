import { ReactNode } from "react";

export type AssetType = "crypto" | "stock" | "commodity" | "forex";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  binanceSymbol?: string;
  color: string;
  icon: ReactNode | string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  triggered: boolean;
  createdAt: number;
}

export interface WatchlistItem {
  assetId: string;
  addedAt: number;
}

export type Theme = "dark" | "light";
export type TabType = "chart" | "overview";
export type TimeframeType = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
