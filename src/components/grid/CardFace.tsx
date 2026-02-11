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
        "absolute inset-0 overflow-hidden [backface-visibility:hidden] pointer-events-none",
        isBack ? "[transform:rotateX(180deg)]" : "",
        bg,
      ].join(" ")}
      style={{
        borderRadius: cornerRadius,
        transition: "border-radius 700ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
