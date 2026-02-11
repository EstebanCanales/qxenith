import { useEffect, useRef, useState } from "react";

type Options = {
  expanded: boolean;
  hovered: boolean;
  pulse: number;
  durationMs: number;
  hoverBackDelayMs: number;
};

export function useFlipTimer({
  expanded,
  hovered,
  pulse,
  durationMs,
  hoverBackDelayMs,
}: Options) {
  const [flipped, setFlipped] = useState(false);
  const animatingRef = useRef(false);

  const timers = useRef<{
    endFlip: ReturnType<typeof setTimeout> | null;
    autoBack: ReturnType<typeof setTimeout> | null;
  }>({ endFlip: null, autoBack: null });

  const clearTimers = () => {
    if (timers.current.endFlip) clearTimeout(timers.current.endFlip);
    if (timers.current.autoBack) clearTimeout(timers.current.autoBack);
    timers.current.endFlip = null;
    timers.current.autoBack = null;
  };

  const hoveredRef = useRef(hovered);
  hoveredRef.current = hovered;

  const triggerFlip = () => {
    if (expanded) return;
    if (animatingRef.current) return;
    if (flipped) return;

    clearTimers();
    animatingRef.current = true;
    setFlipped(true);

    timers.current.endFlip = setTimeout(() => {
      animatingRef.current = false;
      timers.current.endFlip = null;

      // If mouse already left during animation, start auto-back now
      if (!hoveredRef.current) {
        timers.current.autoBack = setTimeout(() => {
          setFlipped(false);
          timers.current.autoBack = null;
        }, hoverBackDelayMs);
      }
    }, durationMs);
  };

  // When mouse leaves (hovered goes false) and card is flipped + done animating, flip back
  useEffect(() => {
    if (!hovered && flipped && !animatingRef.current) {
      // Clear any existing auto-back
      if (timers.current.autoBack) clearTimeout(timers.current.autoBack);

      timers.current.autoBack = setTimeout(() => {
        setFlipped(false);
        timers.current.autoBack = null;
      }, hoverBackDelayMs);
    }

    // If mouse comes back while auto-back is pending, cancel it
    if (hovered && timers.current.autoBack) {
      clearTimeout(timers.current.autoBack);
      timers.current.autoBack = null;
    }
  }, [hovered, flipped, hoverBackDelayMs]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (expanded) {
      clearTimers();
      animatingRef.current = false;
      setFlipped(false);
    }
  }, [expanded]);

  const lastPulse = useRef(pulse);
  useEffect(() => {
    if (pulse !== lastPulse.current) {
      lastPulse.current = pulse;
      triggerFlip();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse]);

  return { flipped, triggerFlip };
}
