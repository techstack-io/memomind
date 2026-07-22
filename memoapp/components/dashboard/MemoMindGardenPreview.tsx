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
          
          {/* Left: Text & CTA */}
          <div className="relative z-10 text-left">
            <p className="text-xs uppercase tracking-[0.34em] text-memo-neutral-700/80 sm:text-sm">
              Welcome to the Garden Preview
            </p>

            <h1 className="mt-6 font-heading text-6xl font-normal leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[68px]">
              Hello, <span className="italic text-memo-connection-600">Dan</span>
            </h1>

            <p className="mt-4 max-w-xl text-xl leading-9 text-memo-neutral-700">
              Thoughtful conversations rooted in timeless wisdom.
            </p>

            <p className="mt-5 text-sm text-memo-neutral-700">
              Choose how you would like to begin.
            </p>

            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => choosePath("memo")}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
              >
                Talk with Memo
              </button>

              <button
                type="button"
                onClick={() => choosePath("foundations")}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-memo-neutral-300 bg-memo-surface/80 px-7 text-sm font-semibold text-memo-text transition-all duration-300 hover:-translate-y-0.5 hover:border-memo-connection-300 hover:bg-memo-surface hover:shadow-md"
              >
                Begin with Foundations
              </button>
            </div>

            <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-memo-neutral-700">
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(event) => setRememberChoice(event.target.checked)}
                className="size-4 rounded border-memo-neutral-300 accent-memo-neutral-900"
              />
              Remember my choice for next time
            </label>
          </div>

          {/* Right: Square Memo Bot Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-memo-surface">
              <Image
                src="/chat/memo-bot.jpeg" // Resolves to public/chat/memo-bot.jpeg
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
