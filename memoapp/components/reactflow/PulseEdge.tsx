"use client";

import React from "react";
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export default function PulseEdge({
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
      {/* Base static connector line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#D3C9C1", // Warm taupe line
          strokeWidth: 1.5,
          ...style,
        }}
      />

      {/* Smooth glowing ember traveling along the edge path */}
      <circle r="3" fill="#B38B59" className="opacity-80">
        <animateMotion
          dur="3.5s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </>
  );
}