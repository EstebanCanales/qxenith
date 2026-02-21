"use client";

import { CascadeVerticalBars } from "./color-bars";
import { COLORS } from "./color-bars/types";

const SERVICES = [
  {
    num: "01",
    title: "Web Development",
    titleKr: "웹 개발",
    desc: "High-performance web applications built with modern frameworks and scalable architecture.",
    colorIdx: 0,
  },
  {
    num: "02",
    title: "UI/UX Design",
    titleKr: "UI/UX 디자인",
    desc: "Human-centered interfaces that balance aesthetics with intuitive functionality.",
    colorIdx: 1,
  },
  {
    num: "03",
    title: "Brand Identity",
    titleKr: "브랜드 아이덴티티",
    desc: "Visual systems that communicate your brand's core values across every touchpoint.",
    colorIdx: 2,
  },
  {
    num: "04",
    title: "Mobile Apps",
    titleKr: "모바일 앱",
    desc: "Native and cross-platform mobile experiences optimized for engagement and retention.",
    colorIdx: 3,
  },
];

export default function ServicesSection({ connected }: { connected?: boolean }) {
  const inner = (
    <div
      id="services"
      className={`w-full min-h-[70vh] sm:h-screen overflow-hidden relative flex flex-col ${connected ? "" : "rounded-xl sm:rounded-2xl lg:rounded-3xl"}`}
      style={{
        backgroundColor: "#080F0F",
        border: connected ? "none" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: connected ? "none" : "inset 0 0 80px rgba(0,0,0,0.6)",
      }}
    >
        <CascadeVerticalBars scale={1} />

        {/* Intense top shadow — delimits the cut from above */}
        {connected && (
          <div
            className="absolute top-0 left-0 right-0 z-[4] pointer-events-none"
            style={{
              height: "clamp(80px, 15vh, 200px)",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
            }}
          />
        )}

        {/* Corner accents */}
        <div
          className="absolute top-3 left-3 w-8 h-8 sm:top-4 sm:left-4 sm:w-10 sm:h-10 lg:top-6 lg:left-6 lg:w-16 lg:h-16"
          style={{
            borderLeft: "1px solid rgba(6,214,160,0.2)",
            borderTop: "1px solid rgba(6,214,160,0.2)",
            borderRadius: "8px 0 0 0",
          }}
        />
        <div
          className="absolute bottom-3 right-3 w-8 h-8 sm:bottom-4 sm:right-4 sm:w-10 sm:h-10 lg:bottom-6 lg:right-6 lg:w-16 lg:h-16"
          style={{
            borderRight: "1px solid rgba(6,214,160,0.2)",
            borderBottom: "1px solid rgba(6,214,160,0.2)",
            borderRadius: "0 0 8px 0",
          }}
        />

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
        <div className="relative z-10 flex flex-col h-full" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 64px)" }}>
          {/* Section header */}
          <div style={{ marginBottom: "clamp(16px, 3vw, 64px)" }}>
            <span className="text-white/30 font-mono text-[10px] sm:text-xs lg:text-sm tracking-widest uppercase">
              What we do
            </span>
            <h2
              className="font-extrabold tracking-tight text-white mt-1 sm:mt-2"
              style={{ fontSize: "clamp(24px, 5vw, 64px)" }}
            >
              Services
            </h2>
            <span
              className="text-white/40 block mt-0.5 sm:mt-1"
              style={{
                fontSize: "clamp(12px, 2.5vw, 28px)",
                fontFamily: "var(--font-nanum-brush-script)",
              }}
            >
              우리가 하는 일
            </span>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-2 flex-1 max-w-4xl" style={{ gap: "clamp(6px, 1vw, 20px)" }}>
            {SERVICES.map((s) => (
              <div
                key={s.num}
                className="group relative rounded-lg sm:rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]"
                style={{
                  padding: "clamp(10px, 2vw, 32px)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 w-full h-[2px] transition-all duration-300 group-hover:h-[3px]"
                  style={{
                    backgroundColor: COLORS[s.colorIdx].color,
                    opacity: 0.6,
                  }}
                />

                <div>
                  <span
                    className="font-mono text-[10px] sm:text-xs lg:text-sm font-bold"
                    style={{ color: COLORS[s.colorIdx].color }}
                  >
                    {s.num}
                  </span>
                  <h3 className="text-white font-bold text-sm sm:text-lg lg:text-xl mt-1 sm:mt-2">
                    {s.title}
                  </h3>
                  <span
                    className="text-white/30 text-[10px] sm:text-xs lg:text-sm block mt-0.5"
                    style={{ fontFamily: "var(--font-nanum-brush-script)" }}
                  >
                    {s.titleKr}
                  </span>
                </div>
                <p className="text-white/40 text-[11px] sm:text-xs lg:text-sm mt-2 sm:mt-3 leading-relaxed">
                  {s.desc}
                </p>
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
