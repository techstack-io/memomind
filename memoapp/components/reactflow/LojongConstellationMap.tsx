"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import PulseEdge from "./PulseEdge";

interface SloganData extends Record<string, unknown> {
  point: number;
  title: string;
  sloganText: string;
  isUnlocked: boolean;
}

type SloganNodeType = Node<SloganData, "sloganNode">;

// Custom Light-Theme Slogan Node
const SloganNode = ({ data }: NodeProps<SloganNodeType>) => {
  const isUnlocked = data.isUnlocked;

  return (
    <div
      className={`relative px-4 py-3 rounded-xl border transition-all duration-300 w-56 ${
        isUnlocked
          ? "bg-memo-surface border-memo-connection-300 text-slate-800 shadow-[0_4px_20px_rgba(42,36,31,0.06)]"
          : "bg-[#EFEAE2] border-memo-divider/60 text-memo-neutral-500 opacity-60"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-memo-neutral-500 !w-2 !h-2 !border-none"
      />

      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest font-mono text-memo-connection-600 font-medium">
          Point {data.point}
        </span>
        {isUnlocked && (
          <span className="h-1.5 w-1.5 rounded-full bg-memo-connection-600 animate-pulse" />
        )}
      </div>

      <h4 className="text-sm font-medium leading-snug text-slate-700">
        {data.title}
      </h4>
      <p className="text-[11px] text-memo-neutral-700 mt-1 line-clamp-1">
        {data.sloganText}
      </p>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-memo-neutral-500 !w-2 !h-2 !border-none"
      />
    </div>
  );
};

export default function LojongConstellationMap() {
  const nodeTypes = useMemo(() => ({ sloganNode: SloganNode }), []);
  const edgeTypes = useMemo(() => ({ pulseEdge: PulseEdge }), []);

  const initialNodes: SloganNodeType[] = [
    {
      id: "point-1",
      type: "sloganNode",
      position: { x: 250, y: 50 },
      data: {
        point: 1,
        title: "The Preliminaries",
        sloganText: "First, train in the preliminaries",
        isUnlocked: true,
      },
    },
    {
      id: "slogan-12",
      type: "sloganNode",
      position: { x: 100, y: 200 },
      data: {
        point: 3,
        title: "Radical Responsibility",
        sloganText: "Drive all blames into one",
        isUnlocked: true,
      },
    },
    {
      id: "slogan-10",
      type: "sloganNode",
      position: { x: 400, y: 200 },
      data: {
        point: 3,
        title: "Unexpected Teachers",
        sloganText: "Be grateful to everyone",
        isUnlocked: false,
      },
    },
    {
      id: "point-4",
      type: "sloganNode",
      position: { x: 250, y: 350 },
      data: {
        point: 4,
        title: "Lifetime Integration",
        sloganText: "Integrate all practice into one path",
        isUnlocked: false,
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e1-12",
      source: "point-1",
      target: "slogan-12",
      type: "pulseEdge", // Uses custom animating SVG edge
    },
    {
      id: "e1-10",
      source: "point-1",
      target: "slogan-10",
      style: { stroke: "#D3C9C1", strokeWidth: 1, strokeDasharray: "4 4" },
    },
    {
      id: "e12-p4",
      source: "slogan-12",
      target: "point-4",
      style: { stroke: "#D3C9C1", strokeWidth: 1, strokeDasharray: "4 4" },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] bg-[#f9f7ed] rounded-3xl border border-memo-divider overflow-hidden relative shadow-[0_18px_50px_rgba(42,36,31,0.05)]">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-sm font-medium text-slate-700">
          Lojong Mind-Training Landscape
        </h3>
        <p className="text-xs text-memo-neutral-500 mt-0.5">
          Explore slogans processed through conversational reflection
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-[#F3EEE5]"
      >
        <Background color="#DCD3C6" gap={24} size={1} />
        <Controls className="!bg-memo-surface !border-memo-divider !text-memo-neutral-700 fill-current !shadow-sm !rounded-xl" />
      </ReactFlow>
    </div>
  );
}