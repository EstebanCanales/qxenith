"use client";

import { DiagonalBars } from "./color-bars";
import { COLORS } from "./color-bars/types";

const LINKS = [
  { label: "Instagram", href: "#", colorIdx: 1 },
  { label: "LinkedIn", href: "#", colorIdx: 2 },
  { label: "GitHub", href: "#", colorIdx: 0 },
  { label: "Dribbble", href: "#", colorIdx: 3 },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="h-screen flex flex-col justify-center px-1.5 py-1.5"
      style={{
        backgroundColor: "#030301",
      }}
    >
      <div
        className="w-full flex-1 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden relative flex flex-col justify-center items-center"
        style={{
          backgroundColor: "#080F0F",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
        }}
      >
        <DiagonalBars
          bottom="-20%"
          right="-10%"
          rotation={-30}
          width="70%"
          height="60%"
          hiddenOnMobile={true}
          reverseColors={false}
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

        {/* Corner accents */}
        <div
          className="absolute top-3 left-3 w-8 h-8 sm:top-4 sm:left-4 sm:w-10 sm:h-10 lg:top-6 lg:left-6 lg:w-16 lg:h-16"
          style={{
            borderLeft: "1px solid rgba(252,196,25,0.2)",
            borderTop: "1px solid rgba(252,196,25,0.2)",
            borderRadius: "8px 0 0 0",
          }}
        />
        <div
          className="absolute bottom-3 right-3 w-8 h-8 sm:bottom-4 sm:right-4 sm:w-10 sm:h-10 lg:bottom-6 lg:right-6 lg:w-16 lg:h-16"
          style={{
            borderRight: "1px solid rgba(252,196,25,0.2)",
            borderBottom: "1px solid rgba(252,196,25,0.2)",
            borderRadius: "0 0 8px 0",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl" style={{ padding: "0 clamp(16px, 3vw, 64px)" }}>
          <span className="text-white/30 font-mono text-xs sm:text-sm tracking-widest uppercase mb-4">
            Get in touch
          </span>

          <h2
            className="font-extrabold tracking-tight text-white"
            style={{ fontSize: "clamp(32px, 7vw, 90px)" }}
          >
            Let&apos;s build
            <br />
            <span style={{ color: COLORS[0].color }}>something</span>
            <br />
            together
          </h2>

          <span
            className="text-white/30 mt-3 sm:mt-4"
            style={{
              fontSize: "clamp(16px, 3vw, 32px)",
              fontFamily: "var(--font-nanum-brush-script)",
            }}
          >
            함께 만들어 봅시다
          </span>

          {/* CTA */}
          <a
            href="mailto:hello@qxenith.com"
            className="group mt-8 sm:mt-10 lg:mt-14 inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: COLORS[0].color,
              color: "#080F0F",
            }}
          >
            hello@qxenith.com
            <svg
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path
                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* Social links */}
          <div className="flex gap-6 sm:gap-8 mt-10 sm:mt-14">
            {LINKS.map((link) => (
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
    </section>
  );
}
