"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { PriceData } from "@/lib/types";

interface BinanceTicker {
  s: string; // symbol
  c: string; // close/last price
  p: string; // price change
  P: string; // price change percent
  h: string; // high
  l: string; // low
  v: string; // volume
}

export function useBinanceWS(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!symbols.length) return;

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const data: BinanceTicker = msg.data;
          if (!data || !data.s) return;

          const symbol = data.s.replace("USDT", "");
          setPrices((prev) => ({
            ...prev,
            [data.s]: {
              symbol,
              price: parseFloat(data.c),
              change24h: parseFloat(data.p),
              changePercent24h: parseFloat(data.P),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
              volume24h: parseFloat(data.v),
            },
          }));
        } catch {
          // silently ignore parse errors
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimer.current = setTimeout(() => connect(), 3000);
      };
    } catch {
      setIsConnected(false);
    }
  }, [symbols.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { prices, isConnected };
}

export async function fetchBinanceKlines(
  symbol: string,
  interval: string,
  limit: number = 200
): Promise<import("@/lib/types").CandleData[]> {
  try {
    const res = await fetch(
      `/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Failed to fetch klines");
    const raw: number[][] = await res.json();
    return raw.map((k) => ({
      time: Math.floor(k[0] / 1000),
      open: parseFloat(k[1] as unknown as string),
      high: parseFloat(k[2] as unknown as string),
      low: parseFloat(k[3] as unknown as string),
      close: parseFloat(k[4] as unknown as string),
      volume: parseFloat(k[5] as unknown as string),
    }));
  } catch {
    return [];
  }
}
