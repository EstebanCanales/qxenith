"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

interface ZShapeBarsProps {
  scale?: number;
  vLen1?: number;
  vLen2?: number;
  hGap?: number;
  baseR?: number;
  reverseColors?: boolean;
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
  hGap = 300,
  baseR = 80,
  reverseColors = true,
}: ZShapeBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const offset = useMarquee();
  const rawThickness = useBarThickness();
  const t = Math.round(rawThickness * scale);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = COLORS.length;
  const maxR = baseR + count * t;

  const c1x = maxR + hGap;
  const cy = vLen1;
  const c2x = maxR;

  const svgW = 2 * maxR + hGap;
  const svgH = vLen1 + 2 * maxR + vLen2;

  if (dims.w === 0 || dims.h === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute hidden sm:block"
        style={{ top: 0, right: 0, width: svgW, height: svgH, overflow: "visible" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute hidden sm:block"
      style={{ top: 0, right: 0, width: svgW, height: svgH, overflow: "visible" }}
    >
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
            `L ${c1x + rOuter} ${cy}`,
            `A ${rOuter} ${rOuter} 0 0 1 ${c1x} ${cy + rOuter}`,
            `L ${c2x} ${cy + rOuter}`,
            `A ${rOuter} ${rOuter} 0 0 0 ${c2x - rOuter} ${cy + 2 * rOuter}`,
            `L ${c2x - rOuter} ${svgH}`,
            `L ${c2x - rInner} ${svgH}`,
            `L ${c2x - rInner} ${cy + 2 * rInner}`,
            `A ${rInner} ${rInner} 0 0 1 ${c2x} ${cy + rInner}`,
            `L ${c1x} ${cy + rInner}`,
            `A ${rInner} ${rInner} 0 0 0 ${c1x + rInner} ${cy}`,
            `L ${c1x + rInner} 0`,
            `Z`,
          ].join(" ");

          const center = [
            `M ${c1x + rCenter} 0`,
            `L ${c1x + rCenter} ${cy}`,
            `A ${rCenter} ${rCenter} 0 0 1 ${c1x} ${cy + rCenter}`,
            `L ${c2x} ${cy + rCenter}`,
            `A ${rCenter} ${rCenter} 0 0 0 ${c2x - rCenter} ${cy + 2 * rCenter}`,
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
    </div>
  );
}
