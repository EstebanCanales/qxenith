"use client";

import { useEffect, useState } from "react";

type GridSize = { cols: number; rows: number; total: number };

const BREAKPOINTS: { minWidth: number; cols: number; rows: number }[] = [
  { minWidth: 1024, cols: 6, rows: 6 },
  { minWidth: 640, cols: 4, rows: 4 },
  { minWidth: 0, cols: 3, rows: 3 },
];

function getGridSize(width: number): GridSize {
  for (const bp of BREAKPOINTS) {
    if (width >= bp.minWidth) {
      return { cols: bp.cols, rows: bp.rows, total: bp.cols * bp.rows };
    }
  }
  return { cols: 3, rows: 3, total: 9 };
}

export function useGridSize(): GridSize {
  const [size, setSize] = useState<GridSize>({ cols: 6, rows: 6, total: 36 });

  useEffect(() => {
    const update = () => setSize(getGridSize(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
