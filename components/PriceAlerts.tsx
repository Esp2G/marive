"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Plus, X, ChevronDown } from "lucide-react";
import { PriceAlert, Asset, PriceData } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface PriceAlertsProps {
  alerts: PriceAlert[];
  asset: Asset;
  currentPrice: number | null;
  onAdd: (alert: PriceAlert) => void;
  onRemove: (id: string) => void;
}

export function PriceAlerts({
  alerts,
  asset,
  currentPrice,
  onAdd,
  onRemove,
}: PriceAlertsProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");

  const assetAlerts = alerts.filter((a) => a.assetId === asset.id);
  const activeAlerts = assetAlerts.filter((a) => !a.triggered);
  const triggeredAlerts = assetAlerts.filter((a) => a.triggered);
  const hasTriggered = triggeredAlerts.length > 0;

  const handleAdd = () => {
    const price = parseFloat(targetPrice);
    if (!price || isNaN(price) || price <= 0) return;

    onAdd({
      id: uuidv4(),
      assetId: asset.id,
      symbol: asset.symbol,
      targetPrice: price,
      condition,
      triggered: false,
      createdAt: Date.now(),
    });
    setTargetPrice("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-150",
          "glass hover:border-white/[0.12]",
          hasTriggered && "border-yellow-500/40"
        )}
      >
        {hasTriggered ? (
          <BellRing size={14} className="text-yellow-400 animate-pulse" />
        ) : (
          <Bell size={14} style={{ color: "var(--text-secondary)" }} />
        )}
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          Alerts
        </span>
        {activeAlerts.length > 0 && (
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {activeAlerts.length}
          </span>
        )}
        <ChevronDown
          size={12}
          style={{
            color: "var(--text-tertiary)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setExpanded(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl overflow-hidden glass shadow-2xl"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Price Alerts — {asset.symbol}
                </span>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:bg-white/[0.08]"
                  style={{ background: "var(--surface-tertiary)" }}
                >
                  <Plus size={13} style={{ color: "var(--accent)" }} />
                </button>
              </div>

              {/* Add form */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="p-3 flex flex-col gap-2">
                      {currentPrice && (
                        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                          Current: {formatPrice(currentPrice, asset.symbol)}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCondition("above")}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                            condition === "above"
                              ? "text-white"
                              : ""
                          )}
                          style={
                            condition === "above"
                              ? { background: "var(--positive)", color: "white" }
                              : { background: "var(--surface-tertiary)", color: "var(--text-secondary)" }
                          }
                        >
                          ↑ Above
                        </button>
                        <button
                          onClick={() => setCondition("below")}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                          )}
                          style={
                            condition === "below"
                              ? { background: "var(--negative)", color: "white" }
                              : { background: "var(--surface-tertiary)", color: "var(--text-secondary)" }
                          }
                        >
                          ↓ Below
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="flex-1 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs"
                          style={{ background: "var(--surface-tertiary)" }}
                        >
                          <span style={{ color: "var(--text-tertiary)" }}>$</span>
                          <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            placeholder="Target price"
                            className="flex-1 bg-transparent outline-none"
                            style={{ color: "var(--text-primary)" }}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                          />
                        </div>
                        <button
                          onClick={handleAdd}
                          disabled={!targetPrice}
                          className="px-3 rounded-lg text-xs font-medium disabled:opacity-40 transition-all"
                          style={{ background: "var(--accent)", color: "white" }}
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alert list */}
              <div className="max-h-60 overflow-y-auto">
                {assetAlerts.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={20} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-tertiary)" }} />
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>No alerts set</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {assetAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                          alert.triggered ? "opacity-50" : ""
                        )}
                        style={{
                          background: alert.triggered
                            ? "var(--surface-tertiary)"
                            : "var(--surface-secondary)",
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{
                            background:
                              alert.condition === "above"
                                ? "rgba(0,208,132,0.15)"
                                : "rgba(255,59,48,0.15)",
                            color:
                              alert.condition === "above"
                                ? "var(--positive)"
                                : "var(--negative)",
                          }}
                        >
                          {alert.condition === "above" ? "↑" : "↓"}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold tabular" style={{ color: "var(--text-primary)" }}>
                            {formatPrice(alert.targetPrice, asset.symbol)}
                          </div>
                          <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                            {alert.triggered ? "✓ Triggered" : `Alert when price goes ${alert.condition} target`}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(alert.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/[0.08] transition-all"
                        >
                          <X size={11} style={{ color: "var(--text-tertiary)" }} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
