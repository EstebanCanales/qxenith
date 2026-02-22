"use client";

import Image from "next/image";
import { COLORS } from "./color-bars/types";

const COMPANIES = [
  { name: "Samsung", logo: "/logos/companies/samsung.svg" },
  { name: "Hyundai", logo: "/logos/companies/hyundai.svg" },
  { name: "Naver",   logo: "/logos/companies/naver.svg" },
  { name: "Kakao",   logo: "/logos/companies/kakao.svg" },
  { name: "LG",      logo: "/logos/companies/lg.svg" },
  { name: "Line",    logo: "/logos/companies/line.svg" },
  { name: "Nexon",   logo: "/logos/companies/nexon.svg" },
];

const ITEMS = [...COMPANIES, ...COMPANIES];

function LogoItem({ name, logo, colorIdx }: { name: string; logo: string; colorIdx: number }) {
  const c = COLORS[colorIdx % COLORS.length];
  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-md sm:rounded-lg"
      style={{
        width: "clamp(48px, 6vw, 80px)",
        height: "clamp(48px, 6vw, 80px)",
        backgroundColor: `${c.color}0A`,
        border: `1px solid ${c.color}18`,
        marginRight: "clamp(8px, 1.5vw, 16px)",
      }}
    >
      <Image
        src={logo}
        alt={name}
        width={24}
        height={24}
        className="select-none"
        style={{
          width: "clamp(24px, 3vw, 42px)",
          height: "clamp(24px, 3vw, 42px)",
          filter: "brightness(0) invert(1)",
          opacity: 0.4,
        }}
      />
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
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: "clamp(20px, 5vw, 60px)",
          background: "linear-gradient(to right, #030301, transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{
          width: "clamp(20px, 5vw, 60px)",
          background: "linear-gradient(to left, #030301, transparent)",
        }}
      />

      {/* Track */}
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: "marquee-scroll 30s linear infinite",
          width: "max-content",
        }}
      >
        {ITEMS.map((company, i) => (
          <LogoItem
            key={`${company.name}-${i}`}
            name={company.name}
            logo={company.logo}
            colorIdx={i}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
