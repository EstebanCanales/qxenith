"use client";

import { VerticalBars } from "./color-bars";
import { COLORS } from "./color-bars/types";

const PROJECTS = [
  {
    title: "Nebula Platform",
    titleKr: "네뷸라 플랫폼",
    category: "Web App",
    year: "2026",
    colorIdx: 0,
  },
  {
    title: "Kaze Commerce",
    titleKr: "카제 커머스",
    category: "E-commerce",
    year: "2025",
    colorIdx: 1,
  },
  {
    title: "Pulse Dashboard",
    titleKr: "펄스 대시보드",
    category: "SaaS",
    year: "2025",
    colorIdx: 2,
  },
  {
    title: "Orion Mobile",
    titleKr: "오리온 모바일",
    category: "Mobile App",
    year: "2025",
    colorIdx: 3,
  },
  {
    title: "Flux Brand System",
    titleKr: "플럭스 브랜드",
    category: "Branding",
    year: "2024",
    colorIdx: 4,
  },
];

export default function ProjectsSection({ connected }: { connected?: boolean }) {
  const inner = (
    <div
      id="projects"
      className={`w-full min-h-[70vh] sm:h-screen overflow-hidden relative flex flex-col ${connected ? "" : "rounded-xl sm:rounded-2xl lg:rounded-3xl"}`}
      style={{
        backgroundColor: "#080F0F",
        border: connected ? "none" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: connected ? "none" : "inset 0 0 80px rgba(0,0,0,0.6)",
      }}
    >
        <VerticalBars
          position="left"
          scale={1}
          startLabel={21}
          direction="down"
          hideOnMobile={true}
          reverseColors={true}
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

        {/* Corner accent bottom-left */}
        <div
          className="absolute bottom-3 left-3 w-8 h-8 sm:bottom-4 sm:left-4 sm:w-10 sm:h-10 lg:bottom-6 lg:left-6 lg:w-16 lg:h-16"
          style={{
            borderLeft: "1px solid rgba(132,94,247,0.2)",
            borderBottom: "1px solid rgba(132,94,247,0.2)",
            borderRadius: "0 0 0 8px",
          }}
        />
        <div
          className="absolute top-3 right-3 w-8 h-8 sm:top-4 sm:right-4 sm:w-10 sm:h-10 lg:top-6 lg:right-6 lg:w-16 lg:h-16"
          style={{
            borderRight: "1px solid rgba(132,94,247,0.2)",
            borderTop: "1px solid rgba(132,94,247,0.2)",
            borderRadius: "0 8px 0 0",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 64px)" }}>
          {/* Section header */}
          <div className="sm:ml-20 lg:ml-28" style={{ marginBottom: "clamp(12px, 2.5vw, 56px)" }}>
            <span className="text-white/30 font-mono text-xs sm:text-sm tracking-widest uppercase">
              Selected work
            </span>
            <h2
              className="font-extrabold tracking-tight text-white mt-2"
              style={{ fontSize: "clamp(28px, 5vw, 64px)" }}
            >
              Projects
            </h2>
            <span
              className="text-white/40 block mt-1"
              style={{
                fontSize: "clamp(14px, 2.5vw, 28px)",
                fontFamily: "var(--font-nanum-brush-script)",
              }}
            >
              선택된 작업
            </span>
          </div>

          {/* Project list */}
          <div className="flex flex-col sm:ml-20 lg:ml-28 max-w-4xl">
            {PROJECTS.map((p, i) => (
              <div
                key={p.title}
                className="group flex items-center justify-between cursor-pointer transition-colors duration-200"
                style={{
                  padding: "clamp(10px, 1.5vw, 24px) 0",
                  borderBottom:
                    i < PROJECTS.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                <div className="flex items-baseline gap-3 sm:gap-5">
                  <span
                    className="font-mono text-xs font-bold transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span
                      className="text-white font-bold text-base sm:text-xl lg:text-2xl block transition-colors duration-200 group-hover:transition-colors"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = COLORS[p.colorIdx].color)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                      }
                    >
                      {p.title}
                    </span>
                    <span
                      className="text-white/20 text-xs sm:text-sm block"
                      style={{ fontFamily: "var(--font-nanum-brush-script)" }}
                    >
                      {p.titleKr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="text-white/30 text-xs sm:text-sm font-mono hidden sm:block">
                    {p.category}
                  </span>
                  <span className="text-white/20 text-xs font-mono">
                    {p.year}
                  </span>
                  {/* Arrow */}
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0"
                    style={{ color: COLORS[p.colorIdx].color }}
                  >
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                      fill="currentColor"
                    />
                  </svg>
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
