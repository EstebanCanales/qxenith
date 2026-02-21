"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { COLORS, SPEEDS, CIRCLE_SIZE } from "./color-bars/types";
import { useMarquee } from "./color-bars/useMarquee";
import { useBarThickness } from "./color-bars/useBarThickness";

/* ── Grid Motion items ── */
const WORK_ITEMS = [
  { type: "image", src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop" },
  { type: "text", label: "Web Dev", labelKr: "웹 개발" },
  { type: "image", src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop" },
  { type: "text", label: "UI/UX", labelKr: "디자인" },
  { type: "image", src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop" },
  { type: "text", label: "Mobile", labelKr: "모바일" },
  { type: "image", src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop" },
  { type: "text", label: "Brand", labelKr: "브랜드" },
  { type: "image", src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop" },
  { type: "text", label: "Strategy", labelKr: "전략" },
  { type: "image", src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop" },
  { type: "text", label: "Code", labelKr: "코드" },
  { type: "image", src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&auto=format&fit=crop" },
  { type: "text", label: "Systems", labelKr: "시스템" },
  { type: "image", src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop" },
  { type: "text", label: "Launch", labelKr: "출시" },
  { type: "image", src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop" },
  { type: "text", label: "Scale", labelKr: "확장" },
  { type: "image", src: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&auto=format&fit=crop" },
  { type: "text", label: "Deploy", labelKr: "배포" },
  { type: "image", src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1522542550221-31fd8043d41e?w=800&auto=format&fit=crop" },
  { type: "text", label: "Iterate", labelKr: "반복" },
  { type: "image", src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop" },
];

const GRID_ROWS = 4;
const GRID_COLS = 7;
const GRID_TOTAL = GRID_ROWS * GRID_COLS;
const ACCENT_COLORS = ["#06D6A0", "#EF476F", "#845EF7", "#FFD166", "#22B8CF"];

/* ── Threads ── */
interface Thread {
  id: number;
  colorIdx: number;
  d: string;
  enterDelay: number;
}

function generateThreads(w: number, h: number, t: number): Thread[] {
  const threads: Thread[] = [];
  const rc = 140;
  const gap = t * 1.2;
  const startX = w * 0.6;

  // 1 — Top → curve right → right edge
  {
    const x = startX;
    const bendY = h * 0.18;
    threads.push({
      id: 0, colorIdx: 0, enterDelay: 0,
      d: `M ${x} ${-20} L ${x} ${bendY - rc} A ${rc} ${rc} 0 0 1 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 2 — Right edge → curve down → bottom
  {
    const x = startX + gap;
    const y = h * 0.06;
    threads.push({
      id: 1, colorIdx: 1, enterDelay: 0.08,
      d: `M ${w + 20} ${y} L ${x + rc} ${y} A ${rc} ${rc} 0 0 1 ${x} ${y + rc} L ${x} ${h + 20}`,
    });
  }

  // 3 — Top → straight down → bottom
  {
    const x = startX + gap * 2;
    threads.push({
      id: 2, colorIdx: 2, enterDelay: 0.16,
      d: `M ${x} ${-20} L ${x} ${h + 20}`,
    });
  }

  // 4 — Top → Z down-left-down → bottom
  {
    const x1 = startX + gap * 5;
    const midY = h * 0.35;
    const x2 = startX + gap * 3;
    threads.push({
      id: 3, colorIdx: 3, enterDelay: 0.12,
      d: [
        `M ${x1} ${-20}`,
        `L ${x1} ${midY - rc}`,
        `A ${rc} ${rc} 0 0 0 ${x1 - rc} ${midY}`,
        `L ${x2 + rc} ${midY}`,
        `A ${rc} ${rc} 0 0 0 ${x2} ${midY + rc}`,
        `L ${x2} ${h + 20}`,
      ].join(" "),
    });
  }

  // 5 — Bottom → curve right → right edge
  {
    const x = startX + gap * 4;
    const bendY = h * 0.65;
    threads.push({
      id: 4, colorIdx: 4, enterDelay: 0.2,
      d: `M ${x} ${h + 20} L ${x} ${bendY + rc} A ${rc} ${rc} 0 0 0 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 6 — Top → curve right → right edge (mid)
  {
    const x = startX + gap * 0.5;
    const bendY = h * 0.5;
    threads.push({
      id: 5, colorIdx: 0, enterDelay: 0.24,
      d: `M ${x} ${-20} L ${x} ${bendY - rc} A ${rc} ${rc} 0 0 1 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 7 — Right edge → curve down → bottom
  {
    const y = h * 0.78;
    const x2 = startX + gap * 6;
    threads.push({
      id: 6, colorIdx: 1, enterDelay: 0.28,
      d: `M ${w + 20} ${y} L ${x2 + rc} ${y} A ${rc} ${rc} 0 0 1 ${x2} ${y + rc} L ${x2} ${h + 20}`,
    });
  }

  // 8 — Top → straight down → bottom
  {
    const x = startX + gap * 7;
    threads.push({
      id: 7, colorIdx: 2, enterDelay: 0.04,
      d: `M ${x} ${-20} L ${x} ${h + 20}`,
    });
  }

  // 9 — Top → curve right → right edge
  {
    const x = startX + gap * 8;
    const bendY = h * 0.55;
    threads.push({
      id: 8, colorIdx: 3, enterDelay: 0.32,
      d: `M ${x} ${-20} L ${x} ${bendY - rc} A ${rc} ${rc} 0 0 1 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 10 — Bottom → curve right → right edge
  {
    const x = startX + gap * 9;
    const bendY = h * 0.88;
    threads.push({
      id: 9, colorIdx: 4, enterDelay: 0.36,
      d: `M ${x} ${h + 20} L ${x} ${bendY + rc} A ${rc} ${rc} 0 0 0 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 11 — Top → curve right → right edge (high)
  {
    const x = startX + gap * 10;
    const bendY = h * 0.3;
    threads.push({
      id: 10, colorIdx: 0, enterDelay: 0.1,
      d: `M ${x} ${-20} L ${x} ${bendY - rc} A ${rc} ${rc} 0 0 1 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 12 — Right edge → curve down → bottom
  {
    const x = startX + gap * 11;
    const y = h * 0.42;
    threads.push({
      id: 11, colorIdx: 2, enterDelay: 0.18,
      d: `M ${w + 20} ${y} L ${x + rc} ${y} A ${rc} ${rc} 0 0 1 ${x} ${y + rc} L ${x} ${h + 20}`,
    });
  }

  // 13 — Top → straight down → bottom
  {
    const x = startX + gap * 12;
    threads.push({
      id: 12, colorIdx: 4, enterDelay: 0.06,
      d: `M ${x} ${-20} L ${x} ${h + 20}`,
    });
  }

  // 14 — Bottom → curve right → right edge
  {
    const x = startX + gap * 13;
    const bendY = h * 0.92;
    threads.push({
      id: 13, colorIdx: 1, enterDelay: 0.4,
      d: `M ${x} ${h + 20} L ${x} ${bendY + rc} A ${rc} ${rc} 0 0 0 ${x + rc} ${bendY} L ${w + 20} ${bendY}`,
    });
  }

  // 15 — Top → Z right → bottom
  {
    const x1 = startX + gap * 14;
    const midY = h * 0.7;
    const x2 = startX + gap * 16;
    threads.push({
      id: 14, colorIdx: 3, enterDelay: 0.22,
      d: [
        `M ${x1} ${-20}`,
        `L ${x1} ${midY - rc}`,
        `A ${rc} ${rc} 0 0 1 ${x1 + rc} ${midY}`,
        `L ${x2 - rc} ${midY}`,
        `A ${rc} ${rc} 0 0 1 ${x2} ${midY + rc}`,
        `L ${x2} ${h + 20}`,
      ].join(" "),
    });
  }

  return threads;
}

/* ── Badge on path ── */
function edgeOpacity(t: number): number {
  const fade = 0.05;
  if (t < fade) return t / fade;
  if (t > 1 - fade) return (1 - t) / fade;
  return 1;
}

function BadgeOnPath({
  d, t, label, contrast, size,
}: {
  d: string; t: number; label: string; contrast: string; size: number;
}) {
  const half = size / 2;
  return (
    <foreignObject
      width={size}
      height={size}
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
          width: size, height: size,
          backgroundColor: contrast, borderRadius: 4,
          filter: "brightness(0.85)",
        }}
      >
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size * 0.4, color: "rgba(255,255,255,0.6)" }}
        >
          {label}
        </span>
      </div>
    </foreignObject>
  );
}

/* ── Animated thread ── */
function AnimatedThread({
  thread, thickness, offset, visible,
}: {
  thread: Thread; thickness: number; offset: number; visible: boolean;
}) {
  const c = COLORS[thread.colorIdx];
  const speed = SPEEDS[thread.colorIdx];
  const raw = (offset * speed) % 1;
  const positions = [0, 0.33, 0.66].map((g) => (raw + g) % 1);

  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.8s ease ${thread.enterDelay}s`,
      }}
    >
      <path d={thread.d} fill="none" stroke={c.contrast} strokeWidth={thickness + 1.5} opacity={0.5} strokeLinecap="butt" strokeLinejoin="round" />
      <path d={thread.d} fill="none" stroke={c.color} strokeWidth={thickness} opacity={0.9} strokeLinecap="butt" strokeLinejoin="round" />
      <path d={thread.d} fill="none" stroke={c.contrast} strokeWidth={1} opacity={0.3} strokeDasharray="4 6" strokeLinecap="butt" />
      {positions.map((p, j) => (
        <BadgeOnPath
          key={j}
          d={thread.d}
          t={p}
          label={String(thread.id * 3 + j + 1).padStart(2, "0")}
          contrast={c.contrast}
          size={CIRCLE_SIZE}
        />
      ))}
    </g>
  );
}

/* ── Main section ── */
export default function ThreadsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const thickness = useBarThickness();
  const offset = useMarquee();

  // Generate threads
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setThreads(generateThreads(el.clientWidth, el.clientHeight, thickness));
  }, [thickness]);

  // Auto marquee animation
  useEffect(() => {
    const speeds = [60, -45, 55, -35]; // px per second, alternating direction

    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      const speed = speeds[i % speeds.length];
      const distance = Math.abs(speed) * 20; // total travel distance

      gsap.fromTo(
        row,
        { x: speed > 0 ? -distance / 2 : distance / 2 },
        {
          x: speed > 0 ? distance / 2 : -distance / 2,
          duration: distance / Math.abs(speed),
          ease: "none",
          repeat: -1,
          yoyo: true,
        },
      );
    });

    return () => {
      rowRefs.current.forEach((row) => {
        if (row) gsap.killTweensOf(row);
      });
    };
  }, []);

  // Intersection observer for entrance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="flow"
      className="min-h-screen flex flex-col justify-center px-1.5 py-1.5"
      style={{ backgroundColor: "#030301" }}
    >
      <div
        ref={containerRef}
        className="w-full h-screen rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative flex flex-col"
        style={{
          backgroundColor: "#080F0F",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Grid Motion — left side only, hidden on mobile */}
        <div
          className="absolute inset-y-0 left-0 hidden sm:flex items-center justify-center overflow-hidden z-[1]"
          style={{
            width: "75%",
            maskImage: "radial-gradient(ellipse at 30% 50%, black 15%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, black 15%, transparent 65%)",
          }}
        >
          <div
            className="relative grid grid-rows-4 grid-cols-1 gap-4"
            style={{
              width: "150vw",
              height: "150vh",
              transform: "rotate(-15deg)",
              transformOrigin: "center center",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 0.2s",
            }}
          >
            {Array.from({ length: GRID_ROWS }, (_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                  willChange: "transform",
                }}
                ref={(el) => {
                  if (el) rowRefs.current[rowIdx] = el;
                }}
              >
                {Array.from({ length: GRID_COLS }, (_, colIdx) => {
                  const item = WORK_ITEMS[(rowIdx * GRID_COLS + colIdx) % GRID_TOTAL];
                  const accentColor =
                    ACCENT_COLORS[(rowIdx * GRID_COLS + colIdx) % ACCENT_COLORS.length];

                  return (
                    <div key={colIdx} className="relative aspect-[4/3]">
                      <div
                        className="w-full h-full overflow-hidden rounded-[10px] flex items-center justify-center"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {item.type === "image" ? (
                          <div
                            className="w-full h-full bg-cover bg-center absolute inset-0"
                            style={{
                              backgroundImage: `url(${item.src})`,
                              opacity: 0.7,
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 z-[1]">
                            <span
                              className="font-extrabold text-lg sm:text-xl lg:text-2xl"
                              style={{ color: accentColor }}
                            >
                              {item.label}
                            </span>
                            <span
                              className="text-white/30 text-xs sm:text-sm"
                              style={{
                                fontFamily: "var(--font-nanum-brush-script)",
                              }}
                            >
                              {item.labelKr}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Threads — on top of grid */}
        <svg className="absolute inset-0 w-full h-full z-[4]" fill="none">
          {threads.map((t) => (
            <AnimatedThread key={t.id} thread={t} thickness={thickness} offset={offset} visible={visible} />
          ))}
        </svg>

        {/* Content — left side */}
        <div className="relative z-10 flex flex-col justify-end h-full" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 64px)" }}>
          <div
            style={{
              maxWidth: "min(90%, 500px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            <span className="text-white/30 font-mono text-xs sm:text-sm tracking-widest uppercase mb-3 block">
              The flow
            </span>
            <h2
              className="font-extrabold tracking-tight text-white"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
            >
              Everything<br />connects
            </h2>
            <span
              className="text-white/40 block mt-2"
              style={{
                fontSize: "clamp(14px, 2.5vw, 28px)",
                fontFamily: "var(--font-nanum-brush-script)",
              }}
            >
              모든 것이 연결됩니다
            </span>
            <p className="text-white/30 text-sm sm:text-base mt-6 leading-relaxed">
              Ideas flow like threads through every layer of our work — weaving
              technology, design, and purpose into one seamless experience.
            </p>
            <p
              className="text-white/20 text-sm sm:text-base mt-2"
              style={{ fontFamily: "var(--font-nanum-brush-script)" }}
            >
              아이디어는 우리 작업의 모든 층을 관통하며 흐릅니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
