"use client";

/**
 * MagicBorder — a flowing gradient beam that animates around the element's perimeter.
 * Usage: render as the FIRST child of a `position: relative` container.
 */
export function MagicBorder({
  borderRadius = "0.75rem",
  color = "var(--accent)",
  duration = 3,
}: {
  borderRadius?: string;
  color?: string;
  duration?: number;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          padding: "1px",
          background: `conic-gradient(from var(--beam-angle, 0deg), transparent 20%, ${color} 50%, transparent 80%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          animation: `border-beam-spin ${duration}s linear infinite`,
        }}
      />
      <style>{`
        @property --beam-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-beam-spin {
          to { --beam-angle: 360deg; }
        }
      `}</style>
    </>
  );
}
