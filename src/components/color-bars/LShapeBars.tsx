"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

interface LShapeBarsProps {
  corner?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  scale?: number;
  vLen?: number;
  hLen?: number;
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

/* ------------------------------------------------------------------ */
/*  Path builders — all arcs share one center, truly concentric       */
/* ------------------------------------------------------------------ */

function bottomLeft(
  vLen: number, hLen: number, maxR: number,
  rInner: number, rOuter: number, rCenter: number,
) {
  const cX = maxR;
  const cY = vLen - maxR;
  const xEnd = maxR + hLen;

  const fill = [
    `M ${cX - rOuter} 0`,
    `L ${cX - rOuter} ${cY}`,
    `A ${rOuter} ${rOuter} 0 0 0 ${cX} ${cY + rOuter}`,
    `L ${xEnd} ${cY + rOuter}`,
    `L ${xEnd} ${cY + rInner}`,
    `L ${cX} ${cY + rInner}`,
    rInner > 0
      ? `A ${rInner} ${rInner} 0 0 1 ${cX - rInner} ${cY}`
      : `L ${cX} ${cY}`,
    `L ${cX - rInner} 0`,
    `Z`,
  ].join(" ");

  const center = [
    `M ${cX - rCenter} 0`,
    `L ${cX - rCenter} ${cY}`,
    `A ${rCenter} ${rCenter} 0 0 0 ${cX} ${cY + rCenter}`,
    `L ${xEnd} ${cY + rCenter}`,
  ].join(" ");

  return { fill, center };
}

function bottomRight(
  vLen: number, hLen: number, maxR: number,
  rInner: number, rOuter: number, rCenter: number,
) {
  const cX = hLen;
  const cY = vLen - maxR;
  const xStart = cX - hLen;

  const fill = [
    `M ${cX + rOuter} 0`,
    `L ${cX + rOuter} ${cY}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${cX} ${cY + rOuter}`,
    `L ${xStart} ${cY + rOuter}`,
    `L ${xStart} ${cY + rInner}`,
    `L ${cX} ${cY + rInner}`,
    rInner > 0
      ? `A ${rInner} ${rInner} 0 0 0 ${cX + rInner} ${cY}`
      : `L ${cX} ${cY}`,
    `L ${cX + rInner} 0`,
    `Z`,
  ].join(" ");

  const center = [
    `M ${cX + rCenter} 0`,
    `L ${cX + rCenter} ${cY}`,
    `A ${rCenter} ${rCenter} 0 0 1 ${cX} ${cY + rCenter}`,
    `L ${xStart} ${cY + rCenter}`,
  ].join(" ");

  return { fill, center };
}

function topLeft(
  vLen: number, hLen: number, maxR: number,
  rInner: number, rOuter: number, rCenter: number,
) {
  const cX = maxR;
  const cY = maxR;
  const xEnd = maxR + hLen;

  const fill = [
    `M ${cX - rOuter} ${vLen}`,
    `L ${cX - rOuter} ${cY}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${cX} ${cY - rOuter}`,
    `L ${xEnd} ${cY - rOuter}`,
    `L ${xEnd} ${cY - rInner}`,
    `L ${cX} ${cY - rInner}`,
    rInner > 0
      ? `A ${rInner} ${rInner} 0 0 0 ${cX - rInner} ${cY}`
      : `L ${cX} ${cY}`,
    `L ${cX - rInner} ${vLen}`,
    `Z`,
  ].join(" ");

  const center = [
    `M ${xEnd} ${cY - rCenter}`,
    `L ${cX} ${cY - rCenter}`,
    `A ${rCenter} ${rCenter} 0 0 0 ${cX - rCenter} ${cY}`,
    `L ${cX - rCenter} ${vLen}`,
  ].join(" ");

  return { fill, center };
}

function topRight(
  vLen: number, hLen: number, maxR: number,
  rInner: number, rOuter: number, rCenter: number,
) {
  const cX = hLen;
  const cY = maxR;
  const xStart = 0;

  const fill = [
    `M ${cX + rOuter} ${vLen}`,
    `L ${cX + rOuter} ${cY}`,
    `A ${rOuter} ${rOuter} 0 0 0 ${cX} ${cY - rOuter}`,
    `L ${xStart} ${cY - rOuter}`,
    `L ${xStart} ${cY - rInner}`,
    `L ${cX} ${cY - rInner}`,
    rInner > 0
      ? `A ${rInner} ${rInner} 0 0 1 ${cX + rInner} ${cY}`
      : `L ${cX} ${cY}`,
    `L ${cX + rInner} ${vLen}`,
    `Z`,
  ].join(" ");

  const center = [
    `M ${xStart} ${cY - rCenter}`,
    `L ${cX} ${cY - rCenter}`,
    `A ${rCenter} ${rCenter} 0 0 1 ${cX + rCenter} ${cY}`,
    `L ${cX + rCenter} ${vLen}`,
  ].join(" ");

  return { fill, center };
}

const PATH_FNS = {
  "bottom-left": bottomLeft,
  "bottom-right": bottomRight,
  "top-left": topLeft,
  "top-right": topRight,
} as const;

/* ------------------------------------------------------------------ */

export default function LShapeBars({
  corner = "bottom-left",
  scale = 1,
  vLen = 520,
  hLen = 480,
  baseR = 60,
  reverseColors = true,
}: LShapeBarsProps) {
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

  const svgW = maxR + hLen;
  const svgH = vLen;

  const buildPaths = PATH_FNS[corner];

  if (dims.w === 0 || dims.h === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute hidden sm:block"
        style={{
          [corner.includes("bottom") ? "bottom" : "top"]: 0,
          [corner.includes("left") ? "left" : "right"]: 0,
          width: svgW,
          height: svgH,
          overflow: "visible",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute hidden sm:block"
      style={{
        [corner.includes("bottom") ? "bottom" : "top"]: 0,
        [corner.includes("left") ? "left" : "right"]: 0,
        width: svgW,
        height: svgH,
        overflow: "visible",
      }}
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

          const { fill, center } = buildPaths(vLen, hLen, maxR, rInner, rOuter, rCenter);

          const ri = COLORS.length - 1 - i;
          const speed = SPEEDS[ri];
          const raw = ((offset * speed) % 1);
          const positions = [0, 0.33, 0.66].map((g) => ((raw + g) % 1));

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
