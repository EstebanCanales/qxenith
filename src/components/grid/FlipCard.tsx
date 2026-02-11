"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useFlipTimer } from "./useFlipTimer";
import CardFace from "./CardFace";

export type FlipCardProps = {
  index: number;
  row: number;
  col: number;
  expanded: boolean;
  hovered: boolean;
  onExpandFromHere: () => void;
  rippleDelayMs: number;
  pulse: number;
  cornerRadius: string;
  front: React.ReactNode;
  back: React.ReactNode;
  frontBg?: string;
  backBg?: string;
  durationMs?: number;
  hoverBackDelayMs?: number;
};

export default function FlipCard({
  expanded,
  hovered,
  onExpandFromHere,
  rippleDelayMs,
  pulse,
  cornerRadius,
  front,
  back,
  frontBg = "bg-[#080F0F]",
  backBg = "bg-[#06D6A0]",
  durationMs = 500,
  hoverBackDelayMs = 150,
}: FlipCardProps) {
  const { flipped, triggerFlip } = useFlipTimer({
    expanded,
    hovered,
    pulse,
    durationMs,
    hoverBackDelayMs,
  });

  const isFlipped = expanded || flipped;
  const innerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prevState = useRef({ isFlipped: false, expanded: false });

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const prev = prevState.current;
    const stateChanged =
      prev.isFlipped !== isFlipped || prev.expanded !== expanded;

    // Skip initial render and unchanged state
    if (!stateChanged) return;
    prevState.current = { isFlipped, expanded };

    // Kill any running animation immediately
    tlRef.current?.kill();

    // If expand happened mid-flip, get current rotation and animate from there
    const currentRot = gsap.getProperty(el, "rotateX") as number;
    const toRot = isFlipped ? 180 : 0;

    // If already at target, just snap
    if (Math.abs(currentRot - toRot) < 1) {
      gsap.set(el, { rotateX: toRot, scale: 1, z: 0 });
      return;
    }

    const delay = expanded && !prev.expanded ? rippleDelayMs / 1000 : 0;
    const dur = durationMs / 1000;

    // Calculate remaining fraction based on how far we still need to rotate
    const totalRange = 180;
    const remaining = Math.abs(toRot - currentRot) / totalRange;
    const adjustedDur = dur * Math.max(remaining, 0.4);

    const tl = gsap.timeline({ delay });

    // If we're far from target, do the 2-phase lift+rotate
    if (remaining > 0.3) {
      const midRot = currentRot + (toRot - currentRot) * 0.5;
      tl.to(el, {
        rotateX: midRot,
        scale: 1.06,
        z: 30,
        duration: adjustedDur * 0.4,
        ease: "power2.in",
      });
      tl.to(el, {
        rotateX: toRot,
        scale: 1,
        z: 0,
        duration: adjustedDur * 0.6,
        ease: "back.out(2)",
      });
    } else {
      // Close to target, just settle
      tl.to(el, {
        rotateX: toRot,
        scale: 1,
        z: 0,
        duration: adjustedDur,
        ease: "back.out(1.5)",
      });
    }

    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
    };
  }, [isFlipped, expanded, rippleDelayMs, durationMs]);

  // Set initial state
  useEffect(() => {
    const el = innerRef.current;
    if (el) gsap.set(el, { rotateX: 0, scale: 1, z: 0 });
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (!expanded) onExpandFromHere();
      }}
      onMouseEnter={triggerFlip}
      className="relative w-full h-full [perspective:500px] outline-none"
    >
      <div className="absolute inset-0">
        <div
          ref={innerRef}
          className="relative w-full h-full [transform-style:preserve-3d] will-change-transform"
        >
          <CardFace bg={frontBg} cornerRadius={cornerRadius}>
            {front}
          </CardFace>
          <CardFace bg={backBg} cornerRadius={cornerRadius} isBack>
            {back}
          </CardFace>
        </div>
      </div>
    </button>
  );
}
