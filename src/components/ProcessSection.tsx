"use client";

import { LShapeBars } from "./color-bars";
import { COLORS } from "./color-bars/types";

const STEPS = [
  {
    num: "01",
    title: "Discovery",
    titleKr: "발견",
    desc: "We dive deep into your vision, audience, and goals.",
    colorIdx: 0,
  },
  {
    num: "02",
    title: "Strategy",
    titleKr: "전략",
    desc: "Architecture, wireframes, and a clear roadmap.",
    colorIdx: 1,
  },
  {
    num: "03",
    title: "Execution",
    titleKr: "실행",
    desc: "Design and development in tight sprints.",
    colorIdx: 2,
  },
  {
    num: "04",
    title: "Launch",
    titleKr: "출시",
    desc: "Performance-tuned deployment and support.",
    colorIdx: 3,
  },
];

function StepCircle({ num, colorIdx }: { num: string; colorIdx: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: 44,
        height: 44,
        border: `2px solid ${COLORS[colorIdx].color}`,
        backgroundColor: "rgba(8,15,15,0.95)",
        boxShadow: `0 0 16px ${COLORS[colorIdx].color}33`,
      }}
    >
      <span
        className="font-mono font-extrabold text-xs"
        style={{ color: COLORS[colorIdx].color }}
      >
        {num}
      </span>
    </div>
  );
}

export default function ProcessSection({ connected }: { connected?: boolean }) {
  const inner = (
    <div
      id="process"
      className={`w-full min-h-[70vh] sm:h-screen overflow-hidden relative flex flex-col ${connected ? "" : "rounded-xl sm:rounded-2xl lg:rounded-3xl"}`}
      style={{
        backgroundColor: "#080F0F",
        border: connected ? "none" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: connected ? "none" : "inset 0 0 80px rgba(0,0,0,0.6)",
      }}
    >
        <div className="absolute top-0 left-0 w-full hidden sm:block" style={{ height: 250 }}>
          <LShapeBars
            corner="bottom-left"
            scale={1}
            vLen={250}
            hLen={1400}
            baseR={80}
            reverseColors={false}
          />
        </div>
        <div className="absolute top-0 left-0 w-full sm:hidden" style={{ height: 150 }}>
          <LShapeBars
            corner="bottom-left"
            scale={0.7}
            vLen={150}
            hLen={500}
            baseR={50}
            reverseColors={false}
          />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Corner accent */}
        <div
          className="absolute bottom-3 left-3 w-8 h-8 sm:bottom-4 sm:left-4 sm:w-10 sm:h-10 lg:bottom-6 lg:left-6 lg:w-16 lg:h-16"
          style={{
            borderLeft: "1px solid rgba(34,184,207,0.2)",
            borderBottom: "1px solid rgba(34,184,207,0.2)",
            borderRadius: "0 0 0 8px",
          }}
        />

        {/* Content — positioned bottom-left, opposite to bars */}
        <div className="relative z-10 flex flex-col justify-end h-full" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 64px)" }}>
          {/* Header */}
          <div className="shrink-0" style={{ marginBottom: "clamp(16px, 2vw, 32px)" }}>
            <span className="text-white/30 font-mono text-xs sm:text-sm tracking-widest uppercase">
              How we work
            </span>
            <h2
              className="font-extrabold tracking-tight text-white mt-2"
              style={{ fontSize: "clamp(28px, 5vw, 64px)" }}
            >
              Our Process
            </h2>
            <span
              className="text-white/40 block mt-1"
              style={{
                fontSize: "clamp(14px, 2.5vw, 28px)",
                fontFamily: "var(--font-nanum-brush-script)",
              }}
            >
              우리의 프로세스
            </span>
          </div>

          {/* Steps grid — bottom-left area */}
          <div className="grid grid-cols-2 sm:grid-cols-4 max-w-3xl" style={{ gap: "clamp(8px, 1.5vw, 24px)" }}>
            {STEPS.map((s) => (
              <div key={s.num} className="flex items-start gap-3">
                <StepCircle num={s.num} colorIdx={s.colorIdx} />
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">
                    {s.title}
                  </h3>
                  <span
                    className="text-white/25 text-xs sm:text-sm"
                    style={{ fontFamily: "var(--font-nanum-brush-script)" }}
                  >
                    {s.titleKr}
                  </span>
                  <p className="text-white/35 text-xs sm:text-sm mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );

  if (connected) return inner;

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-1.5 py-1.5"
      style={{ backgroundColor: "#030301" }}
    >
      {inner}
    </section>
  );
}
