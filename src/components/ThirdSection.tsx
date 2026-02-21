"use client";

import { ZShapeBars } from "./color-bars";
import { COLORS } from "./color-bars/types";

const STATS = [
  { value: "50+", label: "Projects", labelKr: "프로젝트", colorIdx: 0 },
  { value: "30+", label: "Clients", labelKr: "고객사", colorIdx: 1 },
  { value: "5", label: "Years", labelKr: "경력", colorIdx: 2 },
  { value: "99%", label: "Satisfaction", labelKr: "만족도", colorIdx: 3 },
];

export default function ThirdSection({ connected }: { connected?: boolean }) {
  const inner = (
    <div
      id="about"
      className={`w-full min-h-[70vh] sm:h-screen overflow-hidden relative flex flex-col ${connected ? "" : "rounded-xl sm:rounded-2xl lg:rounded-3xl"}`}
      style={{
        backgroundColor: "#080F0F",
        border: connected ? "none" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: connected ? "none" : "inset 0 0 80px rgba(0,0,0,0.6)",
      }}
    >
        <div className="hidden sm:block">
          <ZShapeBars
            scale={1}
            vLen1={50}
            vLen2={450}
            hGap={1110}
            baseR={59}
            reverseColors={false}
          />
        </div>
        <div className="sm:hidden">
          <ZShapeBars
            scale={0.7}
            vLen1={30}
            vLen2={300}
            hGap={400}
            baseR={40}
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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start sm:items-end justify-end h-full" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 64px)" }}>
          {/* Title above */}
          <div className="text-left sm:text-right" style={{ marginBottom: "clamp(16px, 2.5vw, 40px)" }}>
            <span className="text-white/30 font-mono text-xs sm:text-sm tracking-widest uppercase">
              Our track record
            </span>
            <h2
              className="font-extrabold tracking-tight text-white mt-2"
              style={{ fontSize: "clamp(28px, 5vw, 64px)" }}
            >
              By the numbers
            </h2>
            <span
              className="text-white/40 block mt-1"
              style={{
                fontSize: "clamp(14px, 2.5vw, 28px)",
                fontFamily: "var(--font-nanum-brush-script)",
              }}
            >
              숫자로 보는 우리
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 max-w-3xl" style={{ gap: "clamp(12px, 2vw, 40px)" }}>
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-start sm:items-end text-left sm:text-right">
                <span
                  className="font-extrabold tracking-tight"
                  style={{
                    fontSize: "clamp(32px, 5vw, 64px)",
                    color: COLORS[s.colorIdx].color,
                  }}
                >
                  {s.value}
                </span>
                <span className="text-white/60 font-bold text-sm sm:text-base mt-1">
                  {s.label}
                </span>
                <span
                  className="text-white/25 text-xs sm:text-sm"
                  style={{ fontFamily: "var(--font-nanum-brush-script)" }}
                >
                  {s.labelKr}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/40 text-sm sm:text-base leading-relaxed mt-6 sm:mt-8 max-w-lg text-left sm:text-right">
            We craft digital experiences that merge cutting-edge technology
            with purposeful design. Every pixel, every interaction, every line
            of code is intentional.
          </p>
          <p
            className="text-white/25 text-sm sm:text-base mt-2 max-w-lg text-left sm:text-right"
            style={{ fontFamily: "var(--font-nanum-brush-script)" }}
          >
            최첨단 기술과 의도적인 디자인이 만나는 디지털 경험을 만듭니다.
          </p>
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
