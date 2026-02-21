"use client";

import { COLORS } from "./types";
import { useBarThickness } from "./useBarThickness";

interface LShapeCirclesProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  scale?: number;
  reverseColors?: boolean;
}

export default function LShapeCircles({ position = "top-right", scale = 1, reverseColors = false }: LShapeCirclesProps) {
  const rawThickness = useBarThickness();
  const thickness = Math.round(rawThickness * scale);
  const isTop = position.startsWith("top");
  const isRight = position.endsWith("right");

  const count = COLORS.length;
  const baseSize = thickness * count * 2 + thickness * 2;
  const radii = COLORS.map((_, i) => (baseSize - i * thickness * 2) / 2);
  // Center-line radii (midpoint between each ring)
  const centerRadii = COLORS.map((_, i) => radii[i] - thickness / 2);

  const maxR = radii[0];

  const cx = isRight ? maxR : 0;
  const cy = isTop ? maxR : 0;

  return (
    <svg
      className="absolute hidden sm:block"
      width={maxR}
      height={maxR}
      viewBox={`0 0 ${maxR} ${maxR}`}
      style={{
        [isTop ? "top" : "bottom"]: -maxR / 2,
        [isRight ? "right" : "left"]: -maxR / 2,
        overflow: "visible",
      }}
    >
      <defs>
        <clipPath id={`clip-${position}`}>
          <rect
            x={isRight ? maxR / 2 : 0}
            y={isTop ? maxR / 2 : 0}
            width={maxR / 2}
            height={maxR / 2}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${position})`}>
        {(reverseColors ? COLORS.slice().reverse() : COLORS).map((c, i) => (
          <g key={i}>
            {/* Fill ring */}
            <circle cx={cx} cy={cy} r={radii[i]} fill={c.color} opacity={0.9} />
            {/* Outer border */}
            <circle cx={cx} cy={cy} r={radii[i]} fill="none" stroke={c.contrast} strokeWidth={1.5} opacity={0.5} />
            {/* Center path line (dashed) */}
            <circle cx={cx} cy={cy} r={centerRadii[i]} fill="none" stroke={c.contrast} strokeWidth={1} opacity={0.3} strokeDasharray="4 6" />
          </g>
        ))}
      </g>
    </svg>
  );
}
