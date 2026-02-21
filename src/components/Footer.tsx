"use client";

import { COLORS } from "./color-bars/types";
import CardSwap, { Card } from "./CardSwap";

const ROTATING_TEXT = "CREATE \u2022 DESIGN \u2022 BUILD \u2022 ";
const CHARS = ROTATING_TEXT.split("");
const DEG_PER_CHAR = 360 / CHARS.length;

const FOOTER_LINKS = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Dribbble", href: "#" },
];

const SERVICE_CARDS = [
  {
    title: "Web Development",
    subtitle: "웹 개발",
    description: "Full-stack applications built with modern frameworks",
    color: COLORS[0].color,
    icon: "⟨/⟩",
  },
  {
    title: "UI/UX Design",
    subtitle: "디자인",
    description: "Interfaces that feel intuitive and look stunning",
    color: COLORS[2].color,
    icon: "◈",
  },
  {
    title: "Brand Identity",
    subtitle: "브랜드",
    description: "Visual systems that communicate your essence",
    color: COLORS[1].color,
    icon: "◉",
  },
  {
    title: "Motion & 3D",
    subtitle: "모션",
    description: "Animations and immersive experiences that captivate",
    color: COLORS[3].color,
    icon: "△",
  },
];

/* ── Spinning circle decoration ── */
function SpinningCircle() {
  return (
    <button
      className="group relative cursor-pointer overflow-hidden rounded-full bg-[#06D6A0] hover:bg-[#080F0F] hover:scale-105 transition-all duration-300 grid place-content-center border-2 border-transparent hover:border-[#06D6A0]"
      style={{ width: 100, height: 100 }}
    >
      <p
        className="absolute inset-0 m-0 p-0"
        style={{ animation: "footer-spin 8s linear infinite" }}
      >
        {CHARS.map((char, i) => (
          <span
            key={i}
            className="absolute text-[10px] font-bold text-[#080F0F] group-hover:text-[#06D6A0] transition-colors duration-300"
            style={{
              inset: "6px",
              transform: `rotate(${i * DEG_PER_CHAR}deg)`,
            }}
          >
            {char}
          </span>
        ))}
      </p>

      <div
        className="relative overflow-hidden rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-[#06D6A0] transition-all duration-300"
        style={{
          width: 38,
          height: 38,
          backgroundColor: "#080F0F",
          color: COLORS[0].color,
        }}
      >
        <svg
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          className="transition-transform duration-300 ease-in-out group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
        >
          <path
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            fill="currentColor"
          />
        </svg>
        <svg
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          className="absolute transition-transform duration-300 ease-in-out delay-100 -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0"
        >
          <path
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            fill="currentColor"
          />
        </svg>
      </div>
    </button>
  );
}

export default function Footer() {
  return (
    <footer
      id="footer"
      className="flex flex-col px-1.5 py-1.5"
      style={{ backgroundColor: "#030301" }}
    >
      <div
        className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative"
        style={{
          backgroundColor: "#080F0F",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: "clamp(500px, 60vh, 700px)",
        }}
      >
        {/* Logo watermark — top-left */}
        <img
          src="/logos/logo-white.svg"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none z-[0]"
          style={{ top: "-15%", left: "-8%", width: "clamp(300px, 40vw, 600px)", opacity: 0.025 }}
        />

        {/* CardSwap — bottom-right corner with blur */}
        <div
          className="absolute bottom-0 right-0 z-[1] hidden sm:block"
          style={{
            width: "clamp(450px, 55%, 700px)",
            height: "100%",
            maskImage:
              "radial-gradient(ellipse at 80% 70%, black 35%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 80% 70%, black 35%, transparent 80%)",
          }}
        >
          <div className="absolute bottom-0 right-0 w-full h-full">
            <CardSwap
              width={580}
              height={520}
              cardDistance={60}
              verticalDistance={65}
              delay={4000}
              pauseOnHover
              skewAmount={5}
              easing="elastic"
            >
              {SERVICE_CARDS.map((card, i) => (
                <Card key={i}>
                  <div className="flex flex-col justify-between h-full p-8 sm:p-10">
                    <div className="flex flex-col gap-5">
                      <span
                        className="text-5xl"
                        style={{ color: card.color }}
                      >
                        {card.icon}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-xl sm:text-2xl text-white">
                          {card.title}
                        </span>
                        <span
                          className="text-white/20 text-base"
                          style={{
                            fontFamily: "var(--font-nanum-brush-script)",
                          }}
                        >
                          {card.subtitle}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/30 text-sm sm:text-base leading-relaxed mt-5">
                      {card.description}
                    </p>
                    <div
                      className="mt-8 h-[2px] w-16 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${card.color}, transparent)`,
                      }}
                    />
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>

        {/* Main footer content — on top of cards */}
        <div className="relative z-[2]" style={{ padding: "clamp(24px, 4vw, 80px) clamp(16px, 3vw, 80px)" }}>
          <div className="flex flex-col gap-12 lg:gap-20 max-w-lg">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <img
                  src="/logos/logo-green.svg"
                  alt="QXENITH"
                  className="shrink-0"
                  style={{ width: "clamp(36px, 5vw, 56px)", height: "auto" }}
                />
                <span
                  className="font-extrabold tracking-tight text-white"
                  style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  QXENITH
                </span>
              </div>
              <span
                className="text-white/20"
                style={{
                  fontSize: "clamp(12px, 1.8vw, 18px)",
                  fontFamily: "var(--font-nanum-brush-script)",
                }}
              >
                우리는 존재할 가치가 있는 아이디어를 만들어냅니다.
              </span>
              <p className="text-white/15 text-xs sm:text-sm mt-2 leading-relaxed max-w-sm">
                We craft ideas worth existing — merging technology, design,
                and purpose into digital experiences that matter.
              </p>
            </div>

            {/* Nav + Social */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              <div className="flex flex-col gap-2">
                <span className="text-white/30 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2">
                  Navigation
                </span>
                <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-1.5">
                  {FOOTER_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-white/40 text-sm sm:text-base font-medium transition-colors duration-200 hover:text-[#06D6A0]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white/30 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2">
                  Connect
                </span>
                <div className="flex flex-col gap-1.5">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-white/30 text-xs sm:text-sm font-mono transition-colors duration-200 hover:text-white/70"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="relative z-[2] flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ padding: "clamp(12px, 1.5vw, 20px) clamp(16px, 3vw, 80px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] text-white/15 font-mono">
            &copy; 2026 QXENITH. All rights reserved.
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms"].map((t) => (
              <a
                key={t}
                href="#"
                className="text-[11px] text-white/15 font-mono transition-colors duration-200 hover:text-white/40"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
