"use client";

import React from "react";
import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";

export default function AnimatedGlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* 1. Base Connector Line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#262626", // Neutral dark grey
          strokeWidth: 1.5,
          ...style,
        }}
      />

      {/* 2. Soft Glowing Path Overlay */}
      <path
        d={edgePath}
        fill="none"
        stroke="#f59e0b" // Muted Gold
        strokeWidth={2}
        strokeDasharray="6, 12"
        className="animate-flowing-edge opacity-70"
      />
    </>
  );
}