"use client";

import { useEffect, useRef, useState } from "react";
import { BarConfig, COLORS, SPEEDS, CIRCLE_SIZE } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

function buildBars(startLabel: number, speeds: number[]): BarConfig[] {
  return COLORS.map((c, i) => ({
    ...c,
    labels: [String(startLabel + i * 2).padStart(2, "0"), String(startLabel + i * 2 + 1).padStart(2, "0")],
    speed: speeds[i] ?? SPEEDS[i],
  }));
}

interface VerticalBarsProps {
  bars?: BarConfig[];
  position?: "left" | "right";
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  height?: string;
  mobileCount?: number;
  scale?: number;
  startLabel?: number;
  direction?: "down" | "up";
  speeds?: number[];
  reverseColors?: boolean;
  hideOnMobile?: boolean;
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

function VerticalBarsSVG({
  bars, offset, thickness, direction, containerH,
}: {
  bars: BarConfig[]; offset: number; thickness: number; direction: "down" | "up"; containerH: number;
}) {
  const svgW = bars.length * thickness;
  const svgH = containerH || 1000;

  return (
    <svg
      width={svgW} height="100%"
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="none" fill="none"
      style={{ display: "block", width: svgW, height: "100%" }}
    >
      {bars.map((bar, i) => {
        const x = i * thickness;
        const cx = x + thickness / 2;
        const d = direction === "down"
          ? `M ${cx} 0 L ${cx} ${svgH}`
          : `M ${cx} ${svgH} L ${cx} 0`;

        const raw = (offset * bar.speed) % 1;
        const positions = [0, 0.25, 0.5, 0.75].map((gap) => {
          const p = (raw + gap) % 1;
          return direction === "up" ? 1 - p : p;
        });

        return (
          <g key={i}>
            <rect x={x} y={0} width={thickness} height={svgH} fill={bar.color} opacity={0.9} />
            <line x1={x} y1={0} x2={x} y2={svgH} stroke={bar.contrast} strokeWidth={1.5} opacity={0.5} />
            <line x1={x + thickness} y1={0} x2={x + thickness} y2={svgH} stroke={bar.contrast} strokeWidth={1.5} opacity={0.5} />
            <line x1={cx} y1={0} x2={cx} y2={svgH} stroke={bar.contrast} strokeWidth={1} opacity={0.3} strokeDasharray="4 6" />
            {positions.map((p, j) => (
              <BadgeOnPath key={j} d={d} t={p} label={bar.labels[j % bar.labels.length]} contrast={bar.contrast} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function VerticalBars({
  bars, position = "right", left, right: rightProp, top, bottom = "0",
  height = "100%", mobileCount = 3, scale = 1, startLabel = 11, direction = "down", speeds,
  reverseColors = false, hideOnMobile = false,
}: VerticalBarsProps) {
  const builtBars = bars ?? buildBars(startLabel, speeds ?? SPEEDS);
  const resolvedBars = reverseColors ? [...builtBars].reverse() : builtBars;
  const offset = useMarquee();
  const rawThickness = useBarThickness();
  const thickness = Math.round(rawThickness * scale);

  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const [mobileH, setMobileH] = useState(0);
  const [desktopH, setDesktopH] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const h = target.clientHeight;
        if (target === mobileRef.current) setMobileH(h);
        if (target === desktopRef.current) setDesktopH(h);
      }
    });
    if (mobileRef.current) ro.observe(mobileRef.current);
    if (desktopRef.current) ro.observe(desktopRef.current);
    return () => ro.disconnect();
  }, []);

  const posStyle = left != null ? { left }
    : rightProp != null ? { right: rightProp }
    : position === "right" ? { right: "0" } : { left: "0" };

  const mobileW = resolvedBars.slice(0, mobileCount).length * thickness;
  const desktopW = resolvedBars.length * thickness;

  return (
    <>
      <div ref={mobileRef} className={`absolute flex flex-row ${hideOnMobile ? "hidden" : "sm:hidden"}`} style={{ top, bottom, height, width: mobileW, ...posStyle }}>
        <VerticalBarsSVG bars={resolvedBars.slice(0, mobileCount)} offset={offset} thickness={thickness} direction={direction} containerH={mobileH} />
      </div>
      <div ref={desktopRef} className="absolute hidden sm:flex flex-row" style={{ top, bottom, height, width: desktopW, ...posStyle }}>
        <VerticalBarsSVG bars={resolvedBars} offset={offset} thickness={thickness} direction={direction} containerH={desktopH} />
      </div>
    </>
  );
}
