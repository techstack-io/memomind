"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PreferredPath = "memo" | "foundations";

export default function MemoMindGardenPreview() {
  const router = useRouter();
  const [rememberChoice, setRememberChoice] = useState(false);

  function choosePath(path: PreferredPath) {
    if (rememberChoice) {
      localStorage.setItem("memomind:preferredPath", path);
    } else {
      localStorage.removeItem("memomind:preferredPath");
    }

    router.push(path === "memo" ? "/dashboard" : "/preliminaries");
  }

  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          
          {/* Left: Modern Chat Bubble Interface */}
          <div className="relative z-10 flex flex-col justify-center space-y-4">
            
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs uppercase tracking-[0.34em] text-memo-neutral-700/80 sm:text-sm font-medium">
                Live Reflection
              </p>
            </div>

            {/* Chat Bubble Thread */}
            <div className="flex flex-col space-y-3 rounded-2xl border border-memo-neutral-300/40 bg-memo-surface/50 p-5 shadow-sm backdrop-blur-sm">
              
              {/* User Bubble (Right-aligned) */}
              <div className="flex flex-col items-end">
                <span className="mb-1 text-[11px] text-memo-neutral-700/70 font-medium">Dan</span>
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-memo-neutral-900 px-4 py-3 text-sm text-white shadow-sm leading-relaxed">
                  "My manager took credit for my presentation today. I'm furious and can't let it go."
                </div>
              </div>

              {/* Memo Bot Bubble (Left-aligned) */}
              <div className="flex flex-col items-start pt-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-semibold text-memo-connection-600">Memo</span>
                  <span className="text-[10px] text-memo-neutral-700/50">• Lojong Engine</span>
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-tl-xs border border-memo-neutral-300/60 bg-memo-surface px-4 py-3 text-sm text-memo-text shadow-sm leading-relaxed">
                  <p className="text-xs font-semibold text-memo-connection-600 tracking-wide uppercase mb-1">
                    Slogan #12 • Drive all blames into one
                  </p>
                  "Notice where your energy is going. Is the frustration coming from their action, or from holding onto how you expected them to behave?"
                </div>
              </div>

            </div>

            {/* CTAs Below Chat */}
            <div className="pt-2">
              <p className="text-xs text-memo-neutral-700 mb-3 font-medium">
                Ready to reflect on what's pulling at your mind?
              </p>

              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => choosePath("memo")}
                  className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
                >
                  Talk with Memo
                </button>

                <button
                  type="button"
                  onClick={() => choosePath("foundations")}
                  className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-memo-neutral-300 bg-memo-surface/80 px-7 text-sm font-semibold text-memo-text transition-all duration-300 hover:-translate-y-0.5 hover:border-memo-connection-300 hover:bg-memo-surface hover:shadow-md"
                >
                  Begin with Foundations
                </button>
              </div>

              {/* Remember Choice Checkbox */}
              <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-xs text-memo-neutral-700">
                <input
                  type="checkbox"
                  checked={rememberChoice}
                  onChange={(event) => setRememberChoice(event.target.checked)}
                  className="size-4 rounded border-memo-neutral-300 accent-memo-neutral-900"
                />
                Remember my choice for next time
              </label>
            </div>

          </div>

          {/* Right: Square Memo Bot Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-memo-surface">
              <Image
                src="/chat/memo-bot.jpeg"
                alt="Memo Bot emblem"
                fill
                priority
                className="object-cover"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-black/5 shadow-[inset_0_0_10px_rgba(38,31,26,0.12),inset_0_2px_4px_rgba(38,31,26,0.08),inset_0_-1px_2px_rgba(255,255,255,0.28)]"
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
