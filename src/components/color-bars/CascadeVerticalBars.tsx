"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, CIRCLE_SIZE, SPEEDS } from "./types";
import { useMarquee } from "./useMarquee";
import { useBarThickness } from "./useBarThickness";

interface CascadeVerticalBarsProps {
  /** Scale factor for bar thickness (default 0.72) */
  scale?: number;
  /** Cone portion as fraction of total height (default 0.3) */
  coneFraction?: number;
  /** Position: "left" or "right" (default "right") */
  position?: "left" | "right";
  /** Whether to reverse color order (default false) */
  reverseColors?: boolean;
  /** Number of bars to show on mobile (default 3) */
  mobileCount?: number;
}

export default function CascadeVerticalBars({
  scale = 0.72,
  coneFraction = 0.3,
  position = "right",
  reverseColors = false,
  mobileCount = 3,
}: CascadeVerticalBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const rawThickness = useBarThickness();
  const thickness = Math.round(rawThickness * scale);
  const offset = useMarquee();

  // Measure actual container size with ResizeObserver (catches zoom too)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const colors = reverseColors ? [...COLORS].reverse() : COLORS;
  const speeds = reverseColors ? [...SPEEDS].reverse() : SPEEDS;
  const n = colors.length;

  const vw = dims.w;
  const vh = dims.h;
  const coneH = Math.round(vh * coneFraction);
  const barsH = vh - coneH;

  // Cone: top = full width proportional, bottom = tight cluster
  const weights = Array.from({ length: n }, (_, i) => n - i);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const topWidths = weights.map((w) => (w / totalWeight) * vw);
  const topStarts: number[] = [];
  let acc = 0;

  if (position === "right") {
    for (const tw of topWidths) { topStarts.push(acc); acc += tw; }
  } else {
    const reversed = [...topWidths].reverse();
    for (const tw of reversed) { topStarts.push(acc); acc += tw; }
    topStarts.reverse();
  }

  const barsW = n * thickness;
  const barsX = position === "right" ? vw - barsW : 0;
  const midY = coneH * 0.55;

  const PHASE_OFFSETS = [0, 0.13, 0.06, 0.19, 0.09];

  const renderBars = (barColors: typeof colors, barSpeeds: number[]) => {
    if (vw === 0 || vh === 0) return null;
    return (
      <svg
        className="absolute inset-0 w-full h-full z-[3] pointer-events-none"
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {barColors.map((c, i) => {
          const topL = topStarts[i];
          const topR = topStarts[i] + topWidths[i];
          const botL = barsX + i * thickness;
          const botR = barsX + (i + 1) * thickness;

          const coneD = [
            `M ${topL} 0`,
            `C ${topL} ${midY}, ${botL} ${midY}, ${botL} ${coneH}`,
            `L ${botR} ${coneH}`,
            `C ${botR} ${midY}, ${topR} ${midY}, ${topR} 0`,
            `Z`,
          ].join(" ");

          const cTopX = (topL + topR) / 2;
          const cBotX = (botL + botR) / 2;
          const centerD = `M ${cTopX} 0 C ${cTopX} ${midY}, ${cBotX} ${midY}, ${cBotX} ${coneH} L ${cBotX} ${vh}`;

          const speed = barSpeeds[i] ?? 0.1;
          const phase = PHASE_OFFSETS[i] ?? 0;
          const raw = (offset * speed + phase) % 1;
          const gaps = [0, 0.33, 0.66];
          const positions = gaps.map((gap) => (raw + gap) % 1);

          return (
            <g key={i}>
              <path d={coneD} fill={c.color} opacity={0.9} />
              <rect x={botL} y={coneH} width={thickness} height={barsH} fill={c.color} opacity={0.9} />

              <path d={`M ${topL} 0 C ${topL} ${midY}, ${botL} ${midY}, ${botL} ${coneH}`}
                stroke={c.contrast} strokeWidth={1.5} opacity={0.5} fill="none" />
              <path d={`M ${topR} 0 C ${topR} ${midY}, ${botR} ${midY}, ${botR} ${coneH}`}
                stroke={c.contrast} strokeWidth={1.5} opacity={0.5} fill="none" />
              <line x1={botL} y1={coneH} x2={botL} y2={vh} stroke={c.contrast} strokeWidth={1.5} opacity={0.5} />
              <line x1={botR} y1={coneH} x2={botR} y2={vh} stroke={c.contrast} strokeWidth={1.5} opacity={0.5} />

              <path d={centerD} stroke={c.contrast} strokeWidth={1}
                opacity={0.3} strokeDasharray="4 6" fill="none" />

              {positions.map((p, j) => {
                const fadeIn = Math.min(1, p / 0.08);
                const fadeOut = Math.min(1, (1 - p) / 0.08);
                const fade = fadeIn * fadeOut;
                const badgeScale = 0.6 + fade * 0.4;
                return (
                  <foreignObject key={j}
                    width={CIRCLE_SIZE} height={CIRCLE_SIZE}
                    x={-CIRCLE_SIZE / 2} y={-CIRCLE_SIZE / 2}
                    opacity={fade * 0.85}
                    style={{
                      offsetPath: `path("${centerD}")`,
                      offsetDistance: `${p * 100}%`,
                      offsetRotate: "0deg",
                      overflow: "visible",
                    }}
                  >
                    <div className="flex items-center justify-center"
                      style={{
                        width: CIRCLE_SIZE, height: CIRCLE_SIZE,
                        backgroundColor: c.contrast, borderRadius: 4,
                        filter: "brightness(0.85)",
                        transform: `scale(${badgeScale})`,
                        boxShadow: `0 0 ${Math.round(fade * 8)}px ${c.color}66`,
                      }}
                    >
                      <span className="font-mono font-bold leading-none"
                        style={{ fontSize: CIRCLE_SIZE * 0.4, color: "rgba(255,255,255,0.7)" }}
                      >
                        {String(11 + i * 2 + (j % 2)).padStart(2, "0")}
                      </span>
                    </div>
                  </foreignObject>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  };

  const mobileColors = colors.slice(0, mobileCount);
  const mobileSpeeds = speeds.slice(0, mobileCount);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div className="absolute inset-0 sm:hidden">
        {renderBars(mobileColors, mobileSpeeds)}
      </div>
      <div className="absolute inset-0 hidden sm:block">
        {renderBars(colors, speeds)}
      </div>
    </div>
  );
}
