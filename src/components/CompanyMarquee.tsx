"use client";

import {
  siGoogle,
  siFigma,
  siGithub,
  siLinear,
  siStripe,
  siNotion,
  siVercel,
  siFramer,
  siSupabase,
  siWebflow,
  siAnthropic,
  siRaycast,
  siNetlify,
  siMiro,
  siPrisma,
  siSentry,
} from "simple-icons";
import { COLORS } from "./color-bars/types";

const COMPANIES = [
  siGoogle,
  siFigma,
  siGithub,
  siLinear,
  siStripe,
  siNotion,
  siVercel,
  siFramer,
  siSupabase,
  siWebflow,
  siAnthropic,
  siRaycast,
  siNetlify,
  siMiro,
  siPrisma,
  siSentry,
];

const ITEMS = [...COMPANIES, ...COMPANIES];

function LogoItem({
  icon,
  colorIdx,
}: {
  icon: (typeof COMPANIES)[number];
  colorIdx: number;
}) {
  const c = COLORS[colorIdx % COLORS.length];
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-md sm:rounded-lg"
      style={{
        width: "clamp(72px, 9vw, 110px)",
        height: "clamp(72px, 9vw, 110px)",
        backgroundColor: `${c.color}0A`,
        border: `1px solid ${c.color}18`,
        marginRight: "clamp(10px, 2vw, 20px)",
      }}
    >
      <svg
        role="img"
        aria-label={icon.title}
        viewBox="0 0 24 24"
        style={{
          width: "clamp(36px, 4.5vw, 56px)",
          height: "clamp(36px, 4.5vw, 56px)",
          fill: "white",
          opacity: 0.45,
        }}
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
}

export default function CompanyMarquee() {
  return (
    <div
      id="clients"
      className="w-full relative overflow-hidden"
      style={{
        padding: "clamp(10px, 2vw, 20px) 0",
        backgroundColor: "#030301",
      }}
    >
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: "clamp(20px, 5vw, 80px)",
          background: "linear-gradient(to right, #030301 30%, transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{
          width: "clamp(20px, 5vw, 80px)",
          background: "linear-gradient(to left, #030301 30%, transparent)",
        }}
      />

      <div
        className="flex items-center"
        style={{
          width: "max-content",
          animation: "footer-marquee 35s linear infinite",
        }}
      >
        {ITEMS.map((icon, i) => (
          <LogoItem
            key={`${icon.title}-${i}`}
            icon={icon}
            colorIdx={i % COMPANIES.length}
          />
        ))}
      </div>
    </div>
  );
}
