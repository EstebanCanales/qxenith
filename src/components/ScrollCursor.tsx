"use client";

import React, { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";

const DIAMETER = 105;
const R = DIAMETER / 2 - 10;
const CENTER = DIAMETER / 2;
const LERP = 0.12;
const SCROLL_THRESHOLD = 80;

type Props = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
};

export default function ScrollCursor({ scrollContainerRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rawPos = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Check for fine pointer
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      setMounted(true);
    }
  }, []);

  // Cursor tracking + smooth follow + rotation — all in one effect
  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    const svg = svgRef.current;
    if (!el || !svg) return;

    const onMove = (e: MouseEvent) => {
      rawPos.current.x = e.clientX;
      rawPos.current.y = e.clientY;
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        smoothPos.current.x = e.clientX;
        smoothPos.current.y = e.clientY;
        el.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", onMove);

    // Smooth position update
    const tick = () => {
      if (!hasMovedRef.current) return;
      smoothPos.current.x += (rawPos.current.x - smoothPos.current.x) * LERP;
      smoothPos.current.y += (rawPos.current.y - smoothPos.current.y) * LERP;
      el.style.left = `${smoothPos.current.x - CENTER}px`;
      el.style.top = `${smoothPos.current.y - CENTER}px`;
    };
    gsap.ticker.add(tick);

    // Rotation
    const tween = gsap.to(svg, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    // Scroll fade
    const scrollEl = scrollContainerRef.current;
    const checkScroll = () => {
      const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
      const show = scrollTop < SCROLL_THRESHOLD;
      gsap.to(el, {
        opacity: show && hasMovedRef.current ? 1 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(tick);
      tween.kill();
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkScroll);
      }
    };
  }, [mounted, scrollContainerRef]);

  if (!mounted) return null;

  // Arc path: full circle centered at (CENTER, CENTER) with radius R
  const arc = `M ${CENTER},${CENTER - R} A ${R},${R} 0 1 1 ${CENTER - 0.001},${CENTER - R}`;

  return (
    <div
      ref={containerRef}
      className="fixed z-[50] pointer-events-none"
      style={{
        width: DIAMETER,
        height: DIAMETER,
        opacity: 0,
      }}
    >
      <svg
        ref={svgRef}
        width={DIAMETER}
        height={DIAMETER}
        viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}
      >
        <defs>
          <path id="scroll-circle" d={arc} fill="none" />
        </defs>
        <text
          fill="rgba(255,255,255,0.45)"
          fontSize="8.5"
          letterSpacing="4.5"
          fontWeight="600"
          textAnchor="start"
        >
          <textPath href="#scroll-circle">
            SCROLL DOWN &#x2022; SCROLL DOWN &#x2022;
          </textPath>
        </text>
      </svg>
    </div>
  );
}
