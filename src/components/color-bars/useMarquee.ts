"use client";

import { useEffect, useRef, useState } from "react";

export function useMarquee() {
  const [offset, setOffset] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const tick = () => {
      setOffset(performance.now() * 0.001);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return offset;
}
