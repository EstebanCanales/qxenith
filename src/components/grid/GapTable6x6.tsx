"use client";

import React, { useMemo } from "react";

const LAST = 5;

function getCornerClass(r: number, c: number): string {
  const cls: string[] = ["rounded-md"];
  if (r === 0 && c === 0) cls.push("rounded-tl-xl");
  if (r === 0 && c === LAST) cls.push("rounded-tr-xl");
  if (r === LAST && c === 0) cls.push("rounded-bl-xl");
  if (r === LAST && c === LAST) cls.push("rounded-br-xl");
  return cls.join(" ");
}

export default function GapTable6x6() {
  const cells = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        i,
        r: Math.floor(i / 6),
        c: i % 6,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 z-[16] pointer-events-none">
      <div className="grid grid-cols-6 grid-rows-6 w-full h-full p-1.5" style={{ gap: "3px" }}>
        {cells.map(({ i, r, c }) => (
          <div
            key={i}
            className={[
              "w-full h-full bg-transparent",
              getCornerClass(r, c),
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
