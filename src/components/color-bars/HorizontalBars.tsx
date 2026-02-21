"use client";

import { useEffect, useRef, useState } from "react";
import { BarConfig, COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

function buildBars(startLabel: number, speeds: number[]): BarConfig[] {
  return COLORS.map((c, i) => ({
    ...c,
    labels: [
      String(startLabel + i * 2).padStart(2, "0"),
      String(startLabel + i * 2 + 1).padStart(2, "0"),
    ],
    speed: speeds[i] ?? SPEEDS[i],
  }));
}

interface HorizontalBarsProps {
  position?: "top" | "bottom";
  top?: string;
  bottom?: string;
  left?: string;
  width?: string;
  scale?: number;
  startLabel?: number;
  direction?: "left" | "right";
  speeds?: number[];
  mobileCount?: number;
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

function HorizontalBarsSVG({
  bars, offset, thickness, direction, containerW,
}: {
  bars: BarConfig[]; offset: number; thickness: number; direction: "left" | "right"; containerW: number;
}) {
  if (containerW === 0) return null;

  const svgW = containerW;
  const svgH = bars.length * thickness;

  return (
    <svg
      width="100%" height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="none" fill="none"
      style={{ display: "block", width: "100%", height: svgH }}
    >
      {bars.map((bar, i) => {
        const y = i * thickness;
        const cy = y + thickness / 2;
        const d = direction === "right"
          ? `M 0 ${cy} L ${svgW} ${cy}`
          : `M ${svgW} ${cy} L 0 ${cy}`;

        const raw = (offset * bar.speed) % 1;
        const positions = [0, 0.25, 0.5, 0.75].map((gap) => {
          const p = (raw + gap) % 1;
          return direction === "left" ? 1 - p : p;
        });

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
  );
}

export default function HorizontalBars({
  position = "bottom", top, bottom: bottomProp, left = "0", width = "100%",
  scale = 1, startLabel = 31, direction = "right", speeds, mobileCount = 3, hiddenOnMobile = false,
  reverseColors = false,
}: HorizontalBarsProps) {
  const builtBars = buildBars(startLabel, speeds ?? SPEEDS);
  const bars = reverseColors ? [...builtBars].reverse() : builtBars;
  const offset = useMarquee();
  const rawThickness = useBarThickness();
  const thickness = Math.round(rawThickness * scale);

  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const [mobileW, setMobileW] = useState(0);
  const [desktopW, setDesktopW] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const w = target.clientWidth;
        if (target === mobileRef.current) setMobileW(w);
        if (target === desktopRef.current) setDesktopW(w);
      }
    });
    if (mobileRef.current) ro.observe(mobileRef.current);
    if (desktopRef.current) ro.observe(desktopRef.current);
    return () => ro.disconnect();
  }, []);

  const posStyle = top != null ? { top }
    : bottomProp != null ? { bottom: bottomProp }
    : position === "top" ? { top: "0" } : { bottom: "0" };

  return (
    <>
      <div ref={mobileRef} className={`absolute flex flex-col ${hiddenOnMobile ? "hidden" : "sm:hidden"}`} style={{ left, width, ...posStyle }}>
        <HorizontalBarsSVG bars={bars.slice(0, mobileCount)} offset={offset} thickness={thickness} direction={direction} containerW={mobileW} />
      </div>
      <div ref={desktopRef} className="absolute hidden sm:flex flex-col" style={{ left, width, ...posStyle }}>
        <HorizontalBarsSVG bars={bars} offset={offset} thickness={thickness} direction={direction} containerW={desktopW} />
      </div>
    </>
  );
}
