import { CandleData, PriceData } from "./types";

// Base prices for all mock assets (non-crypto)
const MOCK_PRICES: Record<string, number> = {
  // Commodities
  XAU: 2345.8,
  XAG: 29.5,

  // Big Tech Stocks
  AAPL:  227.52,
  NVDA:  128.30,
  TSLA:  248.75,
  AMZN:  192.40,
  GOOGL: 165.20,
  MSFT:  415.50,
  META:  585.30,
  AMD:   185.00,
  INTC:   21.40,
  IBM:   228.00,
  ADBE:  370.00,
  SSNLF:  55.00,

  // Entertainment & Media
  NFLX:  970.00,
  SPOT:  640.00,
  SONY:   92.00,
  WBD:     8.00,
  XIAO:    1.80,

  // Financial
  V:     280.00,
  MA:    468.00,

  // Automotive
  TM:    185.00,
  BMWYY:  35.00,
  MBGYY:  65.00,
  F:      10.00,

  // Apparel
  NKE:    72.00,
  ADDYY: 115.00,

  // Forex
  EUR: 1.085,
  GBP: 1.264,
  CNY: 0.1383,
};

// Volatility per symbol category (fraction of price per tick)
const VOLATILITY: Record<string, number> = {
  XAU: 0.005, XAG: 0.008,
  EUR: 0.002, GBP: 0.002, CNY: 0.002,
};
function getVolatility(symbol: string): number {
  return VOLATILITY[symbol] ?? 0.015;
}

function generateOHLC(basePrice: number, volatility: number) {
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  const open = basePrice;
  const close = basePrice + change;
  const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
  const low  = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
  return { o: open, h: high, l: low, c: close };
}

export function generateMockCandles(
  symbol: string,
  count: number = 200,
  intervalMs: number = 3_600_000
): CandleData[] {
  const basePrice = MOCK_PRICES[symbol] ?? 100;
  const volatility = getVolatility(symbol);
  const candles: CandleData[] = [];
  const now = Math.floor(Date.now() / 1000);

  let currentPrice = basePrice * (0.85 + Math.random() * 0.3);

  for (let i = count; i >= 0; i--) {
    const time = now - i * Math.floor(intervalMs / 1000);
    const { o, h, l, c } = generateOHLC(currentPrice, volatility);
    candles.push({
      time,
      open:   parseFloat(o.toFixed(4)),
      high:   parseFloat(h.toFixed(4)),
      low:    parseFloat(l.toFixed(4)),
      close:  parseFloat(c.toFixed(4)),
      volume: Math.floor(Math.random() * 10_000 + 1_000),
    });
    currentPrice = c;
  }

  return candles;
}

export function getMockPriceData(symbol: string): PriceData {
  const basePrice = MOCK_PRICES[symbol] ?? 100;
  const change = (Math.random() - 0.45) * basePrice * 0.03;
  const price = basePrice + change;
  return {
    symbol,
    price:           parseFloat(price.toFixed(4)),
    change24h:       parseFloat(change.toFixed(4)),
    changePercent24h:parseFloat(((change / basePrice) * 100).toFixed(2)),
    high24h:         parseFloat((price * 1.015).toFixed(4)),
    low24h:          parseFloat((price * 0.985).toFixed(4)),
    volume24h:       Math.floor(Math.random() * 1_000_000 + 500_000),
  };
}

export function tickMockPrice(current: PriceData): PriceData {
  const volatility = getVolatility(current.symbol) * 0.1;
  const delta = (Math.random() - 0.5) * 2 * volatility * current.price;
  const newPrice = Math.max(0.0001, current.price + delta);
  const base = MOCK_PRICES[current.symbol] ?? current.price;
  const change = newPrice - base;
  return {
    ...current,
    price:           parseFloat(newPrice.toFixed(4)),
    change24h:       parseFloat(change.toFixed(4)),
    changePercent24h:parseFloat(((change / base) * 100).toFixed(2)),
  };
}
