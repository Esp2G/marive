import { Asset } from "./types";
import { SVG_LINKS } from "./svg-config";

function IconWrapper({ id, alt }: { id: string; alt: string }) {
  const src = SVG_LINKS[id] || "";
  if (!src) return <span className="font-bold text-[10px]">{alt.slice(0, 3)}</span>;
  return <img src={src} alt={alt} className="w-full h-full object-contain p-0.5" />;
}

export const ASSETS: Asset[] = [
  // ── Crypto — Binance Live ─────────────────────────────────────────────────
  { id:"btc",   symbol:"BTC",   name:"Bitcoin",         type:"crypto", binanceSymbol:"BTCUSDT",   color:"#F7931A", icon:<IconWrapper id="btc"   alt="BTC"/> },
  { id:"eth",   symbol:"ETH",   name:"Ethereum",        type:"crypto", binanceSymbol:"ETHUSDT",   color:"#627EEA", icon:<IconWrapper id="eth"   alt="ETH"/> },
  { id:"bnb",   symbol:"BNB",   name:"BNB",             type:"crypto", binanceSymbol:"BNBUSDT",   color:"#F3BA2F", icon:<IconWrapper id="bnb"   alt="BNB"/> },
  { id:"sol",   symbol:"SOL",   name:"Solana",          type:"crypto", binanceSymbol:"SOLUSDT",   color:"#9945FF", icon:<IconWrapper id="sol"   alt="SOL"/> },
  { id:"xrp",   symbol:"XRP",   name:"XRP",             type:"crypto", binanceSymbol:"XRPUSDT",   color:"#00AAE4", icon:<IconWrapper id="xrp"   alt="XRP"/> },
  { id:"ada",   symbol:"ADA",   name:"Cardano",         type:"crypto", binanceSymbol:"ADAUSDT",   color:"#0033AD", icon:<IconWrapper id="ada"   alt="ADA"/> },
  { id:"doge",  symbol:"DOGE",  name:"Dogecoin",        type:"crypto", binanceSymbol:"DOGEUSDT",  color:"#C2A633", icon:<IconWrapper id="doge"  alt="DOGE"/> },
  { id:"avax",  symbol:"AVAX",  name:"Avalanche",       type:"crypto", binanceSymbol:"AVAXUSDT",  color:"#E84142", icon:<IconWrapper id="avax"  alt="AVAX"/> },
  { id:"link",  symbol:"LINK",  name:"Chainlink",       type:"crypto", binanceSymbol:"LINKUSDT",  color:"#2A5ADA", icon:<IconWrapper id="link"  alt="LINK"/> },
  { id:"dot",   symbol:"DOT",   name:"Polkadot",        type:"crypto", binanceSymbol:"DOTUSDT",   color:"#E6007A", icon:<IconWrapper id="dot"   alt="DOT"/> },
  { id:"ltc",   symbol:"LTC",   name:"Litecoin",        type:"crypto", binanceSymbol:"LTCUSDT",   color:"#BFBBBB", icon:<IconWrapper id="ltc"   alt="LTC"/> },
  { id:"matic", symbol:"MATIC", name:"Polygon",         type:"crypto", binanceSymbol:"MATICUSDT", color:"#8247E5", icon:<IconWrapper id="matic" alt="MATIC"/> },
  { id:"uni",   symbol:"UNI",   name:"Uniswap",         type:"crypto", binanceSymbol:"UNIUSDT",   color:"#FF007A", icon:<IconWrapper id="uni"   alt="UNI"/> },
  { id:"trx",   symbol:"TRX",   name:"TRON",            type:"crypto", binanceSymbol:"TRXUSDT",   color:"#EF0027", icon:<IconWrapper id="trx"   alt="TRX"/> },
  { id:"atom",  symbol:"ATOM",  name:"Cosmos",          type:"crypto", binanceSymbol:"ATOMUSDT",  color:"#2E3148", icon:<IconWrapper id="atom"  alt="ATOM"/> },
  { id:"shib",  symbol:"SHIB",  name:"Shiba Inu",       type:"crypto", binanceSymbol:"SHIBUSDT",  color:"#FFA409", icon:<IconWrapper id="shib"  alt="SHIB"/> },

  // ── Commodities ───────────────────────────────────────────────────────────
  { id:"gold",   symbol:"XAU", name:"Gold",   type:"commodity", color:"#FFD60A", icon:<IconWrapper id="gold"   alt="Gold"/> },
  { id:"silver", symbol:"XAG", name:"Silver", type:"commodity", color:"#C0C0C0", icon:<IconWrapper id="silver" alt="Silver"/> },

  // ── Big Tech ──────────────────────────────────────────────────────────────
  { id:"aapl",  symbol:"AAPL",  name:"Apple",           type:"stock", color:"#A2AAAD", icon:<IconWrapper id="aapl"   alt="Apple"/> },
  { id:"nvda",  symbol:"NVDA",  name:"NVIDIA",          type:"stock", color:"#76B900", icon:<IconWrapper id="nvda"   alt="NVDA"/> },
  { id:"tsla",  symbol:"TSLA",  name:"Tesla",           type:"stock", color:"#E31937", icon:<IconWrapper id="tsla"   alt="Tesla"/> },
  { id:"msft",  symbol:"MSFT",  name:"Microsoft",       type:"stock", color:"#00A4EF", icon:<IconWrapper id="msft"   alt="MSFT"/> },
  { id:"amzn",  symbol:"AMZN",  name:"Amazon",          type:"stock", color:"#FF9900", icon:<IconWrapper id="amzn"   alt="AMZN"/> },
  { id:"googl", symbol:"GOOGL", name:"Alphabet",        type:"stock", color:"#4285F4", icon:<IconWrapper id="googl"  alt="GOOGL"/> },
  { id:"meta",  symbol:"META",  name:"Meta Platforms",  type:"stock", color:"#0668E1", icon:<IconWrapper id="meta"   alt="META"/> },
  { id:"amd",   symbol:"AMD",   name:"AMD",             type:"stock", color:"#ED1C24", icon:<IconWrapper id="amd"    alt="AMD"/> },
  { id:"intel", symbol:"INTC",  name:"Intel",           type:"stock", color:"#0071C5", icon:<IconWrapper id="intel"  alt="Intel"/> },
  { id:"ibm",   symbol:"IBM",   name:"IBM",             type:"stock", color:"#052FAD", icon:<IconWrapper id="ibm"    alt="IBM"/> },
  { id:"adbe", symbol:"ADBE",  name:"Adobe",           type:"stock", color:"#FF0000", icon:<IconWrapper id="adbe"  alt="Adobe"/> },
  { id:"samsung",symbol:"SSNLF",name:"Samsung",         type:"stock", color:"#1428A0", icon:<IconWrapper id="samsung" alt="Samsung"/> },

  // ── Entertainment & Media ─────────────────────────────────────────────────
  { id:"netflix", symbol:"NFLX", name:"Netflix",         type:"stock", color:"#E50914", icon:<IconWrapper id="netflix" alt="NFLX"/> },
  { id:"spotify", symbol:"SPOT", name:"Spotify",         type:"stock", color:"#1DB954", icon:<IconWrapper id="spotify" alt="SPOT"/> },
  { id:"sony",    symbol:"SONY", name:"Sony Group",      type:"stock", color:"#6699CC", icon:<IconWrapper id="sony"    alt="Sony"/> },
  { id:"wb",      symbol:"WBD",  name:"Warner Bros.",    type:"stock", color:"#005CAB", icon:<IconWrapper id="wb"      alt="WBD"/> },
  { id:"xiaomi",  symbol:"XIAO", name:"Xiaomi",          type:"stock", color:"#FF6900", icon:<IconWrapper id="xiaomi"  alt="Xiaomi"/> },

  // ── Financial ─────────────────────────────────────────────────────────────
  { id:"visa",       symbol:"V",  name:"Visa",       type:"stock", color:"#1A1F71", icon:<IconWrapper id="visa"       alt="Visa"/> },
  { id:"mastercard", symbol:"MA", name:"Mastercard", type:"stock", color:"#EB001B", icon:<IconWrapper id="mastercard" alt="MA"/> },

  // ── Automotive ───────────────────────────────────────────────────────────
  { id:"toyota",   symbol:"TM",    name:"Toyota",   type:"stock", color:"#EB0A1E", icon:<IconWrapper id="toyota"   alt="Toyota"/> },
  { id:"bmw",      symbol:"BMWYY", name:"BMW",      type:"stock", color:"#0066B1", icon:<IconWrapper id="bmw"      alt="BMW"/> },
  { id:"mercedes", symbol:"MBGYY", name:"Mercedes", type:"stock", color:"#888888", icon:<IconWrapper id="mercedes" alt="Mercedes"/> },
  { id:"ford",     symbol:"F",     name:"Ford",     type:"stock", color:"#003087", icon:<IconWrapper id="ford"     alt="Ford"/> },

  // ── Apparel ───────────────────────────────────────────────────────────────
  { id:"nike",   symbol:"NKE",   name:"Nike",   type:"stock", color:"#E5E5E5", icon:<IconWrapper id="nike"   alt="Nike"/> },
  { id:"adidas", symbol:"ADDYY", name:"Adidas", type:"stock", color:"#E5E5E5", icon:<IconWrapper id="adidas" alt="Adidas"/> },

  // ── Forex ─────────────────────────────────────────────────────────────────
  { id:"eur", symbol:"EUR", name:"Euro",            type:"forex", color:"#003399", icon:<IconWrapper id="eur" alt="EUR"/> },
  { id:"gbp", symbol:"GBP", name:"Pound Sterling",  type:"forex", color:"#C8102E", icon:<IconWrapper id="gbp" alt="GBP"/> },
  { id:"cny", symbol:"CNY", name:"Chinese Yuan",    type:"forex", color:"#DE2910", icon:<IconWrapper id="cny" alt="CNY"/> },
];

export const getAssetById     = (id: string)     => ASSETS.find((a) => a.id === id);
export const getAssetBySymbol = (symbol: string) => ASSETS.find((a) => a.symbol === symbol);
