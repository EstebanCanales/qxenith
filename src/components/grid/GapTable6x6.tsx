"use client";

import React, { useMemo } from "react";

function getCornerClass(r: number, c: number, last: number): string {
  const cls: string[] = ["rounded-md"];
  if (r === 0 && c === 0) cls.push("rounded-tl-xl");
  if (r === 0 && c === last) cls.push("rounded-tr-xl");
  if (r === last && c === 0) cls.push("rounded-bl-xl");
  if (r === last && c === last) cls.push("rounded-br-xl");
  return cls.join(" ");
}

export default function GapTable6x6({ cols = 6 }: { cols?: number }) {
  const last = cols - 1;
  const total = cols * cols;

  const cells = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        i,
        r: Math.floor(i / cols),
        c: i % cols,
      })),
    [total, cols],
  );

  return (
    <div className="absolute inset-0 z-[16] pointer-events-none">
      <div
        className="grid w-full h-full p-1.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${cols}, 1fr)`,
          gap: "3px",
        }}
      >
        {cells.map(({ i, r, c }) => (
          <div
            key={i}
            className={[
              "w-full h-full bg-transparent",
              getCornerClass(r, c, last),
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
