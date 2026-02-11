"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  trail: Map<string, number>;
  expanded: boolean;
  onCell: (row: number, col: number, numCols: number, cellSize: number) => void;
  onClickExpand: (row: number, col: number, numCols: number, cellSize: number) => void;
  onMouseLeave?: () => void;
};

const ROWS = 12;
const RADIUS = 8;
const ACTIVE_THRESHOLD = 0.05;

// Always use a subtle light color (white) so it works on both dark and green faces
const TRAIL_COLOR = { r: 255, g: 255, b: 255 };

export default function Overlay({ trail, expanded, onCell, onClickExpand, onMouseLeave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ cellSize: 0, numCols: 0 });
  const lastCell = useRef("");

  const color = TRAIL_COLOR;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const cellSize = height / ROWS;
      const numCols = Math.ceil(width / cellSize);
      setDims({ cellSize, numCols });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cells = useMemo(() => {
    if (dims.numCols === 0) return [];
    const result: { row: number; col: number; key: string }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < dims.numCols; col++) {
        result.push({ row, col, key: `${row}_${col}` });
      }
    }
    return result;
  }, [dims.numCols]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dims.cellSize === 0) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / dims.cellSize);
      const row = Math.floor(y / dims.cellSize);

      if (row < 0 || row >= ROWS || col < 0 || col >= dims.numCols) return;

      const key = `${row}_${col}`;
      if (key === lastCell.current) return;
      lastCell.current = key;

      onCell(row, col, dims.numCols, dims.cellSize);
    },
    [dims, onCell],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dims.cellSize === 0) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / dims.cellSize);
      const row = Math.floor(y / dims.cellSize);

      if (row < 0 || row >= ROWS || col < 0 || col >= dims.numCols) return;
      onClickExpand(row, col, dims.numCols, dims.cellSize);
    },
    [dims, onClickExpand],
  );

  const isActive = useCallback(
    (r: number, c: number): boolean => {
      if (r < 0 || r >= ROWS || c < 0 || c >= dims.numCols) return false;
      return (trail.get(`${r}_${c}`) ?? 0) > ACTIVE_THRESHOLD;
    },
    [trail, dims.numCols],
  );

  if (dims.cellSize === 0) {
    return <div ref={ref} className="absolute inset-0 z-[30]" />;
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-[30] pointer-events-auto overflow-hidden cursor-pointer"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${dims.numCols}, ${dims.cellSize}px)`,
        gridAutoRows: `${dims.cellSize}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      {cells.map(({ row, col, key }) => {
        const intensity = trail.get(key) ?? 0;
        const active = intensity > ACTIVE_THRESHOLD;

        const hasTop = isActive(row - 1, col);
        const hasBottom = isActive(row + 1, col);
        const hasLeft = isActive(row, col - 1);
        const hasRight = isActive(row, col + 1);

        const bt = active && !hasTop;
        const bb = active && !hasBottom;
        const bl = active && !hasLeft;
        const br = active && !hasRight;

        const rTL = bt && bl;
        const rTR = bt && br;
        const rBR = bb && br;
        const rBL = bb && bl;

        const { r, g, b } = color;
        const outerColor = `rgba(${r},${g},${b},${Math.min(intensity * 0.5, 0.35)})`;
        const innerColor = `rgba(${r},${g},${b},${Math.min(intensity * 0.25, 0.18)})`;
        const none = "1px solid transparent";
        const INSET = 3;
        const INNER_R = Math.max(0, RADIUS - INSET);

        return (
          <div
            key={key}
            className="pointer-events-none relative"
            style={{
              backgroundColor: active
                ? `rgba(${r},${g},${b},${(intensity * 0.08).toFixed(3)})`
                : "transparent",
              borderTop: bt ? `1px solid ${outerColor}` : none,
              borderBottom: bb ? `1px solid ${outerColor}` : none,
              borderLeft: bl ? `1px solid ${outerColor}` : none,
              borderRight: br ? `1px solid ${outerColor}` : none,
              borderRadius: `${rTL ? RADIUS : 0}px ${rTR ? RADIUS : 0}px ${rBR ? RADIUS : 0}px ${rBL ? RADIUS : 0}px`,
              transition:
                "background-color 200ms ease-out, border-color 200ms ease-out, border-radius 150ms ease-out",
            }}
          >
            {active && (
              <div
                className="absolute"
                style={{
                  top: bt ? INSET : 0,
                  bottom: bb ? INSET : 0,
                  left: bl ? INSET : 0,
                  right: br ? INSET : 0,
                  borderTop: bt ? `1px solid ${innerColor}` : "1px solid transparent",
                  borderBottom: bb ? `1px solid ${innerColor}` : "1px solid transparent",
                  borderLeft: bl ? `1px solid ${innerColor}` : "1px solid transparent",
                  borderRight: br ? `1px solid ${innerColor}` : "1px solid transparent",
                  borderRadius: `${rTL ? INNER_R : 0}px ${rTR ? INNER_R : 0}px ${rBR ? INNER_R : 0}px ${rBL ? INNER_R : 0}px`,
                  transition:
                    "border-color 200ms ease-out, border-radius 150ms ease-out",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
