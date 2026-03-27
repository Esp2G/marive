"use client";
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
  intensity?: number;
}

/** A card wrapper that emits a coloured radial glow halo on hover. */
export function GlowCard({ children, glowColor = "var(--accent)", className, intensity = 0.25 }: GlowCardProps) {
  const [hovered, setHovered] = useState(false);

  // Convert CSS var to a string that works in box-shadow
  const shadow = hovered
    ? `0 0 40px 4px color-mix(in srgb, ${glowColor} ${Math.round(intensity * 100)}%, transparent)`
    : "none";

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ scale: hovered ? 1.01 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("relative", className)}
      style={{ boxShadow: shadow, transition: "box-shadow 0.3s ease" }}
    >
      {children}
    </motion.div>
  );
}
