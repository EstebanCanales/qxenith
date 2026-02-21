"use client";

export default function NumCircle({ label, contrast, size }: { label: string; contrast: string; size: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: contrast,
        borderRadius: 4,
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
  );
}
