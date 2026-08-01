"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text ${
        disabled
          ? ""
          : "text-transparent bg-gradient-to-r from-memo-connection-600 via-amber-200 to-memo-connection-600 bg-[length:200%_100%] animate-shiny-text"
      } ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
}