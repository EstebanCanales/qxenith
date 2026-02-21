"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const DIAMETER = 95;
const R = DIAMETER / 2 - 12;
const CENTER = DIAMETER / 2;
const CORNER_R = 20;
const PADDING = 24;
const EXPANDED_H = 480;
const BORDER_INSET = 14;
const MARCH_BLOCK = 18; // % of perimeter one BORDER_TEXT block covers

const BORDER_TEXT =
  "QXENITH \u2022 MENU \u2022 QXENITH \u2022 MENU \u2022 QXENITH \u2022 MENU \u2022 QXENITH \u2022 MENU \u2022 ";

const MENU_ITEMS = [
  { label: "Home", labelKr: "홈", href: "#", colorIdx: 0 },
  { label: "Services", labelKr: "서비스", href: "#services", colorIdx: 1 },
  { label: "About", labelKr: "소개", href: "#about", colorIdx: 2 },
  { label: "Projects", labelKr: "프로젝트", href: "#projects", colorIdx: 3 },
  { label: "Process", labelKr: "프로세스", href: "#process", colorIdx: 4 },
  { label: "Flow", labelKr: "흐름", href: "#flow", colorIdx: 0 },
  { label: "Contact", labelKr: "연락", href: "#contact", colorIdx: 1 },
];

const ACCENT_COLORS = ["#06D6A0", "#EF476F", "#845EF7", "#FFD166", "#22B8CF"];

function buildRectPath(w: number, h: number, r: number): string {
  return [
    `M ${r},0`,
    `L ${w - r},0`,
    `A ${r},${r} 0 0 1 ${w},${r}`,
    `L ${w},${h - r}`,
    `A ${r},${r} 0 0 1 ${w - r},${h}`,
    `L ${r},${h}`,
    `A ${r},${r} 0 0 1 0,${h - r}`,
    `L 0,${r}`,
    `A ${r},${r} 0 0 1 ${r},0`,
    "Z",
  ].join(" ");
}

export default function CircleMenu() {
  const [open, setOpen] = useState(false);
  const [expandedW, setExpandedW] = useState(0);

  const morphRef = useRef<HTMLDivElement>(null);
  const borderWrapRef = useRef<HTMLDivElement>(null);
  const svgCircleRef = useRef<SVGSVGElement>(null);
  const svgRectRef = useRef<SVGSVGElement>(null);
  const strokeRef = useRef<SVGUseElement>(null);
  const textGroupRef = useRef<SVGTextElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const borderTextRef = useRef<SVGTextPathElement>(null);
  const marchOffsetRef = useRef({ value: 0 });
  const marchTweenRef = useRef<gsap.core.Tween | null>(null);
  const rectPathRef = useRef<SVGPathElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const hasOpened = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Measure expanded width
  useEffect(() => {
    const measure = () => {
      const pad = window.innerWidth < 640 ? 12 : PADDING;
      setExpandedW(window.innerWidth - pad * 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Circle rotating text
  useEffect(() => {
    const svg = svgCircleRef.current;
    if (!svg) return;
    const tween = gsap.to(svg, {
      rotation: 360,
      duration: 8,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Update rect SVG path when expandedW changes
  useEffect(() => {
    if (!expandedW) return;
    const d = buildRectPath(
      expandedW - BORDER_INSET * 2,
      EXPANDED_H - BORDER_INSET * 2,
      CORNER_R - BORDER_INSET / 2,
    );
    rectPathRef.current?.setAttribute("d", d);
  }, [expandedW]);

  // Start the continuous marching loop
  const startMarchLoop = useCallback(() => {
    marchTweenRef.current?.kill();
    const tp = borderTextRef.current;
    if (!tp) return;
    const obj = marchOffsetRef.current;
    marchTweenRef.current = gsap.to(obj, {
      value: obj.value - MARCH_BLOCK,
      duration: 50,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        tp.setAttribute("startOffset", `${obj.value}%`);
      },
    });
  }, []);

  // Morph animation
  useEffect(() => {
    const el = morphRef.current;
    const borderWrap = borderWrapRef.current;
    const circSvg = svgCircleRef.current;
    const rectSvg = svgRectRef.current;
    const stroke = strokeRef.current;
    const textGroup = textGroupRef.current;
    const content = contentRef.current;
    const tp = borderTextRef.current;
    if (
      !el ||
      !borderWrap ||
      !circSvg ||
      !rectSvg ||
      !stroke ||
      !textGroup ||
      !content ||
      !tp ||
      !expandedW
    )
      return;

    if (!open && !hasOpened.current) return;

    tlRef.current?.kill();
    marchTweenRef.current?.kill();

    if (open) {
      hasOpened.current = true;
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Get path length for stroke-dasharray draw-in
      const pathEl = rectPathRef.current;
      const pathLen = pathEl ? pathEl.getTotalLength() : 3600;

      // Fade out circle SVG
      tl.to(circSvg, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);

      // Expand morph container + add glow
      tl.to(
        el,
        {
          width: expandedW,
          height: EXPANDED_H,
          borderRadius: CORNER_R,
          boxShadow: "0 0 60px rgba(6,214,160,0.08)",
          duration: 0.55,
          ease: "power3.out",
        },
        0,
      );

      // Expand border wrapper
      tl.to(
        borderWrap,
        {
          width: expandedW,
          height: EXPANDED_H,
          borderRadius: CORNER_R,
          duration: 0.55,
          ease: "power3.out",
        },
        0,
      );

      // Show SVG container (instant, content hidden individually)
      tl.set(rectSvg, { opacity: 1 }, 0.15);

      // --- Procedural stroke draw-in ---
      gsap.set(stroke, {
        attr: {
          "stroke-dasharray": pathLen,
          "stroke-dashoffset": pathLen,
        },
      });
      tl.to(
        stroke,
        {
          attr: { "stroke-dashoffset": 0 },
          duration: 0.7,
          ease: "power2.out",
        },
        0.2,
      );

      // --- Procedural text flow-in ---
      // Start text off-screen (100% = past end of path), flow to 0%
      marchOffsetRef.current.value = 100;
      tp.setAttribute("startOffset", "100%");
      gsap.set(textGroup, { opacity: 1 });

      tl.to(marchOffsetRef.current, {
        value: 0,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          tp.setAttribute(
            "startOffset",
            `${marchOffsetRef.current.value}%`,
          );
        },
        onComplete: () => {
          // Seamlessly hand off to continuous march loop
          marchOffsetRef.current.value = 0;
          startMarchLoop();
        },
      }, 0.3);

      // Stagger menu cards
      tl.add(() => {
        itemsRef.current.forEach((item, i) => {
          if (!item) return;
          gsap.fromTo(
            item,
            { opacity: 0, y: 20, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.35,
              delay: 0.04 * i,
              ease: "power3.out",
            },
          );
        });
      }, 0.35);

      // Show content
      tl.fromTo(
        content,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0.4,
      );
    } else {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Hide content
      tl.to(content, { opacity: 0, duration: 0.15, ease: "power2.in" }, 0);

      // --- Procedural text flow-out ---
      tl.to(marchOffsetRef.current, {
        value: 100,
        duration: 0.4,
        ease: "power2.in",
        onUpdate: () => {
          tp.setAttribute(
            "startOffset",
            `${marchOffsetRef.current.value}%`,
          );
        },
      }, 0);

      // --- Stroke retract ---
      const pathEl = rectPathRef.current;
      const pathLen = pathEl ? pathEl.getTotalLength() : 3600;
      tl.to(
        stroke,
        {
          attr: { "stroke-dashoffset": pathLen },
          duration: 0.35,
          ease: "power2.in",
        },
        0.1,
      );

      // Hide SVG
      tl.set(rectSvg, { opacity: 0 }, 0.4);

      // Shrink morph + border wrapper, remove glow
      tl.to(
        el,
        {
          width: DIAMETER,
          height: DIAMETER,
          borderRadius: DIAMETER / 2,
          boxShadow: "0 0 0px rgba(6,214,160,0)",
          duration: 0.45,
          ease: "power3.inOut",
        },
        0.15,
      );
      tl.to(
        borderWrap,
        {
          width: DIAMETER,
          height: DIAMETER,
          borderRadius: DIAMETER / 2,
          duration: 0.45,
          ease: "power3.inOut",
        },
        0.15,
      );

      // Bring back circle SVG
      tl.to(
        circSvg,
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        0.4,
      );

      // Reset items
      tl.add(() => {
        itemsRef.current.forEach((item) => {
          if (item) gsap.set(item, { opacity: 0, y: 0, scale: 1 });
        });
      });
    }
  }, [open, expandedW, startMarchLoop]);

  const handleToggle = useCallback(() => setOpen((v) => !v), []);
  const handleNavigate = useCallback((href: string) => {
    setOpen(false);
    if (href === "#") {
      // Scroll the inner container to top
      const scrollContainer = document.querySelector("[data-scroll-container]");
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    // Find the target section and scroll to it within the scroll container
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  }, []);

  const arc = `M ${CENTER},${CENTER - R} A ${R},${R} 0 1 1 ${CENTER - 0.001},${CENTER - R}`;
  const rectPath = buildRectPath(
    (expandedW || 600) - BORDER_INSET * 2,
    EXPANDED_H - BORDER_INSET * 2,
    CORNER_R - BORDER_INSET / 2,
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] flex items-start justify-end px-3 py-3 sm:px-6 sm:py-4"
      style={{ pointerEvents: "none" }}
    >
      <div className="relative" style={{ width: DIAMETER, height: DIAMETER }}>
        {/* Morphing background */}
        <div
          ref={morphRef}
          className="absolute top-0 right-0 overflow-hidden"
          style={{
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            backgroundColor: "#080F0F",
            border: "1px solid rgba(255,255,255,0.1)",
            pointerEvents: "auto",
            zIndex: 1,
          }}
        >
          {/* Circle rotating text */}
          <svg
            ref={svgCircleRef}
            className="absolute"
            style={{ zIndex: 1, top: 0, right: 0 }}
            width={DIAMETER}
            height={DIAMETER}
            viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}
          >
            <defs>
              <path id="menu-circle-path" d={arc} fill="none" />
            </defs>
            <text
              fill="rgba(255,255,255,0.7)"
              fontSize="10"
              letterSpacing="5"
              fontWeight="700"
              textAnchor="start"
            >
              <textPath href="#menu-circle-path">
                MENU &#x2022; MENU &#x2022; MENU &#x2022;
              </textPath>
            </text>
          </svg>

          {/* Hamburger / X */}
          <button
            onClick={handleToggle}
            className="absolute flex items-center justify-center outline-none cursor-pointer"
            style={{
              top: 0,
              right: 0,
              width: DIAMETER,
              height: DIAMETER,
              zIndex: 10,
            }}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center justify-center gap-[5px] w-7 h-7">
              <span
                className="block w-6 h-[2px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: open ? "#06D6A0" : "#ffffff",
                  transform: open ? "translateY(7px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-6 h-[2px] transition-all duration-300"
                style={{
                  backgroundColor: open ? "#06D6A0" : "#ffffff",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-[2px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: open ? "#06D6A0" : "#ffffff",
                  transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>

          {/* Menu content */}
          <div
            ref={contentRef}
            className="absolute flex flex-col"
            style={{
              zIndex: 5,
              opacity: 0,
              top: BORDER_INSET + 16,
              left: BORDER_INSET + 16,
              right: BORDER_INSET + 16,
              bottom: BORDER_INSET + 16,
              padding: "clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px)",
              backgroundColor: "#080F0F",
              borderRadius: CORNER_R - 6,
            }}
          >
            {/* Top row: Logo left */}
            <div
              ref={(el) => { itemsRef.current[0] = el as HTMLAnchorElement | null; }}
              className="flex flex-col shrink-0 mb-6 sm:mb-8"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/logos/logo-green.svg"
                  alt="QXENITH"
                  className="shrink-0"
                  style={{ width: "clamp(28px, 4vw, 44px)", height: "auto" }}
                />
                <span
                  className="font-extrabold tracking-tight text-white"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
                >
                  QXENITH
                </span>
              </div>
              <span
                className="text-white/25 mt-1"
                style={{
                  fontSize: "clamp(12px, 1.5vw, 16px)",
                  fontFamily: "var(--font-nanum-brush-script)",
                }}
              >
                우리는 존재할 가치가 있는 아이디어를 만들어냅니다.
              </span>
            </div>

            {/* Section links — big, shifted left */}
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-10 lg:gap-x-14 gap-y-3 sm:gap-y-5 flex-1 pr-8 sm:pr-24">
              {MENU_ITEMS.map((item, i) => (
                <a
                  key={item.label}
                  ref={(el) => {
                    itemsRef.current[i + 1] = el;
                  }}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item.href);
                  }}
                  className="group flex items-start gap-3 text-white transition-colors duration-200 hover:text-[#06D6A0]"
                  style={{ opacity: 0 }}
                >
                  <span
                    className="font-mono text-xs sm:text-sm font-bold mt-1.5"
                    style={{ color: ACCENT_COLORS[item.colorIdx] }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-base sm:text-2xl lg:text-3xl tracking-tight">
                      {item.label}
                    </span>
                    <span
                      className="text-white/20 text-xs sm:text-base"
                      style={{ fontFamily: "var(--font-nanum-brush-script)" }}
                    >
                      {item.labelKr}
                    </span>
                  </div>
                </a>
              ))}
            </nav>

          </div>
        </div>

        {/* Border SVG overlay */}
        <div
          ref={borderWrapRef}
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            zIndex: 2,
          }}
        >
          <svg
            ref={svgRectRef}
            className="absolute"
            style={{
              top: BORDER_INSET,
              left: BORDER_INSET,
              opacity: 0,
              overflow: "visible",
            }}
            width={(expandedW || 600) - BORDER_INSET * 2}
            height={EXPANDED_H - BORDER_INSET * 2}
            viewBox={`0 0 ${(expandedW || 600) - BORDER_INSET * 2} ${EXPANDED_H - BORDER_INSET * 2}`}
          >
            <defs>
              <path
                ref={rectPathRef}
                id="panel-border-path"
                d={rectPath}
                fill="none"
              />
            </defs>

            {/* Animated stroke border */}
            <use
              ref={strokeRef}
              href="#panel-border-path"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              strokeDasharray="0"
              strokeDashoffset="0"
            />

            {/* Marching text */}
            <text
              ref={textGroupRef}
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              letterSpacing="4"
              fontWeight="700"
              opacity="0"
            >
              <textPath
                ref={borderTextRef}
                href="#panel-border-path"
                startOffset="100%"
              >
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
                {BORDER_TEXT}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </header>
  );
}
