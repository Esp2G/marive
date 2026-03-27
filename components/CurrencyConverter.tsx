"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

interface CurrencyConverterProps {
  livePrice: number;
}

const ALL_CURRENCIES = [
  { code: "USD", symbol: "$", flag: "us" },
  { code: "EUR", symbol: "€", flag: "eu" },
  { code: "GBP", symbol: "£", flag: "gb" },
  { code: "JPY", symbol: "¥", flag: "jp" },
  { code: "AUD", symbol: "A$", flag: "au" },
  { code: "CAD", symbol: "C$", flag: "ca" },
  { code: "CHF", symbol: "CHF", flag: "ch" },
  { code: "CNY", symbol: "¥", flag: "cn" },
  { code: "INR", symbol: "₹", flag: "in" },
  { code: "KRW", symbol: "₩", flag: "kr" },
  { code: "DZD", symbol: "د.ج", flag: "dz" },
];

export function CurrencyConverter({ livePrice }: CurrencyConverterProps) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [activeCurrencies, setActiveCurrencies] = useLocalStorage<string[]>(
    "ml-currencies",
    ["USD", "EUR", "GBP", "JPY", "DZD"]
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((err) => console.error("Failed to fetch exchange rates", err));
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCurrency = (code: string) => {
    if (code === "USD") return; // Keep USD permanent if desired, or allow toggling
    setActiveCurrencies((prev) => 
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const filteredCurrencies = ALL_CURRENCIES.filter((c) => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCurrencies = ALL_CURRENCIES.filter((c) => activeCurrencies.includes(c.code));

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 relative">
      {displayedCurrencies.map((currency) => {
        const rate = rates[currency.code] || (currency.code === "USD" ? 1 : 0);
        return (
          <div
            key={currency.code}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md transition-colors"
            style={{
              background: "var(--surface-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
              <img
                src={`https://flagcdn.com/w40/${currency.flag}.png`}
                alt={`${currency.code} flag`}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: "var(--text-secondary)" }}
            >
              {currency.symbol}
              {rate > 0 ? formatPrice(livePrice * rate, currency.symbol).replace(/[^\d.,]/g, "") : "..."}
            </span>
          </div>
        );
      })}

      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="w-7 h-7 rounded-full flex items-center justify-center border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        style={{
          background: "var(--surface-secondary)",
          borderColor: "var(--border)",
        }}
        title="Manage Currencies"
      >
        <Plus size={14} style={{ color: "var(--text-secondary)" }} />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-56 rounded-xl border shadow-xl z-50 overflow-hidden flex flex-col"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-transparent border-none focus:outline-none focus:ring-0"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredCurrencies.map((currency) => {
                const isActive = activeCurrencies.includes(currency.code);
                return (
                  <button
                    key={currency.code}
                    onClick={() => toggleCurrency(currency.code)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                        <img
                          src={`https://flagcdn.com/w40/${currency.flag}.png`}
                          alt={`${currency.code} flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{currency.code}</span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold px-1.5 rounded" style={{ background: "var(--accent)", color: "white" }}>
                        ON
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredCurrencies.length === 0 && (
                <div className="px-3 py-4 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                  No currencies found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
