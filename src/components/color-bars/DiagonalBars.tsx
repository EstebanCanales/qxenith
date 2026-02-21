"use client";

import { useEffect, useRef, useState } from "react";
import { BarConfig, COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

const DEFAULT_BARS: BarConfig[] = COLORS.map((c, i) => ({
  ...c,
  labels: [String(i * 2 + 1).padStart(2, "0"), String(i * 2 + 2).padStart(2, "0")],
  speed: SPEEDS[i],
}));

interface DiagonalBarsProps {
  bars?: BarConfig[];
  bottom?: string;
  right?: string;
  rotation?: number;
  width?: string;
  height?: string;
  hiddenOnMobile?: boolean;
  reverseColors?: boolean;
}

function edgeOpacity(t: number): number {
  const fade = 0.05;
  if (t < fade) return t / fade;
  if (t > 1 - fade) return (1 - t) / fade;
  return 1;
}

function BadgeOnPath({ d, t, label, contrast }: { d: string; t: number; label: string; contrast: string }) {
  const half = CIRCLE_SIZE / 2;
  return (
    <foreignObject
      width={CIRCLE_SIZE}
      height={CIRCLE_SIZE}
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
          width: CIRCLE_SIZE, height: CIRCLE_SIZE,
          backgroundColor: contrast, borderRadius: 4,
          filter: "brightness(0.85)",
        }}
      >
        <span className="font-mono font-bold leading-none" style={{ fontSize: CIRCLE_SIZE * 0.4, color: "rgba(255,255,255,0.6)" }}>
          {label}
        </span>
      </div>
    </foreignObject>
  );
}

export default function DiagonalBars({
  bars = DEFAULT_BARS, bottom = "-12%", right = "0%",
  rotation = -45, width = "50%", height = "55%", hiddenOnMobile = true,
  reverseColors = false,
}: DiagonalBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const offset = useMarquee();
  const thickness = useBarThickness();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerW(el.clientWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const orderedBars = reverseColors ? [...bars].reverse() : bars;
  // Use measured width * 2 (since we use 200% width with -50% margin) or fallback
  const svgW = containerW > 0 ? containerW * 2 : 2000;
  const svgH = orderedBars.length * thickness;

  return (
    <div
      ref={containerRef}
      className={`absolute ${hiddenOnMobile ? "hidden sm:block" : "block"}`}
      style={{ bottom, right, width, height, transform: `rotate(${rotation}deg)`, transformOrigin: "bottom right" }}
    >
      <svg
        width="200%" height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="none" fill="none"
        style={{ display: "block", marginLeft: "-50%" }}
      >
        {orderedBars.map((bar, i) => {
          const y = i * thickness;
          const cy = y + thickness / 2;
          const d = `M 0 ${cy} L ${svgW} ${cy}`;

          const raw = (offset * bar.speed) % 1;
          const positions = [0, 0.25, 0.5, 0.75].map((gap) => (raw + gap) % 1);

          return (
            <g key={i}>
              <rect x={0} y={y} width={svgW} height={thickness} fill={bar.color} opacity={0.9} />
              <line x1={0} y1={y} x2={svgW} y2={y} stroke={bar.contrast} strokeWidth={1.5} opacity={0.5} />
              <line x1={0} y1={y + thickness} x2={svgW} y2={y + thickness} stroke={bar.contrast} strokeWidth={1.5} opacity={0.5} />
              <line x1={0} y1={cy} x2={svgW} y2={cy} stroke={bar.contrast} strokeWidth={1} opacity={0.3} strokeDasharray="4 6" />
              {positions.map((p, j) => (
                <BadgeOnPath key={j} d={d} t={p} label={bar.labels[j % bar.labels.length]} contrast={bar.contrast} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
