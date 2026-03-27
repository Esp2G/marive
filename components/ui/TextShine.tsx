"use client";
import { ReactNode } from "react";

interface TextShineProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}

export function TextShine({
  children,
  className = "",
  colors = ["var(--text-primary)", "#c8c8d4", "#ffffff", "var(--accent)", "#c8c8d4", "var(--text-primary)"],
  duration = 4,
}: TextShineProps) {
  const gradient = colors.join(", ");
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(120deg, ${gradient})`,
        backgroundSize: "300% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        animation: `text-shine ${duration}s linear infinite`,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}
