"use client";

import dynamic from "next/dynamic";
import AppSidebar from "@/components/layout/AppSidebar";

const LojongConstellationMap = dynamic(
  () => import("@/components/reactflow/LojongConstellationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-[#F3EEE5] rounded-3xl border border-memo-divider flex items-center justify-center text-memo-neutral-500 text-xs font-mono">
        Loading Mind-Training Journey...
      </div>
    ),
  }
);

export default function JourneyView() {
  return (
    <div className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <AppSidebar />

        <main className="min-w-0 flex-1 py-4 md:py-8 space-y-6">
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-memo-connection-600">
              Pillar 3
            </p>
            <h1 className="text-3xl font-light tracking-tight text-slate-800">
              Your Journey
            </h1>
            <p className="text-sm text-memo-neutral-500">
              The 7 Points of Atisha & Interconnected Lojong Slogans
            </p>
          </header>

          <section className="relative">
            <LojongConstellationMap />
          </section>
        </main>
      </div>
    </div>
  );
}