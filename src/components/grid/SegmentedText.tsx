"use client";

import React from "react";

type Props = {
  row: number;
  col: number;
  cols?: number;
  rows?: number;
  children: React.ReactNode;
};

export default function SegmentedText({
  row,
  col,
  cols = 6,
  rows = 6,
  children,
}: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden pointer-events-none">
      <div
        style={{
          width: `${cols * 100}%`,
          height: `${rows * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
