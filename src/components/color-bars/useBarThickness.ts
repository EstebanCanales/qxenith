"use client";

import { useEffect, useState } from "react";

// Thickness as ~1.8% of viewport width — scales with zoom
const FACTOR = 0.018;

export function useBarThickness() {
  const [thickness, setThickness] = useState(
    Math.round(1440 * FACTOR),
  );

  useEffect(() => {
    const update = () => {
      setThickness(Math.max(8, Math.round(window.innerWidth * FACTOR)));
    };
    update();

    // ResizeObserver on documentElement catches zoom changes
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return thickness;
}
