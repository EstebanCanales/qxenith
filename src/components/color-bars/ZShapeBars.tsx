"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

interface ZShapeBarsProps {
  scale?: number;
  vLen1?: number;
  vLen2?: number;
  baseR?: number;
  reverseColors?: boolean;
  className?: string;
}

function edgeOpacity(t: number): number {
  const fade = 0.05;
  if (t < fade) return t / fade;
  if (t > 1 - fade) return (1 - t) / fade;
  return 1;
}

function BadgeOnPath({
  d, t, label, contrast, size,
}: {
  d: string; t: number; label: string; contrast: string; size: number;
}) {
  const half = size / 2;
  return (
    <foreignObject
      width={size}
      height={size}
      opacity={edgeOpacity(t) * 0.8}
      style={{
        offsetPath: `path("${d}")`,
        offsetDistance: `${t * 100}%`,
        offsetRotate: "0deg",
        overflow: "visible",
      }}
      x={-half}
      y={-half}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: size, height: size,
          backgroundColor: contrast, borderRadius: 4,
          filter: "brightness(0.85)",
        }}
      >
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size * 0.4, color: "rgba(255,255,255,0.6)" }}
        >
          {label}
        </span>
      </div>
    </foreignObject>
  );
}

export default function ZShapeBars({
  scale = 1,
  vLen1 = 300,
  vLen2 = 300,
  baseR = 80,
  reverseColors = true,
  className,
}: ZShapeBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const offset = useMarquee();
  const rawThickness = useBarThickness();
  const t = Math.round(rawThickness * scale);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerW(el.clientWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = COLORS.length;
  const maxR = baseR + count * t;

  // hGap fills the full container width automatically
  const hGap = Math.max(0, containerW - 2 * maxR);

  const svgW = 2 * maxR + hGap;
  const svgH = vLen1 + 2 * maxR + vLen2;

  const c1x = maxR + hGap;
  const c2x = maxR;

  return (
    <div
      ref={containerRef}
      className={className ?? "absolute"}
      style={{ top: 0, left: 0, right: 0, height: svgH, overflow: "visible" }}
    >
      {containerW > 0 && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          fill="none"
          style={{ overflow: "visible" }}
        >
          {(reverseColors ? COLORS.slice().reverse() : COLORS).map((c, i) => {
            const rInner = baseR + i * t;
            const rOuter = baseR + (i + 1) * t;
            const rCenter = baseR + i * t + t / 2;

            const fill = [
              `M ${c1x + rOuter} 0`,
              `L ${c1x + rOuter} ${vLen1}`,
              `A ${rOuter} ${rOuter} 0 0 1 ${c1x} ${vLen1 + rOuter}`,
              `L ${c2x} ${vLen1 + rOuter}`,
              `A ${rOuter} ${rOuter} 0 0 0 ${c2x - rOuter} ${vLen1 + 2 * rOuter}`,
              `L ${c2x - rOuter} ${svgH}`,
              `L ${c2x - rInner} ${svgH}`,
              `L ${c2x - rInner} ${vLen1 + 2 * rInner}`,
              `A ${rInner} ${rInner} 0 0 1 ${c2x} ${vLen1 + rInner}`,
              `L ${c1x} ${vLen1 + rInner}`,
              `A ${rInner} ${rInner} 0 0 0 ${c1x + rInner} ${vLen1}`,
              `L ${c1x + rInner} 0`,
              `Z`,
            ].join(" ");

            const center = [
              `M ${c1x + rCenter} 0`,
              `L ${c1x + rCenter} ${vLen1}`,
              `A ${rCenter} ${rCenter} 0 0 1 ${c1x} ${vLen1 + rCenter}`,
              `L ${c2x} ${vLen1 + rCenter}`,
              `A ${rCenter} ${rCenter} 0 0 0 ${c2x - rCenter} ${vLen1 + 2 * rCenter}`,
              `L ${c2x - rCenter} ${svgH}`,
            ].join(" ");

            const ri = COLORS.length - 1 - i;
            const speed = SPEEDS[ri];
            const raw = (offset * speed) % 1;
            const positions = [0, 0.33, 0.66].map((g) => (raw + g) % 1);

            return (
              <g key={i}>
                <path d={fill} fill={c.color} opacity={0.9} />
                <path d={fill} fill="none" stroke={c.contrast} strokeWidth={1.5} opacity={0.5} />
                <path d={center} stroke={c.contrast} strokeWidth={1} fill="none" opacity={0.3} strokeDasharray="4 6" />
                {positions.map((p, j) => (
                  <BadgeOnPath
                    key={j}
                    d={center}
                    t={p}
                    label={String(ri * 2 + j + 1).padStart(2, "0")}
                    contrast={c.contrast}
                    size={CIRCLE_SIZE}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
