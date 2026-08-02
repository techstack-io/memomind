// app/journey/components/JourneyView.tsx
"use client";

import { useEffect, useState } from "react";

interface SloganNode {
  id: string;
  sloganNumber: number;
  title: string;
  point: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  isIlluminated: boolean;
}

const initialNodes: SloganNode[] = [
  { id: "lojong-001", sloganNumber: 1, title: "Train in the preliminaries", point: "Preliminaries", x: 20, y: 30, isIlluminated: false },
  { id: "lojong-012", sloganNumber: 12, title: "Drive all blames into one", point: "Transforming Adversity", x: 50, y: 50, isIlluminated: false },
  { id: "lojong-010", sloganNumber: 10, title: "Be grateful to everyone", point: "Bodhicitta", x: 80, y: 40, isIlluminated: false },
];

export default function JourneyView() {
  const [nodes, setNodes] = useState<SloganNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<SloganNode | null>(null);

  useEffect(() => {
    async function fetchUserProgress() {
      try {
        const res = await fetch("/api/journey/progress");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;

        const data = await res.json();
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            isIlluminated: data.illuminated_ids?.includes(node.id) ?? false,
          }))
        );
      } catch (err) {
        console.debug("Journey progress endpoint pending backend setup.");
      }
    }
    fetchUserProgress();
  }, []);

  return (
    <main className="relative h-screen w-screen bg-[#292721] overflow-hidden flex flex-col justify-between p-12">
      {/* Header */}
      <div className="z-10 max-w-md pointer-events-none">
        <span className="text-xs uppercase tracking-[0.2em] text-[#A39E93]">
          Pillar Three
        </span>
        <h1 className="text-3xl font-light tracking-tight text-[#F7F4EE] mt-1">
          Your Living Constellation
        </h1>
        <p className="mt-2 text-sm text-[#A39E93] leading-relaxed">
          Anchored insights illuminate your mind&apos;s network. Every reflection connects ordinary friction to timeless practice.
        </p>
      </div>

      {/* Constellation Canvas View */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[80%] h-[70%] max-w-4xl">
          {/* Hairline Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#4A433B" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="80%" y2="40%" stroke="#4A433B" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {/* Slogan Nodes */}
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            >
              <div
                className={[
                  "flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-500 shadow-lg border",
                  node.isIlluminated
                    ? "border-[#E5C158] bg-[#36322B] text-[#F7F4EE] shadow-[0_0_20px_rgba(229,193,88,0.25)]"
                    : "border-[#4A433B] bg-[#22201C] text-[#8A8378] hover:border-[#8A8378]",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full transition-all",
                    node.isIlluminated ? "bg-[#E5C158] shadow-[0_0_8px_#E5C158]" : "bg-[#5A534A]",
                  ].join(" ")}
                />
                <span className="text-xs font-medium tracking-tight whitespace-nowrap">
                  Slogan {node.sloganNumber}: {node.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info / Selected Drawer Peek */}
      <div className="z-10 text-xs text-[#A39E93] flex justify-between items-end pointer-events-none">
        <span>7 Points of Lojong Mapped</span>
        <span>Click illuminated nodes to inspect logs</span>
      </div>
    </main>
  );
}