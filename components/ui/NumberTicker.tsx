"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface NumberTickerProps {
  value: string;
}

/**
 * AnimatedChar — always calls hooks unconditionally (Rules of Hooks).
 * Non-digit characters just render as a plain span using the motion value,
 * but we never skip the hook calls.
 */
function AnimatedChar({ char }: { char: string }) {
  const isDigit = /\d/.test(char);
  const digit = isDigit ? parseInt(char, 10) : 0;

  // ⚠️  Hooks MUST be called unconditionally — no early return before this block
  const motionVal = useMotionValue(digit);
  const spring = useSpring(motionVal, { stiffness: 220, damping: 26, mass: 0.5 });
  const y = useTransform(spring, (v) => `${-v * 10}%`);

  useEffect(() => {
    if (isDigit) motionVal.set(digit);
  }, [digit, isDigit, motionVal]);

  // Non-digit characters (dollar sign, comma, dot, space) render immediately
  if (!isDigit) {
    return <span style={{ display: "inline-block" }}>{char}</span>;
  }

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: "1.2em",
        verticalAlign: "bottom",
        position: "relative",
      }}
    >
      <motion.span style={{ display: "block", position: "relative", y }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{ display: "block", height: "1.2em" }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function NumberTicker({ value }: NumberTickerProps) {
  const chars = value.split("");
  return (
    <span style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums" }}>
      {chars.map((char, i) => (
        <AnimatedChar key={i} char={char} />
      ))}
    </span>
  );
}
