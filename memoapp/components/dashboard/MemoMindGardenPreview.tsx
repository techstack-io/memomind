"use client";

import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MemoMindGardenPreview() {
  return (
    <main className="min-h-screen bg-memo-bg text-memo-text">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-10">
        <section className="grid w-full overflow-hidden rounded-3xl border border-memo-divider bg-memo-surface shadow-[0_24px_70px_rgba(42,36,31,0.08)] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
            <p className="text-xs uppercase tracking-[0.3em] text-memo-neutral-700/70">
              Your Practice
            </p>

            <h1 className="mt-5 max-w-lg font-heading text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
              A quiet place shaped by the moments you remember.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-memo-neutral-700">
              Each reflection can become part of your landscape. Over time,
              meaningful moments will quietly find their place here.
            </p>

            <div className="mt-10 border-t border-memo-divider pt-8">
              <p className="text-xs uppercase tracking-[0.28em] text-memo-neutral-700/70">
                Today&apos;s Lens
              </p>

              <h2 className="mt-3 font-heading text-2xl">
                Right Intention
              </h2>

              <p className="mt-4 max-w-md leading-7 text-memo-neutral-700">
                Look beyond the action and notice the care that gave rise to
                it.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-memo-neutral-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
              >
                Enter the Landscape
                <ArrowIcon />
              </button>

              <Link
                href="/dashboard"
                className="text-sm font-semibold text-memo-connection-600 transition-colors hover:text-memo-connection-700"
              >
                Back to Memo
              </Link>
            </div>
          </div>

          <div className="relative min-h-[460px] lg:min-h-[720px]">
            <Image
              src="/memomind-landscape.jpeg"
              alt="A colorful contemplative landscape with mountains, trees, and water"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent lg:from-memo-surface/20" />

            <button
              type="button"
              aria-label="Open a memory"
              className="absolute left-[38%] top-[57%] h-5 w-5 rounded-full border-2 border-white/80 bg-white/70 shadow-[0_0_20px_rgba(255,255,255,0.95)] transition-transform hover:scale-125"
            />

            <button
              type="button"
              aria-label="Open another memory"
              className="absolute left-[70%] top-[35%] h-4 w-4 rounded-full border-2 border-white/80 bg-white/60 shadow-[0_0_18px_rgba(255,255,255,0.9)] transition-transform hover:scale-125"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
