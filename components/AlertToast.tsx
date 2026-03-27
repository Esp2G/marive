"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X } from "lucide-react";
import { PriceAlert } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface AlertToastProps {
  alert: PriceAlert | null;
  symbol: string;
  onDismiss: () => void;
}

export function AlertToast({ alert, symbol, onDismiss }: AlertToastProps) {
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [alert, onDismiss]);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 glass rounded-2xl shadow-2xl overflow-hidden"
          style={{ minWidth: 300, maxWidth: 380 }}
        >
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-0.5 origin-left"
            style={{
              background:
                alert.condition === "above"
                  ? "var(--positive)"
                  : "var(--negative)",
            }}
          />
          <div className="flex items-start gap-3 p-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  alert.condition === "above"
                    ? "rgba(0,208,132,0.15)"
                    : "rgba(255,59,48,0.15)",
              }}
            >
              <BellRing
                size={16}
                style={{
                  color:
                    alert.condition === "above"
                      ? "var(--positive)"
                      : "var(--negative)",
                }}
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Price Alert Triggered 🔔
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold">{symbol}</span> crossed{" "}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      alert.condition === "above"
                        ? "var(--positive)"
                        : "var(--negative)",
                  }}
                >
                  {formatPrice(alert.targetPrice, symbol)}
                </span>{" "}
                {alert.condition}
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/[0.08] transition-all"
            >
              <X size={13} style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
