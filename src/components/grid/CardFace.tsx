"use client";

import React from "react";

type Props = {
  bg: string;
  cornerRadius?: string;
  isBack?: boolean;
  children?: React.ReactNode;
};

export default function CardFace({
  bg,
  cornerRadius = "0px",
  isBack = false,
  children,
}: Props) {
  return (
    <div
      className={[
        "absolute overflow-hidden [backface-visibility:hidden] pointer-events-none",
        isBack ? "[transform:rotateX(180deg)]" : "",
        bg,
      ].join(" ")}
      style={{
        inset: "-0.5px",
        borderRadius: cornerRadius,
        transition: "border-radius 700ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
